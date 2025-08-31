# Notification Orchestrator

A lightweight event-driven service that decides whether to send notifications based on user preferences and **Do Not Disturb (DND)** settings.

This project was built as a test assignment to demonstrate event-driven notification orchestration.

---

## 🚀 Features

- **User Preferences API**
  - Store and retrieve user notification settings
  - Configure event-specific subscriptions
  - Define "Do Not Disturb" windows (supports midnight-crossing logic)

- **Event Processing API**
  - Accept incoming events
  - Decide whether to send notifications based on preferences & DND

- **Validation**
  - Input schemas with Zod

---

## 📦 Tech Stack

- **Node.js** + **TypeScript**
- **Express**
- **Zod** for validation
- **Helmet** + **CORS** for security & middleware

---

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/ProbablyNoth1ng/notification-orchestrator.git

cd notification-orchestrator

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

```bash
# Start in development mode (with auto-reload)
npm run dev

# Build TypeScript project
npm run build

# Run tests
npm test
```

---

## 📋 API Documentation

### User Preferences

#### Get User Preferences
```http
GET /preferences/:userId
```

**Response (200):**
```json
{ 
  "dnd": { "start": "22:00", "end": "07:00" }, 
  "eventSettings": { 
    "ORDER_PLACED": { "enabled": true }, 
    "PAYMENT_FAILED": { "enabled": false } 
  } 
}
```

#### Update User Preferences
```http
POST /preferences/:userId
```

**Request Body:**
```json
{ 
  "dnd": { "start": "22:00", "end": "07:00" }, 
  "eventSettings": { 
    "ORDER_PLACED": { "enabled": true }, 
    "PAYMENT_FAILED": { "enabled": false } 
  } 
}
```

**Response (201):**
```json
{ "message": "Preferences updated successfully" }
```

### Event Processing

#### Process Event
```http
POST /events
```

**Request Body:**
```json
{ 
  "eventId": "evt_123", 
  "userId": "user_42", 
  "eventType": "ORDER_PLACED", 
  "timestamp": "2025-08-31T23:15:00.000Z" 
}
```

**Response Examples:**

✅ **Notification should be processed:**
```json
{ 
  "decision": "PROCESS_NOTIFICATION" 
}
```

🚫 **Notification blocked due to user settings:**
```json
{ 
  "decision": "DO_NOT_NOTIFY", 
  "reason": "USER_UNSUBSCRIBED_FROM_EVENT" 
}
```

🚫 **Blocked due to DND:**
```json
{ 
  "decision": "DO_NOT_NOTIFY", 
  "reason": "DND_ACTIVE" 
}
```

🚫 **Unknown user:**
```json
{ 
  "decision": "DO_NOT_NOTIFY", 
  "reason": "USER_NOT_FOUND" 
}
```
