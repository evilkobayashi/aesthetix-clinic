import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  return NextResponse.json(await prisma.professional.findMany());
}
export async function POST(req: Request) {
  return NextResponse.json(await prisma.professional.create({ data: await req.json() }), { status: 201 });
}