# Student Gate Pass Management System

## Overview
A comprehensive web-based system for managing student gate passes with multi-level approval workflows, QR code generation, and entry verification.

## Project Structure

```
gate/
├── backend/
│   ├── src/
│   │   ├── models/           # Sequelize models
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration files
│   │   └── server.js         # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   ├── context/          # Context API
│   │   ├── styles/           # CSS files
│   │   ├── utils/            # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql            # Database schema
│   ├── seed.sql              # Sample data
│   └── migrate.js            # Migration script
└── docs/
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    └── REQUIREMENTS.md
```

## Key Features

### 1. **Student Registration & Authentication**
- Barcode ID card scanning
- Email-based registration
- Role-based login
- Secure password storage

### 2. **Gate Pass Request Workflow**
- Students submit requests with reason, destination, and timing
- HoD reviews and approves/rejects
- Admin verifies and issues pass
- Multi-level approval system

### 3. **Pass Generation & Issuance**
- Unique pass code generation
- QR code generation (24-hour validity)
- Email delivery of passes
- Download capability

### 4. **Gate Entry/Exit Verification**
- Real-time QR code scanning
- Immediate validation
- Access logging
- Deny access with remarks

### 5. **Dashboards**
- **Student**: View request status, QR code display
- **HoD**: View pending requests, approve/reject
- **Admin**: Comprehensive view, analytics, pass generation
- **Security**: Quick access scanning interface

### 6. **Reports & Analytics**
- Request statistics
- Approval analytics
- Audit trails
- Data export functionality

## Technology Stack

### Backend
- **Framework**: Node.js + Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT
- **Email**: Nodemailer
- **QR Code**: qrcode library

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **QR Display**: qrcode.react
- **Styling**: CSS3

## Setup Instructions

### Prerequisites
- Node.js 14+
- MySQL 5.7+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials

4. **Create database and run migrations**
   ```bash
   mysql -u root -p < ../database/schema.sql
   mysql -u root -p < ../database/seed.sql
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   App opens on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Gate Pass Requests
- `POST /api/requests` - Create request
- `GET /api/requests` - Get student's requests
- `GET /api/requests/department/:department` - Get department requests
- `PUT /api/requests/:requestId/hod-approve` - HoD approval
- `PUT /api/requests/:requestId/hod-reject` - HoD rejection
- `PUT /api/requests/:requestId/admin-approve` - Admin approval
- `PUT /api/requests/:requestId/admin-reject` - Admin rejection

### Gate Passes
- `POST /api/gate-passes/:requestId/generate` - Generate pass
- `GET /api/gate-passes` - Get student's passes
- `GET /api/gate-passes/:gatePassId/download` - Download pass
- `POST /api/gate-passes/:gatePassId/email` - Email pass

### Gate Entry
- `POST /api/gate-entries/scan` - Scan gate pass
- `POST /api/gate-entries/deny` - Deny access
- `GET /api/gate-entries` - Get all entries

### Reports
- `GET /api/reports/audit-logs` - Get audit logs
- `GET /api/reports/analytics` - Get analytics
- `GET /api/reports/export-logs` - Export logs

## Database Schema

### Users Table
- Stores all user information (students, HoDs, admins, security)
- Authentication credentials
- Department assignment

### GatePassRequests Table
- Student requests
- Approval workflow tracking
- Remarks from approvers

### GatePasses Table
- Generated passes with pass codes
- QR code data
- Validity period and usage tracking

### GateEntries Table
- Entry/exit logs
- Gate information
- Entry status and timestamps

### AuditLogs Table
- Complete audit trail
- All system actions
- User activity tracking

### Notifications Table
- User notifications
- Email/SMS status
- Related entity tracking

## Security Features

1. **Encryption**
   - Password hashing with bcryptjs
   - HTTPS ready with helmet

2. **Authentication**
   - JWT-based token authentication
   - Role-based access control (RBAC)

3. **Data Protection**
   - SQL parameterized queries
   - Input validation with Joi
   - Rate limiting ready

4. **Audit Trail**
   - Complete logging of all actions
   - Timestamp tracking
   - User activity monitoring

## Performance Considerations

- Connection pooling in database
- Response time target: 2-3 seconds
- Indexed database queries
- Caching ready architecture

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
- Environment: Node.js hosting (Heroku, AWS, Azure)
- Database: Managed MySQL service
- Environment variables configured

### Frontend Deployment
- Build: `npm run build`
- Hosting: Static hosting (Netlify, Vercel, AWS S3)

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in .env
- Ensure database is created

### Backend Not Starting
- Check port 5000 availability
- Verify all dependencies installed
- Check .env file configuration

### Frontend Not Loading
- Ensure backend is running on port 5000
- Check API_URL in .env
- Clear browser cache

## Future Enhancements

1. Mobile app development
2. SMS notifications
3. Biometric verification
4. Real-time notifications (WebSocket)
5. Advanced analytics dashboard
6. Integration with student database
7. Multi-campus support
8. Barcode scanner integration

## Support & Contact

For issues or questions, contact the development team.

## License

This project is licensed under the MIT License.
