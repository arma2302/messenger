import React from "react";
import SideBar from "../component/sidebar/SideBar";
import getusers from "../actions/getUsers";
import UserList from "./component/UserList";
import ActiveStatus from "../component/ActiveStatus";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getusers();
  return (
    <SideBar>
      <main className="h-full">
        <UserList items={users} />
        <ActiveStatus />
        {children}
      </main>
    </SideBar>
  );
}
