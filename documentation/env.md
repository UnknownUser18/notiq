# Env

## What is this file about?

This file provides an overview of the environment setup and configuration for the project. It includes details about
the environment variables and any necessary setup steps required to run the project successfully.

### Environment Variables

```dotenv
HOST=""
PORT=
ACCEPTED_HOST=""
JWT_SECRET_KEY=""
DATABASE_HOST=""
DATABASE_NAME=""
DATABASE_USER=""
DATABASE_PASSWORD=""
```

#### Variable Descriptions
- **HOST**: The host address where the application will run.
- **PORT**: The port number on which the application will listen.
- **ACCEPTED_HOST**: The host (frontend) on which the application get and send HTTP requests.
- **JWT_SECRET_KEY**: The secret key used for signing JSON Web Tokens (JWT).
- **DATABASE_HOST**: The host address of the database server.
- **DATABASE_NAME**: The name of the database to connect to.
- **DATABASE_USER**: The username for accessing the database.
- **DATABASE_PASSWORD**: The password for the database user.
- **DATABASE_PORT**: The port number on which the database server is running.

### Setup Steps
1. **Create a `.env` file** in the `/backend` directory of the project.
2. **Copy the environment variables** from the example provided above into the `.env` file.
3. **Fill in the values** for each variable according to your environment setup.
4. **Ensure that the database is running** and accessible with the provided credentials.
5. **Start the application** using `npm run prod` or when in root directory `cd backend && npm run prod`.

### Example `.env` File
```dotenv
HOST="localhost"
PORT=3000
ACCEPTED_HOST="http://localhost:4200"
JWT_SECRET_KEY="your_jwt_secret"
DATABASE_HOST="localhost"
DATABASE_NAME="your_database_name"
DATABASE_USER="your_database_user"
DATABASE_PASSWORD="your_database_password"
DATABASE_PORT=5432
```