# Library Book Manager

## Objective
A responsive web application where a librarian can register, login and manage book records (add, view, update, delete).

## Technologies Used
HTML5, CSS3, Bootstrap 5, JavaScript (ES6), Node.js, Express.js, MySQL, Git and GitHub

## Features
- Register and login with bcrypt password hashing
- Session based authentication and protected pages
- CRUD operations on books using a REST API with JSON
- Client side and server side validation
- Parameterized SQL queries and output escaping
- Responsive layout for mobile, tablet and desktop

## Folder Structure
- server.js
- database.sql
- public/login.html
- views/books.html

## How to Run
1. Start MySQL in XAMPP.
2. Import database.sql in phpMyAdmin.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000

## API Endpoints
| Endpoint | Method | Purpose |
|---|---|---|
| /api/register | POST | Register user |
| /api/login | POST | Login |
| /api/books | GET | Get all books |
| /api/books | POST | Add book |
| /api/books/:id | PUT | Update book |
| /api/books/:id | DELETE | Delete book |

## Author
Avi Mangukiya, 26DCE046