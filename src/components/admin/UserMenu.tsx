"use client";

import { useState, useRef, useEffect } from "react";
import { UserCircle, ChevronDown, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton"; // Pastikan path ini benar

type Props = {
  displayName: string;
};

export default function UserMenu({ displayName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors outline-none group"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800 capitalize group-hover:text-blue-700 transition-colors">
            {displayName}
          </p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>

        <div className="bg-gray-100 group-hover:bg-blue-100 p-2 rounded-full text-gray-500 group-hover:text-blue-600 transition-colors">
          <UserCircle className="w-6 h-6" />
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Info Mobile Only (Opsional, muncul kalau di layar kecil) */}
          <div className="px-4 py-3 border-b border-gray-100 md:hidden">
            <p className="text-sm font-bold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">admin@kardinal.com</p>
          </div>

          <div className="p-2">
            {/* Tombol Logout custom styling agar fit di dropdown */}
            <div className="w-full">
              {/* Kita wrap LogoutButton agar bisa di-style ulang atau biarkan default */}
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
