import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export interface ExportProgress {
  page: number;
  total: number;
}

/**
 * Рендерит массив страниц (.report-page) в PDF формата A4.
 * Каждая страница должна иметь размер 794×1123 px.
 */
export async function exportReportPdf(
  pages: HTMLElement[],
  fileName: string,
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  if (!pages.length) throw new Error("Нет страниц для экспорта");

  try {
    // дожидаемся загрузки веб-шрифтов, чтобы текст в PDF был «своим»
    await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
      ?.ready;
  } catch {
    /* не критично */
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    onProgress?.({ page: i + 1, total: pages.length });
    // даём браузеру отрисовать кадр с новым прогрессом
    await new Promise((r) => setTimeout(r, 60));

    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const img = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }

  pdf.save(fileName);
}
