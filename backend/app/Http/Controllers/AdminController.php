<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Admin login - Verify admin credentials from database
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        // Check if user exists and is admin
        if (!$user || $user->username !== 'admin') {
            return response()->json([
                'message' => 'بيانات المسؤول غير صحيحة',
                'error' => 'Invalid admin credentials'
            ], 401);
        }

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات المسؤول غير صحيحة',
                'error' => 'Invalid admin credentials'
            ], 401);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Get all users with their notes count
     */
    public function getUsers(Request $request)
    {
        // Verify admin token (in production, you'd check if user is admin)
        $adminUser = $request->user();
        if (!$adminUser || $adminUser->username !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح',
                'error' => 'Unauthorized'
            ], 403);
        }

        $users = User::withCount('notes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'password' => '******', // Masked password - never return actual password
                    'notesCount' => $user->notes_count ?? 0,
                    'joinDate' => $user->created_at->format('Y/m/d'),
                ];
            });

        return response()->json($users);
    }

    /**
     * Create a new user (Admin only)
     */
    public function createUser(Request $request)
    {
        // Verify admin token
        $adminUser = $request->user();
        if (!$adminUser || $adminUser->username !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح',
                'error' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'username' => 'required|string|unique:users,username|max:255',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'تم إنشاء المستخدم بنجاح',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'password' => '******',
                'notesCount' => 0,
                'joinDate' => $user->created_at->format('Y/m/d'),
            ],
        ], 201);
    }

    /**
     * Update user password (Admin only)
     */
    public function updateUserPassword(Request $request, $id)
    {
        // Verify admin token
        $adminUser = $request->user();
        if (!$adminUser || $adminUser->username !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح',
                'error' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user = User::findOrFail($id);

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'تم تحديث كلمة المرور بنجاح',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
        ]);
    }

    /**
     * Delete a user (Admin only)
     */
    public function deleteUser(Request $request, $id)
    {
        // Verify admin token
        $adminUser = $request->user();
        if (!$adminUser || $adminUser->username !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح',
                'error' => 'Unauthorized'
            ], 403);
        }

        $user = User::findOrFail($id);

        // Prevent deleting admin user
        if ($user->username === 'admin') {
            return response()->json([
                'message' => 'لا يمكن حذف حساب المسؤول',
                'error' => 'Cannot delete admin user'
            ], 403);
        }

        // Delete user (notes will be deleted automatically due to cascade)
        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح',
        ]);
    }
}
