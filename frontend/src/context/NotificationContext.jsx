import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeAlert, setActiveAlert] = useState(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getNotifications();
      setNotifications(res.data);
      const countRes = await getUnreadNotificationCount();
      setUnreadCount(countRes.data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Setup STOMP WebSocket Connection with SockJS
    let stompClient = null;
    try {
      stompClient = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        reconnectDelay: 5000,
        debug: () => {},
        onConnect: () => {
          // Subscribe to general notifications
          stompClient.subscribe('/topic/notifications', (message) => {
            try {
              const body = JSON.parse(message.body);
              handleIncomingNotification(body);
            } catch (e) {
              console.error('Error parsing notification', e);
            }
          });

          // Subscribe to user-specific channel
          if (user.id) {
            stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
              try {
                const body = JSON.parse(message.body);
                handleIncomingNotification(body);
              } catch (e) {
                console.error('Error parsing user notification', e);
              }
            });
          }
        },
      });

      stompClient.activate();
    } catch (err) {
      console.warn('WebSocket connection error:', err);
    }

    // Polling interval as reliable backup
    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      clearInterval(interval);
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [isAuthenticated, user?.id]);

  const handleIncomingNotification = (msg) => {
    // Show toast banner
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 6000);

    // Refresh notifications list
    fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeAlert,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
