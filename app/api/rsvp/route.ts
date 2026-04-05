import { NextResponse } from "next/server";

type RSVPBody = {
  name?: string;
  guests?: string;
  attendance?: "yes" | "no";
};

const submissions: Array<{ name: string; guests: string; attendance: "yes" | "no"; createdAt: string }> = [];

export async function POST(request: Request) {
  const body = (await request.json()) as RSVPBody;

  if (!body.name || !body.attendance) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  submissions.push({
    name: body.name,
    guests: body.guests ?? "1",
    attendance: body.attendance,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, message: "RSVP submitted successfully" });
}
