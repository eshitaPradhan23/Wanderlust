# WanderLust

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

WanderLust is a full-stack property listing and booking platform inspired by Airbnb, built with Node.js, Express, and MongoDB. Users can browse stays from around the world, view each one on an interactive map, create and manage their own listings with photo uploads, and leave star ratings and reviews.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [Available Routes](#available-routes)
- [Screenshots](#screenshots)
- [Possible Improvements](#possible-improvements)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Features

- Browse all listings in a responsive card grid with photos and nightly pricing
- View a detailed page for each listing with an interactive Mapbox map of its location
- Sign up, log in, and log out with persistent, MongoDB-backed sessions (Passport.js)
- Create new listings with a photo upload stored on Cloudinary; the location is automatically geocoded via Mapbox
- Edit or delete listings you own, with ownership enforced on the server
- Leave a 1–5 star rating and written review on any listing while logged in
- Delete your own reviews
- Flash messages confirm actions like signing up, logging in, or creating a listing, and surface validation errors
- Listing prices are shown in Indian Rupees (₹), with GST noted on each card
- Custom 404 and error pages instead of raw stack traces
- A seed script to quickly populate the database with sample listings

## Tech Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js (v22.x) |
| Framework | Express 5 |
| Database | MongoDB with Mongoose (MongoDB Atlas-ready) |
| Templating | EJS with ejs-mate for layout support |
| Authentication | Passport.js (`passport-local`, `passport-local-mongoose`) |
| Sessions | `express-session` with `connect-mongo` (MongoDB-backed session store) |
| File uploads | Multer with Cloudinary storage (`multer-storage-cloudinary`) |
| Maps & geocoding | Mapbox (`@mapbox/mapbox-sdk` for geocoding, Mapbox GL JS for the map) |
| Validation | Joi |
| Frontend | Bootstrap 5, Font Awesome, custom CSS, Starability for star ratings |
| Flash messages | `connect-flash` |

## Project Structure

```
Wanderlust-main/
├── app.js                # Entry point: middleware, sessions, routes, error handling
├── Schema.js              # Joi validation schemas for listings & reviews
├── cloudconfig.js         # Cloudinary + Multer storage configuration
├── middleware.js          # Auth guards, ownership checks, validation middleware
├── package.json
├── controller/
│   ├── listings.js        # CRUD logic for listings
│   ├── reviews.js         # Create/delete logic for reviews
│   └── users.js           # Signup/login/logout logic
├── init/
│   ├── data.js            # Sample listing data
│   └── index.js           # Script to seed the database
├── models/
│   ├── listing.js         # Listing schema
│   ├── review.js          # Review schema
│   └── user.js             # User schema (passport-local-mongoose)
├── public/
│   ├── css/                # style.css, rating.css
│   ├── image/               # Static images & favicon
│   └── js/                   # map.js, script.js (client-side)
├── routes/
│   ├── listing.js             # /listings routes
│   ├── review.js               # /listings/:id/reviews routes
│   └── user.js                  # /signup, /login, /logout routes
├── utils/
│   ├── ExpressError.js          # Custom error class
│   └── wrapAsync.js              # Async error-handling wrapper
└── views/                          # EJS templates
    ├── includes/                    # navbar, footer, flash partials
    ├── layouts/                      # boilerplate.ejs layout
    ├── listings/                      # index, show, new, edit, error
    └── user/                           # login, signup
```

## Prerequisites

- Node.js 22.x and npm (the project pins `engines.node` to `22.13.0` in `package.json`)
- A MongoDB database — either a local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account, for image storage
- A free [Mapbox](https://www.mapbox.com) account, for an access token used in geocoding and the map

## Getting Started

1. Unzip the project and move into it:
   ```bash
   cd Wanderlust-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root — see [Environment Variables](#environment-variables) below.
4. *(Optional)* Seed the database with sample listings — see [Seeding the Database](#seeding-the-database).
5. Start the server:
   ```bash
   node app.js
   ```
   or, for auto-restart on file changes during development:
   ```bash
   npx nodemon app.js
   ```
   There's no `npm start` script defined yet, so the commands above are the way to launch the app for now.
6. Visit `http://localhost:3000/listings` in your browser.

## Environment Variables

Create a `.env` file in the project root with the following keys:

```
ATLASDB_URL=your_mongodb_connection_string
SECRET=any_long_random_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
```

| Variable | Description |
| --- | --- |
| `ATLASDB_URL` | MongoDB connection string, used for both the main database and the session store |
| `SECRET` | Secret used to sign session cookies and encrypt the Mongo session store |
| `CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUD_API_KEY` | Your Cloudinary API key |
| `CLOUD_API_SECRET` | Your Cloudinary API secret |
| `MAP_TOKEN` | Mapbox access token, used for forward geocoding and rendering the listing map |

`.env` is already listed in `.gitignore`, so your secrets won't be committed. These variables are loaded with `dotenv` only when `NODE_ENV` isn't `production` — in a production deployment, set them directly in your hosting platform's environment instead of relying on a `.env` file.

## Seeding the Database

To populate the database with sample listings:

```bash
node init/index.js
```

This reads the sample data in `init/data.js`, clears out any existing listings, and inserts the sample set. Note that the script currently connects to a local MongoDB instance at `mongodb://127.0.0.1:27017/wanderlust` rather than `ATLASDB_URL` — if the main app is pointed at Atlas, either run a local MongoDB instance for seeding or update the connection string inside `init/index.js` to match.

## Available Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/listings` | List all listings | Public |
| GET | `/listings/new` | Form to create a listing | Logged in |
| POST | `/listings` | Create a listing | Logged in |
| GET | `/listings/:id` | View a listing's details | Public |
| GET | `/listings/:id/edit` | Form to edit a listing | Owner |
| PUT | `/listings/:id` | Update a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing (and its reviews) | Owner |
| POST | `/listings/:id/reviews` | Add a review to a listing | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review's author |
| GET | `/signup` | Signup form | Public |
| POST | `/signup` | Register a new account | Public |
| GET | `/login` | Login form | Public |
| POST | `/login` | Authenticate and log in | Public |
| GET | `/logout` | Log out of the current session | Logged in |

## Screenshots

_Add a screenshot or short GIF of the listings page, a listing's detail page with its map, and the review section here to give visitors a quick visual tour._

## Possible Improvements

- Search and filters (by location, price range, or category)
- Pagination on the listings index
- A password reset / "forgot password" flow
- User profile pages
- Automated tests (`npm test` is currently just a placeholder)
- Online booking and payment integration

## Acknowledgements

- Sample listing photos from [Unsplash](https://unsplash.com)
- Icons from [Font Awesome](https://fontawesome.com)
- Star rating styles from [Starability](https://github.com/LunarLogic/starability) by Lunar Logic
- Maps and geocoding powered by [Mapbox](https://www.mapbox.com)
- Image hosting by [Cloudinary](https://cloudinary.com)

## License

This project is licensed under the ISC License, as specified in `package.json`.
