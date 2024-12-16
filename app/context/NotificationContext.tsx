// "use client";

// import React, { useEffect, useState } from "react";
// import { pusherClient } from "../libs/pusher";
// import { User } from "@prisma/client";
// import toast from "react-hot-toast";
// interface NotificationProps {
//   currentUser: User;
// }
// const Notification: React.FC<NotificationProps> = ({ currentUser }) => {
//   useEffect(() => {
//     pusherClient.subscribe(currentUser?.id!);
//     pusherClient.bind("notification:new", function (data: any) {
//       return toast.success(`From:${data.from}: ${data.msg}`);
//     });

//     return () => {
//       pusherClient.unsubscribe(currentUser?.id!);
//       pusherClient.unbind("notification:new");
//     };
//   }, [currentUser?.id]);
//   return <></>;
// };

// export default Notification;
"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import clsx from "clsx"; // For conditionally applying classes
import { HiX } from "react-icons/hi";

interface NotificationProps {
  currentUser: User;
}

const Notification: React.FC<NotificationProps> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    pusherClient.subscribe(currentUser?.id!);

    // Handler for new notifications
    const notificationHandler = (data: any) => {
      setNotifications((prev) => [
        ...prev,
        { message: data.msg, from: data.from },
      ]);
    };

    pusherClient.bind("notification:new", notificationHandler);

    return () => {
      pusherClient.unsubscribe(currentUser?.id!);
      pusherClient.unbind("notification:new", notificationHandler);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        setNotifications((prev) => prev.slice(1));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [notifications]);

  return (
    <div className="fixed top-0 right-0 mt-16 mr-4 space-y-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={clsx(
            "bg-blue-500 text-white p-4 rounded-lg shadow-lg w-80 transition-all",
            "transform transition-opacity duration-500 opacity-100", // Smooth fade-in effect
            "hover:bg-blue-600"
          )}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">{notification.from}</span>
            <button
              onClick={() => {
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                );
              }}
              className=" hover:text-gray-300 w-[10] h-[10] rounded-full bg-gray-100 flex justify-center items-center"
            >
              <HiX className="text-sky-500" />
            </button>
          </div>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;
