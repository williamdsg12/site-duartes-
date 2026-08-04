"use client";

import React, { useState } from "react";
import { Printer, Download, Image as ImageIcon, Send, X, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QuotationDocument from "./QuotationDocument";

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

export default function QuotationPdfView({
  quotation,
  onClose,
}: {
  quotation: QuotationData;
  onClose: () => void;
}) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [generatingPng, setGeneratingPng] = useState(false);

  const code = quotation.code || `ORC-${new Date().getFullYear()}-00001`;

  // Generate WhatsApp Message with Bulleted Services List
  const buildWhatsappMessage = () => {
    const servicesList =
      quotation.items && quotation.items.length > 0
        ? quotation.items
            .map((i) => `• ${i.serviceName || i.description || "Serviço"} (${i.quantity}x)`)
            .join("\n")
        : "• Serviço de Manutenção Duarte's";

    return `Olá, ${quotation.customerName}! 👋

Segue o orçamento referente ao serviço solicitado de:

${servicesList}

💰 Total: R$ ${quotation.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
💳 Forma de Pagamento: ${quotation.paymentMethod || "PIX"}

O documento oficial em PDF / Imagem está pronto para sua análise.

Caso tenha qualquer dúvida, estaremos à disposição.

Agradecemos pela preferência!

Duarte's Manutenção em Geral
📞 (44) 9 9706-9677`;
  };

  // TRUE PDF Generation with Proportional A4 Scaling (jsPDF + html2canvas)
  const handleDownloadPdf = async () => {
    const docElement = document.getElementById("quotation-document");
    if (!docElement) return;

    setGeneratingPdf(true);
    try {
      const canvas = await html2canvas(docElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scaled dimensions to fit perfectly on 1 single A4 page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const renderWidth = imgWidth * ratio;
      const renderHeight = imgHeight * ratio;

      const xOffset = (pdfWidth - renderWidth) / 2;
      const yOffset = 0; // Align top

      pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight);
      pdf.save(`Orcamento-Duarte-${code}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Falha ao gerar o PDF verdadeiro.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // PNG Image Generation (html2canvas)
  const handleDownloadPng = async (openWhatsappAfter = false) => {
    const docElement = document.getElementById("quotation-document");
    if (!docElement) return;

    setGeneratingPng(true);
    try {
      const canvas = await html2canvas(docElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1200,
      });

      const link = document.createElement("a");
      link.download = `Orcamento-Duarte-${code}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      if (openWhatsappAfter) {
        handleOpenWhatsapp();
      }
    } catch (err) {
      console.error("Erro ao gerar Imagem:", err);
      alert("Falha ao gerar a imagem PNG.");
    } finally {
      setGeneratingPng(false);
    }
  };

  // Open WhatsApp Web with Custom Text
  const handleOpenWhatsapp = () => {
    const phone = (quotation.customerWhatsapp || quotation.customerPhone || "").replace(/\D/g, "");
    const waTarget = phone ? (phone.startsWith("55") ? phone : `55${phone}`) : "5544997069677";
    const text = encodeURIComponent(buildWhatsappMessage());
    window.open(`https://wa.me/${waTarget}?text=${text}`, "_blank");
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-2 sm:p-6">
      <div className="bg-white w-full max-w-[220mm] rounded-2xl shadow-2xl overflow-hidden my-auto print:shadow-none print:m-0 print:w-full print:rounded-none">
        {/* Action Top Bar (Hidden during print) */}
        <div className="bg-[#0B3C5D] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="text-amber-400" size={20} />
            <span className="font-heading font-extrabold text-sm sm:text-base">
              Orçamento #{code} - Pré-visualização Oficial
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="px-3.5 py-2 bg-amber-400 text-[#0B3C5D] rounded-xl font-extrabold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Download size={15} /> {generatingPdf ? "Gerando PDF..." : "Baixar PDF Verdadeiro"}
            </button>

            <button
              onClick={() => handleDownloadPng(true)}
              disabled={generatingPng}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <ImageIcon size={15} /> {generatingPng ? "Gerando..." : "Compartilhar Imagem (PNG)"}
            </button>

            <button
              onClick={handleOpenWhatsapp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Send size={15} /> WhatsApp (Mensagem)
            </button>

            <button
              onClick={handleNativePrint}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Printer size={15} /> Imprimir
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Container with exact A4 Quotation Document */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-x-auto print:p-0 print:bg-white flex justify-center">
          <QuotationDocument quotation={quotation} />
        </div>
      </div>
    </div>
  );
}
