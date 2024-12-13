<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TenantController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::get('/tenants', [TenantController::class, 'index']);
    Route::post('/tenants', [TenantController::class, 'store']);
    Route::get('room-statistics', [RoomController::class, 'getRoomStatistics']);
    Route::get('rooms', [RoomController::class, 'getRooms']);
    Route::get('/vacant-rooms', [RoomController::class, 'getVacantRooms']);
    Route::get('/rooms/{id}/edit', [RoomController::class, 'editRoom']);
    Route::put('/rooms/{id}', [RoomController::class, 'updateRoom']);
    Route::put('/rooms/{roomNumber}/status', [RoomController::class, 'updateRoomStatus']);
    Route::delete('/rooms/{id}', [RoomController::class, 'deleteRoom']);
    Route::post('add-room', [RoomController::class, 'addRoom']);  
    Route::post('logout', [AuthController::class, 'logout']);
});
