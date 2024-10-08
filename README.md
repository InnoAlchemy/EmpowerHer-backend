
Project Directory Structure
The empowerher project follows a well-organized structure to ensure clarity and maintainability.
Below is a detailed overview of each directory and file.

Installation instructions:

1-install xampp.start Apache and then start MySQL go to phpmyadmin create a database and name it empower_her.
2-extract the project folder from zipped folder and open it in vscode check if you have node your machine by running{node -v}, if not install node on your machine.
3-open terminal and type command: {npm install} after installtion complete run the following command to start the project:
{npm run start:dev }
4-Go tO postman and import the EmpowerHer Api Testing Collection.postman_collection.json
5-try using the endpoints in each folder


6-for registertration make sure to input a valild email format and for the password it should be at least 6 charchter long
the default role for you is user 


Project Directory Overview
1. app/

Purpose: Contains the core application logic, including routes, controllers, models, config and middleware.
Subdirectories/Files:
routes/: Defines the API endpoints and application routes.
controllers/: Contains the business logic for handling requests and responses.

2. config/

Purpose: Stores configuration files required for setting up the application environment.
Subdirectories/Files:
ex: 1- db.config.js: Configuration for database connections.
    2- email.config.js: Configuration for email sending settings.

3. controller/

Purpose: Contains the logic for processing user input and interacting with models.
Files:
ex: userController.js: Manages user-related operations (e.g., signup, login).

4. middleware/

Purpose: Holds middleware functions that process requests before they reach the controller.
Files:
ex:1- authMiddleware.js: Handles authentication and authorization.
   2- AdminMiddleware.js: Checks if user has a role of admin.

5. models/

Purpose: Defines data models and schema for interacting with the database.
Files:
ex:1- user.model.js: Schema and methods for user data.
   2-index.js: is where the realtionship between schemas are formed.

6. routes/

Purpose: Specifies the application's routing logic, mapping URLs to controller actions.
Files:
ex: userRoutes.js: Routes for user-related endpoints.

7. node_modules/

Purpose: Directory where all npm packages are installed.
Note: Automatically managed by npm; not manually edited.
8. .env

Purpose: Contains environment variables such as API keys, database credentials, and other configuration settings.
Example Entries:
DB_HOST=localhost
JWT_SECRET=your-jwt-secret
9. .gitignore

Purpose: Specifies files and directories to be ignored by version control.
Example Entries:
node_modules/
.env
10. PostmanTesting collection

Purpose: Postman collection file used for testing API endpoints.
Files:
empowerher.postman_collection.json: Contains predefined tests and request examples.
11. package-lock.json

Purpose: Locks the versions of dependencies to ensure consistent environments across different setups.
Note: Automatically generated by npm.
12. package.json

Purpose: Manages project metadata, dependencies, and scripts.
Key Sections:
dependencies: Lists project dependencies.
scripts: Defines executable commands (e.g., start, test).
devDependencies: Lists development-only dependencies.
13. Readme.md

Purpose: Provides an overview of the project, including setup instructions and usage guidelines.
Key Sections:
Project description
Installation instructions
Usage examples

13. server.js

Purpose: The entry point for the application, responsible for configuring and starting the server.
Key Functions:
Initializes server settings.
Connects to the database.
Starts listening for incoming requests.



//////////////////////////////////////////////////////////
Project Directory Structure Draw Example:

empowerher/
├── app/
│   ├── controllers/
│   ├── routes/
│   
├── config/
│   ├── db.js
│   ├── config.json
│   
├── controller/
│   ├── userController.js
│   └....
├── middleware/
│   ├── authMiddleware.js
│   └── AdminMiddleware.js
├── models/
│   ├── userModel.js
│   └── index.js
├── routes/
│   ├── userRoutes.js
│   └── ...
├── node_modules/
├── .env
├── .gitignore
├── PostmanTesting collection
│   └── empowerher.postman_collection.json
├── package-lock.json
├── package.json
├── Readme.md
└── server.js
