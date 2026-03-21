import {forwardRef, useEffect, useState, useCallback} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import {msg, Trans} from '@lingui/macro';
import {Dropdown, Button} from 'react-bootstrap'; // Import Button
import {BellFill} from 'react-bootstrap-icons';
import NotificationsMenuItem from './NotificationsMenuItem';
import {type GetMyNotificationsResponse} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

const toggleSize = 32;
const NotificationMenuToggle = forwardRef<
  HTMLDivElement,
  {
    readonly children: React.ReactNode;
    readonly onClick: () => void;
    readonly unreadCount: number;
  }
>(({children, onClick, unreadCount}, ref) => (
  <div
    ref={ref}
    style={{cursor: 'pointer', position: 'relative'}}
    className="d-flex align-items-center me-2"
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
        color={unreadCount > 0 ? 'red' : 'gray'}
      />
    </div>
    {unreadCount > 0 && (
      <span
        style={{
          position: 'absolute',
          top: '-5px',
          right: '-7px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
          paddingTop: 'px',
          fontWeight: 'bold',
          lineHeight: '12px',
          zIndex: 1,
        }}
      >
        {unreadCount}
      </span>
    )}
    {children}
  </div>
));

export default function NotificationsMenu() {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const toasts = useToasts();
  const {_} = useLingui();
  const [notifications, setNotifications] =
    useState<GetMyNotificationsResponse>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      setIsDropdownOpen(false);
      setNotifications([]);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to clear notifications.`),
      });
    }
  };

  return (
    <Dropdown
      align="end"
      autoClose={false}
      className="hide-icon"
      show={isDropdownOpen}
      onToggle={(isOpen) => {
        setIsDropdownOpen(isOpen);
      }}
    >
      <Dropdown.Toggle as={NotificationMenuToggle} unreadCount={unreadCount} />
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
              {notifications.map((notification, index) => {
                const {_id, targetPost} = notification;

                return (
                  <div key={_id}>
                    <Dropdown.Item
                      style={{
                        width: '280px',
                        whiteSpace: 'wrap',
                      }}
                      onClick={() => {
                        searchParameters.set('showPost', targetPost._id);
                        setSearchParameters(searchParameters, {replace: true});
                      }}
                    >
                      <NotificationsMenuItem notification={notification} />
                    </Dropdown.Item>
                    {index < notifications.length - 1 && <Dropdown.Divider />}
                  </div>
                );
              })}
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
