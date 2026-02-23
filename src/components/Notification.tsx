interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps) => {
  if (!message) return null;
  return (
    <div className="alert alert-success mb-4 shadow-lg">
      {message}
    </div>
  );
};

export default Notification;
