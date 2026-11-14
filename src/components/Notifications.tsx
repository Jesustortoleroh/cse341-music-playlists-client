import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
}

export const Notifications = ({ notifications }: Props) => {
  return (
    <div className="notifications-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
};