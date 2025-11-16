<?php

namespace App\Http\Controllers;

use App\Models\User; 
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login()
    {
        // Menampilkan halaman login
        return inertia('auth/LoginPage');
    }

    public function postLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Validasi sederhana
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Redirect ke halaman IndexPage (todos)
            return redirect()->route('todos.index')->with('success', 'Login berhasil!');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.login');
    }

    // Register
    // -------------------------------
    public function register()
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }

        $data = [];
        return Inertia::render('auth/RegisterPage', $data);
    }

    public function postRegister(Request $request)
    {
        // Validasi input pendaftaran
        $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
        ]);

        // Daftarkan user
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Redirect ke halaman login dengan pesan sukses
        return redirect()->route('auth.login')->with('success', 'Pendaftaran berhasil dilakukan! Silakan login.');
    }

}
