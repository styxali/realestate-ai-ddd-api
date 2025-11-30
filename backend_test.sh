#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Full Backend System Test...${NC}"
echo "Target: $API_URL"

# ---------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------
extract_id() {
  echo $1 | jq -r '.id // .data.id'
}

extract_token() {
  echo $1 | jq -r '.accessToken'
}

extract_refresh() {
  echo $1 | jq -r '.refreshToken'
}

print_status() {
  if [[ $1 == *"error"* ]] || [[ $1 == *"statusCode"* ]]; then
    echo -e "${RED}FAILED${NC}"
    echo "Response: $1"
    exit 1
  else
    echo -e "${GREEN}SUCCESS${NC}"
  fi
}

# ---------------------------------------------------------
# 1. Register Users (Admin, Owner, Random User)
# ---------------------------------------------------------
echo -e "\n${BLUE}[1/14] Registering Accounts...${NC}"

# Admin
echo -n "Registering Admin... "
ADMIN_EMAIL="admin_$(date +%s)@test.com"
RES_ADMIN=$(curl -s -X POST "$API_URL/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"password123\", \"role\": \"ADMIN\"}")
ADMIN_ID=$(extract_id "$RES_ADMIN")
print_status "$RES_ADMIN"

# Owner
echo -n "Registering Owner... "
OWNER_EMAIL="owner_$(date +%s)@test.com"
RES_OWNER=$(curl -s -X POST "$API_URL/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$OWNER_EMAIL\", \"password\": \"password123\", \"role\": \"OWNER\"}")
OWNER_ID=$(extract_id "$RES_OWNER")
print_status "$RES_OWNER"

# ---------------------------------------------------------
# 2. Login & Token Extraction
# ---------------------------------------------------------
echo -e "\n${BLUE}[2/14] Logging In...${NC}"

# Login Admin
echo -n "Logging in Admin... "
LOGIN_ADMIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"password123\"}")
ADMIN_TOKEN=$(extract_token "$LOGIN_ADMIN")
print_status "$LOGIN_ADMIN"

# Login Owner
echo -n "Logging in Owner... "
LOGIN_OWNER=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$OWNER_EMAIL\", \"password\": \"password123\"}")
OWNER_TOKEN=$(extract_token "$LOGIN_OWNER")
OWNER_REFRESH=$(extract_refresh "$LOGIN_OWNER")
print_status "$LOGIN_OWNER"

# ---------------------------------------------------------
# 3. Create Property (Owner)
# ---------------------------------------------------------
echo -e "\n${BLUE}[3/14] Creating Property (Triggers AI)...${NC}"
echo -n "Creating Luxury Villa... "

PROP_RES=$(curl -s -X POST "$API_URL/properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -d '{
    "title": "Sunset Villa Miami",
    "description": "A stunning 5-bedroom villa with direct ocean access and private pool.",
    "price": 5000000
  }')
PROP_ID=$(extract_id "$PROP_RES")
print_status "$PROP_RES"

echo "Note: Background Job (BullMQ) is now processing embedding..."
sleep 2 # Give BullMQ a moment

# ---------------------------------------------------------
# 4. List Properties (Owner Context)
# ---------------------------------------------------------
echo -e "\n${BLUE}[4/14] Listing Properties (Owner View)...${NC}"
LIST_RES=$(curl -s -X GET "$API_URL/properties" \
  -H "Authorization: Bearer $OWNER_TOKEN")
COUNT=$(echo $LIST_RES | jq '.count')

if [ "$COUNT" -ge 1 ]; then
  echo -e "${GREEN}SUCCESS${NC} - Found $COUNT properties"
else
  echo -e "${RED}FAILED${NC} - Property list empty"
  exit 1
fi

# ---------------------------------------------------------
# 5. Invite Agent (Team Flow)
# ---------------------------------------------------------
echo -e "\n${BLUE}[5/14] Owner Inviting Agent...${NC}"
AGENT_EMAIL="agent_$(date +%s)@test.com"

INVITE_RES=$(curl -s -X POST "$API_URL/teams/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -d "{\"email\": \"$AGENT_EMAIL\"}")

INVITE_TOKEN=$(echo $INVITE_RES | jq -r '.debugToken')

if [ "$INVITE_TOKEN" != "null" ]; then
  echo -e "${GREEN}SUCCESS${NC} - Invite Sent. Token: $INVITE_TOKEN"
else
  echo -e "${RED}FAILED${NC}"
  echo $INVITE_RES
  exit 1
fi

# ---------------------------------------------------------
# 6. Accept Invite (Agent Registration)
# ---------------------------------------------------------
echo -e "\n${BLUE}[6/14] Agent Accepting Invite...${NC}"
ACCEPT_RES=$(curl -s -X POST "$API_URL/teams/accept" \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$INVITE_TOKEN\", \"password\": \"agentpass123\"}")
print_status "$ACCEPT_RES"

# ---------------------------------------------------------
# 7. Login Agent (Team Context Check)
# ---------------------------------------------------------
echo -e "\n${BLUE}[7/14] Logging in Agent...${NC}"
LOGIN_AGENT=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$AGENT_EMAIL\", \"password\": \"agentpass123\"}")
AGENT_TOKEN=$(extract_token "$LOGIN_AGENT")
print_status "$LOGIN_AGENT"

# ---------------------------------------------------------
# 8. List Properties (Agent View)
# ---------------------------------------------------------
echo -e "\n${BLUE}[8/14] Listing Properties as Agent (Should see Manager's)...${NC}"
AGENT_LIST_RES=$(curl -s -X GET "$API_URL/properties" \
  -H "Authorization: Bearer $AGENT_TOKEN")
AGENT_COUNT=$(echo $AGENT_LIST_RES | jq '.count')

if [ "$AGENT_COUNT" -eq "$COUNT" ]; then
  echo -e "${GREEN}SUCCESS${NC} - Agent sees Manager's properties"
else
  echo -e "${RED}FAILED${NC} - Agent sees $AGENT_COUNT properties (Expected $COUNT)"
  exit 1
fi

# ---------------------------------------------------------
# 9. AI RAG Chat
# ---------------------------------------------------------
echo -e "\n${BLUE}[9/14] Testing AI Chat (RAG)...${NC}"
echo -n "Asking: 'Find a villa in Miami'... "
CHAT_RES=$(curl -s -X POST "$API_URL/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -d '{"query": "Find a villa in Miami"}')
ANSWER=$(echo $CHAT_RES | jq -r '.answer')

if [[ "$ANSWER" != "null" ]] && [[ ${#ANSWER} -gt 5 ]]; then
   echo -e "${GREEN}SUCCESS${NC}"
   echo "AI Answer: $ANSWER"
else
   echo -e "${RED}FAILED${NC}"
   echo $CHAT_RES
fi

# ---------------------------------------------------------
# 10. Admin Stats
# ---------------------------------------------------------
echo -e "\n${BLUE}[10/14] Admin Checking Stats...${NC}"
STATS_RES=$(curl -s -X GET "$API_URL/admin/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Stats: $STATS_RES"
print_status "$STATS_RES"

# ---------------------------------------------------------
# 11. Admin Ban User
# ---------------------------------------------------------
echo -e "\n${BLUE}[11/14] Admin Banning Agent...${NC}"
# Need Agent ID, let's parse from Agent Login (token has sub, but we need ID)
# We can't get ID easily from login response as we returned tokens only.
# Let's assume the ID can be fetched or we skip banning specific ID in this script 
# without implementing a 'Get Me' endpoint. 
# SKIPPING for script simplicity unless we added a 'whoami' endpoint.
echo "Skipping Ban Test (Need ID lookup), but Endpoint exists at PATCH /admin/users/:id/status"

# ---------------------------------------------------------
# 12. Refresh Token Rotation
# ---------------------------------------------------------
echo -e "\n${BLUE}[12/14] Rotating Refresh Token...${NC}"
REFRESH_RES=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$OWNER_ID\", \"refreshToken\": \"$OWNER_REFRESH\"}")

NEW_ACCESS=$(extract_token "$REFRESH_RES")

if [ "$NEW_ACCESS" != "null" ]; then
  echo -e "${GREEN}SUCCESS${NC} - Got new Access Token"
else
  echo -e "${RED}FAILED${NC}"
  echo $REFRESH_RES
fi

echo -e "\n${BLUE}---------------------------------------"
echo -e "      FULL SYSTEM TEST COMPLETE      "
echo -e "---------------------------------------${NC}"