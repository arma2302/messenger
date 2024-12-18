// "use client";
// import useConversation from "@/app/hooks/useConversation";
// import { FullConversationType } from "@/app/types";
// import clsx from "clsx";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import { MdOutlineGroupAdd } from "react-icons/md";
// import CoversationBox from "./CoversationBox";
// import GroupChatModal from "./GroupAddModal";
// import { User } from "@prisma/client";
// import { pusherClient } from "@/app/libs/pusher";
// import { find } from "lodash";
// import { useSession } from "next-auth/react";

// interface ConversationListProps {
//   initialItems: FullConversationType[];
//   users: User[];
//   currentUser: User;
// }
// const ConversationList: React.FC<ConversationListProps> = ({
//   initialItems,
//   users,
//   currentUser,
// }) => {
//   const [items, setItems] = useState(initialItems);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const session = useSession();
//   const { conversationId, isOpen } = useConversation();
//   // const pusherKey = session.data?.user.;

//   useEffect(() => {
//     pusherClient.subscribe(session.data?.user?.email!);

//     if (!currentUser) {
//       return;
//     }
//     const newHandler = (conversation: FullConversationType) => {
//       setItems((current) => {
//         if (find(current, { id: conversationId })) {
//           return current;
//         }
//         return [conversation, ...current];
//       });
//     };
//     const updateHadnler = (conversation: FullConversationType) => {
//       setItems((current) =>
//         current.map((currentConvo) => {
//           if (currentConvo.id === conversation.id) {
//             console.log(currentConvo, "currentconvo");
//             console.log(conversation.messages, "updated msgs");

//             return { ...currentConvo, messages: conversation.messages };
//           }

//           return currentConvo;
//         })
//       );
//     };
//     const removeHandler = (conversation: FullConversationType) => {
//       setItems((current) => {
//         return [
//           ...current.filter((dltConvo) => dltConvo.id !== conversation.id),
//         ];
//       });
//     };
//     pusherClient.bind("conversation:new", newHandler);
//     pusherClient.bind("conversation:update", updateHadnler);
//     pusherClient.bind("conversation:remove", removeHandler);
//     return () => {
//       pusherClient.unsubscribe(currentUser.id);
//       pusherClient.unbind("conversation:new", newHandler);
//       pusherClient.unbind("conversation:update", updateHadnler);
//       pusherClient.unbind("conversation:remove", removeHandler);
//     };
//   }, [currentUser.id, conversationId, session.data?.user?.email]);
//   return (
//     <>
//       <GroupChatModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         users={users}
//       />
//       <aside
//         className={clsx(
//           "fixed w-full inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 bg-white lg:block overflow-y-auto border-r border-gray-200 ",
//           isOpen ? "hidden" : "block"
//         )}
//       >
//         <div className="px-5">
//           <div className="flex  justify-between mt-4 pt-4 gap-2 mb-4">
//             <div className="font-medium text-2xl text-neutral-800">
//               Messages!
//             </div>{" "}
//             <div
//               onClick={() => setIsModalOpen(true)}
//               className="text-gray-600 bg-gray-100 hover:opacity-75 transition rounded-full p-2    "
//             >
//               <MdOutlineGroupAdd size={20} />
//             </div>
//           </div>
//           {items.map((item) => {
//             return (
//               <CoversationBox
//                 key={item.id}
//                 data={item}
//                 selected={conversationId === item.id}
//               />
//             );
//           })}
//         </div>
//       </aside>
//     </>
//   );
// };

// export default ConversationList;
"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import CoversationBox from "./CoversationBox";
import GroupChatModal from "./GroupAddModal";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { useSession } from "next-auth/react";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  currentUser: User;
}
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  currentUser,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  const pusherKey = session.data?.user?.email;

  // useEffect(() => {
  //   pusherClient.subscribe(currentUser.email!);

  //   if (!currentUser) {
  //     return;
  //   }
  //   const newHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       // Avoid adding the same conversation again
  //       if (current.some((convo) => convo.id === conversation.id)) {
  //         return current;
  //       }
  //       return [conversation, ...current];
  //     });
  //   };
  //   const updateHadnler = (conversation: FullConversationType) => {
  //     console.log(conversation, "conversation which is sent by pusher");

  //     setItems((current) =>
  //       current.map((currentConvo) => {
  //         console.log(
  //           currentConvo,
  //           "currentconvo when update convo event triggred"
  //         );

  //         if (currentConvo.id === conversation.id) {
  //           console.log(currentConvo, "currentconvo");
  //           console.log(conversation.messages, "updated msgs");

  //           return { ...currentConvo, messages: conversation.messages };
  //         }

  //         return currentConvo;
  //       })
  //     );
  //   };
  //   const removeHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       return [
  //         ...current.filter((dltConvo) => dltConvo.id !== conversation.id),
  //       ];
  //     });
  //   };
  //   pusherClient.bind("conversation:new", newHandler);
  //   pusherClient.bind("conversation:update", updateHadnler);
  //   pusherClient.bind("conversation:remove", removeHandler);
  //   return () => {
  //     pusherClient.unsubscribe(currentUser.email!);
  //     pusherClient.unbind("conversation:new", newHandler);
  //     pusherClient.unbind("conversation:update", updateHadnler);
  //     pusherClient.unbind("conversation:remove", removeHandler);
  //   };
  // }, [currentUser.email, session]);
  // useEffect(() => {
  //   if (!currentUser?.email) return;

  //   pusherClient.subscribe(currentUser.email);

  //   const newHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       if (current.some((convo) => convo.id === conversation.id)) {
  //         return current;
  //       }
  //       return [conversation, ...current];
  //     });
  //   };

  //   const updateHandler = (conversation: FullConversationType) => {
  //     setItems((current) =>
  //       current.map((currentConvo) => {
  //         if (currentConvo.id === conversation.id) {
  //           return { ...currentConvo, messages: conversation.messages };
  //         }
  //         return currentConvo;
  //       })
  //     );
  //   };

  //   const removeHandler = (conversation: FullConversationType) => {
  //     setItems((current) =>
  //       current.filter((dltConvo) => dltConvo.id !== conversation.id)
  //     );
  //   };

  //   pusherClient.bind("conversation:new", newHandler);
  //   pusherClient.bind("conversation:update", updateHandler);
  //   pusherClient.bind("conversation:remove", removeHandler);

  //   return () => {
  //     pusherClient.unsubscribe(currentUser?.email!);
  //     pusherClient.unbind("conversation:new", newHandler);
  //     pusherClient.unbind("conversation:update", updateHandler);
  //     pusherClient.unbind("conversation:remove", removeHandler);
  //   };
  // }, [currentUser?.email, session]);

  useEffect(() => {
    if (!currentUser?.email) return;

    pusherClient.subscribe(`${currentUser.id}-newConvo`);
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (current.some((convo) => convo.id === conversation.id)) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    pusherClient.bind("conversation:new", newHandler);
    return () => {
      pusherClient.unsubscribe(`${currentUser.id}-newConvo`);
      pusherClient.unbind("conversation:new", newHandler);
    };
  }, [currentUser.id, session]);
  useEffect(() => {
    if (!currentUser?.email) return;

    pusherClient.subscribe(`${currentUser.id}-updateConvo`);
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConvo) => {
          if (currentConvo.id === conversation.id) {
            return { ...currentConvo, messages: conversation.messages };
          }
          return currentConvo;
        })
      );
    };
    pusherClient.bind("conversation:update", updateHandler);

    return () => {
      pusherClient.unsubscribe(`${currentUser.id}-updateConvo`);
      pusherClient.unbind("conversation:update", updateHandler);
    };
  }, [currentUser.id, session]);
  useEffect(() => {
    if (!currentUser?.email) return;

    pusherClient.subscribe(`${currentUser.id}-removeConvo`);
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.filter((dltConvo) => dltConvo.id !== conversation.id)
      );
    };
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(`${currentUser.id}-removeConvo`);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [currentUser.id, session]);
  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          "fixed w-full inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 bg-white lg:block overflow-y-auto border-r border-gray-200 ",
          isOpen ? "hidden" : "block"
        )}
      >
        <div className="px-5">
          <div className="flex  justify-between mt-4 pt-4 gap-2 mb-4">
            <div className="font-medium text-2xl text-neutral-800">
              Messages!
            </div>{" "}
            <div
              onClick={() => setIsModalOpen(true)}
              className="text-gray-600 bg-gray-100 hover:opacity-75 transition rounded-full p-2    "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => {
            return (
              <CoversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
