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
                    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee']
                }
            ]
        )
        .then((answers) => {
            if (answers.whereTo === 'view all departments') {
                return employees();
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

    // console.log(answers)

    db.query('INSERT INTO departments(name) VALUES (?)', [answers.newDep])
        .then(results => {
            console.log('Deparment added...');
            menu();
        })
        .catch(err => {
            console.error(err);
        });
    // try {
    //    const results = await db.query('INSERT INTO departments(?) VALUES (?)', ['name', answers.newDep])
    // } catch (err){
    //     console.log(err)
    // }
}

async function addEmp() {
    db.query('SELECT * FROM departments').then(async dbRes => {
        console.table(dbRes)

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

        db.query('INSERT INTO role SET ?', [answers]).then(dbRes => {
            console.log('role created!');
            menu()
        })
    })


}
async function addRole() {
    db.query('SELECT * FROM departments').then(async dbRes => {
        console.log(dbRes)

        const departments = dbRes.map(department => {
            return {
                name: department.name,
                value: department.id,
            };
        })

        console.log(departments)

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

        console.log(answers);

        db.query('INSERT INTO role SET ?', [answers]).then(dbRes => {
            console.log('role created!');
            menu()
        })
    })


}

async function employees() {
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