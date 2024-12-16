import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/component/EmptyState";
import Header from "./compomnent/Header";
import Body from "./compomnent/Body";
import Form from "./compomnent/Form";
import getCurrentuser from "@/app/actions/getCurrentUser";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversationId = await params.conversationId;
  const conversation = await getConversationById(conversationId);

  const messages = await getMessages(conversationId);
  console.log("all messages", messages);
  const currentUser = await getCurrentuser();

  if (!conversation) {
    return (
      <div className="lg:pl-96 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header convo={conversation} />
        <div className="px-6 h-full flex flex-col justify-between">
          <Body msgs={messages} currentUser={currentUser!} />
          <Form convo={conversation} currentUser={currentUser!} />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ConversationId;
