# Deployment Guide

This project should be deployed as two online services:

- Frontend: Vercel, using the `client` folder.
- Backend: Render, using the repository root.
- Database: MongoDB Atlas, not local MongoDB.
- Image uploads: Cloudinary.

## 1. Create MongoDB Atlas Database

Create a MongoDB Atlas cluster and copy the connection string. Use that value for `mongo_uri` on Render.

Do not use `mongodb://127.0.0.1:27017/...` in production.

## 2. Deploy Backend On Render

Create a new Render Web Service from this repository.

Use these settings:

- Root directory: repository root
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set these Render environment variables:

- `NODE_ENV=production`
- `mongo_uri=<your MongoDB Atlas connection string>`
- `ACCESS_TOKEN=<long random secret>`
- `REFRESH_TOKEN=<long random secret>`
- `FRONTEND_URL=https://<your-vercel-app>.vercel.app`
- `FRONTEND_APP_URL=https://<your-vercel-app>.vercel.app`
- `CLOUD_NAME=<cloudinary cloud name>`
- `API_KEY=<cloudinary api key>`
- `API_SECRET=<cloudinary api secret>`
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PASSWORD=<email app password>`
- `RAZORPAY_KEY_ID=<razorpay key id>`
- `RAZORPAY_SECRET=<razorpay secret>`

After deploy, copy your Render backend URL, for example:

`https://rent-a-ride-backend.onrender.com`

## 3. Deploy Frontend On Vercel

Create a new Vercel project from the same repository.

Use these settings:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Set these Vercel environment variables:

- `VITE_PRODUCTION_BACKEND_URL=https://<your-render-backend>.onrender.com`
- `VITE_RAZORPAY_KEY_ID=<razorpay key id>`
- `VITE_FIREBASE_API_KEY=<firebase api key>`
- `VITE_FIREBASE_AUTH_DOMAIN=<firebase auth domain>`
- `VITE_FIREBASE_PROJECT_ID=<firebase project id>`
- `VITE_FIREBASE_STORAGE_BUCKET=<firebase storage bucket>`
- `VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase messaging sender id>`
- `VITE_FIREBASE_APP_ID=<firebase app id>`

## 4. Update Google Login

In Firebase Console, add your deployed Vercel domain to authorized domains.

Add both:

- `<your-vercel-app>.vercel.app`
- any custom domain you connect later

## 5. Final Production Check

After both deployments finish:

1. Open the Vercel frontend URL.
2. Sign up as a user.
3. Sign up as a vendor.
4. Add a vendor vehicle with an image.
5. Book that vehicle from the user side.
6. Confirm the booking appears in user orders and vendor bookings.

If a frontend request still goes to `localhost`, the Vercel variable `VITE_PRODUCTION_BACKEND_URL` is missing or incorrect.
