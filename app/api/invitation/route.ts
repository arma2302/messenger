// // pages/api/send-invite.js

// import prisma from "@/app/libs/prismadb"; // Prisma setup

// export default async (req: Request, res: Response) => {
//   if (req.method === "POST") {
//     const { callerId, recipientId } = req.body;

//     try {
//       // Get caller and recipient details from the database
//       const caller = await prisma.user.findUnique({ where: { id: callerId } });
//       const recipient = await prisma.user.findUnique({
//         where: { id: recipientId },
//       });

//       if (!caller || !recipient) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Create the call invitation in the database (optional)
//       const callInvitation = await prisma.callInvitation.create({
//         data: {
//           callerId,
//           recipientId,
//           status: "pending",
//         },
//       });

//       // Trigger the Pusher event to notify the recipient
//       pusher.trigger("call-channel", "incoming-call", {
//         callerName: caller.name,
//         recipientId,
//       });

//       res.status(200).json({ message: "Call invitation sent", callInvitation });
//     } catch (error) {
//       console.error("Error sending call invitation:", error);
//       res.status(500).json({ error: "Failed to send call invitation" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// };
