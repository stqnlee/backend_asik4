# Assignment 4 — Notes API (MVC + JWT + RBAC)

## Project Description
This project is a Notes Management System with Categories and User Roles.  
It is based on Assignment 3, but refactored to use a professional MVC architecture and security features.

Primary object: **Note**  
Secondary object: **Category**  
Additional object: **User**
Each Note belongs to a Category.


## Technologies
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- bcrypt (password hashing)


## Architecture (MVC)
- **models/** – database schemas (User, Note, Category)
- **controllers/** – business logic and CRUD operations
- **routes/** – API endpoints
- **middleware/** – authentication, authorization, and error handling


## Authentication & RBAC
- Users can register and login.
- Passwords are stored as hashed values using bcrypt.
- JWT is used for authorization.
- Public access: all GET requests (read operations).
- Protected access: POST, PUT, DELETE requests.
- Only users with role **admin** can create, update, or delete Notes and Categories.

Admin users are created using a special registration secret (`x-admin-secret` header).


## API Endpoints

### Auth
- POST `/auth/register`
- POST `/auth/login`

### Categories
- GET `/categories` (public)
- POST `/categories` (admin only)
- PUT `/categories/:id` (admin only)
- DELETE `/categories/:id` (admin only)

### Notes
- GET `/notes` (public, supports filters)
- GET `/notes/:id` (public)
- POST `/notes` (admin only)
- PUT `/notes/:id` (admin only)
- DELETE `/notes/:id` (admin only)


## Setup

1. Install dependencies:

npm install

## Run the server

node server.js

in browser:

http://localhost:3000

