<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/today', function () {
    return view('home');
})->name('today');
Route::get('/past', function () {
    return view('past-news');
})->name('past');
Route::get('/articles', function () {
    return view('articles.index');
})->name('articles');
Route::get('/editorials/{category}', function ($category) {
    return view('editorials.category', compact('category'));
})->name('editorials');
Route::get('/breaking-news', function () {
    return view('breaking-news');
})->name('breaking-news');
Route::get('/subscribe', function () {
    return view('subscribe');
})->name('subscribe');
Route::get('/profile', function () {
    return view('profile');
})->name('profile');
