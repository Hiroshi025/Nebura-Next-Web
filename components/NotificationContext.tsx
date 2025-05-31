"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextProps {
  notify: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx.notify;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (notification: Omit<Notification, "id">) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification notification-${n.type}`}
            style={{
              minWidth: 250,
              padding: "16px 24px",
              borderRadius: 8,
              background:
                n.type === "success"
                  ? "#e6ffed"
                  : n.type === "error"
                  ? "#ffeaea"
                  : n.type === "info"
                  ? "#eaf6ff"
                  : "#fffbe6",
              color:
                n.type === "success"
                  ? "#1a7f37"
                  : n.type === "error"
                  ? "#d32f2f"
                  : n.type === "info"
                  ? "#1976d2"
                  : "#b8860b",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onClick={() => remove(n.id)}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
