# Camera eCommerce Platform

> eCommerce platform built with the MERN stack & Redux.


![screenshot](/frontend/public/images/landingPage.png)

## Features

- Full featured shopping cart
- User profile with orders
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Usage


### Env Variables

Create a .env file in then root and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET="amiyanshu"
JWT_EXPIRES_IN="5d"
PAYPAL_CLIENT_ID = your paypal client id
```

### Install Dependencies (frontend & backend)

```
cd backend
npm install
cd..
cd frontend
npm install
```

### Run

```
# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```


### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Login

admin@shopkon.com
123456

user@shopkon.com
123456
```