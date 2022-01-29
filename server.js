const inquirer = require('inquirer');

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
    if(answer.select === 'View all departments')
    {
      //Return table with department names and ids
    }
    if(answer.select === 'View all roles')
    {
      //Return job title, role id, department, and salary for role
    }
    if(answer.select === 'View all employees')
    {
      //Return table with employee ids, first name, last name, job title, department, salary, and manager
    }
    if(answer.select === 'Add a department')
    {
      //Function to create new department
    }
    if(answer.select === 'Add a role')
    {
      //Function to enter name, salary, and department for created role
    }
    if(answer.select === 'Add a employee')
    {
      //Function to add first name, last name, role, manager, then add to database
    }
    if(answer.select === 'Update an employee role')
    {
      //Function that selects an employee to update, then updates their info in database
    }
  });
}

presentOptions();