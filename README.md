# 🛍️ Shop Application with Admin Dashboard

A full-stack e-commerce application with a professional Admin Dashboard for product management.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js installed
- A MongoDB database, either local or hosted

### Setup

1. **Install dependencies** (from the project root)
   ```bash
   npm install
   ```

2. **Configure MongoDB**
   Set the Atlas connection string in `backend/.env` as `MONGODB_URI`. Atlas is
   attempted first; `MONGODB_FALLBACK_URI` can point to a local MongoDB server.
   The fallback is used only when Atlas cannot be reached. Data written to the
   fallback database does not automatically sync to Atlas. Set
   `MONGODB_DATABASE=shopDB` to select the database containing the shop data.
   Admin accounts can be stored separately; set `MONGODB_ADMIN_DATABASE=adminDB`
   when the `admins` collection is in that database.
   If Node.js cannot resolve Atlas SRV records using the system DNS, set
   `MONGODB_DNS_SERVERS` to a comma-separated list of DNS server IP addresses
   available on your network.

3. **Create Admin User** (first run only)
   ```bash
   npm run seed:admin
   ```
   Credentials: `admin / password`
   Admin login issues a one-hour JWT used for product create, update, and delete.
   Existing plaintext admin passwords are upgraded to bcrypt hashes after a
   successful login. In production, configure a strong `JWT_SECRET` in
   `backend/.env`; development uses a temporary secret and tokens expire when
   the backend restarts. The optional registration endpoint is disabled unless
   a non-default `ADMIN_INIT_KEY` is configured, and closes after the first
   admin account is created.

4. **Start Backend** (Terminal 1)
   ```bash
   npm run server
   ```

5. **Start Frontend** (Terminal 2, from the project root)
   ```bash
   npm start
   ```

6. **Admin Dashboard**
   - URL: http://localhost:3000/admin/login
   - Login with credentials above
   - Backend health check: http://localhost:5000/health

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

From the project root:

### `npm start`

Starts the Vite development server at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Creates the optimized production build in the root `build` directory.
