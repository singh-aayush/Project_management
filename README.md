# Backend API for Authentication and Task Management

This repository contains the **backend** Node.js/Express API supporting user authentication (register, login) and project/task management functionalities, designed to work with a React frontend.

---

## Features

- **User Authentication:** Registration and login with secure password hashing (bcrypt) and JWT token issuance.
- **Task Management:** Create, update, delete, and fetch tasks associated with projects.
- **Pagination & Filtering:** Support for paginated task lists with filtering by status.
- **Error Handling:** Consistent API error responses.
- **Security:** Password hashing, JWT verification middleware.
- **Database:** MongoDB with Mongoose ODM.

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/react-auth-app.git](https://github.com/singh-aayush/Project_management.git)
cd backend

### 2. Install Dependencies 
Make sure you have Node.js installed.

npm install

### 3. Setup Enviroment variables
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key


### 4. First time Run Seed file for MongoDb connection

npm run seed

### 5. Start Server

npm run dev

```

### Your Backend is running Congratulations.

## Frontend Setup 

# React Frontend Authentication Application

This repository contains the **frontend** React application for user registration and login, integrated with a backend API. It demonstrates form handling, API communication, authentication state management, and responsive UI design.

---

## Features

- **User Registration:** Sign up with optional name, email, and password.
- **User Login:** Authenticate with email and password.
- **Authentication Context:** Manage user login state and JWT token.
- **API Requests:** Uses Axios for communication with backend endpoints.
- **Responsive Design:** Built with Tailwind CSS and custom CSS for mobile and desktop views.
- **Error Handling:** Shows validation and API errors on forms.
- **Loading States:** Buttons indicate loading during API calls.

---


---

## Getting Started

### Prerequisites

- npm

### Installation

1. Clone the repository

```bash
git clone [https://github.com/your-username/react-auth-app.git](https://github.com/singh-aayush/Project_management.git)
cd react-auth-app

### 2. Install Dependencies 
Make sure you have Node.js installed.

npm install

### 3. Run the Frontend File

npm run dev

