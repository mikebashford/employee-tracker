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

const init = () =>
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
      displayDepartments();
    }
    if(answer.options == 'View all roles')
    {
      //Return job title, role id, department, and salary for role
      displayRoles();
    }
    if(answer.options == 'View all employees')
    {
      //Return table with employee ids, first name, last name, job title, department, salary, and manager
      displayEmployees();
    }
    if(answer.options == 'Add a department')
    {
      //Function to create new department
      addDepartment();
    }
    if(answer.options == 'Add a role')
    {
      //Function to enter name, salary, and department for created role
      addRole();
    }
    if(answer.options == 'Add a employee')
    {
      //Function to add first name, last name, role, manager, then add to database
      addEmployee();
    }
    if(answer.options == 'Update an employee role')
    {
      //Function that selects an employee to update, then updates their info in database
      updateEmployee();
    }
  });
}

const displayDepartments = () =>
{
  db.query('SELECT * FROM department', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
}

const displayRoles = () =>
{
  db.query('SELECT *, department.name FROM role LEFT JOIN department ON role.department_id = department.id', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
}

const displayEmployees = () =>
{
  db.query('SELECT *, role.title, role.salary, department.name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id', (err, result) =>
  {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
}

const addDepartment = () =>
{
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
  .then((answer) =>
  {
    db.query(`INSERT INTO DEPARTMENT (name) VALUES (?)`, answer.department, (err, result) =>
    {
      if (err) {
        console.log(err);
      }
      console.table(result);
      displayDepartments();
    });
  });
}

const addRole = () =>
{
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: "What is the name of the role you'd like to add?",
      validate: titleInput =>
      {
        if(titleInput)
        {
          return true;
        }
        else {
          console.log('Please enter a role name!');
          return false;
        }        
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this role?',
      validate: salaryInput =>
      {
        if(salaryInput)
        {
          return true;
        }
        else {
          console.log('Please enter a salary!');
          return false;
        }    
      }
    },
  ])
  .then((answer) =>
  {
    let data = [answer.title, answer.salary];
    db.query('SELECT * FROM DEPARTMENT', (err,result) =>
    {
      if (err) {
        console.log(err);
      }
      const deptArr = result.map(({name, id}) => ({name: name, value:id}));

      inquirer.prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Which department is this role in?',
          choices: deptArr
        }
      ])
      .then(selection =>
        {
          data.push(selection.department);
          db.query(`INSERT INTO ROLE (title, salary, department_id) VALUES (?, ?, ?)`, data , (err, result) =>
          {
            if (err) {
              console.log(err);
            }
            console.table(result);
            displayRoles();
          });
        });
    });
  });
}

const addEmployee = () =>
{
  return inquirer.prompt([
    {
      type: 'input',
      name: 'first',
      message: "What is the first name of the employee?",
      validate: firstInput =>
      {
        if(firstInput)
        {
          return true;
        }
        else {
          console.log('Please enter a first name!');
          return false;
        }        
      }
    },
    {
      type: 'input',
      name: 'last',
      message: 'What is the last name of the employee?',
      validate: lastInput =>
      {
        if(lastInput)
        {
          return true;
        }
        else {
          console.log('Please enter a last name!');
          return false;
        }    
      }
    }
  ])
    .then(answer =>
      {
        let data = [answer.first, answer.last];
        db.query('SELECT role.id, role.title FROM ROLE', (err,result) =>
        {
          if (err) {
            console.log(err);
          }
          const roleArr = result.map(({name, id}) => ({name: title, value:id}));

          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: 'What role does the employee have?',
              choices: roleArr
            }
          ])
          .then(answer =>
            {
              data.push(answer.role);
              db.query('SELECT * FROM EMPLOYEE', (err,result) =>
              {
                if (err) {
                  console.log(err);
                }
                const managers = result.map(({id,first_name,last_name}) => ({name: first_name + " " + last_name, value:id}));

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the manager of this employee?',
                    choices: managers
                  }
                ])
                  .then(answer =>
                    {
                      data.push(answer.manager);
                      db.query('INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id VALUES(?,?,?,?', (err, result) =>
                      {
                        if (err) {
                          console.log(err);
                        }
                        console.table(result);
                        displayEmployees();
                      })
                    })
              })
            })
        })
      })
}

const updateEmployee = () =>
{

}

init();