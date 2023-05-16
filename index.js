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
            else if(answers.whereTo === 'view all roles'){
                return roles();
            }
            else if(answers.whereTo === 'view all employees'){
                return employees();
            }
            else if(answers.whereTo === 'add a department'){
                return addDep();
            }
            else if(answers.whereTo === 'add a role'){
                return addRole();
            }
            else if (answers.whereTo === 'add an employee'){
                return addEmp();
            }
        }
        )
}

menu();

async function departments() {
    try {
        db.query('SELECT * FROM departments', function (err, results) {
            console.table(results)
            menu();
        })
    } 
    catch(err){
        console.log(err)
    }
}

async function roles() {
    try {
        db.query('SELECT * FROM roles', function (err, results) {
            console.table(results)
            menu();
        })
    } 
    catch(err){
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
    catch(err){
        console.log(err)
    }
}

async function addDep(){
    try {
        db.query('INSERT INTO departments(name) VALUES (?)', [], (err, result))
    }
}




/* 
if statement in the .then = ...
call function
*/