# Paper Pixel Bookstore — Frontend

The Paper Pixel frontend is a single-page e-commerce application built with **Vue.js** and **Vite**. It provides the customer-facing bookstore experience as well as the administrative interface for managing bookstore resources.

The frontend communicates with the Paper Pixel REST API through a dedicated service layer and is deployed to **Vercel** for production.

## Production

**Live Application:**
[Paper Pixel Bookstore](https://paper-pixel-seven.vercel.app/?utm_source=chatgpt.com)

**Backend API:**
[AWS API Gateway](https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/?utm_source=chatgpt.com)

---

## Technology Stack

* **Vue.js** — frontend framework
* **Vite** — development server and build tool
* **Vue Router** — client-side routing
* **Pinia** — state management
* **JavaScript** — application logic
* **CSS** — application styling
* **Vercel** — production deployment

---

## Features

### Customer

* User registration and login
* Book catalogue browsing
* Book detail pages
* Category browsing
* Author information
* Book format selection
* Shopping cart
* Cart quantity management
* Checkout
* Order history
* Community content

### Administration

* Admin dashboard
* Book management
* Book inventory management
* Book format management
* Author management
* Category management
* Featured book management
* Order management

---

## Project Structure

```text
frontend/
├── public/
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── styles/
│   │       ├── components/
│   │       │   ├── badges.css
│   │       │   ├── books.css
│   │       │   ├── buttons.css
│   │       │   └── forms.css
│   │       ├── base.css
│   │       ├── main.css
│   │       └── variables.css
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── billboard/
│   │   ├── books/
│   │   │   └── admin/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── tables/
│   │
│   ├── data/
│   │   └── billboardData.js
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── authorService.js
│   │   ├── bookFormatService.js
│   │   ├── bookService.js
│   │   ├── cartService.js
│   │   ├── categoryService.js
│   │   └── orderService.js
│   │
│   ├── stores/
│   │   └── authStore.js
│   │
│   ├── utils/
│   │   └── apiError.js
│   │
│   ├── views/
│   │   ├── AdminDashboardView.vue
│   │   ├── BookDetailsView.vue
│   │   ├── BooksCatalogView.vue
│   │   ├── CartView.vue
│   │   ├── CheckoutView.vue
│   │   ├── CommunityDetailView.vue
│   │   ├── CommunityView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── OrderHistoryView.vue
│   │   └── RegisterView.vue
│   │
│   ├── App.vue
│   └── main.js
│
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .oxlintrc.json
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── vite.config.js
└── README.md
```

---

## Application Architecture

The frontend follows a component-based architecture where page-level views are composed from reusable components.

```text
                    App.vue
                       │
                       ▼
                 Vue Router
                       │
                       ▼
                     Views
                       │
              ┌────────┴────────┐
              ▼                 ▼
         Components          Stores
              │                 │
              └────────┬────────┘
                       ▼
                    Services
                       │
                       ▼
                  REST API
```

### Views

The `views` directory contains page-level components corresponding to major application screens.

Examples include:

* `HomeView.vue`
* `BooksCatalogView.vue`
* `BookDetailsView.vue`
* `CartView.vue`
* `CheckoutView.vue`
* `OrderHistoryView.vue`
* `AdminDashboardView.vue`

### Components

The `components` directory contains reusable UI and feature components.

Components are organised by functionality, including:

* Authentication
* Books
* Cart
* Checkout
* Forms
* Layout
* Tables
* Administration

This allows functionality to be reused across multiple views without placing all application logic directly inside page components.

---

## API Service Layer

Communication with the backend is handled through dedicated service modules.

```text
src/services/
├── api.js
├── authService.js
├── authorService.js
├── bookFormatService.js
├── bookService.js
├── cartService.js
├── categoryService.js
└── orderService.js
```

The service layer keeps HTTP/API communication separate from presentation components.

For example:

```text
Vue Component
      │
      ▼
Feature Service
      │
      ▼
API Utility
      │
      ▼
AWS API Gateway
      │
      ▼
Express / Lambda
```

---

## State Management

The application uses **Pinia** for shared application state.

Authentication state is managed through:

```text
src/stores/authStore.js
```

The store provides authentication-related state and functionality that can be accessed by components throughout the application.

---

## Routing

Vue Router manages client-side navigation.

The router configuration is located at:

```text
src/router/index.js
```

Routes cover both customer-facing pages and administrative functionality.

---

## Styling

The project uses custom CSS organised according to application responsibility.

```text
src/assets/styles/
├── components/
│   ├── badges.css
│   ├── books.css
│   ├── buttons.css
│   └── forms.css
├── base.css
├── main.css
└── variables.css
```

Shared design values are maintained through the project's CSS variables, while reusable component styles are separated into their respective stylesheets.

---

## Environment Variables

The frontend uses Vite environment variables for environment-specific configuration.

Create an environment file for local development and configure the backend API URL:

```text
VITE_API_URL=<backend-api-url>
```

For production, the variable should point to the deployed AWS API Gateway endpoint.

The production API is:

```text
https://o7kw055jy2.execute-api.ap-southeast-2.amazonaws.com/production/
```

> Do not commit environment files containing sensitive or environment-specific configuration.

---

## Installation

From the `frontend` directory:

```bash
npm install
```

---

## Development

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated production files are placed in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Code Quality

The project includes configuration for linting and formatting:

```text
eslint.config.js
.prettierrc.json
.oxlintrc.json
```

Use the scripts defined in `package.json` to run the project's available linting and formatting commands.

---

## Deployment

The frontend is deployed through **Vercel**.

Production deployment flow:

```text
Git Repository
      │
      ▼
    Vercel
      │
      ▼
Vite Production Build
      │
      ▼
Production Frontend
      │
      │ HTTPS
      ▼
AWS API Gateway
```

The Vercel deployment uses the production API URL as an environment variable.

When the API URL or other Vite environment variables are changed in Vercel, the application must be redeployed for the new values to be included in the production build.

---

## Frontend–Backend Integration

The frontend and backend are independently deployed.

```text
┌──────────────────────────┐
│         Vercel           │
│                          │
│     Vue.js + Vite        │
└────────────┬─────────────┘
             │
             │ HTTPS / REST
             ▼
┌──────────────────────────┐
│   Amazon API Gateway     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      AWS Lambda          │
│      Express API         │
└──────────────────────────┘
```

This separation allows frontend and backend deployments to be managed independently while communicating through a defined REST API.
