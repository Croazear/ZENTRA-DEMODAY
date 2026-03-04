import React, { useState } from "react";
import {
  Warehouse,
  Package,
  ArrowDownUp,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ClipboardCheck,
  Search,
  Filter,
} from "lucide-react";
import { MOCK_WAREHOUSES, MOCK_PRODUCTS, MOCK_MOVEMENTS } from "../mockData";

type TabType = "overview" | "products" | "movements";

const WarehouseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const totalCapacity = MOCK_WAREHOUSES.reduce((s, w) => s + w.capacity, 0);
  const totalUsed = MOCK_WAREHOUSES.reduce((s, w) => s + w.usedCapacity, 0);
  const totalProducts = MOCK_PRODUCTS.reduce((s, p) => s + p.quantity, 0);
  const lowStockProducts = MOCK_PRODUCTS.filter(
    (p) => p.quantity <= p.minQuantity,
  );
  const outOfStock = MOCK_PRODUCTS.filter((p) => p.quantity === 0);

  const categories = ["all", ...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "Przyjęcie":
        return <TrendingDown size={14} className="text-emerald-500" />;
      case "Wydanie":
        return <TrendingUp size={14} className="text-red-500" />;
      case "Przesunięcie":
        return <ArrowDownUp size={14} className="text-blue-500" />;
      case "Zwrot":
        return <RotateCcw size={14} className="text-amber-500" />;
      case "Inwentaryzacja":
        return <ClipboardCheck size={14} className="text-violet-500" />;
      default:
        return null;
    }
  };

  const getMovementBadgeClass = (type: string) => {
    switch (type) {
      case "Przyjęcie":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Wydanie":
        return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Przesunięcie":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Zwrot":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Inwentaryzacja":
        return "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
      default:
        return "";
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Przegląd", icon: <Warehouse size={16} /> },
    { id: "products", label: "Produkty", icon: <Package size={16} /> },
    {
      id: "movements",
      label: "Ruchy magazynowe",
      icon: <ArrowDownUp size={16} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Magazyny"
          value={MOCK_WAREHOUSES.length.toString()}
          sub={`${MOCK_WAREHOUSES.filter((w) => w.status === "Aktywny").length} aktywne`}
          color="cyan"
        />
        <StatCard
          label="Produktów na stanie"
          value={totalProducts.toLocaleString("pl")}
          sub={`${MOCK_PRODUCTS.length} pozycji`}
          color="emerald"
        />
        <StatCard
          label="Wykorzystanie"
          value={`${Math.round((totalUsed / totalCapacity) * 100)}%`}
          sub={`${totalUsed.toLocaleString("pl")} / ${totalCapacity.toLocaleString("pl")} j.m.`}
          color="blue"
        />
        <StatCard
          label="Niski stan"
          value={lowStockProducts.length.toString()}
          sub={`${outOfStock.length} brak na stanie`}
          color="red"
          isAlert={lowStockProducts.length > 0}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MOCK_WAREHOUSES.map((wh) => {
            const utilization = Math.round(
              (wh.usedCapacity / wh.capacity) * 100,
            );
            const isHigh = utilization > 90;
            return (
              <div
                key={wh.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm dark:text-white">
                      {wh.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{wh.location}</p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      wh.status === "Aktywny"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : wh.status === "Konserwacja"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {wh.status}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Wykorzystanie</span>
                    <span
                      className={`font-bold ${isHigh ? "text-red-500" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      {utilization}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isHigh ? "bg-red-500" : utilization > 60 ? "bg-amber-500" : "bg-cyan-500"}`}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {wh.usedCapacity.toLocaleString("pl")} /{" "}
                    {wh.capacity.toLocaleString("pl")} j.m.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>
                    Kierownik:{" "}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {wh.manager}
                    </strong>
                  </span>
                  <span>
                    {
                      MOCK_PRODUCTS.filter((p) => p.warehouseId === wh.id)
                        .length
                    }{" "}
                    produktów
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Szukaj produktu lub SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat === "all" ? "Wszystkie" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Produkt
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    SKU
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Magazyn
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Stan
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Min.
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Cena netto
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isLow = p.quantity > 0 && p.quantity <= p.minQuantity;
                  const isOut = p.quantity === 0;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-semibold dark:text-white">
                            {p.name}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {p.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {p.warehouseName}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${isOut ? "text-red-500" : isLow ? "text-amber-500" : "dark:text-white"}`}
                      >
                        {p.quantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-400">
                        {p.minQuantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-xs dark:text-slate-300">
                        {p.priceNet.toLocaleString("pl")} zł
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle size={10} /> Brak
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertTriangle size={10} /> Niski
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "movements" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Data
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Typ
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Produkt
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Ilość
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Skąd / Dokąd
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Operator
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Uwagi
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MOVEMENTS.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {m.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getMovementBadgeClass(m.type)}`}
                      >
                        {getMovementIcon(m.type)} {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold dark:text-white text-xs">
                        {m.productName}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400">
                        {m.sku}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-bold text-xs ${m.type === "Wydanie" ? "text-red-500" : m.type === "Przyjęcie" || m.type === "Zwrot" ? "text-emerald-500" : "dark:text-white"}`}
                    >
                      {m.type === "Wydanie" ? "-" : "+"}
                      {m.quantity}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {m.warehouseFrom && <span>Z: {m.warehouseFrom}</span>}
                      {m.warehouseFrom && m.warehouseTo && <br />}
                      {m.warehouseTo && <span>Do: {m.warehouseTo}</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {m.operator}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                      {m.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  color: string;
  isAlert?: boolean;
}> = ({ label, value, sub, color, isAlert }) => {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border ${isAlert ? "border-red-200 dark:border-red-800/50" : "border-slate-200 dark:border-slate-800"} p-5`}
    >
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p
        className={`text-2xl font-black ${colorMap[color]?.split(" ").filter((c) => c.startsWith("text-"))[0] || "dark:text-white"}`}
      >
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
};

export default WarehouseView;
