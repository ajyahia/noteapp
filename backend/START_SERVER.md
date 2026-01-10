# تعليمات تشغيل الخادم

## خطوات التشغيل:

1. **افتح Terminal في مجلد backend:**
   ```bash
   cd backend
   ```

2. **تأكد من أن قاعدة البيانات جاهزة:**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

3. **شغل الخادم:**
   ```bash
   php artisan serve
   ```
   
   الخادم سيعمل على: `http://localhost:8000`

4. **في terminal آخر، شغل الواجهة الأمامية:**
   ```bash
   cd frontend
   npm run dev
   ```

## بيانات تسجيل الدخول:
- **Username:** jimy
- **Password:** jimy

## ملاحظات:
- تأكد من أن الخادم Laravel يعمل قبل محاولة تسجيل الدخول
- إذا ظهرت رسالة "Failed to fetch"، تأكد من أن الخادم يعمل على المنفذ 8000
- تأكد من أن قاعدة البيانات متصلة وصحيحة في ملف `.env`
