# NestJS Authentication Setup

![NestJS](https://nestjs.com/img/logo.svg)

A comprehensive NestJS authentication setup with:

- **Passport-Local** for user login
- **Mongoose & Passport-JWT** for secure JWT handling
- **Nodemailer** for email verification
- **Bcrypt** for password hashing

This setup provides a robust and scalable authentication system for NestJS applications.

## Features

- **Passport-Local Authentication**: Handles user login with username and password.
- **Mongoose & Passport-JWT**: Securely manage JWT for authentication and authorization.
- **Nodemailer**: Enables email verification and other email functionalities.
- **Bcrypt**: Provides secure password hashing for user authentication.

## Prerequisites

- Node.js and npm installed
- MongoDB instance running
- NestJS CLI installed

## Installation

1. **Clone the Repository**

   ```bash
    git clone https://github.com/oxcodexo/nestjs-auth-mongoose-jwt-nodemailer.git
    cd nestjs-auth-mongoose-jwt-nodemailer
   ```

2. **Install Dependencies**

   ```bash
    npm install
   ```

3. **Set Up Environment Variables**

   Rename `.env.template` file to `.env` and modify the environment variables

4. **Run the Application**

   ```bash
    npm run start
   ```
