# 🔐 DS HoD Login Guide

## ✅ DS HoD Account is Working!

### **Login Credentials**

```
Email:    hod.ds@university.edu
Password: HoD@123456
Department: DS (Data Science)
```

### **API Test Result (✅ Successful)**
```json
{
  "message": "Login successful",
  "user": {
    "email": "hod.ds@university.edu",
    "firstName": "DS",
    "lastName": "Head",
    "role": "hod",
    "department": "DS"
  }
}
```

---

## 🚀 How to Login

1. Go to **http://localhost:3000**
2. Click **"Login"**
3. Enter email: `hod.ds@university.edu`
4. Enter password: `HoD@123456`
5. Click **"Login"**

You should see the **HoD Dashboard** with pending student requests for the DS department.

---

## 📋 HoD Dashboard Features

As DS HoD, you can:

✅ **View Pending Requests**
- See all students requesting gate passes from DS department

✅ **Approve Requests**
- Review student details
- Check requested destination and reason
- Approve or reject each request

✅ **View Approved Requests**
- See requests you've already approved
- Track approval history

✅ **Analytics & Reports**
- View department statistics
- See request trends

---

## 🔍 If Login Still Fails

**Try these steps:**

1. **Clear browser cache**
   - Press `Cmd + Shift + Delete` (Mac)
   - Clear "All time"
   - Retry login

2. **Check services are running**
   ```bash
   # Backend on port 3001
   lsof -i :3001
   
   # Frontend on port 3000
   lsof -i :3000
   ```

3. **Verify credentials in database**
   ```bash
   mysql -u root -h localhost gate_pass_system \
     -e "SELECT email, department, isActive FROM users WHERE email='hod.ds@university.edu';"
   ```

4. **Check browser console for errors**
   - Open DevTools (F12)
   - Go to "Console" tab
   - Look for red error messages

---

## 🔗 All HoD Accounts

All departments have HoD accounts with the same password:

| Email | Department | Password |
|-------|-----------|----------|
| `hod.cse@university.edu` | CSE | `HoD@123456` |
| `hod.it@university.edu` | IT | `HoD@123456` |
| `hod.ece@university.edu` | ECE | `HoD@123456` |
| `hod.eee@university.edu` | EEE | `HoD@123456` |
| `hod.ds@university.edu` | DS | `HoD@123456` |
| `hod.cs@university.edu` | CS | `HoD@123456` |

---

## ✨ What to Do Next

1. **Login as DS HoD**
2. **View student requests**
3. **Approve some requests**
4. **Login as Admin** to generate QR codes
5. **Login as Student** to view QR codes
6. **Login as Gatekeeper** to scan QR codes

---

**Status**: ✅ **DS HoD Account is Active and Working**

Backend Verified: ✅ Login successful
Frontend Status: ✅ Running on port 3000
