# حل مشاكل الاتصال بالخادم

## المشكلة: "لا يمكن الاتصال بالخادم"

إذا ظهرت هذه الرسالة بعد رفع الـ dist الجديد، اتبع الخطوات التالية:

### 1. التحقق من أن الباك إند يعمل

افتح المتصفح وجرب الوصول مباشرة إلى:
```
https://noteapp.foursw.com/api
```

**النتائج المتوقعة:**
- ✅ إذا ظهرت رسالة JSON مثل `{"status":"success","message":"API is working"}` → الباك إند يعمل
- ❌ إذا ظهر 404 أو خطأ → الباك إند غير متاح

### 2. التحقق من إعدادات السيرفر

**في لوحة تحكم Hostinger:**
1. تأكد من أن الـ DocumentRoot يشير إلى `backend/public`
2. تأكد من أن ملف `.htaccess` موجود في `backend/public/`
3. تأكد من تفعيل `mod_rewrite` في Apache

### 3. التحقق من ملف .env

تأكد من أن ملف `.env` في الباك إند يحتوي على:
```env
APP_URL=https://noteapp.foursw.com
APP_ENV=production
```

### 4. مسح الـ Cache

قم بتنفيذ هذه الأوامر على السيرفر:
```bash
cd /path/to/backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 5. التحقق من CORS

تأكد من أن ملف `backend/config/cors.php` يحتوي على:
```php
'allowed_origins_patterns' => [
    '#^https?://.*\.foursw\.com$#',
],
```

### 6. التحقق من SSL Certificate

تأكد من أن شهادة SSL صالحة لـ `noteapp.foursw.com`

### 7. اختبار الاتصال من Terminal

```bash
curl https://noteapp.foursw.com/api
```

إذا لم يعمل، جرب:
```bash
curl -k https://noteapp.foursw.com/api
```

### 8. التحقق من Logs

افحص ملفات الـ logs في:
```
backend/storage/logs/laravel.log
```

---

## ملاحظات مهمة:

- تأكد من رفع جميع ملفات الباك إند (بما في ذلك `vendor`, `storage`, `bootstrap/cache`)
- تأكد من أن الأذونات صحيحة: `chmod -R 775 storage bootstrap/cache`
- تأكد من أن PHP version 8.2 أو أحدث
