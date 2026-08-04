"use client";

import React from "react";
import Image from "next/image";

interface Item {
  serviceName?: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  valor?: number;
  subtotal: number;
}

interface QuotationData {
  id?: string;
  code?: string;
  customerName: string;
  cpfCnpj?: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  customerState?: string;
  customerCep?: string;
  notes?: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  expirationDate?: string;
  createdAt?: string;
  items: Item[];
}

export default function QuotationDocument({ quotation }: { quotation: QuotationData }) {
  const dateStr = quotation.createdAt
    ? new Date(quotation.createdAt).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR");

  const itemsList = quotation.items || [];
  // Calculate dynamic empty rows so overall document fits cleanly on A4 sheet
  const targetMinRows = 9;
  const emptyRowsCount = Math.max(0, targetMinRows - itemsList.length);

  const formattedAddress = [
    quotation.customerAddress,
    quotation.customerCity,
    quotation.customerState,
    quotation.customerCep ? `CEP ${quotation.customerCep}` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div
      id="quotation-document"
      className="relative bg-white text-slate-900 font-sans shadow-2xl overflow-hidden print:shadow-none print:m-0"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Print Page Styles to suppress browser URLs/headers and force A4 portrait */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          header,
          aside,
          nav {
            display: none !important;
          }
          #quotation-document {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Background Watermark (Marca d'Água Suave no Fundo) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06] select-none overflow-hidden">
        <div className="w-[480px] h-[480px] relative">
          <Image
            src="/assets/logo-hero.png"
            alt="Duarte Watermark"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Blue Header Banner */}
          <div className="bg-[#0092E4] text-white px-8 py-5 flex items-center justify-between relative overflow-hidden">
            {/* Mascot Cartoon & Logo Title */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src="/assets/logo.png"
                  alt="Duarte's Mascote"
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-md"
                />
              </div>
              <div>
                <div className="font-heading font-black text-3xl italic tracking-tight text-white drop-shadow-sm">
                  Duarte&apos;s
                </div>
                <div className="font-sans font-extrabold text-[11px] tracking-widest text-white/95 uppercase mt-0.5">
                  MANUTENÇÃO EM GERAL
                </div>
              </div>
            </div>

            {/* Contact Information Right */}
            <div className="text-right text-xs space-y-1 font-medium shrink-0">
              <div className="flex items-center justify-end gap-2 text-white font-extrabold text-sm">
                <span className="bg-white/20 p-1 rounded-full text-xs">📞</span>
                <span>(44) 9.9706-9677</span>
              </div>
              <div className="flex items-center justify-end gap-2 text-white/95 text-xs">
                <span className="bg-white/20 p-1 rounded-full text-[10px]">📷</span>
                <span>@duarteslimpezasmanutencao</span>
              </div>
              <div className="flex items-center justify-end gap-2 text-white/90 text-[11px]">
                <span className="bg-white/20 p-1 rounded-full text-[10px]">✉️</span>
                <span>Duarteslimpezacaixadeagua@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Sublined Identification Fields - Fully Responsive and Wrap-Friendly */}
          <div className="px-8 pt-6 pb-2 space-y-3 text-xs font-semibold text-slate-800">
            {/* Data Line */}
            <div className="flex justify-end">
              <div className="flex items-baseline gap-2 w-64 border-b border-slate-500 pb-0.5">
                <span className="font-bold text-slate-700 shrink-0">Data:</span>
                <span className="font-mono text-slate-900 flex-1 text-center font-extrabold">
                  {dateStr}
                </span>
              </div>
            </div>

            {/* Cliente Line */}
            <div className="flex items-start gap-2 border-b border-slate-500 pb-1">
              <span className="font-bold text-slate-700 w-24 shrink-0 pt-0.5">Cliente:</span>
              <span className="text-slate-900 font-extrabold text-sm flex-1 break-words whitespace-normal leading-snug">
                {quotation.customerName || "------------------------"}
              </span>
            </div>

            {/* CPF / CNPJ Line */}
            <div className="flex items-start gap-2 border-b border-slate-500 pb-1">
              <span className="font-bold text-slate-700 w-24 shrink-0 pt-0.5">CPF / CNPJ:</span>
              <span className="text-slate-900 font-mono font-bold flex-1 break-words whitespace-normal leading-snug">
                {quotation.cpfCnpj || "------------------------"}
              </span>
            </div>

            {/* Endereço Line */}
            <div className="flex items-start gap-2 border-b border-slate-500 pb-1">
              <span className="font-bold text-slate-700 w-24 shrink-0 pt-0.5">Endereço:</span>
              <span className="text-slate-900 flex-1 break-words whitespace-normal leading-snug font-medium">
                {formattedAddress || "Paranavaí - PR"}
              </span>
            </div>

            {/* Telefone Line */}
            <div className="flex items-start gap-2 border-b border-slate-500 pb-1">
              <span className="font-bold text-slate-700 w-24 shrink-0 pt-0.5">Telefone:</span>
              <span className="text-slate-900 font-mono font-bold flex-1 break-words whitespace-normal leading-snug">
                {quotation.customerWhatsapp || quotation.customerPhone || "(44) 9.9706-9677"}
              </span>
            </div>
          </div>

          {/* Service Grid Table matching Reference Sheet with Dynamic Heights */}
          <div className="px-8 pt-4">
            <table className="w-full border-collapse border border-slate-700 text-xs table-fixed">
              <thead>
                <tr className="border-b border-slate-700 text-slate-900 font-extrabold uppercase text-[11px] bg-slate-50/50">
                  <th className="border-r border-slate-700 p-2.5 text-center w-[58%]">
                    DESCRIÇÃO
                  </th>
                  <th className="border-r border-slate-700 p-2.5 text-center w-[20%]">
                    QUANTIDADE
                  </th>
                  <th className="p-2.5 text-center w-[22%]">VALOR</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-400">
                    <td className="border-r border-slate-400 px-3 py-2 font-semibold text-slate-900 align-middle break-words whitespace-normal leading-snug">
                      {item.serviceName || item.description || "Serviço"}
                    </td>
                    <td className="border-r border-slate-400 px-3 py-2 text-center font-bold text-slate-800 align-middle">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-extrabold text-slate-900 align-middle whitespace-nowrap">
                      R${" "}
                      {(item.subtotal || item.quantity * (item.unitPrice || item.valor || 0)).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                  </tr>
                ))}

                {/* Empty Fill Rows to maintain paper grid proportion */}
                {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-b border-slate-300 h-8">
                    <td className="border-r border-slate-400 px-3 py-1" />
                    <td className="border-r border-slate-400 px-3 py-1" />
                    <td className="px-3 py-1" />
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Box Bottom Right */}
            <div className="flex justify-end items-center mt-3">
              <div className="flex items-center border border-slate-700 font-bold text-sm bg-white shadow-xs">
                <span className="px-4 py-1.5 bg-slate-100 border-r border-slate-700 text-slate-800">
                  Total:
                </span>
                <span className="px-6 py-1.5 font-mono text-slate-900 text-base font-black">
                  R$ {quotation.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Signature / Approval Area */}
          <div className="px-8 pt-8 flex items-center gap-3 text-xs font-semibold text-slate-800">
            <span>Aprovado por:</span>
            <span className="font-heading font-black text-xl italic text-slate-900 border-b border-slate-400 px-4 pb-0.5">
              Duarte&apos;s
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600">
              MANUTENÇÃO EM GERAL
            </span>
          </div>
        </div>

        {/* Bottom Blue Footer Banner */}
        <div className="bg-[#0092E4] text-white py-4 px-6 text-center mt-6 shrink-0">
          <div className="font-bold text-xs sm:text-sm leading-snug">
            Ficamos Felizes em atende-los e agradecemos pela preferencia!!
          </div>
          <div className="text-[11px] font-medium mt-0.5 text-white/90">
            Comprometimento com os nossos Clientes
          </div>
        </div>
      </div>
    </div>
  );
}
