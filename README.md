# FixItNow 🔧
**"Your Trusted Home Service Platform"**

FixItNow is a backend REST API for a home services marketplace. Customers can browse available services (plumbing, electrical, cleaning, painting, etc.), book qualified technicians, make payments, and leave reviews. Technicians can create service profiles, manage their offered services, and handle job bookings. Admins oversee the platform, manage users, and moderate service categories.

🔗 **Live API:** [https://fix-it-now-prisma-backend.vercel.app](https://fix-it-now-prisma-backend.vercel.app)

---

## 📌 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Roles & Permissions](#-roles--permissions)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Booking Status Flow](#-booking-status-flow)
- [Authentication](#-authentication)
- [Deployment](#-deployment)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | PostgreSQL |
| ORM | Prisma ORM (multi-file schema) |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Payment Gateway | SSLCommerz |
| Dev Tooling | tsx (watch mode), TypeScript Compiler |

---

## 📂 Project Structure

```
FixItNow-prisma-backend/
├── prisma/
│   ├── schema.prisma          # generator + datasource config
│   ├── enums.prisma           # all enums (UserRole, UserStatus, BookingStatus, etc.)
│   ├── user.prisma            # User model
│   ├── technician.prisma      # TechnicianProfile model
│   ├── service.prisma         # Category & Service models
│   ├── booking.prisma         # Booking model
│   ├── payment.prisma         # Payment model
│   ├── review.prisma          # Review model
│   └── migrations/
├── generated/
│   └── prisma/                # auto-generated Prisma Client (do not edit)
├── src/
│   ├── config/
│   │   └── index.ts           # centralized env config
│   ├── lib/
│   │   └── prisma.ts          # Prisma Client instance
│   ├── middlewares/
│   │   └── auth.ts            # JWT auth + role guard middleware
│   ├── modules/
│   │   ├── auth/               # login, refresh-token
│   │   ├── user/                # registration
│   │   ├── admin/               # user management, categories
│   │   ├── category/             # public category listing
│   │   ├── service/               # public service listing + filters
│   │   ├── technician/             # public technician listing + self-management
│   │   ├── booking/                 # customer booking
│   │   ├── payment/                  # SSLCommerz payment flow
│   │   └── review/                    # customer reviews
│   ├── utils/
│   │   ├── catchAsync.ts       # async error wrapper
│   │   ├── sendResponse.ts    # standard response formatter
│   │   ├── jwt.ts             # token sign/verify helpers
│   │   └── sslcommerz.ts      # SSLCommerz init/validate helpers
│   ├── types/
│   │   └── sslcommerz-lts.d.ts # custom type declarations
│   ├── app.ts                 # express app + route mounting
│   └── server.ts              # entry point
├── .env
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

Each module follows the same **MVC-style pattern**:
```
<module>.interface.ts   -> TypeScript types for request payloads
<module>.service.ts     -> business logic + Prisma queries
<module>.controller.ts  -> request/response handling
<module>.routes.ts      -> route definitions
```

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **CUSTOMER** | Users who book home services | Browse services, book technicians, make payments, track bookings, leave reviews |
| **TECHNICIAN** | Service professionals | Create/update profile, add services, view/accept/decline bookings, update job status |
| **ADMIN** | Platform moderators | Manage all users (ban/unban), manage service categories |

> 💡 Users select their role during registration.

---

## 🗄️ Database Schema

### Core Models

**User**
```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  role      UserRole   @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

**TechnicianProfile** — one-to-one with User
```prisma
model TechnicianProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  bio          String?
  experience   Int      @default(0)
  skills       String[]
  location     String?
  hourlyRate   Float
  isAvailable  Boolean  @default(true)
  ratingAvg    Float    @default(0)
  totalReviews Int      @default(0)
}
```

**Category** — managed only by Admin
```prisma
model Category {
  id          String @id @default(uuid())
  name        String @unique
  description String?
}
```

**Service** — created by Technician, linked to a Category
```prisma
model Service {
  id           String  @id @default(uuid())
  title        String
  description  String?
  price        Float
  durationMins Int?
  categoryId   String
  technicianId String
}
```

**Booking**
```prisma
model Booking {
  id           String        @id @default(uuid())
  customerId   String
  serviceId    String
  technicianId String
  status       BookingStatus @default(REQUESTED)
  scheduledAt  DateTime
  address      String
  note         String?
  price        Float
}
```

**Payment**
```prisma
model Payment {
  id            String        @id @default(uuid())
  bookingId     String        @unique
  transactionId String        @unique
  amount        Float
  method        PaymentMethod @default(SSLCOMMERZ)
  status        PaymentStatus @default(PENDING)
  paidAt        DateTime?
}
```

**Review** — one per completed booking
```prisma
model Review {
  id           String  @id @default(uuid())
  bookingId    String  @unique
  customerId   String
  technicianId String
  rating       Int
  comment      String?
}
```

### Relationship Overview

```
User (1) ─────── (1) TechnicianProfile ─────── (many) Service ─────── (many-to-1) Category
  │                        │
  │                        └──── (many) Booking ──── (1) Payment
  │                                    │
  └──── (many) Booking ────────────────┘
                    │
                    └──── (1) Review
```

- A **User** with role `TECHNICIAN` has exactly one **TechnicianProfile**.
- A **TechnicianProfile** can offer many **Services**, each tied to one **Category** (created by Admin).
- A **Customer** books a **Service** directly — the technician is auto-derived from the service.
- Each **Booking** can have exactly one **Payment** and one **Review** (only after completion).

### Enums

```prisma
enum UserRole      { CUSTOMER TECHNICIAN ADMIN }
enum UserStatus    { ACTIVE BANNED }
enum BookingStatus { REQUESTED ACCEPTED DECLINED PAID IN_PROGRESS COMPLETED CANCELLED }
enum PaymentStatus { PENDING COMPLETED FAILED }
enum PaymentMethod { SSLCOMMERZ STRIPE }
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="postgres://<user>:<password>@<host>:5432/postgres?sslmode=require"
PORT=5001
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

SSL_STORE_ID=your_sslcommerz_store_id
SSL_STORE_PASSWORD=your_sslcommerz_store_password
SSL_IS_LIVE=false
SSL_SUCCESS_URL=http://localhost:5001/api/payments/confirm
SSL_FAIL_URL=http://localhost:5001/api/payments/fail
SSL_CANCEL_URL=http://localhost:5001/api/payments/cancel

FRONTEND_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` to version control. Make sure it's listed in `.gitignore`.

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd FixItNow-prisma-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env   # then fill in real values

# 4. Run migrations
npx prisma migrate dev

# 5. Generate Prisma Client
npx prisma generate

# 6. Start the dev server
npm run dev
```

Server will start at:
```
http://localhost:5001
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user (customer/technician) |
| POST | `/api/auth/login` | Public | Login user, returns access token + refresh token cookie |
| POST | `/api/auth/refresh-token` | Public (cookie) | Get new access token using refresh token |

### Categories (Public)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | Get all service categories |

### Services (Public)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | Get all services (filters: `type`, `location`, `rating`, `searchTerm`) |

### Technicians (Public)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/technicians` | Public | Get all technicians (filters: `location`, `rating`, `skill`, `searchTerm`) |
| GET | `/api/technicians/:id` | Public | Get technician profile with services & reviews |

### Technician Self-Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PUT | `/api/technician/profile` | Technician | Create/update own profile |
| POST | `/api/technician/services` | Technician | Add new service under an existing category |
| GET | `/api/technician/services` | Technician | Get own services |
| GET | `/api/technician/bookings` | Technician | Get bookings assigned to self |
| PATCH | `/api/technician/bookings/:id` | Technician | Update booking status (accept/decline/progress/complete) |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Customer | Create new booking |
| GET | `/api/bookings` | Customer/Technician/Admin | Get own bookings |
| GET | `/api/bookings/:id` | Customer/Technician/Admin | Get booking details |

### Payments (SSLCommerz)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/payments/create` | Customer | Create payment session for an accepted booking |
| POST/GET | `/api/payments/confirm` | SSLCommerz callback | Confirm payment, marks booking as `PAID` |
| POST | `/api/payments/fail` | SSLCommerz callback | Mark payment as failed |
| POST | `/api/payments/cancel` | SSLCommerz callback | Handle cancelled payment |
| GET | `/api/payments` | Customer | Get own payment history |
| GET | `/api/payments/:id` | Customer | Get payment details |

### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reviews` | Customer | Submit review (only for `COMPLETED` bookings) |
| GET | `/api/reviews/my-reviews` | Customer | Get own submitted reviews |
| GET | `/api/reviews/technician/:technicianId` | Public | Get all reviews for a technician |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin | Get all users |
| GET | `/api/admin/users/:id` | Admin | Get single user by id |
| PATCH | `/api/admin/users/:id` | Admin | Update user status (ban/unban) |
| GET | `/api/admin/categories` | Admin | Get all categories |
| POST | `/api/admin/categories` | Admin | Create new service category |

---

## 🔄 Booking Status Flow

```
REQUESTED ──accept──► ACCEPTED ──payment──► PAID ──► IN_PROGRESS ──► COMPLETED
    │
    └──decline──► DECLINED

(Customer can CANCEL a booking any time before IN_PROGRESS)
```

A review can only be submitted once a booking reaches `COMPLETED` status.

---

## 🔐 Authentication

- Login issues a short-lived **access token** (returned in response body) and a long-lived **refresh token** (set as an `httpOnly` cookie).
- Protected routes require the access token to be sent as:
  ```
  Authorization: Bearer <accessToken>
  ```
- Role-based access is enforced via middleware:
  ```ts
  auth(UserRole.ADMIN)
  auth(UserRole.CUSTOMER, UserRole.TECHNICIAN)
  ```
- Banned users (`status: BANNED`) are blocked from authenticating, even with a valid token.

---

## 🚀 Deployment

**Live API:** https://fix-it-now-prisma-backend.vercel.app

Example (public endpoint):
```
GET https://fix-it-now-prisma-backend.vercel.app/api/services
```

This project is configured for deployment on **Vercel** as a serverless Node.js function.

```bash
npm install -g vercel
vercel login
vercel --prod
```

Key deployment notes:
- `prisma generate` must run as part of the build step (`vercel-build` script in `package.json`).
- All environment variables must be added manually via the Vercel Dashboard (Project → Settings → Environment Variables).
- SSLCommerz callback URLs (`SSL_SUCCESS_URL`, `SSL_FAIL_URL`, `SSL_CANCEL_URL`) must be updated to the deployed domain, not `localhost`.
- A pooled/serverless-friendly PostgreSQL connection string is recommended (e.g. Prisma Postgres pooled connection).

---

## 📄 License

This project was built as part of a learning program and is intended for educational purposes.

---

**Built with ❤️ using Express, Prisma, and PostgreSQL.**
