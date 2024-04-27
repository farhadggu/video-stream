import { NextResponse } from "next/server";

export async function POST(request: any) {
  const body = await request.json();
  console.log("body.data", body.data);
  try {
    return NextResponse.json({ status: 200, folderName: body });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500, message: "error" });
  }
}
