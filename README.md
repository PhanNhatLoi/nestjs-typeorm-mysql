# NestJS TypeORM MySQL Backend

A backend REST API built with [NestJS](https://nestjs.com/), using [TypeORM](https://typeorm.io/) as ORM and [MySQL](https://www.mysql.com/) as the database.

---

## Technologies

- **NestJS** - Node.js framework for building efficient, scalable server-side applications
- **TypeORM** - ORM for TypeScript and JavaScript (ES7+)
- **MySQL** - Relational database
- **Class-validator** - For input validation
- **Swagger** (optional) - API documentation

---

## Features

- RESTful API architecture
- Database models with TypeORM entities
- Data validation with DTOs and class-validator
- Automatic database migrations (optional)
- Environment variable configuration
- Modular architecture (modules, controllers, services)

---

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 16.x)
- [MySQL](https://www.mysql.com/) database server
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/PhanNhatLoi/nestjs-typeorm-mysql.git
cd nestjs-typeorm-mysql
```
Install dependencies (choose one)

```bash
npm install
# or
yarn install
```
Create a .env file at the root folder based on .env.example and configure your database connection and other environment variables

Example .env:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=your_database_name
PORT=3000
Running the application
Start the server with:
```
```bash
npm run start
# or
yarn start
```
For development mode with hot reload:

```bash
npm run start:dev
# or
yarn start:dev
```
