<div align="center">

# 🛍️ Ecommerce_mart  

**A production-ready, open-source backend starter for modern e-commerce platforms.**

[Features](#-features) • [Quick Start](#-quick-start) • [Docs](#-docs) • [Contributing](#-contributing)

</div>

---

## 🚀 Why `ecommerce_mart`?

Build flexible, secure, and scalable online stores in record time.

| Feature | Summary |
|---------|---------|
| 🧩 **Modular Architecture** | Clean separation of concerns — swap or extend any module without touching the core. |
| 🔐 **Secure Auth** | JWT + OTP + OAuth flows for users, admins & vendors. |
| 💸 **Payments** | Razorpay pre-wired; add more gateways in minutes. |
| 📧 **Email** | Nodemailer templates for order, delivery & promotional emails. |
| 📊 **Admin Suite** | Full CRUD for products, orders, coupons, reviews & reports. |
| 🧪 **Testable** | Jest + Supertest suites ready for CI/CD. |

---

## ⚙️ Quick Start

### 1. Clone & install
```bash
git clone https://github.com/sahalnp/ecommerce_mart.git
cd ecommerce_mart
npm install

2. Seed 

npm run seed

3. Run

# development
npm run dev

# production
npm start

Server will start at http://localhost:5000 (or the port defined in your .env).
📚 Docs
Module	Endpoint Prefix	Description
Auth	/api/auth	Register, login, refresh, OTP, OAuth
Users	/api/users	Profile, addresses, wishlist
Products	/api/products	CRUD, search, filter, pagination
Cart	/api/cart	Add, update, delete, clear
Orders	/api/orders	Place, track, cancel, admin update
Payments	/api/payments	Razorpay order & capture
Admin	/api/admin	Dashboard stats, manage everything
Reviews	/api/reviews	Rate & comment on products
Coupons	/api/coupons	Discount codes, usage limits

📂 Full Postman collection: docs/postman.json
🧪 Testing

# unit & integration
npm test

# watch mode
npm run test:watch

# coverage
npm run test:coverage

🛠️ Tech Stack

    Runtime: Node.js (v18+)

    Framework: Express.js

    Database: MongoDB + Mongoose ODM

    Auth: jsonwebtoken, bcrypt, passport

    Payment: Razorpay SDK

    Email: Nodemailer + Handlebars templates

    Testing: Jest, Supertest

    Linting: ESLint + Prettier

    CI/CD: GitHub Actions (example in .github/workflows)

🤝 Contributing

    Fork the repo

    Create your feature branch: git checkout -b feature/amazing

    Commit: git commit -m "feat: add amazing"

    Push: git push origin feature/amazing

    Open a Pull Request

Please read CONTRIBUTING.md for coding standards and guidelines.
📄 License

MIT © sahalnp


