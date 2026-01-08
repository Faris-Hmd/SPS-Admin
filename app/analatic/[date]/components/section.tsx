import { ordersRef, productsRef, usersRef } from "@/lib/firebase";
import { getCountFromServer } from "firebase/firestore";
import { Package, ShoppingCart, Users } from "lucide-react";

// This function runs only on the server
async function getTerminalStats() {
  // We use Promise.all for speed
  const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
    getCountFromServer(ordersRef),
    getCountFromServer(productsRef),
    getCountFromServer(usersRef),
  ]);

  return {
    orders: ordersSnap.data().count,
    products: productsSnap.data().count,
    customers: usersSnap.data().count,
  };
}
export default async function SectionCards() {
  const data = await getTerminalStats();
  console.log("getTerminalStats");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        icon={<Package size={18} />}
        label="Digital Assets"
        value={data.products}
        color="text-blue-600 dark:text-blue-400"
        bg="bg-blue-50 dark:bg-blue-900/20"
      />
      <MetricCard
        icon={<ShoppingCart size={18} />}
        label="Total Orders"
        value={data.orders}
        color="text-emerald-600 dark:text-emerald-400"
        bg="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <MetricCard
        icon={<Users size={18} />}
        label="Active Customers"
        value={data.customers}
        color="text-violet-600 dark:text-violet-400"
        bg="bg-violet-50 dark:bg-violet-900/20"
      />
    </div>
  );
}

function MetricCard({ icon, label, value, color, bg }: any) {
  return (
    <div className="flex items-center gap-4 p-3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 last:border-0">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] truncate">
          {label}
        </p>
        <h4 className="text-xl font-black text-slate-800 dark:text-white font-mono tracking-tighter">
          {value.toLocaleString()}
        </h4>
      </div>
    </div>
  );
}
