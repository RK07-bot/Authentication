# Authentication System

**A secure, Redis-backed authentication and account management backend built with Node.js.**

An authentication service providing secure user registration, email verification, JWT-based authentication, refresh token rotation, OTP-based password recovery, and session management. Built with Express.js, MongoDB, and Redis, with a focus on security, validation, and efficient session handling.

## 🚀 Features

### Authentication & Account Management
- **User Registration:** Secure registration with username, email, and password validation.
- **Email Verification:** Account creation is completed only after verifying the email through a time-limited verification link.
- **User Login:** Password verification using bcrypt and JWT token generation.
- **User Profile:** Authenticated endpoint to retrieve the current user's profile.
- **Logout:** Revokes the stored refresh token and clears authentication cookies.

### Token & Session Management
- **JWT Authentication:** Separate access and refresh tokens with different expiration periods.
- **Access Token Expiration:** Short-lived access tokens (15 minutes).
- **Refresh Token Rotation:** Issues a new access and refresh token when refreshing a session.
- **Redis-backed Sessions:** Stores and validates refresh tokens using Redis.
- **Single Active Session:** Maintains one valid refresh token per user, invalidating previous sessions on new login.
- **HTTP-only Cookies:** Stores authentication tokens in secure, HTTP-only cookies.

### Password Recovery
- **Forgot Password:** Sends a six-digit OTP to the registered email address.
- **OTP Verification:** Validates OTPs with a five-minute expiration.
- **Attempt Restrictions:** Invalidates OTPs after five unsuccessful verification attempts.
- **Resend OTP:** Allows requesting a new OTP with a cooldown period.
- **Password Reset:** Uses a temporary reset token after successful OTP verification.
- **Secure Password Updates:** Hashes new passwords using bcrypt.

### Security & Performance
- **Redis Caching:** Caches authenticated user profiles to reduce repeated MongoDB queries.
- **Request Validation:** Uses Zod schemas to validate incoming request data.
- **NoSQL Injection Protection:** Sanitizes user input using mongo-sanitize.
- **Request Throttling:** Redis-based restrictions on registration and OTP resend requests.
- **Centralized Error Handling:** Handles validation, database, JWT, and application errors.
- **Email Service:** Uses Nodemailer with Gmail SMTP for verification and password recovery emails.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | Backend framework and REST APIs |
| MongoDB | Persistent user storage |
| Mongoose | MongoDB object modeling |
| Redis | Session management, OTP storage, and caching |
| JWT | Access and refresh token authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Nodemailer | Email delivery |
| mongo-sanitize | NoSQL injection protection |
| Cookie Parser | Authentication cookie handling |

## 📁 Project Structure

```text
Authentication/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── email.js
│   │   │   ├── env.js
│   │   │   └── redis.js
│   │   │
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── try-catch.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── email.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── emailHtmlTemplate.js
│   │   │   ├── generateOtp.js
│   │   │   ├── generateToken.js
│   │   │   ├── invalidateUserCache.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── revokeRefreshToken.js
│   │   │   └── verifyRefreshToken.js
│   │   │
│   │   ├── validators/
│   │   │   └── auth.validator.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Authentication
```

### 2. Navigate to Backend

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Redis
REDIS_URL=your_redis_connection_url

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Application
APP_NAME=Authentication System

# Email Configuration
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# JWT Secrets
ACCESS_JWT_SECRET=your_access_token_secret
REFRESH_JWT_SECRET=your_refresh_token_secret
```

**Important:**
- Configure MongoDB and Redis before starting the server.
- Use a Gmail App Password for SMTP authentication.
- Generate strong, unique JWT secrets.
- Never commit your `.env` file to GitHub.
- Authentication cookies are configured with `secure: true`, so HTTPS is required for them to work in the browser.

### 5. Start the Server

```bash
node server.js
```

The backend will start on the configured port.

## 📡 API Endpoints

Base URL:

```text
http://localhost:5000/api/auth
```

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/verify/:token` | Verify email and create account |
| POST | `/login` | Authenticate user |
| GET | `/me` | Get authenticated user profile |
| POST | `/refresh` | Refresh access and refresh tokens |
| POST | `/logout` | Logout and revoke refresh token |

### Password Recovery Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/forgot-password` | Request password reset OTP |
| POST | `/verify` | Verify password reset OTP |
| POST | `/resend-otp` | Resend password reset OTP |
| POST | `/change-password` | Update password using reset token |

### Example Request Bodies

**Register – POST `/register`**

```json
{
  "username": "ritesh",
  "email": "ritesh@example.com",
  "password": "StrongPassword123"
}
```

**Login – POST `/login`**

```json
{
  "email": "ritesh@example.com",
  "password": "StrongPassword123"
}
```

**Verify OTP – POST `/verify`**

```json
{
  "email": "ritesh@example.com",
  "otp": "123456"
}
```

**Change Password – POST `/change-password`**

```json
{
  "resetToken": "your_reset_token",
  "newPassword": "NewPassword123",
  "confirmNewPassword": "NewPassword123"
}
```

## 🔐 Authentication Flow

### Registration Flow

1. User submits registration details.
2. Request data is validated using Zod.
3. Password is hashed using bcrypt.
4. Unverified user information is temporarily stored in Redis.
5. A verification email containing a unique token is sent.
6. User verifies their email through the verification link.
7. Verified user information is saved in MongoDB.

### Login & Token Refresh Flow

1. User submits email and password.
2. Credentials are verified using bcrypt.
3. Access and refresh tokens are generated.
4. Refresh token is stored in Redis.
5. Both tokens are sent through HTTP-only cookies.
6. Protected routes validate the access token.
7. When the access token expires, the refresh endpoint validates the existing refresh token and rotates both tokens.

### Password Recovery Flow

1. User requests a password reset.
2. A six-digit OTP is generated and emailed.
3. OTP is stored temporarily in Redis with a five-minute expiration.
4. User submits the OTP for verification.
5. After successful verification, a temporary password-reset token is generated.
6. User submits a new password using the reset token.
7. The new password is hashed and saved in MongoDB.

## 🧪 Testing

The REST API endpoints can be tested using **Postman**.

For protected endpoints, ensure that authentication cookies are included in requests.

Recommended testing scenarios:
- Successful and unsuccessful registration.
- Email verification and expired verification links.
- Valid and invalid login credentials.
- Access token expiration and refresh token rotation.
- Multiple login sessions for the same user.
- OTP expiration and maximum verification attempts.
- OTP resend cooldown.
- Password reset and token reuse prevention.
- Unauthorized access to protected routes.

## 🔒 Security Considerations

- Passwords are never stored in plain text.
- Authentication tokens are stored in HTTP-only cookies.
- Refresh tokens are validated against Redis.
- OTPs and temporary verification data have expiration times.
- Invalid OTP attempts are restricted.
- User input is validated and sanitized.
- Sensitive configuration values are managed through environment variables.

## 👨‍💻 Author

**Ritesh Singh**

[GitHub](https://github.com/RK07-bot)

---

⭐ If you find this project useful, consider giving it a star!
