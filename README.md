# Paper Pixel Bookstore

Paper Pixel is a full-stack e-commerce bookstore application developed as a Capstone 3 project. It provides customers with an online bookstore experience, including authentication, catalogue browsing, shopping cart management, checkout, and order history. It also includes an administrative dashboard for managing books, authors, categories, inventory, featured books, and orders.

The application is built as two independently deployed applications:

* **Frontend:** Vue.js + Vite, deployed on Vercel
* **Backend:** Node.js + Express REST API, deployed to AWS Lambda through Amazon API Gateway
* **Database:** MongoDB
* **Image storage:** Cloudinary

## Live Application

**Production Frontend**

[Paper Pixel Bookstore](https://paper-pixel-seven.vercel.app/?utm_source=chatgpt.com)

**Production Backend API**

[AWS API Gateway](https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/?utm_source=chatgpt.com)

> The frontend communicates with the production REST API through the AWS API Gateway endpoint.

---

## Features

### Customer Features

* User registration and authentication
* Browse the bookstore catalogue
* View detailed book information
* Browse books by category
* View book authors
* Select available book formats
* Add books to a shopping cart
* Update cart quantities
* Remove items from the cart
* Checkout and place orders
* View order history
* Browse community content

### Admin Features

* Administrative dashboard
* Book management
* Book inventory management
* Book format management
* Author management
* Category management
* Featured book management
* Order management

---

## Technology Stack

### Frontend

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| Vue.js     | Frontend framework                |
| Vite       | Development server and build tool |
| Vue Router | Client-side routing               |
| Pinia      | Application state management      |
| JavaScript | Application logic                 |
| CSS        | UI styling                        |

### Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Runtime environment        |
| Express.js         | REST API framework         |
| MongoDB            | Database                   |
| Mongoose           | MongoDB object modelling   |
| JWT                | Authentication             |
| Cloudinary         | Image storage              |
| AWS Lambda         | Serverless backend hosting |
| Amazon API Gateway | Public API endpoint        |

### Deployment

| Application   | Platform           |
| ------------- | ------------------ |
| Frontend      | Vercel             |
| Backend       | AWS Lambda         |
| API           | Amazon API Gateway |
| Database      | MongoDB            |
| Image storage | Cloudinary         |

---

## Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     Vercel              │
                    │  Vue.js + Vite          │
                    └────────────┬────────────┘
                                 │
                                 │ HTTPS / REST API
                                 ▼
                    ┌─────────────────────────┐
                    │   Amazon API Gateway    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      AWS Lambda         │
                    │    Express REST API     │
                    └───────┬──────────┬──────┘
                            │          │
                            ▼          ▼
                    ┌────────────┐ ┌────────────┐
                    │  MongoDB   │ │ Cloudinary │
                    │  Database  │ │   Images   │
                    └────────────┘ └────────────┘
```

The frontend and backend are independently deployable. The frontend communicates with the backend exclusively through HTTP API requests.

---

## Technical Highlights

* Component-based frontend architecture using Vue.js
* Client-side routing using Vue Router
* Centralised authentication state using Pinia
* RESTful API architecture using Express.js
* JWT-based authentication and protected API routes
* MongoDB data modelling using Mongoose
* Reusable frontend service layer for API communication
* Centralised backend error handling
* File upload and image management through Cloudinary
* Serverless backend deployment using AWS Lambda
* Public API exposure through Amazon API Gateway
* Production frontend deployment using Vercel
* Environment-based configuration for development and production

---

## Project Structure

```text
paper-pixel/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.sample
│   ├── capstone3.json
│   ├── index.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── router/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── utils/
│   │   └── views/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

### Backend

| Directory     | Responsibility                             |
| ------------- | ------------------------------------------ |
| `config`      | External service configuration             |
| `controllers` | Request handling and application logic     |
| `middleware`  | Authentication, uploads and error handling |
| `models`      | MongoDB/Mongoose data models               |
| `routes`      | REST API route definitions                 |
| `utils`       | Shared backend utilities                   |

### Frontend

| Directory    | Responsibility               |
| ------------ | ---------------------------- |
| `components` | Reusable Vue components      |
| `views`      | Page-level application views |
| `services`   | API communication            |
| `stores`     | Shared application state     |
| `router`     | Vue Router configuration     |
| `assets`     | Images, icons and styles     |
| `utils`      | Shared frontend utilities    |

---

## Authentication

Authentication is handled between the frontend and backend using JSON Web Tokens.

The general authentication flow is:

```text
User
 │
 ▼
Login / Registration
 │
 ▼
Express API
 │
 ▼
User Database Record
 │
 ▼
JWT
 │
 ▼
Frontend Authentication Store
 │
 ▼
Authenticated API Requests
```

Protected backend resources use authentication middleware to verify the user's credentials and permissions before allowing access.

---

## API

The backend provides REST API resources for:

* Users and authentication
* Books
* Authors
* Categories
* Book formats
* Cart
* Orders

The frontend communicates with these endpoints through the service layer:

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

This separates API communication from the application's presentation components.

---

## Environment Configuration

Environment variables are used to keep environment-specific configuration outside the source code.

### Backend

```text
backend/.env
```

A sample configuration file is provided:

```text
backend/.env.sample
```

Backend configuration includes credentials and configuration for services such as the database, authentication and Cloudinary.

### Frontend

The frontend uses a Vite environment variable to identify the backend API:

```text
VITE_API_URL=<backend-api-url>
```

For production, this points to the deployed API Gateway endpoint.

> Environment files containing secrets should never be committed to the repository.

---

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Configure the required environment variables using `.env.sample` before starting the application.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API URL to point to the appropriate backend environment.

---

## Production Deployment

### Frontend — Vercel

The Vue/Vite frontend is deployed to Vercel.

Production URL:

[https://paper-pixel-seven.vercel.app/](https://paper-pixel-seven.vercel.app/?utm_source=chatgpt.com)

The production build is generated using Vite and served through Vercel.

### Backend — AWS

The backend runs as an AWS Lambda function and is exposed publicly through Amazon API Gateway.

Production API:

[https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/](https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/?utm_source=chatgpt.com)

This architecture allows the Express application to run in a serverless environment without maintaining a continuously running Node.js server.

---

## Frontend–Backend Communication

```text
┌─────────────────────┐
│   Vercel Frontend   │
│                     │
│ Vue + Vite          │
└──────────┬──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│   API Gateway       │
│                     │
│ /production/*       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     AWS Lambda      │
│                     │
│ Express REST API    │
└──────────┬──────────┘
           │
           ├──────────────► MongoDB
           │
           └──────────────► Cloudinary
```

The separation between frontend and backend allows each application to be developed, deployed and scaled independently.

---

## What I Learned

This project provided practical experience building and deploying a complete full-stack application.

Key areas of experience include:

* Designing and consuming REST APIs
* Structuring a full-stack JavaScript application
* Building reusable Vue components
* Managing shared frontend state
* Implementing authentication and protected routes
* Designing MongoDB data models
* Integrating third-party services
* Handling API errors consistently
* Managing environment variables
* Deploying a frontend application to Vercel
* Deploying an Express application to AWS Lambda
* Configuring API Gateway for a serverless REST API
* Connecting independently deployed frontend and backend applications

---

## Project Goals

Paper Pixel was developed to demonstrate practical full-stack development skills through a complete e-commerce workflow.

The project covers the development lifecycle from:

```text
Planning
   ↓
Frontend Development
   ↓
Backend / API Development
   ↓
Database Integration
   ↓
Authentication
   ↓
Third-Party Service Integration
   ↓
Testing
   ↓
Cloud Deployment
```

## License

Fritz Cabalhin
