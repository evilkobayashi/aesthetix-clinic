import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: { client: true, professional: true, procedures: true },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const appt = await prisma.appointment.create({ data: body });
  return NextResponse.json(appt, { status: 201 });
}
