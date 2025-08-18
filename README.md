# Utshob - Event Management Platform

A comprehensive event management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that connects customers with event service vendors.

## Features

### User Management
- **Customer Dashboard**: Book services, track bookings, manage payments
- **Vendor Dashboard**: Manage service listings, track upcoming works, view earnings
- **Admin Dashboard**: Platform administration (coming soon)
- Role-based authentication and authorization

### Service Management
- Browse and book event services
- Vendor service listings
- Booking management system

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CSE470-T1
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
MONGODB_URI=mongodb://localhost:27017/Utshob
PORT=5000
NODE_ENV=development
```

**Note**: If you're using MongoDB Atlas, replace the MONGODB_URI with your connection string.

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your connection string

## Running the Application

### Development Mode (Recommended for development)

Run both backend and frontend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Production Mode

Build and run the production version:
```bash
npm run build
npm start
```

### Individual Services

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

## Usage

### 1. Access the Application
Open your browser and navigate to `http://localhost:3000`

### 2. User Registration
- Click "Sign Up" to create a new account
- Select your role: Customer, Vendor, or Admin
- Fill in your details and create account

### 3. User Login
- Sign in with your email and password
- You'll be automatically redirected to the appropriate dashboard based on your role

### 4. Dashboard Access

#### Customer Dashboard (`/dashboard`)
- View profile information
- Browse available services
- Track bookings and payments
- Manage account settings

#### Vendor Dashboard (`/vendor-dashboard`)
- View vendor profile and statistics
- Manage service listings
- Track upcoming works
- Add new service listings (coming soon)

#### Admin Dashboard (`/admin-dashboard`)
- Platform administration features (coming soon)

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/debug` - Debug user information

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service (coming soon)

## Project Structure

```
CSE470 T1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js           # User model
│   └── Service.js        # Service model
├── routes/                # API routes
│   └── api/
│       ├── users.js      # User routes
│       └── services.js   # Service routes
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md
```

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network access for Atlas

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill processes using the default ports

3. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Build Errors**
   - Ensure all dependencies are installed
   - Check for syntax errors in code
   - Verify Node.js version compatibility

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check your environment variables

## Future Enhancements

- [ ] Service listing creation for vendors
- [ ] Booking system implementation
- [ ] Payment gateway integration
- [ ] Admin dashboard features
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced search and filtering
- [ ] Review and rating system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
