# RESTful API Project

## Introduction

This is a RESTful API project developed using Node.js, Express.js, MySQL, JWT (JSON Web Tokens), and Bcrypt. The purpose of this project is to provide a backend solution for managing a todo list application. Users can register, login, add todo items, view their todo list, update todo item status, and delete todo items.

## Features

- **User Registration**: Users can register by providing a unique username and password. Passwords are hashed using bcrypt before being stored in the database.
- **User Authentication**: Registered users can login using their credentials. Upon successful login, a JWT token is generated and provided to the user for authentication in subsequent requests.
- **Todo List Management**: Authenticated users can perform CRUD (Create, Read, Update, Delete) operations on their todo list items.
- **Token-based Authentication**: JWT tokens are used for authentication. Each authenticated request must include a valid JWT token in the Authorization header.
- **Error Handling**: Comprehensive error handling is implemented to handle various scenarios such as invalid input, database errors, and authentication failures.

## Tech Stack

- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Web application framework for building APIs and handling HTTP requests.
- **MySQL**: Relational database management system for storing user data and todo list items.
- **JWT (JSON Web Tokens)**: Token-based authentication mechanism for securing API endpoints.
- **Bcrypt**: Password hashing library used to securely store user passwords in the database.

## Setup

1. Clone the repository: `git clone https://github.com/your_username/your_project.git`
2. Install dependencies: `npm install`
3. Set up MySQL database and configure connection details in `db_connect.js`.
4. Start the server: `node index.js`
5. The API will be running at `http://localhost:3000`.

## API Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Login with existing credentials and receive a JWT token.
- **POST /todolist**: Add a new todo item.
- **GET /todolist**: View all todo items for the authenticated user.
- **PUT /todolist/:id**: Update the status of a todo item.
- **DELETE /todolist/:id**: Delete a todo item.

## Usage

1. Register a new user using the `/register` endpoint.
2. Login with your credentials using the `/login` endpoint to receive a JWT token.
3. Use the provided token to authenticate subsequent requests to protected endpoints.
4. Perform CRUD operations on your todo list using the appropriate endpoints.
