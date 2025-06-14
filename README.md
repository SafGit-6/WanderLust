🧭 WanderLust
WanderLust is a full-stack web application for exploring, listing, and booking unique stays around the world. Built with Node.js, Express, and MongoDB, it offers secure user authentication, interactive map views, cloud-based image uploads, and seamless session management—all rendered through EJS templates.

🚀 Features
🗺️ Browse & Discover: Explore listings via interactive maps and detailed views.

🧳 Host Properties: Registered users can create, edit, and delete listings.

🔐 Authentication: Secure login/register system using Passport.js.

📷 Image Uploads: Upload listing images via Cloudinary integration.

🧾 Form Validation: Backend validation using Joi for secure data.

✉️ Email Notifications: Send automated emails with Nodemailer.

💬 Review System: Users can leave feedback on listings.

🌐 Responsive UI: Works on desktop and mobile using server-rendered EJS templates.

🛠️ Tech Stack

Backend :

Node.js, Express.js

MongoDB (MongoDB Atlas for cloud DB)

Mongoose – ODM for MongoDB

Passport.js – Local authentication

dotenv, connect-flash, express-session, cookie-parser

method-override – Support for PUT/DELETE in forms

Joi – Schema validation

Nodemailer – Email integration

Frontend :

EJS, ejs-mate – Templating and layouts

CSS and client-side JavaScript

Maptiler SDK – For map visualization (via public/js/map.js)

File Storage & Cloud
Multer – Image upload handling

Cloudinary – Image hosting

multer-storage-cloudinary – Integration layer

Utilities
axios – HTTP requests

@mapbox/mapbox-sdk – Geocoding and map services

📁 Project Structure

WanderLust/
├── app.js                     # Main Express application entry point
├── package.json               # Node.js dependencies and scripts
├── cloudConfig.js             # Cloudinary configuration for image storage
├── .env                       # Environment variables (not included in repo)
├── public/                    # Static assets (JS, CSS, images)
│   └── js/
│       └── map.js             # Map rendering with Maptiler SDK
├── init/
│   └── index.js               # MongoDB initialization and seeding
├── models/                    # Mongoose schema definitions
│   └── listing.js             # Listing schema and logic
│   └── review.js              # Review schema
│   └── user.js                # User schema
├── controllers/               # Route business logic
│   └── listings.js            # Listing controller logic
│   └── reviews.js             # Review controller logic
│   └── users.js               # User controller logic
├── routes/                    # Express routers
│   └── listing.js             # Listing routes
│   └── review.js              # Review routes
│   └── user.js                # User routes
├── views/                     # EJS templates for server-side rendering
│   └── listings/              # Templates for listings
│   └── users/                 # User-related pages
│   └── reviews/               # Review pages
│   └── partials/              # Reusable layout components
│   └── error.ejs              # Error page template
├── utils/                     # Utility modules
│   └── ExpressError.js        # Custom error handling
│   └── wrapAsync.js           # Async error wrapper
├── schema.js                  # Joi validation schemas


# WanderLust Project Setup Instructions

## Prerequisites

- **Node.js** (v20.16.0 recommended)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (or local MongoDB for development)
- **Cloudinary account** (for image storage)
- API keys for Map services (Maptiler or Mapbox)

## 1. Clone the Repository

sh
git clone https://github.com/SafGit-6/WanderLust.git
cd WanderLust


## 2. Install Dependencies

sh
npm install


## 3. Configure Environment Variables

Create a .env file in the project root directory with the following variables:

env
ATLASDB_URL=your_mongodb_atlas_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SECRET=your_session_secret
MAP_TOKEN=your_map_service_api_key
NODE_ENV=development


> Replace the placeholder values with your actual credentials.

## 4. Seed the Database (Optional)

To seed the database with initial data, you can run the script in init/index.js if needed:

sh
node init/index.js


## 5. Start the Application

sh
node app.js


The server should start on port 7861 by default.  
Visit [http://localhost:7861](http://localhost:7861) in your browser.

## 6. Additional Notes

- Static files are served from the public/ directory.
- EJS templates are in the views/ folder.
- For production, set NODE_ENV=production and ensure all environment variables are configured correctly.

---

For more configuration details, review the package.json and check the project files.
