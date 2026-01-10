# حل مشاكل تشغيل الخادم

## المشكلة: Failed to listen on 127.0.0.1:8000

إذا واجهت هذه المشكلة، جرب الحلول التالية:

### الحل 1: استخدام منفذ مختلف
```bash
php artisan serve --host=0.0.0.0 --port=8080
```

ثم غيّر `BASE_URL` في `frontend/api.ts` إلى:
```typescript
const BASE_URL = 'http://localhost:8080/api';
```

### الحل 2: استخدام localhost بدلاً من 127.0.0.1
```bash
php artisan serve --host=localhost --port=8080
```

### الحل 3: التحقق من Windows Firewall
1. افتح Windows Defender Firewall
2. تأكد من أن PHP مسموح به
3. أو أضف قاعدة جديدة للسماح بالمنفذ 8080

### الحل 4: استخدام XAMPP أو WAMP
إذا استمرت المشكلة، يمكنك استخدام XAMPP أو WAMP:
1. شغّل Apache من XAMPP
2. ضع مشروع Laravel في `htdocs`
3. استخدم `http://localhost/noteapp/backend/public`

### الحل 5: استخدام Laravel Valet (للمستخدمين المتقدمين)
```bash
composer global require laravel/valet
valet install
cd backend
valet link noteapp
```

### ملاحظة:
- تأكد من أن PHP مثبت بشكل صحيح
- تأكد من أن لا يوجد تطبيق آخر يستخدم نفس المنفذ
- جرب إعادة تشغيل الكمبيوتر إذا استمرت المشكلة
