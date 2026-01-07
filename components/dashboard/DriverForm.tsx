"use client";

import React, { useState } from "react";
import { Driver } from "@/types/userTypes";
import {
  Truck,
  Phone,
  User,
  Save,
  ChevronLeft,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDriver, upDriver } from "@/services/driversServices";

interface DriverFormProps {
  initialData?: Driver;
  isEdit?: boolean;
}

export function DriverForm({ initialData, isEdit }: DriverFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Driver, "id">>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    vehicle: initialData?.vehicle || "",
    status: initialData?.status || "Active",
    currentOrders: initialData?.currentOrders || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        const res = await upDriver(initialData.id, formData);
        if (res.success) {
          toast.success("Driver profile updated");
          router.push("/drivers" as any);
          router.refresh();
        } else {
          toast.error(res.error || "Update failed");
        }
      } else {
        const res = await addDriver(formData);
        if (res.success) {
          toast.success("New driver deployed");
          router.push("/drivers" as any);
          router.refresh();
        } else {
          toast.error(res.error || "Onboarding failed");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      {/* Sticky Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">
                  <ShieldCheck size={10} />
                  System Protocol
                </div>
                <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {isEdit ? "Edit Operative" : "New Operative"}
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Network Active
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-8 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Operator Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  required
                  type="text"
                  placeholder="e.g. Ahmed Ali"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Login Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Login Identifier (Email)
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  required
                  type="email"
                  placeholder="e.g. ahmed@network.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Secure Contact
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="+249..."
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Vehicle */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Vehicle Model / ID
                </label>
                <div className="relative">
                  <Truck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Toyota - KRT 1234"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    value={formData.vehicle}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Deployment Status
              </label>
              <div className="flex gap-2">
                {["Active", "Inactive"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: status as any })
                    }
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.status === status
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-black py-4.5 rounded-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {loading
                ? "Syncing Protocols..."
                : isEdit
                  ? "Commit Changes"
                  : "Deploy Operative"}
            </button>
          </div>
        </form>

        <footer className="mt-12 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
          Secure Admin Channel 2026 • Sudan Operations
        </footer>
      </div>
    </div>
  );
}
