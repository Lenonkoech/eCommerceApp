
## eCommerce API

This is an **eCommerce API** built using **ASP.NET Core** and **Entity Framework Core**. The API supports basic eCommerce functionalities such as **user registration**, **login**, managing **products**, **categories**, **shopping cart**, and **orders**. It also includes password security with hashing and salting techniques.

## Features

- **User Registration**: Allows users to register with their name, email, phone, and password. The password is securely hashed and salted.
- **User Login**: Authenticates users using email and password. Provides JWT tokens for authentication.
- **Product Management**: Allows adding, retrieving, updating, and deleting products.
- **Category Management**: Manage different categories for products.
- **Shopping Cart**: Users can add products to their shopping cart.
- **Cart Items**: Items in the shopping cart are associated with the user and products.
- **Orders**: Users can place orders based on the items in their shopping cart.
- **Secure Authentication**: Passwords are not stored in plain text. Only the hashed password and salt are stored.

## Requirements

- **.NET 6.0 SDK** or later
- **MySQL** or another supported database (like SQL Server or SQLite)
- **Visual Studio** or another C# IDE (Optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Lenonkoech/eCommerceApi.git
```

### 2. Open the Project in Visual Studio

Open the project in **Visual Studio** or your preferred editor.

### 3. Install Required Packages

Restore the necessary NuGet packages:

```bash
dotnet restore
```

### 4. Configure the Database Connection

In `appsettings.json`, configure your database connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=ecommerceDb;user=root;password=yourpassword"
  }
}
```

### 5. Add Migrations and Update the Database

Generate and apply the migration to create the database and tables:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 6. Run the API

Start the application:

```bash
dotnet run
```

## API Endpoints

### User Registration

**POST** `/api/auth/register`

Registers a new user by providing their name, email, phone number, and password. The password is securely hashed and salted before storage.

**Request Body:**
```json
{
  "name": "John Mwaku",
  "email": "user@example.com",
  "phone": "+123456789",
  "password": "Password123"
}
```

**Response:**
- `201 Created`: User registered successfully
- `400 Bad Request`: Invalid data

### User Login

**POST** `/api/auth/login`

Logs in a user by verifying their email and password. Returns a JWT token upon successful login.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

**Response:**
- `200 OK`: Successful login with JWT token
- `401 Unauthorized`: Invalid credentials

### Get All Products

**GET** `/api/products`

Fetches all products in the database.

**Response:**
- `200 OK`: Returns a list of products

### Get Product by ID

**GET** `/api/products/{id}`

Fetches a specific product by its ID.

**Response:**
- `200 OK`: Returns product details
- `404 Not Found`: Product with the given ID doesn't exist

### Add Product

**POST** `/api/products`

Adds a new product to the catalog.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 29.99,
  "categoryId": 1
}
```

**Response:**
- `201 Created`: Product added successfully
- `400 Bad Request`: Invalid data

### Update Product

**PUT** `/api/products/{id}`

Updates the details of a specific product by its ID.

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated Description",
  "price": 35.00
}
```

**Response:**
- `200 OK`: Product updated successfully
- `404 Not Found`: Product with the given ID doesn't exist

### Delete Product

**DELETE** `/api/products/{id}`

Deletes a specific product by its ID.

**Response:**
- `200 OK`: Product deleted successfully
- `404 Not Found`: Product with the given ID doesn't exist

### Get Categories

**GET** `/api/categories`

Fetches all product categories in the database.

**Response:**
- `200 OK`: Returns a list of categories

### Add Category

**POST** `/api/categories`

Adds a new product category.

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Response:**
- `201 Created`: Category added successfully

### Add to Shopping Cart

**POST** `/api/cart`

Adds an item to the shopping cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
- `200 OK`: Item added to the cart successfully
- `400 Bad Request`: Invalid data

### Get Shopping Cart

**GET** `/api/cart`

Fetches all items in the user's shopping cart.

**Response:**
- `200 OK`: Returns cart items

### Place Order

**POST** `/api/orders`

Creates an order from the items in the user's shopping cart.

**Response:**
- `201 Created`: Order placed successfully
- `400 Bad Request`: Invalid data

## Technology Stack

- **ASP.NET Core** for building the API
- **Entity Framework Core** for ORM and database interaction
- **MySQL** for storing data
- **JWT (JSON Web Tokens)** for authentication
- **Swagger** for API documentation and testing
