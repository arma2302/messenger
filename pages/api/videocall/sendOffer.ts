import { pusherServer } from "@/app/libs/pusher"; // Adjust this import as necessary
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Directly access the request body (Next.js automatically parses it as JSON)
      const { convoId, offer } = req.body;

      // Log the offer for debugging
      console.log("Offer received:", offer);

      // Trigger an event on Pusher to send the offer to the other user
      await pusherServer.trigger(`call-${convoId}`, "offer", offer);

      // Respond with a success message
      res.status(200).json({ message: "Candidate sent successfully" });
    } catch (error) {
      console.error("Error sending candidate:", error);
      res.status(500).json({ error: "Failed to send candidate" });
    }
  } else {
    // If the method is not POST, return a 405 Method Not Allowed error
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
