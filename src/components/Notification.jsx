import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const notificationTypes = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-400',
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-400',
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-400',
  },
};

const Notification = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = notificationTypes[type] || notificationTypes.info;
  const Icon = config.icon;

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-4 mb-4 flex items-start animate-fade-in-down`}
    >
      <Icon className={`h-5 w-5 ${config.iconColor} mr-3 flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Notification;

// Hook for managing notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, autoClose = 5000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, message, autoClose }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showSuccess = (message, autoClose) => addNotification('success', message, autoClose);
  const showError = (message, autoClose) => addNotification('error', message, autoClose);
  const showWarning = (message, autoClose) => addNotification('warning', message, autoClose);
  const showInfo = (message, autoClose) => addNotification('info', message, autoClose);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};

// Container component for displaying multiple notifications
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-md space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          autoClose={notification.autoClose}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};
