-- TO DO Create a list of employees, roles, and departments to fill the database with
INSERT INTO department(name)
VALUES  ("Art"),
        ("QA"),
        ("Engineer"),
        ("Manager");

SELECT * FROM DEPARTMENT;

INSERT INTO role(title, salary, department_id)
VALUES  ("Environment Artist", 59482, 1),
        ("User Interface Artist", 80973, 1),
        ("Level Designer", 55664, 1),
        ("Lead Animator", 56451, 1),
        ("Sound Engineer", 48591, 3),
        ("Game Tester", 59578, 2),
        ("Programmer", 91673, 3),
        ("Manager", 191673, 4);

SELECT * FROM ROLE;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("John", "Smith", 1, 1),
        ("Bob", "Jones", 2,1),
        ("Mary", "Washington",3, 1),
        ("Will", "Robinson", 4, 1),
        ("Josh", "Johnson", 5, 1),
        ("Patrick", "Willis", 6, 1),
        ("Daniel", "Allen", 7, 1),
        ("Jerry", "Williams", 8, NULL);

SELECT * FROM EMPLOYEE;