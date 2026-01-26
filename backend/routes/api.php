<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShareController;
use Illuminate\Support\Facades\Route;

// API health check
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working',
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/login', [AdminController::class, 'login']);

// Public share route (no auth required)
Route::get('/shared/{token}', [ShareController::class, 'getSharedNote']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);

    Route::put('/profile', [ProfileController::class, 'update']);

    // Share routes
    Route::post('/notes/{id}/share', [ShareController::class, 'createShare']);
    Route::post('/shared/{token}/import', [ShareController::class, 'importSharedNote']);
    Route::delete('/notes/{id}/share', [ShareController::class, 'deleteShare']);

    // Admin routes
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{id}/password', [AdminController::class, 'updateUserPassword']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
});
