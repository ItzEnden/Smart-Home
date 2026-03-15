"use client";
import { TopBar } from "@/components/TopBar";
import { PageTransition } from "@/components/PageTransition";
import { Search, Filter, Calendar, User, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { wsManager } from "@/hooks/useSensorData";

interface WebSocketMessage {
  type: "initial" | "sensor_update" | "client_count" | "error" | "ack";
  key?: string;
  deviceId?: string;
  sensorType?: string;
  data?: any;
  timestamp: string;
  clientCount?: number;
  message?: string;
}

interface Event {
  id: string;
  time: string;
  date: string;
  room: string;
  type: "Инфо" | "Предупреждение" | "Тревога";
  text: string;
  sensorType?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      time: "17:24",
      date: "23.02.2026",
      room: "Прихожая",
      type: "Инфо",
      text: "Свет включен по движению",
      sensorType: "motion",
    },
    {
      id: "2",
      time: "17:22",
      date: "23.02.2026",
      room: "Прихожая",
      type: "Инфо",
      text: "Автоматизация возобновлена",
      sensorType: "motion",
    },
    {
      id: "3",
      time: "16:15",
      date: "23.02.2026",
      room: "Улица",
      type: "Инфо",
      text: "Распознан пользователь: Администратор",
      sensorType: "face_recognition",
    },
  ]);

  // Handle WebSocket messages for real-time events
  useEffect(() => {
    const handleMessage = (message: WebSocketMessage) => {
      if (message.type === "sensor_update" && message.data) {
        const { deviceId, sensorType, data } = message;

        // Only handle face recognition events
        if (sensorType === "face_recognition") {
          const timestamp = new Date(data.timestamp);
          const time = timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
          const date = timestamp.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

          const faceName = String(data.value);
          const isUnknown = faceName === "CHUZHOY" || faceName === "Searching...";

          const newEvent: Event = {
            id: Date.now().toString(),
            time,
            date,
            room: "Улица",
            type: isUnknown ? "Предупреждение" : "Инфо",
            text: isUnknown
              ? `Неизвестное лицо: ${faceName}`
              : `Распознан пользователь: ${faceName}`,
            sensorType: "face_recognition",
          };

          setEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
        }
      }
    };

    const unsubscribe = wsManager.subscribe(handleMessage);

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter face recognition events
  const faceEvents = events.filter((event) => event.sensorType === "face_recognition");

  // Filter events by room
  const getFilteredEvents = (room?: string) => {
    if (!room || room === "all") return faceEvents;
    return faceEvents.filter((event) => event.room.toLowerCase() === room.toLowerCase());
  };

  // Get badge color for event type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Инфо":
        return "bg-blue-500/20 text-blue-400";
      case "Предупреждение":
        return "bg-amber-500/20 text-amber-400";
      case "Тревога":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Get icon for face event
  const getFaceIcon = (text: string) => {
    if (text.includes("Неизвестное")) {
      return <UserX className="w-4 h-4 text-amber-400" />;
    }
    return <User className="w-4 h-4 text-green-400" />;
  };

  return (
    <PageTransition>
      <TopBar title="Журнал событий" />

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-md md:max-w-none mx-auto">
        <div className="md:col-span-1 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по событиям..."
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Filters */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Фильтры</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">По комнате</div>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    Все комнаты
                  </button>
                  <button className="bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium">
                    Улица
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">По типу</div>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium">
                    Информация
                  </button>
                  <button className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-sm font-medium">
                    Предупреждения
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="md:col-span-2 space-y-5">
          {/* Events List */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                Распознавание лиц ({faceEvents.length})
              </h3>
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
                Выбрать период
              </button>
            </div>

            <div className="space-y-3">
              {faceEvents.length > 0 ? (
                faceEvents.map((event) => (
                  <div key={event.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex gap-4">
                    <div className="text-sm text-gray-500 min-w-[70px]">
                      <div>{event.time}</div>
                      <div className="text-xs">{event.date}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400">{event.room}</span>
                        <span className="text-gray-600">•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md ${getBadgeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-gray-200">
                        {getFaceIcon(event.text)}
                        {event.text}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Нет событий распознавания лиц
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
