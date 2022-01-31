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

//Start program
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
        'Update an employee role',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'Exit'
      ]
    }
  ])
  .then((answer) =>
  {
    switch(answer.options)
    {
      case 'View all departments':
        displayDepartments();
        break;
      case 'View all roles':
        displayRoles();
        break;
      case 'View all employees':
        displayEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployee();
        break;
      case 'Delete a department':
        deleteDepartment();
        break;
      case 'Delete a role':
        deleteRole();
        break;
      case 'Delete an employee':
        deleteEmployee();
        break;
      case 'Exit':
        exitProgram();
        break;
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
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id', (err, result) =>
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
        if(isNaN(salaryInput))
        {
          console.log('Please enter a salary!');
          return false;
        }
        else {
          return true;
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
          const roleArr = result.map(({title, id}) => ({name: title, value:id}));

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
                      });
                    });
              });
            });
        });
      });
}

const updateEmployee = () =>
{
  db.query('SELECT * FROM EMPLOYEE', (err, result) =>
  {
    if (err) 
    {
      console.log(err);
    }
    const employee = result.map(({id,first_name,last_name}) => ({name: first_name + " " + last_name, value:id}));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeChosen',
        message: 'Which employee would you like to update?',
        choices: employee
      }
    ])
    .then(answer =>
      {
        let selectedEmployee = [];
        let ourEmployee = answer.employeeChosen;
        db.query('SELECT * FROM ROLE', (err, result) =>
        {
          const roleArr = result.map(({id, title}) => ({name: title, value:id}));
          if (err) {
            console.log(err);
          }
          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: 'What is the employees new role?',
              choices: roleArr
            }
          ])
          .then(answer =>
          {
              let ourRole = answer.role;
              selectedEmployee.push(ourRole, ourEmployee);
          
           db.query('UPDATE EMPLOYEE SET role_id = ? WHERE id = ?', selectedEmployee, (err,result) =>    
           {
            if (err) {
              console.log(err);
            }
            console.table(result);
            displayEmployees();
           });
          });
        });
      });
  });
}

const deleteDepartment = () =>
{
  db.query('SELECT * FROM DEPARTMENT', (err, result) =>
  {
    const deptArr = result.map(({name, id}) => ({name: name, value:id}));
    if (err) {
      console.log(err);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to remove?',
        choices: deptArr
      }
    ])
    .then(answer =>
      {
        db.query('DELETE FROM DEPARTMENT WHERE id = ?', answer.department, (err, result) =>
        {
          if (err) {
            console.log(err);
          }
          console.table(result);
          displayDepartments();
        });
      });
  });
}

const deleteRole = () =>
{
  db.query('SELECT * FROM ROLE', (err, result) =>
  {
    const roleArr = result.map(({id, title}) => ({name: title, value:id}));
    if (err) {
      console.log(err);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to remove?',
        choices: roleArr
      }
    ])
    .then(answer =>
      {
        db.query('DELETE FROM ROLE WHERE id = ?', answer.role, (err, result) =>
        {
          if (err) {
            console.log(err);
          }
          console.table(result);
          displayRoles();
        });
      });
  });
}

const deleteEmployee = () =>
{
  db.query('SELECT * FROM EMPLOYEE', (err, result) =>
  {
    const empArr = result.map(({id,first_name,last_name}) => ({name: first_name + " " + last_name, value:id}));
    if (err) {
      console.log(err);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to remove?',
        choices: empArr
      }
    ])
    .then(answer =>
      {
        db.query('DELETE FROM EMPLOYEE WHERE id = ?', answer.employee, (err, result) =>
        {
          if (err) {
            console.log(err);
          }
          console.table(result);
          displayEmployees();
        });
      });
  });
}

const exitProgram = () =>
{
  process.exit();
}

init();