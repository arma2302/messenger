import { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "@/app/libs/pusher"; // Update this import if necessary

// Define the request handler for sending the ICE candidate
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method === "POST") {
    try {
      // Access the request body directly (no need to use .json())
      const { convoId, candidate } = req.body;

      // Trigger Pusher to send the ICE candidate to the other user
      await pusherServer.trigger(`call-${convoId}`, "candidate", { candidate });

      // Send a success response
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
