# 🛍️ Shop Application with Admin Dashboard

A full-stack e-commerce application with a professional Admin Dashboard for product management.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js installed
- MongoDB running locally

### Setup

1. **Create Admin User**
   ```bash
   cd backend
   node seedAdmin.js
   ```
   Credentials: `admin / password`

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   node server.js
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   npm start
   ```

4. **Admin Dashboard**
   - URL: http://localhost:3000/admin/login
   - Login with credentials above

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up running in 5 minutes
- **[ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)** - Complete documentation
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Backend API & setup
- **[STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)** - Detailed walkthrough
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's included

## ✨ Features

### For Customers
- 📦 Browse products
- 🔍 Search & filter
- 💳 Shopping cart
- 📱 Responsive design

### For Admins
- 🔐 Secure login
- ➕ Add products
- ✏️ Edit products  
- 🗑️ Delete products
- 📊 Real-time database sync

## 📁 Project Structure

```
backend/          (Express API)
src/
  ├── Pages/      (AdminLogin, AdminDashboard - NEW)
  ├── components/ (ProductForm, ProductTable - NEW)
  └── context/    (AdminAuthContext - NEW)
```

## 🔌 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
