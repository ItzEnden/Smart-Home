export function StreetCameraCard() {
  return (
    <section className="h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02]">
      <div className="relative h-full min-h-[16rem]">
        {/* Camera Image placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-16 h-16 text-zinc-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className="text-gray-500 text-sm">Ожидание данных</span>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Live Indicator */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-medium text-white">ЭФИР</span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-6">
          <h2 className="text-2xl font-light mb-1">Камера на улице</h2>
          <p className="text-gray-300 text-sm">Последнее распознавание: Нет данных</p>
        </div>
      </div>
    </section>
  );
}
