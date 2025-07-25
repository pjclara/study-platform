<?php

use App\Http\Controllers\StudyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::resource('studies', StudyController::class);
    Route::post('studies/{study}/variables', [\App\Http\Controllers\StudyController::class, 'storeVariable'])->name('studies.variables.store');
    Route::put('studies/{study}/variables/{variable}', [\App\Http\Controllers\StudyController::class, 'updateVariable'])->name('studies.variables.update');
    Route::delete('studies/{study}/variables/{variable}', [\App\Http\Controllers\StudyController::class, 'deleteVariable'])->name('studies.variables.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
