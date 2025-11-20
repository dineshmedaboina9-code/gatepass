# Setup Guide

## Complete Installation & Setup Instructions

### Prerequisites
- **Node.js** 14.0 or higher
- **npm** 6.0 or higher
- **MySQL** 5.7 or higher
- **Git** (optional)

### Step 1: Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd gate

# Or extract zip file
cd gate
```

### Step 2: Database Setup

1. **Create MySQL Database**
   ```bash
   mysql -u root -p
   ```

2. **In MySQL command line:**
   ```sql
   CREATE DATABASE gate_pass_db;
   USE gate_pass_db;
   ```

3. **Exit MySQL**
   ```sql
   EXIT;
   ```

4. **Run schema file**
   ```bash
   mysql -u root -p gate_pass_db < database/schema.sql
   ```

5. **(Optional) Load sample data**
   ```bash
   mysql -u root -p gate_pass_db < database/seed.sql
   ```

### Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with your configuration**
   ```
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gate_pass_db
   DB_USER=root
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-jwt-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Gate Pass Management System Backend running on port 5000
   ```

6. **Verify backend is running**
   
   Open browser and go to: `http://localhost:5000/health`
   
   You should see:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-20T10:00:00.000Z"
   }
   ```

### Step 4: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with API URL** (if needed)
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the frontend development server**
   ```bash
   npm start
   ```
   
   Browser should automatically open: `http://localhost:3000`

### Step 5: Initial Testing

1. **Register a new student account**
   - Click "Register"
   - Fill in student details
   - Select a department (CSE, IT, etc.)
   - Submit

2. **Login with student account**
   - Use your registered email and password
   - You should see the Student Dashboard

3. **Test with HoD account** (if using sample data)
   - Email: `hod.cse@gatepass.com`
   - Password: Set according to your seed data

4. **Test with Admin account** (if using sample data)
   - Email: `admin@gatepass.com`
   - Password: Set according to your seed data

## Configuration Details

### Backend .env Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | gate_pass_db |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | password |
| JWT_SECRET | JWT signing secret | your-secret-key |
| EMAIL_USER | SMTP email | your-email@gmail.com |
| EMAIL_PASSWORD | SMTP password | app-password |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Backend Commands

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run migrations
npm run migrate
```

## Frontend Commands

```bash
# Development mode
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (not recommended)
npm eject
```

## Common Issues & Solutions

### Issue: MySQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Ensure MySQL is running
2. Check credentials in .env
3. Verify database name is correct

```bash
# macOS - start MySQL
mysql.server start

# Windows - start MySQL service
net start MySQL80
```

### Issue: Port Already in Use

**Error**: `Port 5000 already in use`

**Solution 1**: Change port in .env
```
PORT=5001
```

**Solution 2**: Kill process using port
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Node modules not installing

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
npm install --legacy-peer-deps
```

### Issue: CORS Error in Browser

**Error**: `Access to XMLHttpRequest... blocked by CORS`

**Solution**: Ensure backend is running and API URL is correct in frontend .env

### Issue: Password not hashing (Backend)

Ensure `bcryptjs` is installed:
```bash
cd backend
npm install bcryptjs
```

### Issue: QR Code not displaying

Ensure `qrcode.react` is installed:
```bash
cd frontend
npm install qrcode.react
```

## Database Reset

To completely reset the database:

```bash
# Drop database
mysql -u root -p -e "DROP DATABASE gate_pass_db;"

# Recreate and populate
mysql -u root -p < database/schema.sql
mysql -u root -p gate_pass_db < database/seed.sql
```

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student",
    "department": "CSE",
    "registrationNumber": "TEST001"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Download and install Postman
2. Create a new request
3. Set method to POST
4. Set URL to `http://localhost:5000/api/auth/login`
5. Set Body to JSON
6. Add credentials and send

## Performance Tuning

### Backend Optimization
- Database indexing already configured
- Connection pooling enabled
- Audit logging implemented

### Frontend Optimization
- React code splitting ready
- CSS minification on production build
- Image optimization needed for production

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Configure CORS for production domain
- [ ] Set secure email credentials
- [ ] Review firewall rules
- [ ] Enable database backups

## Deployment Preparation

### Backend Deployment
1. Update NODE_ENV to production
2. Update database credentials
3. Set secure JWT_SECRET
4. Configure email service
5. Enable HTTPS
6. Set up logging

### Frontend Deployment
1. Run `npm run build`
2. Deploy dist folder to hosting
3. Configure API URL to production backend
4. Set up CDN for static files

## Next Steps

1. Read [REQUIREMENTS.md](REQUIREMENTS.md) for detailed requirements
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Review [README.md](README.md) for project overview

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in backend
3. Check browser console for frontend errors
4. Contact development team

## Happy Coding! 🚀
