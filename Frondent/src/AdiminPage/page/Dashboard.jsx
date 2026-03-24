import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, Users, Package, IndianRupee, 
  Clock, UserCheck, UserX, BoxIcon, 
  AlertTriangle, ShieldCheck, ChevronRight
} from "lucide-react";
import { getDashboardStats } from "../../api/api";

function Dashboard() {
  const [sum, setSum] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    getDashboardStats(token)
      .then((res) => setSum(res.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="min-h-screen mt-16 p-6 lg:p-10 bg-[#f4f7fe]">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Main Dashboard</h1>
          <p className="text-slate-500 font-medium">Global system performance and resource allocation.</p>
        </div>

        {/* --- ROW 1: THE HEROES --- */}
        {/* Change: grid-cols-2 for mobile, lg:grid-cols-4 for desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          <HeroCard 
            title="Revenue" 
            value={`₹${(sum?.revenue ?? 0).toLocaleString()}`} 
            icon={IndianRupee} 
            color="bg-indigo-600" 
          />
          <HeroCard 
            title="Users" 
            value={sum?.total_users ?? 0} 
            icon={Users} 
            color="bg-emerald-500" 
          />
          <HeroCard 
            title="Orders" 
            value={sum?.total_orders ?? 0} 
            icon={ShoppingBag} 
            color="bg-blue-500" 
          />
          <HeroCard 
            title="Products" 
            value={sum?.total_products ?? 0} 
            icon={Package} 
            color="bg-orange-500" 
          />
        </div>

        {/* --- ROW 2: DETAILED BREAKDOWN LISTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <DetailList title="Order Status" icon={<ShoppingBag size={18}/>}>
            <ListItem 
              label="Pending" 
              value={sum?.total_pendingOrders} 
              icon={Clock} 
              colorName="amber" 
              percentage={(sum?.total_pendingOrders / (sum?.total_orders || 1)) * 100}
            />
            <ListItem 
              label="Confirmed" 
              value={sum?.total_confromOrders} 
              icon={ShieldCheck} 
              colorName="emerald" 
              percentage={(sum?.total_confromOrders / (sum?.total_orders || 1)) * 100}
            />
          </DetailList>

          <DetailList title="User Management" icon={<Users size={18}/>}>
            <ListItem 
              label="Active" 
              value={sum?.total_activeUsers} 
              icon={UserCheck} 
              colorName="blue" 
              percentage={(sum?.total_activeUsers / (sum?.total_users || 1)) * 100}
            />
            <ListItem 
              label="Blocked" 
              value={sum?.total_blockUsers} 
              icon={UserX} 
              colorName="rose" 
              percentage={(sum?.total_blockUsers / (sum?.total_users || 1)) * 100}
            />
          </DetailList>

          <DetailList title="Inventory Health" icon={<Package size={18}/>}>
            <ListItem 
              label="In Stock" 
              value={sum?.total_activeProducts} 
              icon={BoxIcon} 
              colorName="indigo" 
              percentage={(sum?.total_activeProducts / (sum?.total_products || 1)) * 100}
            />
            <ListItem 
              label="Out of Stock" 
              value={sum?.total_nonActiveProducts} 
              icon={AlertTriangle} 
              colorName="red" 
              percentage={(sum?.total_nonActiveProducts / (sum?.total_products || 1)) * 100}
            />
          </DetailList>

        </div>
      </div>
    </div>
  );
}

// --- High Impact Hero Cards ---
function HeroCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-white flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 hover:shadow-md transition-all duration-300 text-center lg:text-left">
      <div className={`${color} p-3 lg:p-4 rounded-xl lg:rounded-2xl text-white shadow-lg mb-3 lg:mb-0`}>
        <Icon size={24} className="lg:w-7 lg:h-7" />
      </div>
      <div>
        <p className="text-slate-400 text-[10px] lg:text-sm font-bold uppercase tracking-wider">{title}</p>
        <h2 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight">{value}</h2>
      </div>
    </div>
  );
}

// --- Detail List Container ---
function DetailList({ title, icon, children }) {
  return (
    <div className="bg-white rounded-4xl p-7 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
          <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// --- Fixed Detail List Item with Progress ---
function ListItem({ label, value, icon: Icon, colorName, percentage }) {
  const safePercent = isNaN(percentage) ? 0 : Math.min(percentage, 100);
  
  // Tailwind map to ensure classes are generated correctly
  const theme = {
    amber: { text: "text-amber-500", bg: "bg-amber-500" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500" },
    blue: { text: "text-blue-500", bg: "bg-blue-500" },
    rose: { text: "text-rose-500", bg: "bg-rose-500" },
    indigo: { text: "text-indigo-500", bg: "bg-indigo-500" },
    red: { text: "text-red-500", bg: "bg-red-500" },
  }[colorName] || { text: "text-slate-500", bg: "bg-slate-500" };

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <Icon size={18} className={theme.text} />
          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-900">{value ?? 0}</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-in-out ${theme.bg}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;