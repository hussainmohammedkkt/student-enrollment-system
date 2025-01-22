
## Student Enrollment System
This system allows for the management of students, courses, and enrollments. It features a role-based access control system:

Superadmins: Have the highest privileges and can manage other admin accounts.
Admins: Can manage students, courses, and enrollments.
Students: Have access only to their own profile.

This structure ensures proper segregation of duties and role-specific access to various features of the system.

## Project setup

```bash
$ npm install
```
 Add a .env file in the root of the project with the content inside .env-sample file

## Swagger documentation

Swagger documentation is available at http://localhost:3000/api


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test
```
