import React, { useEffect } from "react";
interface NotificationProps {
  message: string;
  onClose: () => void;
}
const Toast: React.FC<NotificationProps> = ({ message, onClose }) => {
    useEffect(() => {
        const time = setTimeout(() => {
            onClose()
        }, 3000)

        return () => clearTimeout(time)
    }, [onClose])
  return (
    <div className="toast">
      <div className='alert alert-succes'>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
