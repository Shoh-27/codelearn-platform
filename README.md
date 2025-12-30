# 🎓 Gamified Education Platform

**Junior developerlar uchun gamifikatsiya qilingan ta'lim platformasi**

O'quv jarayonini o'yin elementlari (XP, level, badge) bilan birlashtirgan to'liq fullstack web ilova.

---

## 📖 Loyha haqida

Bu MVP (Minimum Viable Product) versiyasi bo'lib, quyidagi asosiy funksiyalarni o'z ichiga oladi:

- ✅ **Foydalanuvchi autentifikatsiyasi** (JWT token)
- ✅ **Gamifikatsiya tizimi** (XP, Level, Badge)
- ✅ **Challenge (vazifa) tizimi** - Coding mashqlar
- ✅ **Project (loyiha) tizimi** - Katta vazifalar
- ✅ **Leaderboard** - Reyting jadvali
- ✅ **Admin paneli** - To'liq boshqaruv

---

## 🛠️ Texnologiyalar

### Backend
- **Framework:** Laravel 10
- **Database:** MySQL 5.7+
- **Auth:** Custom JWT (firebase/php-jwt)
- **Language:** PHP 8.1+

### Frontend
- **Library:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API

---

## 📋 Tizim talablari

### Backend uchun:
- PHP >= 8.1
- Composer
- MySQL >= 5.7
- Apache/Nginx

### Frontend uchun:
- Node.js >= 16.x
- npm >= 8.x yoki yarn >= 1.22

---

## 🚀 Tezkor o'rnatish

### 1️⃣ Loyihani clone qiling

```bash
git clone https://github.com/Shoh-27/codelearn-platform.git
cd codelearn-platform
```

### 2️⃣ Backend setup

```bash
cd backend

# Kutubxonalarni o'rnatish
composer install

# Environment setup
cp .env.example .env

# .env faylni sozlang (database ma'lumotlari)
# DB_DATABASE=gamified_edu_platform
# DB_USERNAME=root
# DB_PASSWORD=your_password
# JWT_SECRET=your_secret_key

# Application key
php artisan key:generate

# Database yaratish (MySQL-da)
# CREATE DATABASE gamified_edu_platform;

# Migratsiyalar
php artisan migrate

# Seed data
php artisan db:seed

# Serverni ishga tushirish
php artisan serve
```

Backend: `http://localhost:8000`

### 3️⃣ Frontend setup

Yangi terminal oching:

```bash
cd frontend

# Kutubxonalarni o'rnatish
npm install

# Environment setup
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Serverni ishga tushirish
npm start
```

Frontend: `http://localhost:3000`

---

## 👥 Test foydalanuvchilar

Seeder avtomatik yaratadi:

| Rol       | Email                | Parol        |
|-----------|----------------------|--------------|
| **Admin** | admin@example.com    | password123  |
| **Student** | student@example.com | password123  |

---

## 📁 Loyha tuzilishi

```
gamified-edu-platform/
│
├── backend/                      # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API Controllerlar
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── UserProfileController.php
│   │   │   │   ├── ChallengeController.php
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── GamificationController.php
│   │   │   │   └── AdminController.php
│   │   │   └── Middleware/      # Middleware
│   │   │       ├── JWTMiddleware.php
│   │   │       └── AdminMiddleware.php
│   │   ├── Models/              # Eloquent Models
│   │   │   ├── User.php
│   │   │   ├── UserProfile.php
│   │   │   ├── Challenge.php
│   │   │   ├── Project.php
│   │   │   ├── Badge.php
│   │   │   └── Level.php
│   │   └── Services/            # Business Logic
│   │       ├── AuthService.php
│   │       ├── JWTService.php
│   │       ├── GamificationService.php
│   │       ├── ChallengeService.php
│   │       └── ProjectService.php
│   ├── database/
│   │   ├── migrations/          # 11 ta migration
│   │   └── seeders/
│   │       └── DatabaseSeeder.php
│   ├── routes/
│   │   └── api.php              # API routes
│   ├── config/
│   │   └── jwt.php              # JWT config
│   ├── composer.json
│   └── .env.example
│
├── frontend/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js   # Auth holati
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Challenges.js
│   │   │   ├── ChallengeDetail.js
│   │   │   ├── Projects.js
│   │   │   ├── ProjectDetail.js
│   │   │   ├── Leaderboard.js
│   │   │   └── admin/
│   │   │       └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.js               # Main component
│   │   ├── index.js             # Entry point
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── README.md                     # Bu fayl
```

---

## 🎮 Asosiy funksiyalar

### 1. Authentication (Autentifikatsiya)
- Ro'yxatdan o'tish
- Kirish (JWT token bilan)
- Profil boshqaruvi
- Logout

### 2. Gamification (O'yinlashtirish)
- **XP (Experience Points):** Challenge va project bajarganingizda oling
- **Level tizimi:** 10 ta level (Beginner → Mythical)
- **Badge tizimi:** 5 xil achievement
- **Progress tracking:** Vizual progress bar

### 3. Challenge tizimi
- Qiyinlik darajasi bo'yicha filter (Beginner, Intermediate, Advanced)
- Vazifa tavsifi va hintlar
- Code submit qilish
- Avtomatik XP berish
- Har bir foydalanuvchi progressini saqlash

### 4. Project tizimi
- Katta loyihalar (GitHub bilan)
- Repository URL yuklash
- Admin tomonidan ko'rib chiqish
- Approval/Rejection
- XP reward

### 5. Leaderboard (Reyting jadvali)
- Global reyting
- XP bo'yicha saralash
- Top 50 foydalanuvchilar
- O'zingizni highlight qilish

### 6. Admin Panel
- Foydalanuvchilarni boshqarish
- Challenge/Project CRUD
- Submission review
- Platform statistikasi

---

## 📊 Database schema

11 ta asosiy jadval:

```sql
users                      # Foydalanuvchilar
user_profiles              # Profil ma'lumotlari + gamification stats
levels                     # 10 ta level
badges                     # 5 ta badge turi
user_badges                # Foydalanuvchi badgelari
xp_transactions            # XP tarixi (audit)
lessons                    # Darslar
challenges                 # Vazifalar
user_challenge_progress    # Foydalanuvchi progress
projects                   # Loyihalar
project_submissions        # Yuborishlar
```

---

## 🔗 API Endpoints

### Public endpoints
```
POST /api/auth/register
POST /api/auth/login
```

### Protected endpoints (JWT kerak)
```
GET  /api/profile
PUT  /api/profile
GET  /api/challenges
GET  /api/challenges/{slug}
POST /api/challenges/{id}/submit
GET  /api/projects
POST /api/submissions
GET  /api/gamification/leaderboard
```

### Admin endpoints (Admin role kerak)
```
GET  /api/admin/dashboard
GET  /api/admin/users
POST /api/admin/challenges
PUT  /api/admin/submissions/{id}/review
```

To'liq API dokumentatsiyasi: [backend/README.md](backend/README.md)

---

## 🎯 Qanday ishlaydi?

### Foydalanuvchi flow:

1. **Ro'yxatdan o'tish** → Dastlabki XP: 0, Level: 1
2. **Dashboard** → XP, Level, badges ko'rish
3. **Challenge tanlash** → Vazifani yechish
4. **Submit** → XP olish (50-150 XP)
5. **Level Up** → Yetarli XP to'planganda
6. **Badge olish** → Shartlar bajarilganda avtomatik
7. **Project yuborish** → Katta vazifa (300-800 XP)
8. **Admin review** → Tasdiqlansa XP olish
9. **Leaderboard** → O'z o'rningizni ko'rish

### Level progression:

| Level | Nom          | Kerakli XP |
|-------|--------------|------------|
| 1     | Beginner     | 0          |
| 2     | Novice       | 100        |
| 3     | Apprentice   | 300        |
| 4     | Intermediate | 600        |
| 5     | Advanced     | 1000       |
| 6     | Expert       | 1500       |
| 7     | Master       | 2500       |
| 8     | Grandmaster  | 4000       |
| 9     | Legend       | 6000       |
| 10    | Mythical     | 10000      |

### Badge turlari:

1. **First Steps** - Birinchi challenge bajarish (1 challenge)
2. **Challenge Master** - 10 ta challenge bajarish
3. **XP Hunter** - 500 XP to'plash
4. **Project Builder** - Birinchi project yuborish
5. **Dedicated Learner** - 1000 XP to'plash

---

## 🧪 Testlash

### 1. Backend testlash

```bash
# Postman/Insomnia bilan:
POST http://localhost:8000/api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}

# Token olish va keyingi requestlarda ishlatish:
Authorization: Bearer {your_token}
```

### 2. Frontend testlash

1. `http://localhost:3000/register` orqali yangi foydalanuvchi yaratish
2. Login qilish
3. Challenge yechish va XP olish
4. Project yuborish
5. Leaderboard tekshirish

---

## 🛠️ Development

### Backend development

```bash
cd backend

# Migration yaratish
php artisan make:migration create_table_name

# Model yaratish
php artisan make:model ModelName

# Controller yaratish
php artisan make:controller ControllerName

# Seeder yaratish
php artisan make:seeder SeederName
```

### Frontend development

```bash
cd frontend

# Yangi komponent yaratish
# src/components/NewComponent.js

# Yangi sahifa yaratish
# src/pages/NewPage.js

# API service qo'shish
# src/services/api.js da yangi funksiya
```

---

## 🐛 Muammolarni hal qilish

### Backend muammolari

**Database connection error:**
```bash
php artisan config:clear
php artisan cache:clear
```

**Migration error:**
```bash
php artisan migrate:fresh --seed
```

**JWT error:**
`.env` faylda `JWT_SECRET` o'rnatilganligini tekshiring

### Frontend muammolari

**CORS error:**
Backend `config/cors.php` da frontend URL qo'shilganligini tekshiring

**API connection:**
`.env` da `REACT_APP_API_URL` to'g'riligini tekshiring

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Production deployment

### Backend (Laravel)

```bash
# .env faylni production uchun sozlang
APP_ENV=production
APP_DEBUG=false

# Optimize qilish
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Composer production
composer install --optimize-autoloader --no-dev
```

### Frontend (React)

```bash
# Production build
npm run build

# Build fayllarni host qilish (Netlify/Vercel/Apache/Nginx)
```

**Nginx config misol:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/build;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 🔐 Xavfsizlik

- ✅ JWT token bilan autentifikatsiya
- ✅ Parollar bcrypt bilan hash
- ✅ CORS sozlamalari
- ✅ Input validation (backend + frontend)
- ✅ SQL injection himoyasi (Eloquent ORM)
- ✅ XSS himoyasi
- ✅ Rate limiting (production uchun tavsiya)

---

## 📈 Kelajakdagi rivojlantirish

### Texnik yaxshilanishlar:
- [ ] Real-time code execution (Docker sandbox)
- [ ] WebSocket orqali real-time notifications
- [ ] Redis caching
- [ ] Email notifications
- [ ] File upload (avatar, project files)
- [ ] Advanced search va filtering
- [ ] Pagination
- [ ] API rate limiting

### Yangi features:
- [ ] Social features (comments, likes)
- [ ] Team challenges
- [ ] Streak tracking (kundalik aktivlik)
- [ ] Certificate generation
- [ ] Course paths (guided learning)
- [ ] Video lessons
- [ ] Live coding sessions
- [ ] Mentor system
- [ ] Mobile app (React Native)

### UI/UX:
- [ ] Tailwind CSS integration
- [ ] Dark mode
- [ ] Animations (Framer Motion)
- [ ] Better mobile responsive
- [ ] Loading skeletons
- [ ] Toast notifications

### DevOps:
- [ ] Docker containers
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Monitoring (Sentry)
- [ ] Logging (ELK stack)

---

## 🤝 Hissa qo'shish

Pull request yuborishdan oldin:

1. Code style guide'ga rioya qiling
2. Testlar yozing
3. Documentation yangilang
4. Commit message'lar tushunarli bo'lsin

---

## 📄 Litsenziya

MIT License - O'zingiz xohlagancha ishlatishingiz mumkin.

---

## 👨‍💻 Muallif

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 E'tirof

- Laravel jamoasiga
- React jamoasiga
- Barcha open-source ishtirokchilarga

---

## 📞 Yordam

Savollar yoki muammolar bo'lsa:

1. [Issues](https://github.com/yourusername/gamified-edu-platform/issues) bo'limida savol bering
2. [Discussions](https://github.com/yourusername/gamified-edu-platform/discussions) da muhokama qiling
3. Email yuboring: support@example.com

---

## ⭐ Agar loyiha yoqtirgan bo'lsa

GitHub'da star ⭐ qo'yib qo'ying!

**O'rganishingiz va rivojlantirishingiz uchun omad! 🚀**
