import {Trans} from '@lingui/react/macro';
import {msg} from '@lingui/core/macro';
import {forwardRef, useEffect, useState, useCallback} from 'react';
import {useLingui} from '@lingui/react';
import {Dropdown, Button, Nav, Badge} from 'react-bootstrap';
import {BellFill} from 'react-bootstrap-icons';
import {type GetMyNotificationsResponse} from '@client/ApiTypes';
import api from '@client/ApiClient';
import NotificationsMenuItem from './NotificationsMenuItem.js';
import {useToasts} from '@/components/toasts/index.js';

const toggleSize = 32;
const NotificationMenuToggle = forwardRef<
  HTMLDivElement,
  {
    readonly children: React.ReactNode;
    readonly onClick: () => void;
    readonly unreadCount: number;
  }
>(({children, onClick, unreadCount}, reference) => (
  <div
    ref={reference}
    style={{cursor: 'pointer', position: 'relative'}}
    className="nav-link pe-0"
    onClick={onClick}
  >
    <div
      className="d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: toggleSize,
        height: toggleSize,
        backgroundColor: '#ccc',
        position: 'relative',
      }}
    >
      <BellFill
        size={toggleSize * 0.6}
        color={unreadCount > 0 ? 'rgba(var(--bs-danger-rgb)' : 'gray'}
      />
    </div>
    {unreadCount > 0 && (
      <h6
        style={{
          position: 'absolute',
          top: 3,
          left: 30,
          zIndex: 1,
        }}
      >
        <Badge pill bg="danger">
          {unreadCount}
        </Badge>
      </h6>
    )}
    {children}
  </div>
));

export default function NotificationsMenu() {
  const toasts = useToasts();
  const {_} = useLingui();
  const [notifications, setNotifications] =
    useState<GetMyNotificationsResponse>([]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await api.getMyNotifications();
      setNotifications(notifications);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to read notifications.`),
      });
    }
  }, [toasts, _]);

  useEffect(() => {
    void fetchNotifications();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await api.updateMyNotificationsRead({
        date: new Date().toISOString(),
      });
      setNotifications([]);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to clear notifications.`),
      });
    }
  };

  return (
    <Dropdown as={Nav.Item} align="end" className="hide-icon nav-dropdown">
      <Dropdown.Toggle
        as={NotificationMenuToggle}
        unreadCount={unreadCount}
        id="notifications-dropdown"
      />
      <Dropdown.Menu>
        {notifications.length > 0 ? (
          <>
            <div className="d-flex justify-content-end mx-2 mb-2">
              <Button
                variant="primary"
                className="w-100"
                disabled={unreadCount === 0}
                onClick={markAllAsRead}
              >
                <Trans>Clear Notifications</Trans>
              </Button>
            </div>
            <Dropdown.Divider />
            <div
              style={{
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationsMenuItem notification={notification} />
                  {index < notifications.length - 1 && <Dropdown.Divider />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-3 text-center text-muted">
            <Trans>No unread notifications</Trans>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
