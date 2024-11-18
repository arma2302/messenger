import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getCurrentuser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }
    const currentuser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!currentuser) {
      return null;
    }
    return currentuser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentuser;
