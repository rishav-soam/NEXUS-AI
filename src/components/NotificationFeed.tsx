import React, { useState, useEffect } from "react";
import { Notification, Internship } from "../types";
import { Bell, Volume2, VolumeX, CheckCircle, Flame, ExternalLink } from "lucide-react";

interface NotificationFeedProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectInternship: (internship: Internship) => void;
}

export default function NotificationFeed({
  notifications,
  onMarkRead,
  onClearAll,
  soundEnabled,
  onToggleSound,
  onSelectInternship
}: NotificationFeedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" id="notifications_dropdown_parent">
      <button
        id="btn_toggle_notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-zinc-300 transition-all flex items-center justify-center cursor-pointer"
        title="View Notifications Link"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-sans font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="notifications_panel"
          className="absolute right-0 mt-3 w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-zinc-900"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold tracking-wider text-zinc-300 uppercase">Live Postings Feed</h4>
            </div>
            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                id="btn_toggle_sound"
                onClick={onToggleSound}
                className={`p-1.5 rounded-md transition-colors ${soundEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700/55"}`}
                title={soundEnabled ? "Mute Sound Alerts" : "Enable Sound Alerts"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {notifications.length > 0 && (
                <button
                  id="btn_clear_notifications"
                  onClick={() => {
                    onClearAll();
                    setIsOpen(false);
                  }}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900/60" id="notification_list_container">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                <p>No active postings triggered yet.</p>
                <p className="mt-1 text-[10.5px]">New remote roles index automatically every 30 seconds.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors ${notif.read ? "bg-transparent" : "bg-emerald-500/[0.02]"}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-zinc-550 shrink-0 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[12px] text-zinc-350 mt-1">{notif.message}</p>
                  
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-zinc-900/40">
                    <button
                      onClick={() => onMarkRead(notif.id)}
                      className="text-[10.5px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-zinc-500" />
                      Dismiss
                    </button>
                    
                    {/* Simulated navigation payload inside message */}
                    {notif.message.includes("at") && (
                      <button
                        onClick={() => {
                          onMarkRead(notif.id);
                          setIsOpen(false);
                        }}
                        className="text-[10.5px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        View Roles <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 text-center bg-zinc-900/30 text-[10px] text-zinc-500 select-none">
            ● Real-Time Scraping Agent Active
          </div>
        </div>
      )}
    </div>
  );
}
