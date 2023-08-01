const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');


const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log(`connected to the employee db`)
)
db.query = util.promisify(db.query);

function menu() {
    inquirer
        .prompt(
            [
                {
                    name: 'whereTo',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
                }
            ]
        )
        .then((answers) => {
            if (answers.whereTo === 'view all departments') {
                return departments();
            }
            else if (answers.whereTo === 'view all roles') {
                return roles();
            }
            else if (answers.whereTo === 'view all employees') {
                return employees();
            }
            else if (answers.whereTo === 'add a department') {
                return addDep();
            }
            else if (answers.whereTo === 'add a role') {
                return addRole();
            }
            else if (answers.whereTo === 'add an employee') {
                return addEmp();
            }
            else if (answers.whereTo === 'update an employee role') {
                return updateEmp();
            }
        }
        )
}

menu();

async function addDep() {

    const answers = await inquirer.prompt([{
        message: 'Whats the name of the department?',
        name: 'newDep',
        type: 'input'
    }])

    db.query('INSERT INTO departments(name) VALUES (?)', [answers.newDep])
        .then(results => {
            console.log('Deparment added...');
            menu();
        })
        .catch(err => {
            console.error(err);
        });
}

async function addEmp() {
    db.query('SELECT * FROM departments').then(async dbRes => {

        const employees = dbRes.map(employee => {
            return {
                name: employee.name,
                value: employee.id,
            };
        })

        console.table(employees)

        const answers = await inquirer.prompt([
            {
                name: 'first_name',
                message: 'What is the first name of the employee?',
                type: 'input'
            },
            {
                name: 'last_name',
                message: 'What is the last name of the employee?',
                type: 'input'
            },
            {
                name: 'role_id',
                message: 'What is the role id?',
                type: 'number'
            },
            {
                name: 'manager_id',
                message: 'What is the manager id?',
                type: 'list',
                choices: employees
            }

        ])

        console.log(answers);

        db.query('INSERT INTO employees SET ?', [answers]).then(dbRes => {
            console.log(dbRes);
            menu()
        })
    })


}

async function updateEmp() {
    db.query('SELECT * FROM employees').then(async dbRes => {
        
        const employees = dbRes.map(employee => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
                role: employee.role_id
            };
        })
        console.log(employees);

        const roles = dbRes.map(role => {
            return {
                name: role.title,
                id: role.id,
            };
        })

        console.log(roles)
        const answers = await inquirer.prompt([
            {
                name: 'empID',
                message: 'What is the id of the employee?',
                type: 'list',
                choices: employees
            },
            {
                name: 'role_id',
                message: 'What is the new role id?',
                type: 'list',
                choices: roles
            }
        ])

        db.query('UPDATE employees SET role_id = ? WHERE id = ?', [answers.role_id, answers.empID]).then(dbRes => {
            console.log('role updated!');
            menu()
        })
 })
}

async function addRole() {
    db.query('SELECT * FROM departments').then(async dbRes => {

        const departments = dbRes.map(department => {
            return {
                name: department.name,
                value: department.id,
            };
        })

        const answers = await inquirer.prompt([
            {
                name: 'title',
                message: 'What is the name of the role?',
                type: 'input'
            },
            {
                name: 'salary',
                message: 'What is the salary of the role?',
                type: 'number'
            },
            {
                name: 'department_id',
                message: 'What department is the role assigned to?',
                type: 'list',
                choices: departments
            }

        ])

        db.query('INSERT INTO role SET ?', [answers]).then(dbRes => {
            console.log('role created!');
            menu()
        })
    })


}

async function departments() {
    try {
        db.query('SELECT * FROM departments', function (err, results) {
            console.table(results)
            menu();
        })
    }
    catch (err) {
        console.log(err)
    }
}

async function roles() {
    try {
        db.query('SELECT * FROM role', function (err, results) {
            console.table(results)
            menu();
        })
    }
    catch (err) {
        console.log(err)
    }
}

async function employees() {
    try {
        db.query('SELECT * FROM employees', function (err, results) {
            console.table(results)
            menu();
        })
    }
    catch (err) {
        console.log(err)
    }
}








/* 
if statement in the .then = ...
call function
*/