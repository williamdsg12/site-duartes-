import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const minVal = searchParams.get("minVal");
    const maxVal = searchParams.get("maxVal");

    const where: any = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerCity: { contains: search, mode: "insensitive" } },
        { cpfCnpj: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { customerAddress: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (minVal !== null && minVal !== undefined && minVal !== "") {
      where.total = { ...where.total, gte: Number(minVal) };
    }
    if (maxVal !== null && maxVal !== undefined && maxVal !== "") {
      where.total = { ...where.total, lte: Number(maxVal) };
    }

    const quotations = await prisma.quotation.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      cpfCnpj = "",
      customerPhone = "",
      customerWhatsapp = "",
      customerEmail = "",
      customerAddress = "",
      customerCity = "Paranavaí",
      customerState = "PR",
      customerCep = "",
      notes = "",
      items = [],
      subtotal = 0,
      discount = 0,
      total = 0,
      paymentMethod = "PIX",
      expirationDate = "",
      status = "PENDING",
    } = body;

    if (!customerName) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    const count = await prisma.quotation.count();
    const code = `ORC-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    const quotation = await prisma.quotation.create({
      data: {
        code,
        customerName,
        cpfCnpj,
        customerPhone,
        customerWhatsapp: customerWhatsapp || customerPhone,
        customerEmail,
        customerAddress,
        customerCity,
        customerState,
        customerCep,
        notes,
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        total: Number(total) || 0,
        paymentMethod,
        expirationDate,
        status,
        items: {
          create: items.map((item: any) => ({
            serviceName: item.serviceName || item.description || "Serviço Geral",
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || Number(item.valor) || 0,
            subtotal:
              (Number(item.quantity) || 1) *
              (Number(item.unitPrice) || Number(item.valor) || 0),
          })),
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "ORCAMENTO_CRIADO",
        details: `Orçamento ${code} criado para ${customerName} (R$ ${total.toFixed(2)})`,
      },
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
}
