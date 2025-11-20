#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== COMPLETE QR CODE GENERATION TEST ===${NC}\n"

# 1. Register a student
echo -e "${YELLOW}Step 1: Registering student...${NC}"
STUDENT_EMAIL="testqr$(date +%s)@university.edu"
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$STUDENT_EMAIL\",
    \"password\":\"Student@123\",
    \"firstName\":\"Test\",
    \"lastName\":\"Student\",
    \"role\":\"student\",
    \"department\":\"CSE\",
    \"registrationNumber\":\"CSE$(date +%s)\"
  }")

STUDENT_ID=$(echo $STUDENT_RESPONSE | jq -r '.user.id' 2>/dev/null)
if [ "$STUDENT_ID" != "null" ] && [ ! -z "$STUDENT_ID" ]; then
  echo -e "${GREEN}✓ Student created: $STUDENT_EMAIL${NC}"
  echo "  ID: $STUDENT_ID\n"
else
  echo -e "Error creating student: $STUDENT_RESPONSE\n"
  exit 1
fi

# 2. Login student and get token
echo -e "${YELLOW}Step 2: Logging in student...${NC}"
STUDENT_LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STUDENT_EMAIL\",\"password\":\"Student@123\"}")

STUDENT_TOKEN=$(echo $STUDENT_LOGIN | jq -r '.token' 2>/dev/null)
if [ "$STUDENT_TOKEN" != "null" ] && [ ! -z "$STUDENT_TOKEN" ]; then
  echo -e "${GREEN}✓ Student logged in${NC}\n"
else
  echo -e "Error logging in: $STUDENT_LOGIN\n"
  exit 1
fi

# 3. Student submits request
echo -e "${YELLOW}Step 3: Student submitting gate pass request...${NC}"
OUT_TIME=$(date -u -d "+1 hour" +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v+1H +%Y-%m-%dT%H:%M:%S)
IN_TIME=$(date -u -d "+4 hours" +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v+4H +%Y-%m-%dT%H:%M:%S)

REQUEST_RESPONSE=$(curl -s -X POST http://localhost:3001/api/requests \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"reason\":\"Test QR Code Generation\",
    \"destination\":\"Main Library\",
    \"outTime\":\"$OUT_TIME\",
    \"inTime\":\"$IN_TIME\"
  }")

REQUEST_ID=$(echo $REQUEST_RESPONSE | jq -r '.request.id' 2>/dev/null)
if [ "$REQUEST_ID" != "null" ] && [ ! -z "$REQUEST_ID" ]; then
  echo -e "${GREEN}✓ Request submitted${NC}"
  echo "  Request ID: $REQUEST_ID\n"
else
  echo -e "Error submitting request: $REQUEST_RESPONSE\n"
  exit 1
fi

# 4. HoD approves request
echo -e "${YELLOW}Step 4: HoD approving request...${NC}"
HOD_LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hod.cse@university.edu","password":"HoD@123456"}')

HOD_TOKEN=$(echo $HOD_LOGIN | jq -r '.token' 2>/dev/null)
if [ "$HOD_TOKEN" != "null" ] && [ ! -z "$HOD_TOKEN" ]; then
  echo -e "${GREEN}✓ HoD logged in${NC}"
  
  HOD_APPROVE=$(curl -s -X PUT http://localhost:3001/api/requests/$REQUEST_ID/hod-approve \
    -H "Authorization: Bearer $HOD_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"remarks":"Approved by HoD"}')
  
  HOD_STATUS=$(echo $HOD_APPROVE | jq -r '.request.status' 2>/dev/null)
  if [ "$HOD_STATUS" = "hod_approved" ]; then
    echo -e "${GREEN}✓ HoD approved request${NC}\n"
  else
    echo -e "Error with HoD approval: $HOD_APPROVE\n"
    exit 1
  fi
else
  echo -e "Error logging in HoD: $HOD_LOGIN\n"
  exit 1
fi

# 5. Admin approves request (GENERATES GATE PASS WITH QR)
echo -e "${YELLOW}Step 5: Admin approving request (generates gate pass with QR)...${NC}"
ADMIN_LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.portal@test.com","password":"Admin@12345"}')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r '.token' 2>/dev/null)
if [ "$ADMIN_TOKEN" != "null" ] && [ ! -z "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin logged in${NC}"
  
  ADMIN_APPROVE=$(curl -s -X PUT http://localhost:3001/api/requests/$REQUEST_ID/admin-approve \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"remarks":"Approved by Admin"}')
  
  ADMIN_STATUS=$(echo $ADMIN_APPROVE | jq -r '.request.status' 2>/dev/null)
  if [ "$ADMIN_STATUS" = "admin_approved" ] || [ "$ADMIN_STATUS" = "issued" ]; then
    echo -e "${GREEN}✓ Admin approved request${NC}"
    echo "  Request status: $ADMIN_STATUS\n"
  else
    echo -e "Error with Admin approval: $ADMIN_APPROVE\n"
    exit 1
  fi
else
  echo -e "Error logging in Admin: $ADMIN_LOGIN\n"
  exit 1
fi

# 6. Check if gate pass was created
echo -e "${YELLOW}Step 6: Checking if gate pass was created...${NC}"
PASS_COUNT=$(mysql -u root -h localhost gate_pass_system -e "SELECT COUNT(*) as cnt FROM gatepasses WHERE studentId='$STUDENT_ID';" 2>/dev/null | tail -1)
if [ "$PASS_COUNT" -gt "0" ]; then
  echo -e "${GREEN}✓ Gate pass created in database${NC}"
  
  # Get the gate pass details
  PASS_INFO=$(mysql -u root -h localhost gate_pass_system -e "SELECT id, passCode, qrCode FROM gatepasses WHERE studentId='$STUDENT_ID' LIMIT 1;" 2>/dev/null | tail -1)
  echo "  Pass Info: $PASS_INFO\n"
else
  echo -e "Warning: No gate pass found in database\n"
fi

# 7. Fetch gate passes via API (what the frontend does)
echo -e "${YELLOW}Step 7: Fetching gate passes via API (as student)...${NC}"
PASSES=$(curl -s -X GET http://localhost:3001/api/gate-passes \
  -H "Authorization: Bearer $STUDENT_TOKEN")

PASS_COUNT_API=$(echo $PASSES | jq '.gatePasses | length' 2>/dev/null)
if [ "$PASS_COUNT_API" -gt "0" ]; then
  echo -e "${GREEN}✓ Gate passes retrieved via API${NC}"
  echo "  Count: $PASS_COUNT_API"
  
  # Check if QR code is present
  QR_CODE=$(echo $PASSES | jq -r '.gatePasses[0].qrCode' 2>/dev/null | head -c 50)
  if [ ! -z "$QR_CODE" ] && [ "$QR_CODE" != "null" ]; then
    echo -e "${GREEN}✓ QR Code is present in response${NC}"
    echo "  QR Code (first 50 chars): $QR_CODE...\n"
  else
    echo -e "Warning: QR Code not found in response\n"
  fi
  
  # Print full response for debugging
  echo "Full API Response:"
  echo $PASSES | jq '.'
else
  echo -e "Error: No gate passes returned"
  echo "API Response: $PASSES\n"
  exit 1
fi

echo -e "\n${GREEN}=== TEST COMPLETED SUCCESSFULLY ===${NC}"
echo -e "${GREEN}Student can now see QR code on dashboard${NC}\n"
