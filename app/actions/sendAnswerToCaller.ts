import { pusherServer } from "../libs/pusher";

export async function SendAnswerToCaller(ans: string, Id: string) {
  if (ans == "accept") {
    await pusherServer.trigger(Id, "answer:new", ans);
  }
  if (ans == "reject") {
    await pusherServer.trigger(Id, "answer:new", ans);
  }
}
