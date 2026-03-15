"use client";
import Link from "next/link";
import { Camera, User, UserX } from "lucide-react";
import { useFaceRecognition } from "@/hooks/useFaceRecognition";

export function StreetCard() {
  const { lastFace, isUnknown, connected } = useFaceRecognition("esp_street_01");

  const getFaceStatusColor = () => {
    if (lastFace === null) return "text-gray-500";
    if (isUnknown) return "text-amber-500";
    return "text-green-500";
  };

  const getFaceStatusIcon = () => {
    if (lastFace === null) return <Camera className="w-5 h-5" />;
    if (isUnknown) return <UserX className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const getFaceStatusText = () => {
    if (lastFace === null) return "Ожидание данных";
    if (isUnknown) return "Неизвестное лицо";
    return lastFace;
  };

  const getCameraStatusColor = () => {
    return connected ? "text-green-400" : "text-red-400";
  };

  const getCameraStatusText = () => {
    return connected ? "Камера активна" : "Нет соединения";
  };

  return (
    <Link href="/street" className="block h-full">
      <section className="h-full flex flex-col justify-between rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 shadow-xl shadow-black/40 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02]">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Улица</h3>
            <span className="text-xl text-gray-500">›</span>
          </div>

          <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
            Видеонаблюдение
          </p>

          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-4 flex flex-col items-center justify-center text-center">
              <Camera className="w-6 h-6 mb-2" />
              <div className={`text-sm font-semibold ${getCameraStatusColor()}`}>
                {getCameraStatusText()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Последнее лицо:</span>
            <strong className={`flex items-center gap-1 ${getFaceStatusColor()}`}>
              {getFaceStatusIcon()}
              {getFaceStatusText()}
            </strong>
          </div>
        </div>
      </section>
    </Link>
  );
}
