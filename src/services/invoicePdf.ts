import type { Fatura, FaturaLineItem } from "../data/sampleData"
import { formatCurrency, formatDate, getFaturaLineItems } from "../data/sampleData"
import stampLogoUrl from "../assets/galani-stamp.jpg"

export type InvoiceSnapshot = {
  fatura: Fatura
  clientName: string
  items?: FaturaLineItem[]
}

const createFallbackLine = (fatura: Fatura): FaturaLineItem => ({
  id: `${fatura.id}-fallback`,
  faturaId: fatura.id,
  description: fatura.description,
  colorType: "-",
  quantity: fatura.quantity,
  unit: "cope",
  unitPrice: fatura.unitPrice,
})

const buildInvoiceHtml = (snapshot: InvoiceSnapshot): string => {
  const { fatura, clientName } = snapshot
  const items = snapshot.items ?? getFaturaLineItems(fatura.id)
  const lines = items.length > 0 ? items : [createFallbackLine(fatura)]
  const total = lines.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const lineRows = lines
    .map(
      (line, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(line.description)}</td>
            <td>${escapeHtml(line.colorType || "-")}</td>
            <td>${line.quantity}</td>
            <td>${line.unit}</td>
            <td>${formatCurrency(line.unitPrice)}</td>
            <td>${formatCurrency(line.quantity * line.unitPrice)}</td>
          </tr>`
    )
    .join("\n")

  const headerRows = `
        <tr class="invoice-meta-row">
          <th>Numri i fatures</th>
          <td>${escapeHtml(fatura.nr)}</td>
        </tr>
        <tr class="invoice-meta-row">
          <th>Data</th>
          <td>${formatDate(fatura.date)}</td>
        </tr>
        <tr class="invoice-meta-row">
          <th>Klienti</th>
          <td>${escapeHtml(clientName)}</td>
        </tr>
        <tr class="invoice-meta-row">
          <th>Statusi</th>
          <td>${fatura.paid ? "Paguar" : "Pa paguar"}</td>
        </tr>`

  return `<!DOCTYPE html>
<html lang="sq">
  <head>
    <meta charset="utf-8" />
    <title>Fatura ${escapeHtml(fatura.nr)}</title>
    <style>
      @page { margin: 24mm; }
      body {
        font-family: "Helvetica", Arial, sans-serif;
        color: #0f172a;
        margin: 0;
        padding: 0;
      }
      .invoice-wrapper {
        max-width: 760px;
        margin: 0 auto;
        padding: 32px;
        position: relative;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 26px;
      }
      .invoice-meta {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 24px;
      }
      .invoice-meta-row th {
        text-align: left;
        padding: 4px 12px 4px 0;
        font-weight: 600;
        width: 180px;
      }
      .invoice-meta-row td {
        padding: 4px 0;
      }
      .invoice-table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 28px;
      }
      .invoice-table th {
        text-align: left;
        background: #eff6ff;
        border-bottom: 1px solid #cbd5f5;
        padding: 10px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .invoice-table td {
        padding: 10px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 13px;
      }
      .invoice-total {
        text-align: right;
        font-size: 18px;
        font-weight: 700;
      }
      .invoice-stamp {
        position: absolute;
        top: 60px;
        right: 46px;
        width: 140px;
        opacity: 0.25;
        transform: rotate(-20deg);
      }
      .footer-note {
        font-size: 12px;
        color: #64748b;
        margin-top: 30px;
      }
      .print-actions {
        display: none;
      }
      @media print {
        .print-actions { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="invoice-wrapper">
      <img src="${stampLogoUrl}" alt="Galani Stamp" class="invoice-stamp" />
      <div class="print-actions">
        <button onclick="window.print()">Printo / Ruaj si PDF</button>
      </div>
      <h1>Fatura ${escapeHtml(fatura.nr)}</h1>
      <table class="invoice-meta">
        <tbody>
${headerRows}
        </tbody>
      </table>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Pershkrimi</th>
            <th>Lloji i ngjyres</th>
            <th>Sasia</th>
            <th>Njesia</th>
            <th>Cmimi</th>
            <th>Totali</th>
          </tr>
        </thead>
        <tbody>
${lineRows}
        </tbody>
      </table>
      <div class="invoice-total">Totali pergjithshem: ${formatCurrency(total)}</div>
      <p class="footer-note">Ky dokument eshte gjeneruar automatikisht per qellime demonstrimi. Ju lutem kontrolloni para se ta dergoni te klienti.</p>
    </div>
    <script>
      window.addEventListener('load', () => {
        window.focus();
        setTimeout(() => window.print(), 300);
        setTimeout(() => {
          if (window.matchMedia('print').matches === false) {
            window.close();
          }
        }, 2000);
      });
    </script>
  </body>
</html>`
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

export const openInvoicePrintWindow = (snapshot: InvoiceSnapshot) => {
  const html = buildInvoiceHtml(snapshot)
  const printWindow = window.open("", "_blank", "width=900,height=650")
  if (!printWindow) {
    return
  }
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}


