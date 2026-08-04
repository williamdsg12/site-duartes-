import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      customerName,
      cpfCnpj,
      customerPhone,
      customerWhatsapp,
      customerEmail,
      customerAddress,
      customerCity,
      customerState,
      customerCep,
      notes,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      expirationDate,
      status,
    } = body;

    const updateData: any = {};
    if (customerName !== undefined) updateData.customerName = customerName;
    if (cpfCnpj !== undefined) updateData.cpfCnpj = cpfCnpj;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (customerWhatsapp !== undefined) updateData.customerWhatsapp = customerWhatsapp;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerAddress !== undefined) updateData.customerAddress = customerAddress;
    if (customerCity !== undefined) updateData.customerCity = customerCity;
    if (customerState !== undefined) updateData.customerState = customerState;
    if (customerCep !== undefined) updateData.customerCep = customerCep;
    if (notes !== undefined) updateData.notes = notes;
    if (subtotal !== undefined) updateData.subtotal = Number(subtotal);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (total !== undefined) updateData.total = Number(total);
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (expirationDate !== undefined) updateData.expirationDate = expirationDate;
    if (status !== undefined) updateData.status = status;

    if (items) {
      await prisma.quotationItem.deleteMany({ where: { quotationId: id } });
      updateData.items = {
        create: items.map((item: any) => ({
          serviceName: item.serviceName || item.description || "Serviço Geral",
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || Number(item.valor) || 0,
          subtotal:
            (Number(item.quantity) || 1) *
            (Number(item.unitPrice) || Number(item.valor) || 0),
        })),
      };
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "ORCAMENTO_ATUALIZADO",
        details: `Orçamento ${updated.code} atualizado (${updated.status})`,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await prisma.quotation.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "ORCAMENTO_EXCLUIDO",
        details: `Orçamento ${deleted.code} excluído`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json({ error: "Failed to delete quotation" }, { status: 500 });
  }
}
