# Smart Parking Backend

This directory contains the Node.js/Express backend for the Smart Parking System. It uses DynamoDB for storage and JWT for authentication.

## Structure

```
backend
├── config
│   └── awsConfig.js         # DynamoDB client
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── parkingController.js
│   └── reservationController.js
├── middleware
│   ├── adminMiddleware.js  # JWT + role check
│   └── authMiddleware.js   # JWT verification
├── models
│   ├── userModel.js
│   ├── parkingLotModel.js
│   ├── slotModel.js
│   └── reservationModel.js
├── routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── parkingRoutes.js
│   └── reservationRoutes.js
├── server.js
└── package.json
```

## Environment Variables

- `AWS_REGION` – AWS region
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` – credentials
- `USERS_TABLE`, `PARKING_LOTS_TABLE`, `SLOTS_TABLE`, `RESERVATIONS_TABLE` – DynamoDB table names
- `JWT_SECRET` – secret for signing tokens
- `PORT` – server port

## API Endpoints

### Auth
- `POST /auth/register` – create user
- `POST /auth/login` – login and receive JWT

### Parking
- `GET /parking-lots` – list all lots
- `GET /parking-lots/:lotId/slots` – list slots belonging to lot

### Reservations
- `POST /reservations` – book slot (user JWT required)
- `GET /users/:userId/reservations` – get user's reservations
- `DELETE /reservations/:reservationId` – cancel reservation

### Admin (require admin JWT)
- `POST /admin/login`
- `GET /admin/dashboard` – basic stats
- `POST /admin/parking-lots` – add new lot (will now automatically generate `total_slots` number of records in ParkingSlots table)
- `POST /admin/slots` – add slot (manual addition)
- `PUT  /admin/slots/:slotId` – update status
- `GET  /admin/reservations` – all reservations
- `GET  /admin/users` – all users (returns **only normal users**; admin accounts are filtered out)


## Installation

```bash
cd backend
npm install
npm run dev
```

`nodemon` is included for development.

## Notes

- Slot booking updates slot status and lot availability.
- Dynamic pricing is a simple switch; adjust as needed.
- Validation is minimal; consider using `express-validator` for production.

```