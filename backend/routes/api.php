<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TokenController;

Route::get('/', function () {
    return response()->json(['message' => 'API is working']);
});

Route::get('/token-prices', [TokenController::class, 'getTokenPrices']);
