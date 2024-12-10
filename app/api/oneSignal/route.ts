import getCurrentuser from "@/app/actions/getCurrentUser";
import axios from "axios";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const currentUser = await getCurrentuser(); // Fetch the current user

    // Check if user exists
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("User not found", { status: 404 });
    }

    // // Find the user in the database to check if externalId is already set
    // const findUser = await prisma.user.findUnique({
    //   where: {
    //     id: currentUser.id,
    //   },
    // });

    // // If the externalId is already set, no need to proceed with OneSignal
    // if (findUser?.externalId) {
    //   return NextResponse.json("External ID already set.");
    // }
    const apiUrl = `https://onesignal.com/api/v1/players`;
    const apiKey =
      "os_v2_app_ncivvszznbecxc5umdjqkzahtzblp35b6fpeggvgwxj6h33ikt5iiszfenubhhg2ic6z4vdmcsfijshvtdzrxedplh4zzjb6i52fela";
    const appId = "68915acb-3968-482b-8bb4-60d30564079e";

    const requestBody = {
      app_id: appId,
      external_id: currentUser.id, // External ID for the user
      device_type: 3,
      tags: {
        userId: currentUser.id,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${apiKey}`,
    };

    try {
      await axios.post(apiUrl, requestBody, { headers });
      console.log("User created in OneSignal");
    } catch (error) {
      console.error("Error creating user in OneSignal:", error);
    }

    // // After the external ID is successfully set on OneSignal, update it in your database
    // if (response.status === 200) {
    //   const updatedUser = await prisma.user.update({
    //     where: {
    //       id: currentUser?.id,
    //     },
    //     data: {
    //       externalId: currentUser?.id, // Set the externalId for the user in your DB
    //     },
    //   });

    //   console.log("subscribed to push");

    //   return new NextResponse("External ID set successfully.", {
    //     status: 200,
    //   });
    // } else {
    //   return new NextResponse("Failed to set external ID on OneSignal", {
    //     status: 500,
    //   });
    // }

    return new NextResponse("External ID set successfully.", { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
