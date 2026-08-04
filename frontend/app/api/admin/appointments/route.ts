import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, serviceTitle, address, scheduledAt, timeSlot = "08:00", notes } = body;

    if (!customerName || !serviceTitle || !address || !scheduledAt) {
      return NextResponse.json(
        { error: "Customer name, service, address and date are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        serviceTitle,
        address,
        scheduledAt: new Date(scheduledAt),
        timeSlot,
        notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "AGENDAMENTO_CRIADO",
        details: `Agendamento criado para ${customerName} - ${serviceTitle}`,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
