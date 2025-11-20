# Generate Pass Button - How to Use

## ✅ Button Location

The **"Generate Pass & QR" button** is now visible in the Admin Dashboard at:

```
Admin Dashboard → "Ready for QR Generation" tab
```

---

## 📋 Workflow to See the Button

### Step 1: Student Submits Request
- Student logs in at http://localhost:3000
- Fills out gate pass request form
- Request status: **PENDING**

### Step 2: HoD Approves
- HoD logs in and approves the request
- Request status: **HOD_APPROVED**

### Step 3: Admin Reviews
- Admin logs in: `admin.portal@test.com` / `Admin@12345`
- Goes to **"Pending Admin Approval"** tab
- Clicks **"Approve"** button
- Request status: **ADMIN_APPROVED**

### Step 4: Generate QR Code
- Admin stays on dashboard or refreshes
- Clicks **"Ready for QR Generation"** tab
- Sees the **orange "Generate Pass & QR" button**
- Clicks it
- Confirmation modal appears
- Clicks **"Generate Pass"**
- ✅ Gate pass created with QR code!

### Step 5: Student Sees QR
- Student logs in and refreshes
- Goes to **"View QR Code"** tab
- Sees the QR code! ✓

---

## 🔑 Admin Credentials

```
Email: admin.portal@test.com
Password: Admin@12345
```

---

## 📍 Two Admin Tabs

### Tab 1: "Pending Admin Approval"
- Shows requests **HoD has approved**
- Has **"Approve"** and **"Reject"** buttons
- For initial admin review

### Tab 2: "Ready for QR Generation"  
- Shows requests **Admin has already approved**
- Has **orange "Generate Pass & QR" button**
- For creating QR codes

---

## 🧪 Test It Now

Run this to create a demo workflow:

```bash
bash /tmp/test_button_visible.sh
```

Then:
1. Go to http://localhost:3000
2. Login as admin
3. Click "Ready for QR Generation" tab
4. Click "Generate Pass & QR" button
5. QR code created! ✓

---

## ✨ What the Button Does

When admin clicks "Generate Pass & QR":

1. ✅ Creates GatePass record in database
2. ✅ Generates QR code (encodes: pass code, student ID, destination, times)
3. ✅ Stores QR as base64 data URL (~5KB)
4. ✅ Updates request status to ISSUED
5. ✅ Creates audit log entry
6. ✅ Sends email to student
7. ✅ Shows success message

---

## 🎯 Status: FULLY WORKING

- ✅ Button visible in "Ready for QR Generation" tab
- ✅ Button creates QR codes with all required data
- ✅ Students can view QR codes immediately
- ✅ Complete workflow tested end-to-end
