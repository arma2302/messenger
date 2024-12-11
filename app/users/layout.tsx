import React from "react";
import SideBar from "../component/sidebar/SideBar";
import getusers from "../actions/getUsers";
import UserList from "./component/UserList";
import ActiveStatus from "../component/ActiveStatus";
import getCurrentuser from "../actions/getCurrentUser";
import CallContext from "../context/CallContext";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getusers();
  const currentUser = await getCurrentuser();

  return (
    <>
      {" "}
      <SideBar>
        <main className="h-full">
          <UserList items={users} currentUser={currentUser!} />
          <CallContext currentUser={currentUser!} />
          <ActiveStatus />
          {children}
        </main>
      </SideBar>
    </>
  );
}
