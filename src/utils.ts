export const uid = () => Math.random().toString(36).slice(2, 10);

export const fmtMoney = (n: number) =>
  `${new Intl.NumberFormat("ru-RU").format(Math.round(n || 0))} ₽`;

export const fmtInt = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n || 0));

export function fmtShort(n: number): string {
  const v = Math.round(n || 0);
  if (Math.abs(v) >= 1_000_000)
    return `${(v / 1_000_000).toFixed(1).replace(".", ",")} млн ₽`;
  if (Math.abs(v) >= 10_000)
    return `${Math.round(v / 1000)} тыс ₽`;
  return fmtMoney(v);
}

export function initials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "·";
  return parts
    .slice(0, 2)
    .map((w) => (w[0] || "").toUpperCase())
    .join("");
}

export const isRemote = (src: string) => /^https?:/i.test(src || "");

export const sum = (rows: { amount: number }[]) =>
  rows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Читает файл изображения, уменьшает до maxDim и возвращает dataURL */
export function readImageFile(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Файл не похож на изображение"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const isPng = file.type === "image/png";
          if (scale >= 1 && (!isPng || file.size < 500_000)) {
            resolve(src);
            return;
          }
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(
            canvas.toDataURL(isPng ? "image/png" : "image/jpeg", 0.86)
          );
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => reject(new Error("Не удалось декодировать изображение"));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function hasContent(d: {
  org: { fullName: string; mission: string };
  team: unknown[];
  programs: unknown[];
  director: { name: string; text: string };
}): boolean {
  return Boolean(
    d.org.fullName ||
      d.org.mission ||
      d.director.name ||
      d.director.text ||
      d.team.length ||
      d.programs.length
  );
}
