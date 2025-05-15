NestJS Task Management API
==========================

A RESTful API built with NestJS for user authentication and task management, using PostgreSQL, JWT authentication, and TypeORM. The project is containerized with Docker for easy deployment.

Project Overview
----------------

This API allows users to register as admins or regular users, log in to obtain JWT tokens, and manage tasks (create, read, update, delete). Tasks are scoped to users, with admins having access to all tasks and users restricted to their own.

Prerequisites
-------------

### General

*   **Node.js**: Required for local development (Node 22 recommended).
    
    *   Verify: node --version
        
*   **Git**: To clone the repository.
    
    *   Verify: git --version
        

### Docker Environment Prerequisites

*   **Docker**: Docker and Docker Compose must be installed.
    
    *   Verify: docker --version, docker-compose --version (tested with Compose 1.29.2).
        
*   **PostgreSQL**: An existing container named postgres-server-container running on port 5432 with:
    
    *   Database: tasks-db
        
    *   User: admin
        
    *   Password: Qwerty12
        
    *   Verify: sudo docker ps -a | grep postgres-server-container
        
*   **Port Availability**: Host port 3001 must be free (port 3000 is occupied).
    
    *   Check: sudo lsof -i :3001
        
*   **Docker Network**: A network named app-network for connecting the backend to postgres-server-container.
    
*   **PostgreSQL IP**: The IP address of postgres-server-container for docker-compose.yml.
    

Setup Instructions
------------------

### 1\. Clone the Repository

 `git clone git@github.com:ahmzz/task-manager.git  cd task-manager   `

### 2\. Configure Environment

Create or verify the .env file in the project root:

` echo -e "DATABASE_URL=postgresql://admin:Qwerty12@localhost:5432/tasks-db\nJWT_SECRET=ashdfjhasdlkjfhalksdjhflak\nPORT=3000" > .env   `

*   DATABASE\_URL: Local PostgreSQL connection (overridden in Docker).
    
*   JWT\_SECRET: For JWT signing.
    
*   PORT: Container’s internal port (3000).
    

### 3\. Verify PostgreSQL

Ensure postgres-server-container is running:

`sudo docker ps -a | grep postgres-server-container   `

Test connection:

`sudo docker exec -it postgres-server-container psql -U admin -d tasks-db -c "\dt"   `

Running the Project
-------------------

### Running with Docker

1.  sudo docker network create app-networksudo docker network connect app-network postgres-server-container
    
2.  sudo docker inspect postgres-server-container | grep IPAddressExample: "IPAddress": "172.17.0.2".Update docker-compose.yml’s DATABASE\_URL with this IP (e.g., postgresql://admin:Qwerty12@172.17.0.2:5432/tasks-db?schema=public).
    
3.  sudo docker-compose downsudo docker rm -f nest-backend-task\_backend\_1sudo docker-compose build --no-cachesudo docker-compose up -d
    
4.  sudo docker-compose logs backendExpect: \[Nest\] Listening on port 3000.Test API:curl http://localhost:3001
    

### Running Locally

1.  npm install
    
2.  **Ensure PostgreSQL Access**:Verify postgres-server-container is accessible at localhost:5432 or update .env’s DATABASE\_URL with the container’s IP.
    
3.  npm run start:devThe API will run on http://localhost:3000.
    
4.  curl http://localhost:3000
    

API Endpoints
-------------

All endpoints are prefixed with /api. Authentication endpoints are public, while task endpoints require a JWT token in the Authorization: Bearer header.

### Authentication (AuthController)

*   **POST /api/auth/register/admin**
    
    *   **Description**: Register a new admin user.
        
    *   { "email": "admin@example.com", "password": "password123", "name": "Admin User"}
        
    *   **Response**: { "token": "jwt-token" }
        
    *   **Errors**:
        
        *   400 Bad Request: If email already exists (AUTH\_EMAIL\_EXISTS).
            
*   **POST /api/auth/register/user**
    
    *   **Description**: Register a new regular user.
        
    *   { "email": "user@example.com", "password": "password123", "name": "Regular User"}
        
    *   **Response**: { "token": "jwt-token" }
        
    *   **Errors**:
        
        *   400 Bad Request: If email already exists (AUTH\_EMAIL\_EXISTS).
            
*   **POST /api/auth/login**
    
    *   **Description**: Log in a user and receive a JWT token.
        
    *   { "email": "user@example.com", "password": "password123"}
        
    *   **Response**: { "token": "jwt-token" }
        
    *   **Errors**:
        
        *   400 Bad Request: If user doesn’t exist (AUTH\_USER\_NOT\_EXISTS) or credentials are invalid (AUTH\_INVALID\_CREDENTIALS).
            

### Tasks (TasksController)

All endpoints require JWT authentication and are restricted to ADMIN or USER roles (via RolesGuard). Admins can access all tasks, while users can only access their own.

*   **POST /api/tasks**
    
    *   **Description**: Create a new task.
        
    *   { "title": "New Task", "description": "Task description", "status": "pending"}
        
    *   **Response**: Task object (e.g., { "id": 1, "title": "New Task", "description": "Task description", "status": "pending", "userId": 1 })
        
    *   **Status**: 201 Created
        
*   **GET /api/tasks**
    
    *   **Description**: Retrieve all tasks (user’s own for USER, all tasks for ADMIN).
        
    *   **Response**: Array of task objects
        
    *   **Errors**:
        
        *   None (empty array if no tasks).
            
*   **GET /api/tasks/:id**
    
    *   **Description**: Retrieve a specific task by ID.
        
    *   **Response**: Task object
        
    *   **Errors**:
        
        *   404 Not Found: If task doesn’t exist (TASK\_NOT\_FOUND).
            
        *   403 Forbidden: If user tries to access another user’s task (TASK\_ACCESS\_DENIED).
            
*   **PATCH /api/tasks/:id**
    
    *   **Description**: Update a task.
        
    *   { "title": "Updated Task", "description": "Updated description", "status": "completed"}
        
    *   **Response**: Updated task object
        
    *   **Errors**:
        
        *   404 Not Found: If task doesn’t exist (TASK\_NOT\_FOUND).
            
        *   403 Forbidden: If user tries to access another user’s task (TASK\_ACCESS\_DENIED).
            
*   **DELETE /api/tasks/:id**
    
    *   **Description**: Delete a task.
        
    *   **Response**: None (204 No Content)
        
    *   **Errors**:
        
        *   404 Not Found: If task doesn’t exist (TASK\_NOT\_FOUND).
            
        *   403 Forbidden: If user tries to access another user’s task (TASK\_ACCESS\_DENIED).
            

### Example Usage

1.  curl -X POST http://localhost:3001/api/auth/register/user \\ -H "Content-Type: application/json" \\ -d '{"email":"user@example.com","password":"password123","name":"User"}'
    
2.  curl -X POST http://localhost:3001/api/auth/login \\ -H "Content-Type: application/json" \\ -d '{"email":"user@example.com","password":"password123"}'Save the token from the response.
    
3.  curl -X POST http://localhost:3001/api/tasks \\ -H "Authorization: Bearer " \\ -H "Content-Type: application/json" \\ -d '{"title":"New Task","description":"Task description","status":"pending"}'
    
4.  curl -X GET http://localhost:3001/api/tasks \\ -H "Authorization: Bearer "
    

Design Decisions
----------------

*   **NestJS Framework**:
    
    *   Chosen for its modular architecture, TypeScript support, and built-in dependency injection, simplifying API development.
        
*   **TypeORM**:
    
    *   Used for PostgreSQL interactions due to its ORM capabilities, enabling easy entity management and queries.
        
*   **JWT Authentication**:
    
    *   Implemented with JwtService and JwtAuthGuard for secure, stateless authentication. Tokens include user ID, email, and role.
        
*   **Role-Based Access Control**:
    
    *   RolesGuard and @Roles decorator ensure admins access all tasks, while users are restricted to their own, enhancing security.
        
*   **Bcrypt for Passwords**:
    
    *   Passwords are hashed with bcrypt (10 salt rounds) for secure storage.
        
*   **Error Handling**:
    
    *   Custom HttpException with structured error responses (statusCode, message, errorCode) for clear client feedback.
        
*   **Docker Integration**:
    
    *   Leverages an existing postgres-server-container to avoid redundant database setup, using app-network for connectivity.
        

Areas for Improvement
---------------------

Given more time, the following enhancements could be implemented:

*   **Database Migrations**:
    
    *   Use TypeORM migrations to manage tasks-db schema changes, replacing synchronize: true for production safety.
        
*   **API Documentation**:
    
    *   Integrate @nestjs/swagger for interactive OpenAPI documentation.
        
*   **Enhanced Validation**:
    
    *   Add stricter DTO validation (e.g., email regex, password strength) using class-validator.
        
*   **Testing**:
    
    *   Implement unit and integration tests with @nestjs/testing and Jest for controllers and services.
        
*   **Refresh Tokens**:
    
    *   Add refresh tokens for longer sessions, improving user experience.
        
*   **Logging**:
    
    *   Use Winston for structured logging to aid debugging and monitoring.
        
*   **Rate Limiting**:
    
    *   Apply @nestjs/throttler to prevent abuse on authentication endpoints.
        
*   **Multi-Stage Docker Build**:
    
    *   Optimize image size with a multi-stage Dockerfile.