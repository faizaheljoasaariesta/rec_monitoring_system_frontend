import { useState } from "react";

export const useIsNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }>>([]);

  const showNotification = (
    type: 'success' | 'error',
    title: string,
    message: string,
    options?: {
      duration?: number;
      position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    }
  ) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      show: true,
      type,
      title,
      message,
      duration: options?.duration || 5000,
      position: options?.position || 'top-right'
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (title: string, message: string, options?: { duration?: number; position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }) => {
    showNotification('success', title, message, options);
  };

  const showError = (title: string, message: string, options?: { duration?: number; position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }) => {
    showNotification('error', title, message, options);
  };

  return {
    notifications,
    showSuccess,
    showError,
    hideNotification
  };
};