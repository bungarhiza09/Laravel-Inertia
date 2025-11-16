import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }) {
  const onLogout = () => {
    router.get("/auth/logout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-gray-800">
              TickTick
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Bungkus children dalam card putih */}
        <div className="bg-white rounded-xl shadow p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-6">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          &copy; 2025 Bunga Rhiza Sitorus. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
