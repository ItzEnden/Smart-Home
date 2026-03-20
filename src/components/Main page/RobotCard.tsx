"use client";
import { Battery, Package, MapPin, Cpu } from "lucide-react";

export function RobotCard() {
  return (
    <section className="h-full flex flex-col rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 shadow-xl shadow-black/40 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Робот</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Автономный агент</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Активен</span>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Current Task - full width */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-3 col-span-2">
          <div className="text-xs text-gray-500 mb-1">Текущая задача</div>
          <div className="text-sm text-white">Сбор банок в прихожей</div>
        </div>

        {/* Battery */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
          <Battery className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Заряд</div>
            <div className="text-sm font-medium text-green-400">73%</div>
          </div>
        </div>

        {/* Cans counter */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
          <Package className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Банок собрано</div>
            <div className="text-sm font-medium text-yellow-400">12 шт.</div>
          </div>
        </div>

        {/* Location - full width */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3 col-span-2">
          <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Местоположение</div>
            <div className="text-sm text-white">Прихожая</div>
          </div>
        </div>
      </div>
    </section>
  );
}
