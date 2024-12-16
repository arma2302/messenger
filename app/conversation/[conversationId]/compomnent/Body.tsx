// "use client";
// import useConversation from "@/app/hooks/useConversation";
// import React, { useEffect, useRef, useState } from "react";
// import { FullMessageType } from "@/app/types";
// import axios from "axios";
// import MessageBox from "./MessageBox";
// import { pusherClient } from "@/app/libs/pusher";
// import { find } from "lodash";
// import ActiveStatus from "@/app/component/ActiveStatus";
// import OneSignal from "react-onesignal";
// import { useParams } from "next/navigation";
// import { User } from "@prisma/client";
// import SearchedMessageBox from "./SearchedMessageBox";

// interface BodyProps {
//   msgs: FullMessageType[];
//   currentUser: User;
// }

// const Body: React.FC<BodyProps> = ({ msgs, currentUser }) => {
//   const [messages, setMessages] = useState(msgs);
//   const [filteredMessages, setFilteredMessages] = useState<
//     FullMessageType[] | null
//   >(null);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const { conversationId } = useConversation();

//   // useEffect(() => {
//   //   pusherClient.subscribe(conversationId.toString());
//   //   bottomRef?.current?.scrollIntoView();

//   //   const messageHandler = (message: FullMessageType) => {
//   //     axios.post(`/api/conversations/${conversationId}/seen`);

//   //     setMessages((current) => {
//   //       if (find(current, { id: message.id })) {
//   //         return current;
//   //       }
//   //       return [...current, message];
//   //     });
//   //     bottomRef.current?.scrollIntoView();
//   //   };
//   //   pusherClient.bind("message:new", messageHandler);

//   //   return () => {
//   //     pusherClient.unsubscribe(conversationId.toString());
//   //     pusherClient.unbind("message:new", messageHandler);
//   //   };
//   // }, [conversationId]);

//   useEffect(() => {
//     axios.post(`/api/conversations/${conversationId}/seen`);
//   }, [conversationId]);

//   useEffect(() => {
//     pusherClient.subscribe(conversationId.toString());
//     bottomRef.current?.scrollIntoView();

//     const messageHandler = (message: FullMessageType) => {
//       console.log("New message received via Pusher:", message);
//       setMessages((current) => {
//         const existingMessage = find(current, { id: message.id });
//         if (existingMessage) {
//           return current;
//         }
//         return [...current, message];
//       });
//       bottomRef.current?.scrollIntoView();
//       axios.post(`/api/conversations/${conversationId}/seen`);
//     };

//     const updateMessaheHandler = (newmsg: FullMessageType) => {
//       axios.post(`/api/conversations/${conversationId}/seen`);

//       setMessages((current) =>
//         current.map((currentMessage) => {
//           if (currentMessage.id === newmsg.id) {
//             return newmsg;
//           }
//           return currentMessage;
//         })
//       );
//     };

//     const filtermessageHandler = (value: string) => {
//       console.log(value, "value");

//       setFilteredMessages(() =>
//         messages.filter((msg) =>
//           msg.body?.toLowerCase().includes(value.toLowerCase())
//         )
//       );
//     };

//     pusherClient.bind("message:new", messageHandler);
//     pusherClient.bind("message:update", updateMessaheHandler);
//     pusherClient.bind("message:filter", filtermessageHandler);

//     return () => {
//       pusherClient.unsubscribe(conversationId.toString());
//       pusherClient.unbind("message:new", messageHandler);
//       pusherClient.unbind("message:update", updateMessaheHandler);
//       pusherClient.unbind("message:filter", filtermessageHandler);
//     };
//   }, [conversationId]);

//   // useEffect(() => {
//   //   pusherClient.bind("callInvitation:new", function (data: any) {
//   //     console.log(data, "notification data");
//   //     alert(data.invitaion);
//   //   });

//   //   return () => {
//   //     pusherClient.unsubscribe("call-channel");
//   //   };
//   // }, []);
//   return (
//     <div className="flex-1 overflow-y-auto">
//       <ActiveStatus />

//       {filteredMessages &&
//         filteredMessages.map((msg) => {
//           return <SearchedMessageBox key={msg.id} data={msg} />;
//         })}
//       {messages.map((msg, i) => {
//         return (
//           <MessageBox
//             isLast={i === messages.length - 1}
//             key={msg.id}
//             data={msg}
//             conversationId={conversationId.toString()}
//           />
//         );
//       })}
//       <div ref={bottomRef} className="pt-24 "></div>
//     </div>
//   );
// };

// export default Body;
// "use client";
// import useConversation from "@/app/hooks/useConversation";
// import React, { useEffect, useRef, useState } from "react";
// import { FullMessageType } from "@/app/types";
// import axios from "axios";
// import MessageBox from "./MessageBox";
// import { pusherClient } from "@/app/libs/pusher";
// import { find } from "lodash";
// import ActiveStatus from "@/app/component/ActiveStatus";
// import SearchedMessageBox from "./SearchedMessageBox";
// import { User } from "@prisma/client";
// import clsx from "clsx";
// import { IoClose } from "react-icons/io5";
// import toast from "react-hot-toast";

// interface BodyProps {
//   msgs: FullMessageType[];
//   currentUser: User;
// }

// const Body: React.FC<BodyProps> = ({ msgs, currentUser }) => {
//   const [messages, setMessages] = useState(msgs);
//   const [filteredMessages, setFilteredMessages] = useState<
//     FullMessageType[] | null
//   >(null);
//   const [isFiltered, setIsFiltered] = useState(false); // Track if filtering is active
//   const [filteredValue, setFilteredValue] = useState("");
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const { conversationId } = useConversation();

//   useEffect(() => {
//     axios.post(`/api/conversations/${conversationId}/seen`);
//   }, [conversationId]);

//   useEffect(() => {
//     pusherClient.subscribe(conversationId.toString());
//     bottomRef.current?.scrollIntoView();

//     const messageHandler = (message: FullMessageType) => {
//       console.log("New message received via Pusher:", message);
//       setMessages((current) => {
//         const existingMessage = find(current, { id: message.id });
//         if (existingMessage) {
//           return current;
//         }
//         return [...current, message];
//       });
//       bottomRef.current?.scrollIntoView();
//       axios.post(`/api/conversations/${conversationId}/seen`);
//     };

//     const updateMessageHandler = (newMsg: FullMessageType) => {
//       axios.post(`/api/conversations/${conversationId}/seen`);

//       setMessages((current) =>
//         current.map((currentMessage) => {
//           if (currentMessage.id === newMsg.id) {
//             return newMsg;
//           }
//           return currentMessage;
//         })
//       );
//     };

//     const filtermessageHandler = (value: string) => {
//       console.log(value, "value");
//       setFilteredValue(value);
//       setFilteredMessages(() =>
//         messages.filter((msg) =>
//           msg.body?.toLowerCase().includes(value.toLowerCase())
//         )
//       );
//       setIsFiltered(true); // Set filter state to true
//     };

//     pusherClient.bind("message:new", messageHandler);
//     pusherClient.bind("message:update", updateMessageHandler);
//     pusherClient.bind("message:filter", filtermessageHandler);

//     return () => {
//       pusherClient.unsubscribe(conversationId.toString());
//       pusherClient.unbind("message:new", messageHandler);
//       pusherClient.unbind("message:update", updateMessageHandler);
//       pusherClient.unbind("message:filter", filtermessageHandler);
//     };
//   }, [conversationId]);

//   const closeFilteredMessages = () => {
//     setFilteredMessages(null); // Reset filtered messages
//     setIsFiltered(false); // Reset filter state
//     bottomRef.current?.scrollIntoView();
//   };

//   return (
//     <div className={clsx("flex-1 overflow-y-auto")}>
//       <ActiveStatus />

//       {/* Show filtered messages if available */}
//       {isFiltered && (
//         <div className="mt-2">
//           <button
//             className="close-filter-button w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center"
//             onClick={closeFilteredMessages}
//           >
//             <IoClose size={32} />
//           </button>
//         </div>
//       )}

//       {/* Render filtered messages if active */}
//       {isFiltered &&
//         filteredMessages &&
//         filteredMessages.length > 0 &&
//         filteredMessages.map((msg) => (
//           <SearchedMessageBox
//             key={msg.id}
//             data={msg}
//             filteredVal={filteredValue}
//           />
//         ))}
//       {isFiltered && filteredMessages?.length === 0 && (
//         <div className="flex w-full items-center justify-center text-lg text-gray-100"></div>
//       )}

//       {/* Render normal messages */}
//       {!isFiltered &&
//         messages.map((msg, i) => (
//           <MessageBox
//             isLast={i === messages.length - 1}
//             key={msg.id}
//             data={msg}
//             conversationId={conversationId.toString()}
//           />
//         ))}

//       <div ref={bottomRef} className="pt-24 "></div>
//     </div>
//   );
// };

// export default Body;
"use client";
import useConversation from "@/app/hooks/useConversation";
import React, { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import ActiveStatus from "@/app/component/ActiveStatus";
import SearchedMessageBox from "./SearchedMessageBox";
import { User } from "@prisma/client";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

interface BodyProps {
  msgs: FullMessageType[];
  currentUser: User;
}

const Body: React.FC<BodyProps> = ({ msgs, currentUser }) => {
  const [messages, setMessages] = useState(msgs);
  const [filteredMessages, setFilteredMessages] = useState<
    FullMessageType[] | null
  >(null);
  const [isFiltered, setIsFiltered] = useState(false); // Track if filtering is active
  const [filteredValue, setFilteredValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId.toString());
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        const existingMessage = find(current, { id: message.id });
        if (existingMessage) {
          return current;
        }
        return [...current, message];
      });
      bottomRef.current?.scrollIntoView();
      axios.post(`/api/conversations/${conversationId}/seen`);
    };

    const updateMessageHandler = (newMsg: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMsg.id) {
            return newMsg;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("message:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId.toString());
      pusherClient.unbind("message:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);
  useEffect(() => {
    pusherClient.subscribe(currentUser.id);
    const filtermessageHandler = (value: string) => {
      setFilteredValue(value);
      setFilteredMessages(() =>
        messages.filter((msg) =>
          msg.body?.toLowerCase().includes(value.toLowerCase())
        )
      );
      setIsFiltered(true); // Set filter state to true
    };

    pusherClient.bind("message:filter", filtermessageHandler);

    return () => {
      pusherClient.unbind("message:filter", filtermessageHandler);
    };
  }, [currentUser.id]);

  const closeFilteredMessages = () => {
    setFilteredMessages(null); // Reset filtered messages
    setIsFiltered(false); // Reset filter state
    bottomRef.current?.scrollIntoView();
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      <ActiveStatus />

      {/* Modal-like Overlay for Filtered Messages */}
      {isFiltered && filteredMessages && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-4/5 md:w-2/3 rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Searched Result</h2>
              <button className="text-sky-500" onClick={closeFilteredMessages}>
                <IoClose size={32} />
              </button>
            </div>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <SearchedMessageBox
                  key={msg.id}
                  data={msg}
                  filteredVal={filteredValue}
                />
              ))
            ) : (
              <h2>No Result Found</h2>
            )}
          </div>
        </div>
      )}

      {!isFiltered &&
        messages.map((msg, i) => (
          <MessageBox
            key={msg.id}
            data={msg}
            isLast={i === messages.length - 1}
            conversationId={conversationId.toString()}
          />
        ))}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
