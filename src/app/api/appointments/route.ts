import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  return NextResponse.json(await prisma.appointment.findMany({ include: { client: true, professional: true }, orderBy: { date: "asc" } }));
}
export async function POST(req: Request) {
  return NextResponse.json(await prisma.appointment.create({ data: await req.json() }), { status: 201 });
}