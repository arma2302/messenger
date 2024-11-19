import { pusherServer } from "@/app/libs/pusher"; // Update this import if needed
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Access the request body directly (no need to use .json() in Next.js)
      const { convoId, answer } = req.body;

      // Trigger an event on Pusher to send the answer to the other user
      await pusherServer.trigger(`call-${convoId}`, "answer", answer);

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
