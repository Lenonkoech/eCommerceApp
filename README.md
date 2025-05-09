# eCommerce Project - Full-Stack Application

This repository contains a full-stack eCommerce application built with **ASP.NET Core** for the backend API and **React** for the frontend. The application supports basic eCommerce functionalities such as **user registration**, **login**, **product management**, **shopping cart**, and **orders**. The backend API integrates **JWT authentication**, and the frontend is built using **Create React App**.

---

## 📁 File Structure

### Backend (`eCommerceApi/`)

```
eCommerceApi/
│
├── Controllers/             # API Controllers (Auth, Products, Cart, Orders, etc.)
├── DTOs/                    # Data Transfer Objects
├── Models/                  # Entity models (User, Product, Order, etc.)
├── Services/                # Business logic and service classes
├── appsettings.json         # Application configuration (DB connection, JWT secrets)
├── Program.cs               # Main entry point and middleware setup
└── eCommerceApi.csproj      # .NET project file
```

### Frontend (`eCommerceAppFrontend/`)

```
eCommerceAppFrontend/
│
├── public/                  # Static files and HTML template
│
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-level components (Home, Cart, Login, etc.)
│   ├── services/            # API interaction logic (Axios or Fetch wrappers)
│   ├── context/             # Global state management (e.g., Auth, Cart)
│   ├── App.js               # Root component
│   ├── index.js             # React DOM entry point
│   └── styles/              # Global and modular CSS
│
├── .env                     # Environment variables (e.g., REACT_APP_API_URL)
├── package.json             # NPM configuration and dependencies
└── README.md                # Frontend-specific documentation
```

---

##  Features

### Backend - eCommerce API
- **User Registration & Authentication** (JWT-based)
- **Admin Management**
- **Product & Category CRUD**
- **Shopping Cart Functionality**
- **Order Management**
- **Secure Password Hashing**

### Frontend - React Application
- **Responsive and Interactive UI**
- **User Auth and JWT Token Storage**
- **Product Listings & Cart Operations**
- **Order Placement Flow**

---

## 🛠️ Requirements

### Backend
- .NET 6.0 SDK or later
- MySQL Server
- Visual Studio / VS Code

### Frontend
- Node.js & npm
- Modern Browser

---

## 🚀 Installation

### 1. Clone the Repositories

```bash
git clone https://github.com/Lenonkoech/eCommerceApi.git
git clone https://github.com/Lenonkoech/eCommerceAppFrontend.git
```

### 2. Backend Setup

```bash
cd eCommerceApi
dotnet restore
# Configure database in appsettings.json
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

### 3. Frontend Setup

```bash
cd ../eCommerceAppFrontend
npm install
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔗 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Products

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/{id}`
* `DELETE /api/products/{id}`

### Cart & Orders

* `POST /api/cart`
* `GET /api/cart`
* `POST /api/orders`

---

## 📦 Frontend Scripts

```bash
npm start       # Run development server
npm test        # Run tests
npm run build   # Build for production
npm run eject   # Eject Create React App configs
```

---

## ⚙️ Technology Stack

### Backend

* ASP.NET Core
* Entity Framework Core
* MySQL
* JWT Authentication

### Frontend

* React
* Create React App
* Axios / Fetch API
* CSS Modules

---

## 🌐 Deployment

### Backend

* Deploy on Azure, AWS, Render, Railway, or your preferred .NET hosting service

### Frontend

* Deploy using Netlify, Vercel, or GitHub Pages (with static build)

---

Feel free to contribute or fork this project for your own use!
