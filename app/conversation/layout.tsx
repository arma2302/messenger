import React from "react";
import SideBar from "../component/sidebar/SideBar";
import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversations";
import getusers from "../actions/getUsers";
import getCurrentuser from "../actions/getCurrentUser";
import CallContext from "../context/CallContext";

export default async function CoverversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const coversations = await getConversations();
  const users = await getusers();
  const currentUser = await getCurrentuser();
  return (
    <SideBar>
      <div className="h-full">
        {" "}
        <ConversationList
          initialItems={coversations}
          users={users}
        ></ConversationList>
        {children}
      </div>
      <CallContext currentUser={currentUser!} />
    </SideBar>
  );
}
