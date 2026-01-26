<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم المسؤول
        User::create([
            'username' => 'admin',
            'password' => Hash::make('admin'),
            'plain_password' => 'admin',
        ]);

        // إنشاء المستخدم jimy
        $user = User::create([
            'username' => 'jimy',
            'password' => Hash::make('jimy'),
            'plain_password' => 'jimy',
        ]);

        // إنشاء ملاحظات تجريبية
        $notes = [
            [
                'title' => 'مرحباً بك في نظام الملاحظات',
                'content' => 'هذه ملاحظة تجريبية لتوضيح كيفية عمل النظام.',
                'blocks' => [
                    [
                        ['type' => 'text', 'content' => 'نظام الملاحظات العربي هو تطبيق متطور لإدارة أفكارك.'],
                        ['type' => 'quote', 'content' => 'العلم صيد والكتابة قيده', 'color' => '#3b82f6'],
                        ['type' => 'text', 'content' => 'يمكنك إضافة تعليقات على أي كلمة في وضع القراءة.']
                    ]
                ],
                'comments' => [
                    '0-0-0' => [
                        'title' => 'ملاحظة',
                        'content' => 'كلمة نظام هي كلمة افتتاحية.',
                        'color' => '#3b82f6'
                    ]
                ],
                'date' => now()->toDateString(),
            ],
            [
                'title' => 'ملاحظة عن التطوير',
                'content' => 'هذه ملاحظة ثانية تحتوي على معلومات عن التطوير.',
                'blocks' => [
                    [
                        ['type' => 'text', 'content' => 'Laravel هو إطار عمل PHP قوي وسهل الاستخدام.'],
                        ['type' => 'text', 'content' => 'React هو مكتبة JavaScript لبناء واجهات المستخدم.'],
                    ],
                    [
                        ['type' => 'quote', 'content' => 'الكود النظيف هو الكود الذي يسهل قراءته وفهمه', 'color' => '#10b981'],
                        ['type' => 'text', 'content' => 'يجب دائماً كتابة كود نظيف ومنظم.'],
                    ]
                ],
                'comments' => [],
                'date' => now()->subDay()->toDateString(),
            ],
            [
                'title' => 'قائمة المهام',
                'content' => 'قائمة بالمهام اليومية.',
                'blocks' => [
                    [
                        ['type' => 'text', 'content' => 'المهام المطلوبة:'],
                        ['type' => 'text', 'content' => '1. إكمال تطوير الواجهة الخلفية'],
                        ['type' => 'text', 'content' => '2. ربط الواجهة الأمامية مع الخلفية'],
                        ['type' => 'text', 'content' => '3. اختبار النظام بالكامل'],
                    ]
                ],
                'comments' => [
                    '0-1-0' => [
                        'title' => 'هام',
                        'content' => 'هذه مهمة ذات أولوية عالية',
                        'color' => '#ef4444'
                    ]
                ],
                'date' => now()->subDays(2)->toDateString(),
            ],
        ];

        foreach ($notes as $noteData) {
            Note::create([
                'user_id' => $user->id,
                'title' => $noteData['title'],
                'content' => $noteData['content'],
                'blocks' => $noteData['blocks'],
                'comments' => $noteData['comments'],
                'date' => $noteData['date'],
            ]);
        }
    }
}
