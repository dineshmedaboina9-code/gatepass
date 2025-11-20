# 🔐 GATEKEEPER CREDENTIALS

## Gatekeeper Accounts

All gatekeeper accounts use the same password:

### Password
```
GateKeeper@123
```

### Gatekeeper Accounts

| Email | Name | Password |
|-------|------|----------|
| gatekeeper1@university.edu | Gate Keeper 1 | GateKeeper@123 |
| gatekeeper2@university.edu | Gate Keeper 2 | GateKeeper@123 |

---

## Login Information

### URL
```
http://localhost:3000
```

### To Login as Gatekeeper

1. Open http://localhost:3000
2. Enter email: `gatekeeper1@university.edu` or `gatekeeper2@university.edu`
3. Enter password: `GateKeeper@123`
4. Click "Login"

---

## Gatekeeper Role Features

**Available Functions:**
- ✓ View QR codes scanned at gate
- ✓ Log gate entries
- ✓ Record entry/exit times
- ✓ View student information from QR code
- ✓ Scan QR codes from gate passes

---

## Testing Gatekeepers

### Quick Test
```bash
# Login as gatekeeper
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"gatekeeper1@university.edu",
    "password":"GateKeeper@123"
  }'
```

### Expected Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "gatekeeper1@university.edu",
    "firstName": "Gate",
    "lastName": "Keeper 1",
    "role": "gatekeeper"
  }
}
```

---

## All System Roles & Credentials

### Admin
```
Email:    admin.portal@test.com
Password: Admin@12345
```

### HoD (Head of Department)
```
Password: HoD@123456
Example:  hod.cse@university.edu
```

### Student
```
Example:  demo3.student@test.com
Password: Test123456
```

### Gatekeeper
```
Email:    gatekeeper1@university.edu (or gatekeeper2@university.edu)
Password: GateKeeper@123
```

---

## Workflow with Gatekeeper

```
1. Student gets approved QR code
        ↓
2. Student arrives at gate
        ↓
3. Gatekeeper scans QR code
        ↓
4. System validates pass
        ↓
5. Gatekeeper logs entry in system
        ↓
6. Student granted gate access
```

---

## Notes

- Gatekeeper role is for staff who scan QR codes at the gate
- Both gatekeeper accounts have the same password
- Gatekeeper can view student information from QR scans
- Gate entries are logged in the system for audit trail
