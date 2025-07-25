<?php

use App\Http\Controllers\DataEntryController;
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
    Route::get('studies/{study}/data-list', [\App\Http\Controllers\StudyController::class, 'dataList'])->name('studies.data-list');
    Route::get('studies/{study}/data-entry', [\App\Http\Controllers\StudyController::class, 'dataEntryForm'])->name('studies.data-entry.form');
    Route::post('studies/{study}/data-entry', [\App\Http\Controllers\StudyController::class, 'storeDataEntry'])->name('studies.data-entry.store');
    Route::get('/studies/{study}/data-entry/{entry}/edit', [StudyController::class, 'editEntry'])->name('studies.data-entry.edit');
    Route::put('/studies/{study}/data-entry/{entry}', [StudyController::class, 'updateEntry'])->name('studies.data-entry.update');
    Route::delete('/studies/{study}/data-entry/{entry}', [StudyController::class, 'deleteEntry'])->name('studies.data-entry.delete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
