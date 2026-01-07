"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Loader2,
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  History,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getOrdersWh, delOrder } from "@/services/ordersServices";

const fetchOrders = async () => {
  return getOrdersWh([{ field: "status", op: "!=", val: "Delivered" }]);
};

export default function ManageOrdersPage() {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {},
  );

  const {
    data: orders,
    error,
    isLoading,
    isValidating,
  } = useSWR("admin/orders", fetchOrders, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Delete this order? This action cannot be undone."))
      return;

    try {
      await delOrder(orderId);
      mutate("admin/orders");
      toast.success("Order deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (isLoading)
    return (
      <div className="h-[70vh] w-full flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
          Loading Database...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ORDER <span className="text-blue-600">MANAGEMENT</span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase tracking-wider">
                System Logistics & Fulfillment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={
                  `/manageOrder/shipped/${new Date().toISOString().slice(0, 7)}` as any
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-900/30"
              >
                <History size={16} />
                <span className="hidden md:inline">Logs</span>
              </Link>
              <button
                onClick={() => mutate("admin/orders")}
                disabled={isValidating}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl disabled:opacity-50"
              >
                <RefreshCcw
                  size={18}
                  className={cn(isValidating && "animate-spin")}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-2 py-8">
        <div className="grid gap-3">
          {orders?.map((order) => {
            const isExpanded = expandedOrders[order.id];
            const totalItems = order.productsList.reduce(
              (sum, p) => sum + (Number(p.p_qu) || 0),
              0,
            );

            return (
              <div
                key={order.id}
                className={cn(
                  "bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-200 overflow-hidden",
                  isExpanded
                    ? "ring-2 ring-blue-600/20 border-blue-600/50 shadow-xl"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleOrder(order.id)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-2.5 rounded-xl shrink-0",
                        isExpanded
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400",
                      )}
                    >
                      <Package size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100",
                          )}
                        >
                          {order.status || "Pending"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          ID: {order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                          {order.totalAmount.toLocaleString()}{" "}
                          <span className="text-[10px] text-blue-600">SDG</span>
                        </p>
                        <span className="text-[10px] font-black text-slate-400 uppercase">
                          / {totalItems} Units
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/manageOrder/${order.id}` as any}
                        className="sm:block text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Settings2 size={16} />
                      </Link>
                      <div className="text-slate-300">
                        {isExpanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-slate-50/50 dark:bg-slate-950/50 border-t dark:border-slate-800">
                    <div className="py-4 space-y-2">
                      {order.productsList.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate">
                              {p.p_name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                              QTY: {p.p_qu} @{" "}
                              {Number(p.p_cost).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs font-black text-blue-600">
                            {(
                              Number(p.p_cost) * Number(p.p_qu)
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t dark:border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.id);
                        }}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        [ Terminate Order ]
                      </button>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        Authorized Transaction
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {orders?.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Package size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Queue Empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
