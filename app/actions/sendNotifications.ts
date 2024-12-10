import axios from "axios";

const senNotification = async (userId: string, msg: any) => {
  const apiUrl = "https://onesignal.com/api/v1/notifications";
  const apiKey =
    "os_v2_app_ncivvszznbecxc5umdjqkzahtzblp35b6fpeggvgwxj6h33ikt5iiszfenubhhg2ic6z4vdmcsfijshvtdzrxedplh4zzjb6i52fela";
  const appId = "68915acb-3968-482b-8bb4-60d30564079e";
  const reqBody = {
    filters: [{ field: "tag", key: "userId", relation: "=", value: userId }],
    included_segments: ["All"],
    target_channel: "push",
    app_id: appId,
    contents: {
      en: msg,
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${apiKey}`,
  };

  await axios
    .post(apiUrl, reqBody, { headers })
    .then(() => {
      console.log("sent  notification");
    })
    .catch(() => {
      console.log("error sending the notiifcation");
    });
};
export default senNotification;
