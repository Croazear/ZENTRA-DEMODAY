import React from "react";
import {
  LayoutDashboard,
  FileText,
  Bot,
  PlusCircle,
  Settings,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { ViewType } from "@/types";
import Logo from "./Logo";

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "documents", label: "Dokumenty", icon: FileText },
    { id: "calendar", label: "Kalendarz", icon: CalendarIcon },
    { id: "finances", label: "Finanse", icon: TrendingUp },
    { id: "warehouse", label: "Magazyny", icon: Warehouse },
    { id: "ai-assistant", label: "Asystent AI", icon: Bot },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 h-screen border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 mb-2">
        <Logo className="h-9" />
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <div className="flex items-center gap-3 text-sm">
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
            {currentView === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setView("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            currentView === "settings"
              ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
          }`}
        >
          <Settings size={18} />
          <span className="text-sm">Ustawienia</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
