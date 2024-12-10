import axios from "axios";

const sendSignalingData = async (event: string, data: any) => {
  try {
    await axios
      .post("/api/videocall", { event, data })
      .then((data) => console.log("Signaling data sent successfully"))
      .catch((e) => console.log("errror sending Data", e));
  } catch (error) {
    console.error("Error sending signaling data:", error);
  }
};
export default sendSignalingData;
