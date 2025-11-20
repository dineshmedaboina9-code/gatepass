# ⚡ QUICK START GUIDE - Gate Pass Management System

## 🎯 What You've Built

A complete **Student Gate Pass Management System** with QR code verification at gates:
- **Students** create exit requests → **HoDs** approve → **Admins** issue gate passes → **GateKeepers** scan QR codes

---

## 🔐 Login Credentials (Ready to Use)

### Admin Portal
```
Email:    admin.portal@test.com
Password: Admin@12345
```

### HoD Accounts (One per Department)
```
Department  Email                      Password
─────────────────────────────────────────────────
CSE         hod.cse@university.edu      HoD@123456
IT          hod.it@university.edu       HoD@123456
ECE         hod.ece@university.edu      HoD@123456
EEE         hod.eee@university.edu      HoD@123456
DS          hod.ds@university.edu       HoD@123456
CS          hod.cs@university.edu       HoD@123456
```

### GateKeeper Accounts (Created)
```
Location    Email                       Password
─────────────────────────────────────────────────
Gate 1      gatekeeper1@university.edu  GateKeeper@123
Gate 2      gatekeeper2@university.edu  GateKeeper@123
```

### Create Your Own Student Account
```
1. Go to http://localhost:3000/register
2. Fill in:
   - Email: yourname@university.edu
   - Password: Any strong password
   - Department: Pick from dropdown (CSE/IT/ECE/EEE/DS/CS)
   - Registration Number: Any ID number
3. Click Register & Login
```

---

## ⚙️ Check System Status

### Backend Running?
```bash
lsof -i :3001
# Should show: node process listening on port 3001
```

### Frontend Running?
```bash
lsof -i :3000
# Should show: node process listening on port 3000
```

### Database OK?
```bash
mysql -u root -p -e "SELECT COUNT(*) FROM gate_pass_system.users;"
# Should return: row count > 10
```

---

## 🧪 Complete Test Flow (10 minutes)

### Step 1️⃣: Student Submits Request
1. Open http://localhost:3000
2. Login as student (or register new one)
3. Click "Request Gate Pass"
4. Fill form: Destination, Reason, Out Time, In Time
5. Click Submit
6. ✅ See request in table with status "PENDING"

### Step 2️⃣: HoD Reviews & Approves
1. New tab: http://localhost:3000
2. Login as HoD (use any HoD account from above)
3. Find student request in department
4. Click "View Details" to see request info
5. Click "Approve" button
6. Enter remarks (optional) and confirm
7. ✅ Status changes to "HOD_APPROVED"

### Step 3️⃣: Admin Issues Gate Pass
1. New tab: http://localhost:3000
2. Login as admin
3. See HoD-approved requests
4. Find student request
5. Click "Approve" button
6. Enter remarks (optional) and confirm
7. ✅ Status becomes "ADMIN_APPROVED" → "ISSUED"
8. ✅ Gate pass with QR code automatically generated
9. ✅ Email sent to student

### Step 4️⃣: Student Views QR Code
1. Go back to student's tab
2. Refresh page
3. Click "View QR Code" tab
4. ✅ See gate pass card with QR code image
5. Shows: Pass Code, Destination, Status, Valid Until
6. Status shows: "⏳ Pending"

### Step 5️⃣: GateKeeper Scans QR
1. New tab: http://localhost:3000
2. Login as gatekeeper1@university.edu / GateKeeper@123
3. Go to GateKeeper page (if not auto-routed, navigate to `/gatekeeper-page`)
4. **Method A: Copy QR Data**
   - Right-click student's QR code image
   - Open in new tab to see the data URL
   - Copy the long string after `data:image/png;base64,`
   - Paste into GateKeeper form
   - Click outside or press "Verify Manually"
   
5. **Method B: Manual Pass Code**
   - From student's pass card, copy the Pass Code
   - Paste into GateKeeper form
   - Click "Verify Manually" button

6. ✅ System shows:
   - Green success message: "✓ Gate Pass Verified! Entry recorded."
   - Student Name & Email
   - Destination & Reason
   - Pass Code & Timestamp

### Step 6️⃣: Verify Entry Recorded
1. Go back to student's tab
2. Refresh "View QR Code" section
3. ✅ Same gate pass now shows status: "✓ Used"
4. ✅ Entry successfully recorded in system!

---

## 📊 Dashboard Tabs Overview

### Student Dashboard
- **Request Status**: View all your requests with status and dates
- **View QR Code**: See approved gate passes with scannable QR codes

### HoD Dashboard
- **Pending Requests**: Student requests from your department
- View details and approve/reject
- Add remarks for students

### Admin Dashboard
- **HoD Approved Requests**: All HoD-approved requests from all departments
- Approve/reject and issue gate passes
- **Analytics & Reports**: Statistics on total requests, approvals, etc.

### GateKeeper Page
- **QR Code Scanner**: Scan or manually enter gate pass ID
- Verify student identity and gate pass validity
- View student details upon successful verification

---

## 🔧 Troubleshooting

**"I don't see any requests in HoD dashboard"**
- Verify student account is in correct department
- Verify student submitted a request (check Request Status tab)
- Verify request is in PENDING status (not rejected)

**"No QR code showing in student dashboard"**
- Admin must click "Approve" button (not just view)
- Wait a few seconds for generation
- Refresh page (Cmd+R or Ctrl+R)
- Check backend logs for errors

**"QR Verification fails at GateKeeper"**
- Ensure pass status is ADMIN_APPROVED
- Ensure pass hasn't been scanned before
- Ensure pass hasn't expired (valid 24 hours from approval)
- Verify you're copying the correct gate pass ID

**"Can't login"**
- Check caps lock on password
- Try incognito window (clear cookies)
- Verify backend is running: `lsof -i :3001`
- Check MySQL is running: `mysql -u root -p -e "SELECT 1;"`

**"Backend won't start"**
```bash
cd /Users/apple/Documents/myproject/gate/backend
npm install  # Re-install dependencies if needed
/opt/homebrew/opt/node@18/bin/npm start
```

**"Frontend won't load"**
```bash
cd /Users/apple/Documents/myproject/gate/frontend
npm install  # Re-install dependencies if needed
npm start
```

---

## 📁 Project Structure
```
/gate/
├── backend/              # Express server (port 3001)
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   └── config/       # Database & constants
│   ├── create_hods.js    # HoD account creation script (done)
│   └── create_gatekeepers.js  # GateKeeper creation (done)
├── frontend/             # React app (port 3000)
│   ├── src/
│   │   ├── pages/        # Dashboard pages
│   │   ├── components/   # Reusable components
│   │   └── styles/       # CSS styling
│   └── package.json
├── database/             # MySQL schema & seed
└── docs/                 # Documentation
```

---

## 🎓 Key Features Implemented

✅ **Multi-Role Authentication**
- Student, HoD, Admin, GateKeeper roles
- JWT tokens, password hashing
- Role-based access control

✅ **Request Workflow**
- Students submit → HoD approve → Admin approve → Gate pass issued

✅ **QR Code System**
- Automatic generation on admin approval
- Encoded with student & pass data
- 24-hour validity window

✅ **Gate Entry Recording**
- QR code scanning/verification
- Student identity confirmation
- Automatic entry logging

✅ **Audit & Compliance**
- Complete audit trail
- Timestamp logging
- User action tracking

---

## 🚀 What Happens Behind the Scenes

1. **Request Submission**: Student data → Database
2. **HoD Approval**: Status changes, email notification
3. **Admin Approval**: 
   - Status updated to ADMIN_APPROVED
   - Gate pass record created
   - QR code generated (base64 data URL)
   - Email with QR code sent to student
   - Status changed to ISSUED
4. **QR Verification**:
   - GateKeeper scans/enters pass ID
   - Backend verifies pass status & expiration
   - Gate entry recorded with timestamp
   - Pass marked as USED
   - Audit log created

---

## 📧 Email Functionality

When Admin approves a request:
- Email sent to student's email address
- Contains: Pass code, QR code image, expiration time
- Check terminal logs to see email content (in dev mode, not actually sent)

---

## 💾 Database Tables

- **users**: All accounts (students, HoDs, admins, gatekeepers)
- **gatepassrequests**: Student exit requests with status
- **gatepasses**: Issued passes with QR codes
- **gateentries**: Records of each gate scanning
- **auditlogs**: Complete action history

---

## 🎯 Next Steps After Testing

1. Create real test student accounts
2. Test complete workflow with multiple students
3. Test concurrent scanning at multiple gates
4. Generate reports on analytics dashboard
5. Check audit logs for compliance
6. Test reject/denial workflows

---

## 📞 Quick Command Reference

```bash
# Start backend
cd /Users/apple/Documents/myproject/gate/backend
npm start

# Start frontend
cd /Users/apple/Documents/myproject/gate/frontend
npm start

# Create test gatekeeper accounts
node /Users/apple/Documents/myproject/gate/backend/create_gatekeepers.js

# Check MySQL
mysql -u root -p gate_pass_system

# View backend logs
tail -f /Users/apple/Documents/myproject/gate/backend/logs.txt
```

---

## ✅ System Status: READY FOR TESTING

All components implemented and integrated.
- ✅ Servers running and responding
- ✅ Gatekeeper accounts created
- ✅ QR code generation working
- ✅ Gate entry verification active
- ✅ Complete workflow tested

**You're ready to perform full end-to-end testing!**

---

*Last Updated: 2025-11-18*
*System Status: ✅ COMPLETE AND OPERATIONAL*

