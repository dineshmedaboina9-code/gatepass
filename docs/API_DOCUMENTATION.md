# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "student@college.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "department": "CSE",
  "registrationNumber": "CSE001"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "student@college.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "token": "jwt_token"
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "student@college.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "student@college.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "department": "CSE"
  },
  "token": "jwt_token"
}
```

---

### Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## Gate Pass Request Endpoints

### Create Request (Student)
**POST** `/requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Attending interview",
  "destination": "TCS Office, Bangalore",
  "outTime": "2024-01-20T10:00:00",
  "inTime": "2024-01-20T17:00:00"
}
```

**Response:**
```json
{
  "message": "Gate pass request created successfully",
  "request": {
    "id": "uuid",
    "studentId": "uuid",
    "reason": "Attending interview",
    "destination": "TCS Office, Bangalore",
    "outTime": "2024-01-20T10:00:00",
    "status": "pending",
    "createdAt": "2024-01-20T09:00:00"
  }
}
```

---

### Get Student Requests
**GET** `/requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Requests retrieved successfully",
  "requests": [
    {
      "id": "uuid",
      "reason": "Attending interview",
      "destination": "TCS Office, Bangalore",
      "outTime": "2024-01-20T10:00:00",
      "status": "pending",
      "createdAt": "2024-01-20T09:00:00"
    }
  ]
}
```

---

### Get Department Requests (HoD)
**GET** `/requests/department/{department}`

**Headers:**
```
Authorization: Bearer <token>
Role: hod or admin
```

**Response:**
```json
{
  "message": "Department requests retrieved successfully",
  "requests": [
    {
      "id": "uuid",
      "student": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "student@college.com"
      },
      "destination": "TCS Office",
      "reason": "Interview",
      "outTime": "2024-01-20T10:00:00",
      "status": "pending"
    }
  ]
}
```

---

### HoD Approve Request
**PUT** `/requests/{requestId}/hod-approve`

**Headers:**
```
Authorization: Bearer <token>
Role: hod
```

**Request Body:**
```json
{
  "remarks": "Approved - documents verified"
}
```

**Response:**
```json
{
  "message": "Request approved by HoD",
  "request": {
    "id": "uuid",
    "status": "hod_approved",
    "hodApprovedAt": "2024-01-20T09:30:00",
    "hodRemarks": "Approved - documents verified"
  }
}
```

---

### HoD Reject Request
**PUT** `/requests/{requestId}/hod-reject`

**Headers:**
```
Authorization: Bearer <token>
Role: hod
```

**Request Body:**
```json
{
  "remarks": "Insufficient justification"
}
```

**Response:**
```json
{
  "message": "Request rejected by HoD",
  "request": {
    "id": "uuid",
    "status": "hod_rejected",
    "hodApprovedAt": "2024-01-20T09:35:00",
    "hodRemarks": "Insufficient justification"
  }
}
```

---

### Admin Approve Request
**PUT** `/requests/{requestId}/admin-approve`

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "remarks": "Final approval granted"
}
```

**Response:**
```json
{
  "message": "Request approved by Admin",
  "request": {
    "id": "uuid",
    "status": "admin_approved",
    "adminApprovedAt": "2024-01-20T10:00:00",
    "adminRemarks": "Final approval granted"
  }
}
```

---

## Gate Pass Endpoints

### Generate Gate Pass (Admin)
**POST** `/gate-passes/{requestId}/generate`

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "message": "Gate pass generated successfully",
  "gatePass": {
    "id": "uuid",
    "passCode": "GATE-1234567890-ABC123",
    "qrCode": "data:image/png;base64,...",
    "validFrom": "2024-01-20T09:00:00",
    "validUntil": "2024-01-21T09:00:00",
    "isUsed": false
  }
}
```

---

### Get Student Gate Passes
**GET** `/gate-passes`

**Headers:**
```
Authorization: Bearer <token>
Role: student
```

**Response:**
```json
{
  "message": "Gate passes retrieved successfully",
  "gatePasses": [
    {
      "id": "uuid",
      "passCode": "GATE-1234567890-ABC123",
      "qrCode": "data:image/png;base64,...",
      "validFrom": "2024-01-20T09:00:00",
      "validUntil": "2024-01-21T09:00:00",
      "isUsed": false,
      "request": {
        "destination": "TCS Office",
        "reason": "Interview",
        "outTime": "2024-01-20T10:00:00"
      }
    }
  ]
}
```

---

### Download Gate Pass
**GET** `/gate-passes/{gatePassId}/download`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Gate pass retrieved for download",
  "gatePass": { ... }
}
```

---

### Email Gate Pass
**POST** `/gate-passes/{gatePassId}/email`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Gate pass emailed successfully"
}
```

---

## Gate Entry Endpoints

### Scan Gate Pass
**POST** `/gate-entries/scan`

**Request Body:**
```json
{
  "passCode": "GATE-1234567890-ABC123",
  "gate": "Main Gate - North"
}
```

**Response:**
```json
{
  "message": "Gate pass validated and entry recorded",
  "entry": {
    "id": "uuid",
    "gatePassId": "uuid",
    "studentId": "uuid",
    "gate": "Main Gate - North",
    "scanTime": "2024-01-20T10:15:00",
    "status": "allowed"
  },
  "status": "allowed"
}
```

---

### Deny Access
**POST** `/gate-entries/deny`

**Request Body:**
```json
{
  "passCode": "GATE-1234567890-ABC123",
  "gate": "Main Gate - North",
  "remarks": "Pass expired"
}
```

**Response:**
```json
{
  "message": "Access denied",
  "entry": {
    "id": "uuid",
    "status": "denied",
    "remarks": "Pass expired",
    "scanTime": "2024-01-20T10:15:00"
  }
}
```

---

### Get All Gate Entries
**GET** `/gate-entries?startDate=2024-01-20&endDate=2024-01-21&gate=Main Gate&status=allowed`

**Response:**
```json
{
  "message": "Gate entries retrieved successfully",
  "entries": [
    {
      "id": "uuid",
      "student": {
        "firstName": "John",
        "lastName": "Doe",
        "registrationNumber": "CSE001"
      },
      "gate": "Main Gate - North",
      "scanTime": "2024-01-20T10:15:00",
      "status": "allowed"
    }
  ]
}
```

---

## Reports Endpoints

### Get Audit Logs
**GET** `/reports/audit-logs?startDate=2024-01-20&action=LOGIN`

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "message": "Audit logs retrieved successfully",
  "logs": [
    {
      "id": "uuid",
      "userId": "uuid",
      "action": "LOGIN",
      "entityType": "User",
      "status": "success",
      "createdAt": "2024-01-20T09:00:00"
    }
  ]
}
```

---

### Get Analytics
**GET** `/reports/analytics?department=CSE`

**Headers:**
```
Authorization: Bearer <token>
Role: admin or hod
```

**Response:**
```json
{
  "message": "Analytics retrieved successfully",
  "analytics": {
    "total": 50,
    "pending": 5,
    "hodApproved": 20,
    "hodRejected": 2,
    "adminApproved": 18,
    "adminRejected": 1,
    "issued": 15,
    "used": 15
  }
}
```

---

### Export Logs
**GET** `/reports/export-logs?startDate=2024-01-20&endDate=2024-01-21`

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "message": "Logs exported successfully",
  "data": [ ... ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Rate Limiting

Coming soon - currently no rate limiting implemented.

---

## Pagination

To be implemented for large datasets.
