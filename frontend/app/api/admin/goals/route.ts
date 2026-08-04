import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let goal = await prisma.monthlyGoal.findUnique({
      where: { id: "default" },
    });

    if (!goal) {
      goal = await prisma.monthlyGoal.create({
        data: {
          id: "default",
          quotesGoal: 50,
          clientsGoal: 30,
          revenueGoal: 20000,
        },
      });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { quotesGoal, clientsGoal, revenueGoal } = body;

    const goal = await prisma.monthlyGoal.upsert({
      where: { id: "default" },
      update: {
        quotesGoal: Number(quotesGoal) || 50,
        clientsGoal: Number(clientsGoal) || 30,
        revenueGoal: Number(revenueGoal) || 20000,
      },
      create: {
        id: "default",
        quotesGoal: Number(quotesGoal) || 50,
        clientsGoal: Number(clientsGoal) || 30,
        revenueGoal: Number(revenueGoal) || 20000,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json({ error: "Failed to update goals" }, { status: 500 });
  }
}
