# Last Burger — نسخة Next.js

تحويل كامل للمشروع الأصلي (React+Vite + Express) إلى **Next.js**، بنفس الديزاين (Dark theme + orange accent) ونفس الأنيميشن (Framer Motion)، مع تحديث اسم البراند للوجو الحقيقي بتاع **Last Burger**.

---

## 🗂️ هيكل المشروع

```
burgerhub-nextjs/
├── app/
│   ├── (site)/                    ← الصفحات العامة (فيها Navbar)
│   │   ├── page.jsx               ← Home
│   │   ├── menu/page.jsx          ← المنيو (بحث + فلترة)
│   │   ├── product/[id]/page.jsx  ← تفاصيل المنتج
│   │   ├── cart/page.jsx          ← السلة
│   │   ├── checkout/page.jsx      ← إتمام الطلب (فيها رقم بديل اختياري)
│   │   ├── track/page.jsx         ← تتبع الأوردر
│   │   ├── offers/page.jsx        ← العروض
│   │   ├── about/page.jsx         ← عننا
│   │   ├── contact/page.jsx       ← تواصل معانا (واتساب/فيسبوك/انستجرام/تيك توك حقيقيين)
│   │   └── layout.jsx             ← بيلف الصفحات دي بالـ Navbar
│   ├── admin/
│   │   ├── page.jsx               ← تسجيل دخول الأدمن (/admin)
│   │   └── dashboard/page.jsx     ← لوحة تحكم الأدمن (/admin/dashboard)
│   ├── setup-x7k9m2/page.jsx      ← صفحة إنشاء حساب أدمن (محمية بمفتاح سري)
│   ├── api/                       ← الباك إند (Route Handlers)
│   │   ├── auth/{register,login}/route.js
│   │   ├── products/route.js + [id]/route.js
│   │   └── orders/route.js + [id]/route.js
│   ├── layout.jsx                 ← Root layout (CartProvider + Toaster)
│   └── globals.css
├── components/Navbar.jsx          ← فيه لوجو Last Burger الحقيقي
├── context/CartContext.jsx
├── lib/
│   ├── db.js                      ← اتصال MongoDB
│   ├── auth.js                    ← JWT (generateToken + protect)
│   └── api/{axios,products,orders,admin}.js
├── models/{Product.js, Order.js, Admin.js}
├── data/products.js
├── public/logo.jpeg               ← لوجو Last Burger
├── .env.example
└── .gitignore
```

---

## ⚙️ التقنيات المستخدمة

| تقنية | الاستخدام |
|---|---|
| Next.js 14 (App Router) | الفرونت إند والباك إند في مشروع واحد |
| React + Tailwind CSS | الواجهة والتصميم |
| Framer Motion | الأنيميشن |
| React Hot Toast | الإشعارات |
| Lucide React | الأيقونات |
| MongoDB Atlas + Mongoose | قاعدة البيانات |
| JWT + bcryptjs | المصادقة وتشفير الباسورد |

---

## 🔑 ملف `.env.local` المطلوب

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/burgersite?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_SETUP_KEY=your_secret_setup_key_here
```

> ⚠️ الملف ده مش بيترفع على GitHub (موجود في `.gitignore`). خليك حريص ما تشاركه مع حد.

---

## 🔌 الـ APIs الكاملة

### المصادقة (Auth)
| Method | Endpoint | الوصف | حماية |
|---|---|---|---|
| POST | `/api/auth/register` | تسجيل أدمن جديد | لا |
| POST | `/api/auth/login` | تسجيل دخول الأدمن | لا |

### المنتجات (Products)
| Method | Endpoint | الوصف | حماية |
|---|---|---|---|
| GET | `/api/products` | جلب كل المنتجات | لا |
| GET | `/api/products?category=burgers` | فلترة بالكاتيجوري | لا |
| GET | `/api/products/:id` | جلب منتج واحد | لا |
| POST | `/api/products` | إضافة منتج (بيدعم array) | ✅ أدمن |
| PUT | `/api/products/:id` | تعديل منتج | ✅ أدمن |
| DELETE | `/api/products/:id` | حذف منتج | ✅ أدمن |

### الأوردرات (Orders)
| Method | Endpoint | الوصف | حماية |
|---|---|---|---|
| POST | `/api/orders` | إنشاء أوردر جديد | لا |
| GET | `/api/orders` | جلب كل الأوردرات | ✅ أدمن |
| GET | `/api/orders/:id` | تتبع أوردر برقمه | لا |
| PATCH | `/api/orders/:id` | تحديث حالة الأوردر | ✅ أدمن |

**حالات الأوردر:** `pending` → `preparing` → `out_for_delivery` → `delivered`

**الحماية (✅ أدمن):** لازم تبعت Header:
```
Authorization: Bearer <token>
```
الـ token ده بتاخده من الرد بتاع `/api/auth/login`.

---

## 👤 الأدمن — ازاي توصله بالظبط

### 1. إنشاء أول حساب أدمن (مرة واحدة بس)

روح على صفحة الـ **setup** المحمية، اللي مفيهاش لينك في أي مكان في الموقع:

```
http://localhost:3000/setup-x7k9m2?key=<NEXT_PUBLIC_SETUP_KEY بتاعك>
```

بعد الـ Deploy:
```
https://<دومين المشروع>/setup-x7k9m2?key=<NEXT_PUBLIC_SETUP_KEY بتاعك>
```

> المفتاح ده هو نفس القيمة اللي حطيتها في `.env.local` (محليًا) أو في Environment Variables على Vercel (بعد الـ Deploy)، تحت اسم `NEXT_PUBLIC_SETUP_KEY`. لو فتحت الرابط من غير المفتاح أو بمفتاح غلط، هيظهرلك "الصفحة دي محمية" بس.

حط إيميل وباسورد (6 حروف على الأقل) واضغط "إنشاء الحساب" — هيسجلك دخول تلقائيًا.

> ⚠️ بعد إنشاء حساب الأدمن، يُفضّل تمسح فولدر `app/setup-x7k9m2/` بالكامل قبل الإطلاق النهائي.

### 2. تسجيل الدخول بعد كده

```
http://localhost:3000/admin
```

حط نفس الإيميل والباسورد، وهتدخل على `/admin/dashboard`.

### 3. لوحة التحكم

من فيها الأدمن يقدر:
- يشوف كل الأوردرات ويغيّر حالتها
- يشوف رقم العميل **والرقم البديل** (لو حطه العميل) عشان يتواصل لو الأساسي مقفول
- يضيف منتج جديد بصورة (رابط أو **رفع من الجهاز** مباشرة مع معاينة كبيرة وحذف)
- يحذف منتج (بعد تأكيد من مودال تأكيد)

---

## 🚀 التشغيل محليًا

```bash
npm install
cp .env.example .env.local
npm run dev
```

الموقع هيشتغل على `http://localhost:3000`.

---

## 🌐 الـ Deployment على Vercel

1. ارفع المشروع على GitHub (تأكد إن `.env.local` مش متضاف).
2. Vercel → New Project → اختار الريبو.
3. في Environment Variables ضيف:
   ```
   MONGO_URI
   JWT_SECRET
   NEXT_PUBLIC_SETUP_KEY
   ```
4. Deploy.
5. استخدم رابط الـ setup بدومين Vercel الجديد لعمل أول حساب أدمن لايف.

---

## 📞 بيانات Last Burger في الموقع

- **واتساب/تليفون:** +20 11 18207465
- **فيسبوك:** facebook.com/share/17f3GPe1mt
- **انستجرام:** instagram.com/last_burger_
- **تيك توك:** tiktok.com/@last_burger_

---

## ✅ الفيتشرز الموجودة

- [x] عرض المنيو مع فلتر وسيرش
- [x] سلة مشتريات + Checkout مع Validation + رقم تليفون بديل اختياري
- [x] تتبع الأوردر بالـ ID
- [x] لوحة تحكم الأدمن (أوردرات + منتجات)
- [x] إضافة منتجات بصورة (رابط أو رفع من الجهاز) مع معاينة وحذف
- [x] تأكيد قبل حذف أي منتج
- [x] JWT Authentication
- [x] صفحة إنشاء أدمن محمية بمسار عشوائي + مفتاح سري
- [x] لوجو وبراند Last Burger الحقيقي في الناف بار وصفحات الأدمن
- [x] روابط السوشيال ميديا الحقيقية في صفحة Contact

## 🔮 فيتشرز ممكن تضيفها مستقبلاً

- [ ] رفع الصور على Cloudinary بدل base64 في الداتابيز
- [ ] Dark/Light Mode toggle
- [ ] نظام Coupons
- [ ] دفع أونلاين (Stripe / Paymob)

---

## ⚠️ تنبيهات أمان

- ملف `.env.local` فيه بيانات حساسة — خليه في `.gitignore` دايمًا.
- صفحة `setup-x7k9m2` لازم تتمسح أو تتحمي أكتر بعد إنشاء أول حساب أدمن.
- لو غيّرت `NEXT_PUBLIC_SETUP_KEY`، حدّثه في كل بيئة (محلي + Vercel) بنفس القيمة.

## Admin Register
[الدومين بتاعك]/setup-x7k9m2?key=[المفتاح بتاع NEXT_PUBLIC_SETUP_KEY]