<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DeliveryAnalyticsController;

Route::get('/kpis', [DeliveryAnalyticsController::class, 'kpis']);
Route::get('/weather-stats', [DeliveryAnalyticsController::class, 'weatherStats']);
Route::get('/vehicle-stats', [DeliveryAnalyticsController::class, 'vehicleStats']);
Route::get('/priority-stats', [DeliveryAnalyticsController::class, 'priorityStats']);
Route::get('/weekday-delay', [DeliveryAnalyticsController::class, 'weekdayDelay']);
Route::get('/week-total-delay', [DeliveryAnalyticsController::class, 'weekTotalDelay']);
Route::get('/month-total-delay', [DeliveryAnalyticsController::class, 'monthTotalDelay']);
Route::get('/rating-summary', [DeliveryAnalyticsController::class, 'ratingSummary']);