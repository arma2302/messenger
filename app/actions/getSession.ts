import { getServerSession } from "next-auth";
import { authOptions } from "../libs/authoptions";


export default async function getSession() {
  return await getServerSession(authOptions);
}
