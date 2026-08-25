import React, { useRef, useState } from "react";
import { readImageFile, uid } from "../utils";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ----------------------------- Иконки (SVG) ----------------------------- */

const paths: Record<string, React.ReactNode> = {
  download: (
    <>
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4.5 20h15" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="m6.5 7 1 13h9l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  up: <path d="m5 15 7-7 7 7" />,
  down: <path d="m5 9 7 7 7-7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 13 4 4L19 7" />,
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7 10 4h4l1.5 3" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 18 5-5 3 3 3.5-3.5 3 3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 20c.5-3.5 2.7-5.5 5.5-5.5s5 2 5.5 5.5" />
      <path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8" />
      <path d="M17.5 14.8c1.6.9 2.7 2.6 3 5.2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.6 3.4 4.5 6.6 4.5c2 0 3.6 1.1 4.4 2.7.2.4.8.4 1 0 .8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.2 3.1 3.9 6.3C18.5 15.4 12 20 12 20z" />
  ),
  coins: (
    <>
      <ellipse cx="9.5" cy="8" rx="6" ry="3.2" />
      <path d="M3.5 8v4c0 1.8 2.7 3.2 6 3.2s6-1.4 6-3.2V8" />
      <path d="M3.5 12v4c0 1.8 2.7 3.2 6 3.2 1.5 0 2.9-.3 4-.8" />
      <path d="M17.5 11.5c1.8.4 3 1.4 3 2.5 0 1-.9 1.8-2.2 2.3M18.5 17.2c1.2.5 2 1.2 2 2 0 1.3-1.9 2.3-4.2 2.3-.9 0-1.7-.1-2.4-.4" />
    </>
  ),
  flag: (
    <>
      <path d="M5.5 21V4" />
      <path d="M5.5 4.5c4-2.2 8 2.2 12.5 0v9.5c-4.5 2.2-8.5-2.2-12.5 0" />
    </>
  ),
  handshake: (
    <>
      <path d="m3 7 4-2 5 2 4.5-2L21 7.5v5l-2 .5" />
      <path d="M12 7 8.5 10.5c-.8.8-.8 2 0 2.8.8.8 2 .8 2.8 0L13 11.5" />
      <path d="m13 11.5 3 3c.7.7.7 1.8 0 2.5-.7.7-1.8.7-2.5 0" />
      <path d="M3 7.5v5l3 4.5c.7 1 2.3 1 3 0" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 7.8v.2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  zoomIn: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
      <path d="M10.5 8v5M8 10.5h5" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
      <path d="M8 10.5h5" />
    </>
  ),
  spark: (
    <path d="M12 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6z" />
  ),
  doc: (
    <>
      <path d="M6 3.5h8L19 8.5v12H6z" />
      <path d="M14 3.5v5h5" />
      <path d="M9 13h7M9 16.5h7" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.4v.2" />
    </>
  ),
  refresh: (
    <>
      <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2L20 9" />
      <path d="M20 4.5V9h-4.5" />
      <path d="M19.5 12a7.5 7.5 0 0 1-13 5.2L4 15" />
      <path d="M4 19.5V15h4.5" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
};

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.8,
}: {
  name: keyof typeof paths | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}

/* ------------------------------ Поля форм ------------------------------ */

export const inputCls =
  "w-full rounded-md border border-pine-700/70 bg-pine-900/80 px-3 py-2 text-[15px] text-pine-100 placeholder:text-pine-400/50 outline-none transition-colors duration-150 hover:border-pine-600 focus:border-gold-400/80 focus:ring-2 focus:ring-gold-400/15";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine-300">
          {label}
        </span>
        {hint && <span className="text-[11px] text-pine-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      rows={4}
      {...props}
      className={cx(inputCls, "resize-y leading-relaxed", props.className)}
    />
  );
}

export function GoldButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-gold-400 px-4 py-2 text-[14px] font-bold text-pine-950 shadow-[0_2px_14px_-2px_rgba(238,188,98,0.45)] transition-all duration-150 hover:bg-gold-300 hover:shadow-[0_4px_20px_-2px_rgba(238,188,98,0.55)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md border border-pine-700 bg-pine-850/60 px-3.5 py-2 text-[13.5px] font-semibold text-pine-200 transition-all duration-150 hover:border-pine-600 hover:bg-pine-800 hover:text-pine-100 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SmallBtn({
  children,
  className,
  title,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      title={title}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-md border border-pine-700/80 bg-pine-900/70 px-2.5 text-[12.5px] font-semibold text-pine-300 transition-colors hover:border-gold-400/60 hover:text-gold-300 active:translate-y-px disabled:opacity-35 disabled:hover:border-pine-700/80 disabled:hover:text-pine-300",
        className
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------- Загрузка изображений --------------------------- */

export function ImageUpload({
  value,
  onChange,
  label = "Загрузить фото",
  hint = "PNG / JPG, до 10 МБ",
  className,
  imgClassName = "h-36",
  contain = false,
  onFail,
}: {
  value: string;
  onChange: (src: string) => void;
  label?: string;
  hint?: string;
  className?: string;
  imgClassName?: string;
  contain?: boolean;
  onFail?: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const src = await readImageFile(file);
      onChange(src);
    } catch (e) {
      onFail?.(e instanceof Error ? e.message : "Не удалось загрузить файл");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="group relative overflow-hidden rounded-md border border-pine-700/70 bg-pine-900">
          <img
            src={value}
            alt=""
            className={cx(
              "w-full",
              contain ? "bg-white object-contain p-2" : "object-cover",
              imgClassName
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-pine-950/70 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <SmallBtn type="button" onClick={() => inputRef.current?.click()}>
              <Icon name="refresh" size={13} /> Заменить
            </SmallBtn>
            <SmallBtn
              type="button"
              onClick={() => onChange("")}
              title="Удалить фото"
              className="px-2"
            >
              <Icon name="trash" size={13} />
            </SmallBtn>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cx(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed py-5 transition-all duration-150",
            imgClassName,
            drag
              ? "border-gold-400 bg-gold-400/10 text-gold-300"
              : "border-pine-600 bg-pine-900/50 text-pine-300 hover:border-gold-400/70 hover:bg-pine-900 hover:text-gold-300"
          )}
        >
          {busy ? (
            <span className="inline-flex items-center gap-2 text-[13px]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400" />
              Обрабатываем…
            </span>
          ) : (
            <>
              <Icon name="camera" size={22} />
              <span className="text-[13px] font-semibold">{label}</span>
              <span className="text-[11px] text-pine-400">{hint}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

/** Сетка из нескольких фото с подписями */
export function MultiPhotoUpload({
  items,
  onChange,
  onFail,
}: {
  items: { id: string; src: string; caption: string }[];
  onChange: (items: { id: string; src: string; caption: string }[]) => void;
  onFail?: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next = [...items];
      for (const f of Array.from(files).slice(0, 6)) {
        const src = await readImageFile(f, 1400);
        next.push({ id: uid(), src, caption: "" });
      }
      onChange(next);
    } catch (e) {
      onFail?.(e instanceof Error ? e.message : "Не удалось загрузить файл");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((it, i) => (
        <div
          key={it.id}
          className="anim-fade overflow-hidden rounded-md border border-pine-700/70 bg-pine-900"
        >
          <div className="group relative">
            <img src={it.src} alt="" className="h-24 w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(items.filter((x) => x.id !== it.id))}
              className="absolute right-1.5 top-1.5 rounded bg-pine-950/80 p-1 text-pine-200 opacity-0 transition-opacity hover:text-gold-300 group-hover:opacity-100"
              title="Удалить фото"
            >
              <Icon name="x" size={13} />
            </button>
            <span className="absolute left-1.5 top-1.5 rounded bg-pine-950/80 px-1.5 py-0.5 text-[10px] font-bold text-gold-300">
              {i + 1}
            </span>
          </div>
          <input
            value={it.caption}
            onChange={(e) =>
              onChange(
                items.map((x) =>
                  x.id === it.id ? { ...x, caption: e.target.value } : x
                )
              )
            }
            placeholder="Подпись к фото…"
            className="w-full bg-transparent px-2 py-1.5 text-[12px] text-pine-100 placeholder:text-pine-400/50 outline-none focus:bg-pine-850"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[8.5rem] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-pine-600 bg-pine-900/40 text-pine-300 transition-colors hover:border-gold-400/70 hover:text-gold-300"
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400" />
        ) : (
          <>
            <Icon name="image" size={20} />
            <span className="text-[12.5px] font-semibold">Добавить фото</span>
            <span className="text-[10.5px] text-pine-400">можно несколько</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}

/* ------------------------------ Модальное окно ------------------------------ */

export function Modal({
  open,
  title,
  children,
  actions,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-center justify-center bg-pine-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="anim-rise w-full max-w-md rounded-lg border border-pine-700 bg-pine-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl text-pine-50">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-pine-400 transition-colors hover:bg-pine-800 hover:text-pine-100"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="mt-3 text-[14px] leading-relaxed text-pine-300">
          {children}
        </div>
        <div className="mt-6 flex justify-end gap-2.5">{actions}</div>
      </div>
    </div>
  );
}

/* --------------------------------- Тосты --------------------------------- */

export type ToastKind = "success" | "error" | "info" | "warn";
export interface Toast {
  id: string;
  kind: ToastKind;
  msg: string;
}

const toastStyle: Record<ToastKind, { border: string; icon: string; color: string }> = {
  success: { border: "border-l-gold-400", icon: "check", color: "text-gold-300" },
  error: { border: "border-l-red-400", icon: "alert", color: "text-red-300" },
  warn: { border: "border-l-amber-400", icon: "alert", color: "text-amber-300" },
  info: { border: "border-l-pine-400", icon: "info", color: "text-pine-300" },
};

export function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-80 flex-col gap-2.5">
      {toasts.map((t) => {
        const s = toastStyle[t.kind];
        return (
          <div
            key={t.id}
            className={cx(
              "anim-toast pointer-events-auto flex items-start gap-2.5 rounded-md border border-pine-700 border-l-4 bg-pine-900/95 px-3.5 py-3 shadow-xl backdrop-blur",
              s.border
            )}
          >
            <span className={cx("mt-0.5 shrink-0", s.color)}>
              <Icon name={s.icon} size={16} strokeWidth={2} />
            </span>
            <p className="flex-1 text-[13px] leading-snug text-pine-100">
              {t.msg}
            </p>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-pine-400 transition-colors hover:text-pine-100"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
