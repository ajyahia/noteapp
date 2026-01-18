# دليل نشر Laravel على السيرفر

## المشكلة: 404 عند الوصول إلى `/api`

إذا كنت تحصل على 404 عند الوصول إلى `https://noteapp.foursw.com/api`، تأكد من التالي:

## 1. إعدادات DocumentRoot

**في Apache:**
- يجب أن يشير `DocumentRoot` إلى مجلد `backend/public`
- مثال: إذا كان المشروع في `/home/username/public_html/noteapp/backend/public`

**في Nginx:**
```nginx
server {
    listen 80;
    server_name noteapp.foursw.com;
    root /path/to/noteapp/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 2. التحقق من ملف .htaccess

تأكد من وجود ملف `.htaccess` في `backend/public/.htaccess` وأنه يحتوي على:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

## 3. إعدادات ملف .env

تأكد من أن ملف `.env` يحتوي على:

```env
APP_NAME="Note App"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://noteapp.foursw.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## 4. الأذونات (Permissions)

تأكد من أن المجلدات التالية قابلة للكتابة:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## 5. مسح الـ Cache

بعد رفع الملفات، قم بتنفيذ:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 6. اختبار API

بعد الإعداد، جرب الوصول إلى:
- `https://noteapp.foursw.com/api` - يجب أن يعرض رسالة JSON
- `https://noteapp.foursw.com/api/login` - endpoint تسجيل الدخول

## 7. استكشاف الأخطاء

إذا استمرت المشكلة:

1. **تحقق من logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **تحقق من أن mod_rewrite مفعل في Apache:**
   ```bash
   a2enmod rewrite
   service apache2 restart
   ```

3. **تحقق من PHP version:**
   - Laravel 11 يحتاج PHP 8.2 أو أحدث

4. **تحقق من Composer dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

## ملاحظات مهمة:

- تأكد من رفع جميع ملفات Laravel (بما في ذلك `vendor`, `storage`, `bootstrap/cache`)
- لا ترفع ملف `.env.example` - استخدم `.env` الفعلي
- تأكد من أن `APP_KEY` تم توليده: `php artisan key:generate`
