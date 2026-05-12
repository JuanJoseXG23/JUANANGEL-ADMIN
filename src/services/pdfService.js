import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { calculatePaySlip } from "../utils/calculations";
import { fileSafeName, formatDate, formatMoney } from "../utils/formatters";
import { getEmployeeVariables, renderTemplate } from "../utils/templateEngine";
import { company, page } from "../templates/pdfStyles";
import { standardLaborLetter } from "../templates/letterTemplates";

function drawText(pageRef, text, x, y, options = {}) {
  pageRef.drawText(String(text ?? ""), {
    x,
    y,
    size: options.size || 11,
    font: options.font,
    color: options.color || rgb(0.12, 0.16, 0.24),
    lineHeight: options.lineHeight || 16,
  });
}

function wrapText(text, maxChars = 90) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = `${line} ${word}`.trim();
    if (next.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function createBaseDocument() {
  const pdf = await PDFDocument.create();
  const pageRef = pdf.addPage([page.width, page.height]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  return { pdf, pageRef, font, bold };
}

function drawHeader(pageRef, font, bold) {
  drawText(pageRef, company.legalName, page.marginX, page.top, { font: bold, size: 14, color: rgb(0.05, 0.1, 0.2) });
  drawText(pageRef, `Nit: ${company.nit}`, page.marginX, page.top - 18, { font, size: 10, color: rgb(0.36, 0.41, 0.48) });
  drawText(pageRef, company.brandName, page.marginX, page.top - 48, { font: bold, size: 12 });
  drawText(pageRef, `Tel. ${company.phone}`, page.marginX, page.top - 64, { font, size: 10 });
  drawText(pageRef, company.city, page.marginX, page.top - 80, { font, size: 10 });
  pageRef.drawLine({
    start: { x: page.marginX, y: page.top - 104 },
    end: { x: page.width - page.marginX, y: page.top - 104 },
    thickness: 1,
    color: rgb(0.84, 0.88, 0.94),
  });
}

export async function generateLaborLetter(employee, options = {}) {
  const { pdf, pageRef, font, bold } = await createBaseDocument();
  drawHeader(pageRef, font, bold);

  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  let y = page.top - 145;

  drawText(pageRef, currentDate, page.marginX, y, { font, size: 11 });
  y -= 58;

  const variables = getEmployeeVariables(employee, { cargo: options.cargo });
  const rendered = renderTemplate(options.contenido || standardLaborLetter.contenido, variables);

  rendered.split("\n").forEach((paragraph) => {
    if (!paragraph.trim()) {
      y -= 16;
      return;
    }

    const normalized = paragraph.trim();
    const isTitle = normalized === normalized.toUpperCase() && normalized.length < 60;
    wrapText(normalized, 92).forEach((line) => {
      drawText(pageRef, line, page.marginX, y, {
        font: isTitle ? bold : font,
        size: isTitle ? 13 : 11,
        lineHeight: 18,
        color: rgb(0.05, 0.1, 0.2),
      });
      y -= isTitle ? 24 : 18;
    });
  });

  y -= 92;
  pageRef.drawLine({
    start: { x: page.marginX, y },
    end: { x: page.marginX + 180, y },
    thickness: 1,
    color: rgb(0.12, 0.16, 0.24),
  });
  y -= 18;
  drawText(pageRef, company.signer, page.marginX, y, { font: bold, size: 11 });
  y -= 16;
  drawText(pageRef, company.signerRole, page.marginX, y, { font, size: 10 });

  const bytes = await pdf.save();
  const filename = `${fileSafeName(options.tipoDocumento || "carta-laboral")}-${fileSafeName(employee.nombre)}.pdf`;
  downloadPdf(bytes, filename);
  return filename;
}

export async function generatePaySlipPdf(employee, values) {
  const totals = calculatePaySlip(employee, values);
  const { pdf, pageRef, font, bold } = await createBaseDocument();

  const x = 44;
  const top = 720;
  const width = 524;
  const row = 18;
  const border = rgb(0.08, 0.08, 0.08);
  const text = rgb(0.03, 0.03, 0.03);

  function line(x1, y1, x2, y2, thickness = 0.6) {
    pageRef.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness,
      color: border,
    });
  }

  function rect(rx, ry, rw, rh) {
    pageRef.drawRectangle({
      x: rx,
      y: ry,
      width: rw,
      height: rh,
      borderWidth: 0.7,
      borderColor: border,
    });
  }

  function cell(value, cx, cy, options = {}) {
    drawText(pageRef, value, cx + 3, cy + 5, {
      font: options.bold ? bold : font,
      size: options.size || 7.5,
      color: text,
    });
  }

  function money(value) {
    return formatMoney(value).replace(/\s/g, "");
  }

  drawText(pageRef, "CREACIONES JUANANGEL S.A.S", x, top, { font: bold, size: 9, color: text });
  drawText(pageRef, `NIT ${company.nit}`, x + 390, top, { font, size: 7.5, color: text });
  drawText(pageRef, "COLILLA DE PAGO", x + 210, top - 14, { font: bold, size: 9, color: text });

  const headerTop = top - 28;
  const headerHeight = row * 3;
  rect(x, headerTop - headerHeight, width, headerHeight);
  line(x, headerTop - row, x + width, headerTop - row);
  line(x, headerTop - row * 2, x + width, headerTop - row * 2);
  line(x + 120, headerTop, x + 120, headerTop - headerHeight);
  line(x + 300, headerTop - row, x + 300, headerTop - headerHeight);
  line(x + 365, headerTop - row, x + 365, headerTop - headerHeight);
  line(x + 425, headerTop - row, x + 425, headerTop - headerHeight);

  cell("APELLIDOS Y NOMBRE", x, headerTop - row, { bold: true });
  cell(employee.nombre || "", x + 120, headerTop - row);
  cell("IDENTIFICACION", x, headerTop - row * 2, { bold: true });
  cell(employee.cedula || "", x + 120, headerTop - row * 2);
  cell("C DE C", x + 300, headerTop - row * 2, { bold: true });
  cell("C DE C", x + 365, headerTop - row * 2);
  cell(employee.cargo || "", x + 425, headerTop - row * 2);
  cell("V.HORA", x, headerTop - row * 3, { bold: true });
  cell("0", x + 120, headerTop - row * 3);
  cell("PERIODO", x + 300, headerTop - row * 3, { bold: true });
  cell(totals.periodo, x + 365, headerTop - row * 3);

  const tableTop = headerTop - headerHeight - 16;
  const tableRows = 10;
  const tableHeight = row * tableRows;
  const serviceX = x + 300;
  const dedX = x + 412;
  rect(x, tableTop - tableHeight, width, tableHeight);
  line(serviceX, tableTop, serviceX, tableTop - tableHeight);
  line(dedX, tableTop, dedX, tableTop - tableHeight);

  for (let index = 1; index < tableRows; index += 1) {
    line(x, tableTop - row * index, x + width, tableTop - row * index);
  }

  cell("LIQUIDACION", x, tableTop - row, { bold: true });
  cell("SERVICIO", serviceX, tableTop - row, { bold: true });
  cell("DEDUCCIONES", dedX, tableTop - row, { bold: true });

  const rows = [
    ["Salario basico", money(totals.salarioBase), "0"],
    ["Sub-transporte", money(totals.auxilioTransporte), "0"],
    ["Otros conceptos", "0", "0"],
    ["EPS", "0", money(totals.eps)],
    ["Pension", "0", money(totals.pension)],
    ["Otras deducciones", "0", money(totals.otrasDeducciones)],
    ["Total Devengado", money(totals.totalDevengado), ""],
    ["Total Deduccion", "", money(totals.totalDeduccion)],
    ["Neto a pagar", money(totals.netoPagar), ""],
  ];

  rows.forEach(([label, service, deduction], index) => {
    const y = tableTop - row * (index + 2);
    const strong = index >= 6;
    cell(label, x, y, { bold: strong });
    cell(service, serviceX + 42, y, { bold: strong });
    cell(deduction, dedX + 44, y, { bold: strong });
  });

  const signY = tableTop - tableHeight - 34;
  line(x, signY, x + 165, signY);
  line(x + 330, signY, x + 524, signY);
  drawText(pageRef, "Firma trabajador", x, signY - 11, { font, size: 7.5, color: text });
  drawText(pageRef, "Elaborado por", x + 330, signY - 11, { font, size: 7.5, color: text });

  const bytes = await pdf.save();
  const filename = `colilla-${fileSafeName(employee.nombre)}-${fileSafeName(totals.periodo)}.pdf`;
  downloadPdf(bytes, filename);
  return { filename, totals };
}
