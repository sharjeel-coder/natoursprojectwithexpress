# Express.js

Express.js is a minimal and flexible web framework for Node.js used to build web servers and REST APIs.

## Installation

```bash
npm install express
```

## Basic Express Application

```javascript
const express = require('express');

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

---

## Request-Response Cycle

When a client sends a request, Express processes it through middleware and routes before sending a response.

```text
Client
  ↓
HTTP Request
  ↓
Middleware
  ↓
Router
  ↓
Controller
  ↓
HTTP Response
  ↓
Client
```

---

## HTTP Methods

| Method | Purpose |
|--------|---------|
| GET | Read data |
| POST | Create data |
| PATCH | Update existing data |
| DELETE | Delete data |

Example:

```javascript
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
```

---

## Request Object

The `req` object contains information about the incoming request.

### Route Parameters

```javascript
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
});
```

For:

```text
/api/v1/tours/5
```

we get:

```javascript
req.params
// { id: '5' }
```

### Query Parameters

Query parameters are values after `?`.

```text
/api/v1/tours?duration=5&difficulty=easy
```

Access them using:

```javascript
req.query
```

Result:

```javascript
{
  duration: '5',
  difficulty: 'easy'
}
```

### Request Body

For JSON request bodies, use:

```javascript
app.use(express.json());
```

Then access the data using:

```javascript
req.body
```

---

## Response Object

The `res` object is used to send a response to the client.

```javascript
res.status(200).json({
  status: 'success',
  data: {
    tours
  }
});
```

Common methods:

```javascript
res.status()
res.json()
res.send()
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Successful request |
| 201 | Resource successfully created |
| 204 | Successful request with no content |
| 400 | Bad request |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Middleware

Middleware is a function that runs during the request-response cycle.

A middleware function normally receives:

```javascript
(req, res, next)
```

Example:

```javascript
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});
```

`next()` passes control to the next middleware or route handler.

### Middleware Flow

```text
Request
   ↓
Middleware 1
   ↓ next()
Middleware 2
   ↓ next()
Route Handler
   ↓
Response
```

If middleware does not call `next()` or send a response, the request can remain hanging.

---

## Built-in Middleware

Express provides built-in middleware.

For example:

```javascript
app.use(express.json());
```

This parses incoming JSON request bodies and makes the data available through:

```javascript
req.body
```

---

## Third-Party Middleware

Third-party packages can also provide middleware.

For example, Morgan is used for HTTP request logging.

Install:

```bash
npm install morgan
```

Use:

```javascript
const morgan = require('morgan');

app.use(morgan('dev'));
```

---

## Custom Middleware

We can create our own middleware.

```javascript
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
```

The property can then be accessed by later middleware or controllers:

```javascript
console.log(req.requestTime);
```

---

## Routes

A route defines:

1. HTTP method
2. URL path
3. Handler function

Example:

```javascript
app.get('/api/v1/tours', getAllTours);
```

This means:

```text
GET + /api/v1/tours → getAllTours()
```

---

## Route Parameters

A route parameter is a dynamic part of the URL.

```javascript
app.get('/api/v1/tours/:id', getTour);
```

Here:

```text
:id
```

is the route parameter.

For:

```text
/api/v1/tours/5
```

we get:

```javascript
req.params.id
// '5'
```

---

## Parameter Middleware

Express provides `router.param()` for middleware that runs when a specific route parameter is present.

```javascript
router.param('id', tourController.checkID);
```

The parameter middleware receives:

```javascript
(req, res, next, val)
```

Example:

```javascript
exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID: ${val}`);
  next();
};
```

Whenever a matching route contains `:id`, this middleware runs before the route handler.

---

## Express Router

`express.Router()` allows routes to be separated into different files.

Example:

```javascript
const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
```

---

## Mounting a Router

A router is mounted in the main application using `app.use()`.

In `app.js`:

```javascript
const tourRouter = require('./routes/tourRoutes');

app.use('/api/v1/tours', tourRouter);
```

If the router contains:

```javascript
router.route('/');
```

the final route becomes:

```text
/api/v1/tours/
```

If the router contains:

```javascript
router.route('/:id');
```

the final route becomes:

```text
/api/v1/tours/:id
```

### Mounting Concept

```text
Mount path:
 /api/v1/tours

Router path:
 /

Final path:
 /api/v1/tours/
```

```text
Mount path:
 /api/v1/tours

Router path:
 /:id

Final path:
 /api/v1/tours/:id
```

---

## Controllers

Controllers contain the logic for handling requests.

Instead of putting all the logic directly inside routes:

```javascript
app.get('/api/v1/tours', (req, res) => {
  // logic
});
```

we create a controller:

```javascript
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success'
  });
};
```

Then connect it to the route:

```javascript
router
  .route('/')
  .get(tourController.getAllTours);
```

This keeps routes and application logic separate.

---

## Route-Controller Flow

A typical Express request flows like this:

```text
Client
  ↓
Request
  ↓
Global Middleware
  ↓
Mounted Router
  ↓
Route Middleware
  ↓
Controller
  ↓
Response
```

For example:

```text
GET /api/v1/tours/5
        ↓
   tourRouter
        ↓
     checkID
        ↓
     getTour
        ↓
    Response
```

---

## REST API

A REST API uses HTTP methods to perform operations on resources.

For a `tours` resource:

```text
GET       /api/v1/tours
GET       /api/v1/tours/:id
POST      /api/v1/tours
PATCH     /api/v1/tours/:id
DELETE    /api/v1/tours/:id
```

These represent CRUD operations:

```text
CREATE → POST
READ   → GET
UPDATE → PATCH
DELETE → DELETE
```

---

## Environment Variables

Environment variables store configuration outside the application code.

Example `config.env`:

```env
NODE_ENV=development
PORT=3000
```

Using `dotenv`:

```javascript
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
```

Variables can then be accessed through:

```javascript
process.env.NODE_ENV
process.env.PORT
```

### Development Environment

Used while building and debugging the application.

```text
NODE_ENV=development
```

### Production Environment

Used when the application is deployed for real users.

```text
NODE_ENV=production
```

Example:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

---

## MVC Structure

A common way to organize an Express application is MVC.

```text
Model
  ↓
Handles data

Controller
  ↓
Handles application logic

View
  ↓
Handles presentation
```

For a REST API, the project can be organized as:

```text
starter/
│
├── controllers/
│   └── tourController.js
│
├── routes/
│   └── tourRoutes.js
│
├── dev-data/
│   └── data/
│       └── tours-simple.json
│
├── app.js
├── server.js
└── package.json
```

---

## app.js vs server.js

It is common to separate application configuration from starting the server.

### app.js

Responsible for:

- Creating the Express application
- Registering middleware
- Registering routes

Example:

```javascript
const express = require('express');

const app = express();

app.use(express.json());

module.exports = app;
```

### server.js

Responsible for:

- Loading environment variables
- Starting the server

Example:

```javascript
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

---

## Quick Summary

- **Express** → Node.js web framework.
- **Route** → Defines how a request should be handled.
- **Middleware** → Runs during the request-response cycle.
- **`next()`** → Passes control to the next middleware.
- **`req.params`** → Contains route parameters.
- **`req.query`** → Contains query parameters.
- **`req.body`** → Contains request body data.
- **`res`** → Sends the response to the client.
- **Router** → Organizes routes into separate modules.
- **Mounting** → Attaches a router to a base URL.
- **`router.param()`** → Runs middleware for a specific route parameter.
- **Controller** → Contains request-handling logic.
- **`dotenv`** → Loads environment variables.
- **REST API** → Uses HTTP methods to work with resources.
- **MVC** → Separates application responsibilities.