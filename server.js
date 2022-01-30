const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'mike',
    password: 'password',
    database: 'employee_db'
  },
  console.log('Connected to the employee database.')
);

const presentOptions = () =>
{
  return inquirer.prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    }
  ])
  .then((answer) =>
  {
    console.log(answer.options);
    if(answer.options == 'View all departments')
    {
      //Return table with department names and ids
      getDepartments();
    }
    if(answer.options == 'View all roles')
    {
      //Return job title, role id, department, and salary for role
      getRoles();
    }
    if(answer.options == 'View all employees')
    {
      //Return table with employee ids, first name, last name, job title, department, salary, and manager
      getEmployees();
    }
    if(answer.options == 'Add a department')
    {
      //Function to create new department
    }
    if(answer.options == 'Add a role')
    {
      //Function to enter name, salary, and department for created role
    }
    if(answer.options == 'Add a employee')
    {
      //Function to add first name, last name, role, manager, then add to database
    }
    if(answer.options == 'Update an employee role')
    {
      //Function that selects an employee to update, then updates their info in database
    }
  });
}

const getDepartments = () =>
{
  db.query('SELECT * FROM department', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
}

const getRoles = () =>
{
  db.query('SELECT *, department.name FROM role LEFT JOIN department ON role.department_id = department.id', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    return console.table(result);
  });
}

const getEmployees = () =>
{
  db.query('SELECT *, role.title, role.salary, department.name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    return console.table(result);
  });
}

const addDepartment = () =>
{
  db.query('SELECT * FROM department', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    console.table(result);

    return inquirer.prompt([
      {
        type: 'input',
        name: 'department',
        message: "What is the name of the department you'd like to add?",
        validate: departmentInput =>
        {
          if(departmentInput)
          {
            return true;
          }
          else {
            console.log('Please enter a department name!');
            return false;
          }        
        }
      }
    ])
  });
}

const addRole = () =>
{
  db.query('SELECT * FROM role', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    return console.table(result);
  });
}

const addEmployee = () =>
{
  db.query('SELECT * FROM employee', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    return console.table(result);
  });
}

const updateEmployee = () =>
{
  db.query('SELECT * FROM employee', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    return console.table(result);
  });
}
presentOptions();