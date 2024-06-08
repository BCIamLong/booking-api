# Booking API

[Booking API](https://booking-api-ebe1.onrender.com/docs) is a RESTful API for managing bookings with comprehensive features including user authentication, profile management, payment processing, and more.

### Table of contents
- [Features](#feature)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

### Features
- Authentication and Authorization: JWT and OAuth2
- User Management: Login, Register, Profile Management (upload images, edit password, edit email, deactivate account, 2FA)
- CRUD Operations: Full CRUD functionality for managing resources
- Payments: Stripe API integration
- Email Notifications: Nodemailer with Mailtrap and Gmail service
- Image Uploads: Multer, Sharp, and Cloudinary
- Caching: Redis
- Security: set up security milldewares (helpmet...), rate limit, validator, cors implementation...
- Error handler: global error handler
- Code Refactoring: Implemented best practices for code refactoring
- API Documentation: Swagger
- Testing: Integration and unit tests with Jest

### Tech Stack
- Programming language: Typescript
- Backend: Node.js, Express.js
- Authentication and Authentication: JWT, OAuth2
- Payments: Stripe API
- Email: Nodemailer, Mailtrap, Gmail
- Image Uploads: Multer, Sharp, Cloudinary
- Database: MongoDB (Mongo Atlas), Mongoose library
- Caching: Redis (Redis Cloud)
- Documentation: Swagger
- Testing: Jest

### Installation

#### Prerequisites
- Node.js
- npm or yarn
- Redis server and Redis account
- Stripe account
- Cloudinary account
- Mailtrap account and Gmail account
#### Steps
1, Clone the repository
```bash
git clone https://github.com/BCIamLong/booking-api.git
cd booking-api
```
2, Install dependencies
```bash
npm install
```
3, Set up environment variables

Create a .env file in the root of your project and add the following:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=<your-jwt-expiration>
OAUTH2_CLIENT_ID=<your-oauth2-client-id>
OAUTH2_CLIENT_SECRET=<your-oauth2-client-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
EMAIL_USERNAME=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
MAILTRAP_USER=<your-mailtrap-user>
MAILTRAP_PASS=<your-mailtrap-pass>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
REDIS_HOST=<your-redis-host>
REDIS_PASSWORD=<your-redis-password>
REDIS_PORT=<your-redis-port>
```
4, Run the application
```bash
npm run start:dev
```

### Testing
#### Running Tests 
Integration and unit tests are written using Jest.

To run the tests for integration, use the following command:
```bash
npm run test:integration
```
To run the tests for unit tests, use the following command:
```bash
npm run test:unit
```

## API Documentation

[API Documentation](https://booking-api-ebe1.onrender.com/docs)



### Deployment
The project is deployed on Render. Follow these steps to deploy your own instance:

- Create a Render account and set up a new project.
- Connect your GitHub repository.
- Set up CI/CD commands, environment variables
- Deploy the project.
