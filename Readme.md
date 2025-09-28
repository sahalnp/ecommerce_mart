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



```html
<body style="">
  <div id="root">
    <div class="min-h-screen bg-[#F8FAFD] flex flex-col">
      <main class="pt-6 pb-16 px-4">
        <div class="max-w-[1400px] mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-8 space-y-6">
              <div class="bg-white rounded-lg shadow-sm p-4">
                <div dir="ltr" data-orientation="horizontal" class="mt-4">
                  <div data-state="active"
                       data-orientation="horizontal"
                       role="tabpanel"
                       aria-labelledby="radix-:r10:-trigger-preview"
                       id="radix-:r10:-content-preview"
                       tabindex="0"
                       class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <div class="border border-border rounded-lg bg-background p-6 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</body>

<style>
/* === Tailwind-like base resets & variables === */
*, :before, :after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / .5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
}
*, :before, :after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}
* {
  border-color: hsl(var(--border));
}

/* === Tailwind utility classes === */
.min-h-screen { min-height: 100vh; }
.bg-\[\#F8FAFD\] { background-color: #F8FAFD; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.pt-6 { padding-top: 1.5rem; }
.pb-16 { padding-bottom: 4rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.max-w-\[1400px\] { max-width: 1400px; }
.mx-auto { margin-left: auto; margin-right: auto; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.lg\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.gap-6 { gap: 1.5rem; }
.lg\:col-span-8 { grid-column: span 8 / span 8; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
.bg-white { background-color: #fff; }
.rounded-lg { border-radius: var(--radius, 0.5rem); }
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
              var(--tw-ring-shadow, 0 0 #0000),
              var(--tw-shadow);
}
.p-4 { padding: 1rem; }
.mt-4 { margin-top: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
.focus-visible\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus-visible\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
.focus-visible\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
.border { border-width: 1px; }
.border-border { border-color: hsl(var(--border)); }
.bg-background { background-color: hsl(var(--background)); }
.p-6 { padding: 1.5rem; }
</style>
