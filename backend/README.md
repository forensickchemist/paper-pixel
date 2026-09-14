# Paper Pixel Bookstore — Backend

The Paper Pixel backend is a RESTful API built with **Node.js** and **Express.js**. It provides the application's business logic, authentication, database operations, resource management and API endpoints used by the frontend.

The production API is deployed as an **AWS Lambda** function and exposed through **Amazon API Gateway**.

## Production API

[Paper Pixel REST API](https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/?utm_source=chatgpt.com)

---

## Technology Stack

* **Node.js** — JavaScript runtime
* **Express.js** — REST API framework
* **MongoDB** — database
* **Mongoose** — MongoDB object modelling
* **JSON Web Tokens (JWT)** — authentication
* **Cloudinary** — image storage
* **AWS Lambda** — serverless application hosting
* **Amazon API Gateway** — public API endpoint

---

## Features

The API provides functionality for:

* User registration and authentication
* User management
* Book management
* Author management
* Category management
* Book format management
* Shopping cart operations
* Order management
* Book inventory management
* Image uploads

---

## Project Structure

```text
backend/
├── config/
│   └── cloudinary.js
│
├── controllers/
│   ├── author.js
│   ├── book.js
│   ├── bookFormat.js
│   ├── cart.js
│   ├── category.js
│   ├── order.js
│   └── user.js
│
├── middleware/
│   ├── asyncHandler.js
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
│
├── models/
│   ├── Author.js
│   ├── Book.js
│   ├── BookFormat.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Review.js
│   ├── User.js
│   ├── UserLibrary.js
│   └── addressSchema.js
│
├── routes/
│   ├── author.js
│   ├── book.js
│   ├── bookFormat.js
│   ├── cart.js
│   ├── category.js
│   ├── order.js
│   └── user.js
│
├── utils/
│   └── AppError.js
│
├── .env.sample
├── .gitignore
├── capstone3.json
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

---

## Architecture

The backend follows a route → middleware → controller → model architecture.

```text
HTTP Request
     │
     ▼
API Gateway
     │
     ▼
AWS Lambda
     │
     ▼
Express
     │
     ▼
Routes
     │
     ▼
Middleware
     │
     ▼
Controllers
     │
     ▼
Mongoose Models
     │
     ▼
MongoDB
```

Cloudinary is integrated separately for image-related functionality.

---

## Routes

API routes are organised by resource:

```text
routes/
├── author.js
├── book.js
├── bookFormat.js
├── cart.js
├── category.js
├── order.js
└── user.js
```

This keeps endpoint definitions separated by domain and makes the API easier to maintain.

The major API resources are:

| Resource     | Responsibility                                   |
| ------------ | ------------------------------------------------ |
| Users        | Registration, authentication and user operations |
| Books        | Book catalogue and book management               |
| Authors      | Author management                                |
| Categories   | Book categorisation                              |
| Book Formats | Format-related operations                        |
| Cart         | Shopping cart operations                         |
| Orders       | Checkout and order management                    |

---

## Controllers

Controllers contain the request-handling and application logic for each API resource.

```text
controllers/
├── author.js
├── book.js
├── bookFormat.js
├── cart.js
├── category.js
├── order.js
└── user.js
```

Separating controllers from route definitions keeps the route files focused on endpoint configuration while the controllers handle application behaviour.

---

## Data Models

MongoDB data structures are represented through Mongoose models.

```text
models/
├── Author.js
├── Book.js
├── BookFormat.js
├── Cart.js
├── Category.js
├── Order.js
├── Payment.js
├── Review.js
├── User.js
├── UserLibrary.js
└── addressSchema.js
```

These models represent the primary entities used by the bookstore application.

---

## Middleware

The backend uses middleware for cross-cutting functionality.

### Authentication

```text
middleware/auth.js
```

Handles authentication and authorization for protected resources.

### Error Handling

```text
middleware/errorHandler.js
```

Provides centralised handling of application errors.

### Async Handling

```text
middleware/asyncHandler.js
```

Provides consistent handling for asynchronous controller operations.

### File Uploads

```text
middleware/upload.js
```

Handles uploaded files used by the application before they are processed and stored.

---

## Error Handling

Application-specific errors are represented using:

```text
utils/AppError.js
```

Errors are then processed by the central error-handling middleware.

This provides a consistent approach to handling failures across the API rather than implementing separate error-handling logic in every controller.

---

## Authentication

Authentication uses **JSON Web Tokens (JWT)**.

The general authentication flow is:

```text
Client
  │
  ▼
Login / Registration
  │
  ▼
User Controller
  │
  ▼
MongoDB
  │
  ▼
JWT
  │
  ▼
Client
  │
  │ Authenticated Request
  ▼
Authentication Middleware
  │
  ▼
Protected Controller
```

Protected endpoints verify the authentication information before allowing access to restricted resources.

---

## Cloudinary

Cloudinary is used for image storage.

Configuration is located at:

```text
config/cloudinary.js
```

Image upload handling is separated from the main application logic through the upload middleware and Cloudinary configuration.

---

## Environment Variables

Backend configuration is stored in environment variables.

A sample configuration file is provided:

```text
.env.sample
```

Create a local environment file:

```bash
cp .env.sample .env
```

Configure the required values for the application, including database, authentication and Cloudinary configuration.

> Never commit `.env` files or production credentials to source control.

---

## Installation

From the `backend` directory:

```bash
npm install
```

---

## Local Development

Start the backend using the development script defined in `package.json`:

```bash
npm run dev
```

The API will run using the local configuration defined in the application's environment variables.

---

## Production Deployment

The backend is deployed using AWS Lambda and Amazon API Gateway.

```text
                    ┌────────────────────┐
                    │  Amazon API Gateway │
                    └──────────┬─────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │     AWS Lambda     │
                    │                    │
                    │   Express API      │
                    └─────────┬──────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              ┌───────────┐       ┌───────────┐
              │  MongoDB  │       │ Cloudinary│
              └───────────┘       └───────────┘
```

The Express application runs within the Lambda environment, while API Gateway provides the public HTTPS endpoint consumed by the frontend.

### Production Endpoint

```text
https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/
```

The `/production/` stage is part of the deployed API Gateway endpoint.

---

## Frontend Integration

The frontend communicates with this API through its service layer.

```text
frontend/src/services/
├── api.js
├── authService.js
├── authorService.js
├── bookFormatService.js
├── bookService.js
├── cartService.js
├── categoryService.js
└── orderService.js
```

The frontend's API configuration points to the production API Gateway endpoint when running in production.

```text
Vercel
  │
  │ HTTPS
  ▼
API Gateway
  │
  ▼
AWS Lambda
  │
  ▼
Express
  │
  ├── MongoDB
  └── Cloudinary
```

---

## Deployment Considerations

When deploying a new backend version:

1. Ensure the application dependencies are installed.
2. Ensure production environment variables are configured.
3. Package the application for the Lambda environment.
4. Deploy the updated application to AWS Lambda.
5. Verify the API Gateway integration.
6. Test the production API endpoint.
7. Verify that the deployed frontend can communicate with the updated API.

---

## Security

Sensitive configuration must be supplied through environment variables rather than committed to the repository.

This includes credentials and secrets such as:

* Database connection credentials
* JWT secret
* Cloudinary credentials
* AWS credentials
* Other production secrets

The repository's `.gitignore` should prevent local environment files and other sensitive configuration from being committed.

---

## Backend–Frontend Architecture

The backend is independently deployed from the frontend.

```text
┌─────────────────────────┐
│     Vercel              │
│     Vue Frontend        │
└────────────┬────────────┘
             │
             │ HTTPS / REST
             ▼
┌─────────────────────────┐
│   Amazon API Gateway    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      AWS Lambda         │
│      Express API        │
└──────────┬───────┬──────┘
           │       │
           ▼       ▼
      MongoDB   Cloudinary
```

This architecture separates the presentation layer from the API and data layers, allowing the frontend and backend to be developed and deployed independently.
