// /pages/api/sendOffer.js

// /pages/api/sendAnswer.js

export default async function handler(req, res) {
  const { convoId, answer } = JSON.parse(req.body);

  // Trigger an event on Pusher to send the answer to the other user
  await pusherServer.trigger(`call-${convoId}`, "answer", answer);

  res.status(200).json({ message: "Answer sent" });
}

// /pages/api/sendCandidate.js

export default async function handler(req, res) {
  const { convoId, candidate } = JSON.parse(req.body);

  // Trigger an event on Pusher to send the ICE candidate to the other user
  await pusherServer.trigger(`call-${convoId}`, "candidate", candidate);

  res.status(200).json({ message: "Candidate sent" });
}
