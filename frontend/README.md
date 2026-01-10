
# دليل تطوير الواجهة الخلفية (Backend Guide for Cursor AI)

هذا المشروع حالياً عبارة عن واجهة أمامية (Frontend) مبنية بـ React. المهمة المطلوبة هي بناء **Laravel API** متكامل ليعمل كخلفية لهذا النظام.

## 1. تعليمات لـ Cursor (Instructions)
عزيزي Cursor، يرجى اتباع المواصفات التالية لبناء الـ Backend:

### أ. قاعدة البيانات (Database Schema)
نحتاج إلى الجداول التالية:

1. **Users Table:**
   - `id`, `username` (unique), `password`, `remember_token`, `timestamps`.

2. **Notes Table:**
   - `id` (UUID or String), `user_id` (foreign key), `title`, `content` (short preview), `blocks` (JSON - لتخزين مصفوفة الصفحات والمكعبات), `comments` (JSON - لتخزين Record الكلمات المعلق عليها), `date` (String or Date), `timestamps`.

### ب. مسارات الـ API (Required Endpoints)
يجب أن تكون جميع الاستجابات بصيغة JSON:

- **Auth:**
  - `POST /api/login`: التحقق من المستخدم وإرجاع (Token + User Data).
  - `POST /api/register`: إنشاء حساب جديد.
  - `POST /api/logout`: إبطال التوكن.

- **Notes:**
  - `GET /api/notes`: جلب ملاحظات المستخدم المسجل فقط.
  - `POST /api/notes`: حفظ ملاحظة جديدة (title, blocks).
  - `PUT /api/notes/{id}`: تحديث ملاحظة موجودة.
  - `DELETE /api/notes/{id}`: حذف ملاحظة.

- **Comments & Content:**
  - `POST /api/notes/{id}/comments`: تحديث حقل الـ comments في الملاحظة (يستقبل key و comment object).

- **Profile:**
  - `PUT /api/profile`: تحديث اسم المستخدم أو كلمة المرور.

### ج. المتطلبات التقنية
- استخدام **Laravel Sanctum** للمصادقة (Authentication).
- تفعيل الـ **CORS** للسماح لـ React (غالباً `localhost:3000` أو المنفذ الذي تعمل عليه) بالوصول للـ API.
- التأكد من أن حقول `blocks` و `comments` في موديل `Note` يتم تحويلها تلقائياً (Casts) إلى `array`.

## 2. كيفية الربط بين الفرونت والباك (Linking Instructions)

لإتمام عملية الربط، يجب تعديل ملف `App.tsx` في الفرونت إند:
1. استبدال الـ `localStorage` بـ `fetch` أو `axios` لنداء الـ API الجديد.
2. استخدام `useEffect` لجلب البيانات عند تحميل التطبيق.
3. تخزين الـ `Token` المستلم من Laravel في `localStorage` وإرساله في الـ `Headers` مع كل طلب (`Authorization: Bearer {token}`).

## 3. خطوات التشغيل (Backend Setup)
1. قم بإنشاء مشروع Laravel جديد: `composer create-project laravel/laravel backend`.
2. قم بإعداد ملف `.env` وربطه بقاعدة بيانات (MySQL/PostgreSQL).
3. قم بتنفيذ الهجرات: `php artisan migrate`.
4. ابدأ السيرفر: `php artisan serve`.

---
**ملاحظة لمطور الـ Frontend:** تأكد من تغيير `BASE_URL` في إعدادات Axios الخاصة بك ليشير إلى `http://localhost:8000/api`.
