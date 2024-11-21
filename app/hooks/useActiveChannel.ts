import { useEffect, useState } from "react";
import useActiceUserList from "./useActiveUserList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { add, remove, set } = useActiceUserList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
      console.log("chanel", channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initalMembers: string[] = [];
      members.each((member: Record<string, any>) =>
        initalMembers.push(member.id)
      );
      set(initalMembers);
      console.log(initalMembers, "inital members");
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, []);
};

export default useActiveChannel;
