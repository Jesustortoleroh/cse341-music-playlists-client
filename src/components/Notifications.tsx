import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
}

export const Notifications = ({ notifications }: Props) => {
  return (
    <div className="notifications-container" aria-live="polite" aria-atomic="false">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`toast ${n.type}`}
          role={n.type === 'error' ? 'alert' : 'status'}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};
