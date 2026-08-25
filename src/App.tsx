import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReportData, SectionId } from "./types";
import { emptyReport } from "./types";
import { sampleReport } from "./sample";
import { hasContent, uid, wait } from "./utils";
import { countPages, ReportPreview, PAGE_W, PAGE_H } from "./components/preview";
import { exportReportPdf } from "./pdf";
import {
  DirectorEditor,
  FinanceEditor,
  OrgEditor,
  PartnersEditor,
  ProgramsEditor,
  TeamEditor,
} from "./components/editors";
import {
  cx,
  GhostButton,
  GoldButton,
  Icon,
  Modal,
  ToastHost,
  type Toast,
  type ToastKind,
} from "./components/ui";

const LS_KEY = "nko-annual-report-v1";
const PAGE_GAP = 40;

const SECTIONS: { id: SectionId; n: string; title: string; icon: string }[] = [
  { id: "org", n: "01", title: "Организация", icon: "info" },
  { id: "director", n: "02", title: "Слово руководителя", icon: "heart" },
  { id: "team", n: "03", title: "Команда", icon: "users" },
  { id: "programs", n: "04", title: "Программы", icon: "flag" },
  { id: "finance", n: "05", title: "Финансы", icon: "coins" },
  { id: "partners", n: "06", title: "Партнёры", icon: "handshake" },
];

function isSectionComplete(d: ReportData, id: SectionId): boolean {
  switch (id) {
    case "org":
      return Boolean(d.org.fullName.trim() && d.org.mission.trim());
    case "director":
      return Boolean(d.director.name.trim() && d.director.text.trim());
    case "team":
      return d.team.length > 0;
    case "programs":
      return d.programs.length > 0;
    case "finance":
      return (
        d.finances.income.some((r) => r.label || r.amount > 0) ||
        d.finances.expenses.some((r) => r.label || r.amount > 0)
      );
    case "partners":
      return d.partners.list.length > 0;
  }
}

function loadData(): ReportData {
  const base = emptyReport();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return base;
    const p = JSON.parse(raw) as Partial<ReportData>;
    if (!p || typeof p !== "object" || !p.org) return base;
    return {
      ...base,
      ...p,
      org: { ...base.org, ...(p.org || {}) },
      director: { ...base.director, ...(p.director || {}) },
      team: Array.isArray(p.team) ? p.team : base.team,
      partners: { ...base.partners, ...(p.partners || {}) },
      finances: { ...base.finances, ...(p.finances || {}) },
      programs: Array.isArray(p.programs) ? p.programs : base.programs,
    };
  } catch {
    return base;
  }
}

export default function App() {
  const [data, setData] = useState<ReportData>(loadData);
  const [active, setActive] = useState<SectionId>("org");
  const [zoom, setZoom] = useState(0.42);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<null | "sample" | "clear">(null);
  const [exporting, setExporting] = useState<{ page: number; total: number } | null>(null);
  const [stripRemote, setStripRemote] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const notify = useCallback((kind: ToastKind, msg: string) => {
    const id = uid();
    setToasts((t) => [...t.slice(-3), { id, kind, msg }]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      4500
    );
  }, []);

  /* Автосохранение черновика */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        setSavedAt(Date.now());
      } catch {
        notify(
          "warn",
          "Черновик не поместился в хранилище браузера — используйте фото меньшего размера."
        );
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [data, notify]);

  const pagesTotal = useMemo(() => countPages(data), [data]);
  const canExport = Boolean(
    data.org.fullName.trim() && data.org.mission.trim()
  );

  const getNodes = () =>
    Array.from(
      previewRef.current?.querySelectorAll<HTMLElement>(".report-page") || []
    );

  /* ------------------------------- Экспорт PDF ------------------------------- */
  async function handleExport() {
    if (exporting) return;
    if (!canExport) {
      notify(
        "warn",
        "Заполните название организации и миссию — без них отчёт не экспортируется."
      );
      setActive("org");
      setMobileView("editor");
      return;
    }
    setStripRemote(false);
    setExporting({ page: 0, total: pagesTotal });
    scrollRef.current?.scrollTo({ top: 0 });
    await wait(350);

    const finish = () => {
      setExporting(null);
      setStripRemote(false);
    };

    try {
      try {
        const nodes = getNodes();
        await exportReportPdf(
          nodes,
          `godovoy-otchet-${data.year || "nko"}.pdf`,
          (p) => setExporting(p)
        );
        notify("success", `PDF сохранён — страниц: ${nodes.length}.`);
      } catch {
        /* Фолбэк: браузер не отдал сторонние фото (CORS) — пробуем без них */
        setStripRemote(true);
        await wait(350);
        const nodes = getNodes();
        await exportReportPdf(
          nodes,
          `godovoy-otchet-${data.year || "nko"}.pdf`,
          (p) => setExporting(p)
        );
        notify(
          "warn",
          "PDF сохранён, но часть онлайн-фото заменена заглушками. Загрузите фотографии файлами — они попадут в отчёт полностью."
        );
      }
    } catch {
      notify("error", "Не удалось сформировать PDF. Попробуйте ещё раз.");
    } finally {
      finish();
    }
  }

  /* ------------------------------ Пример и очистка ------------------------------ */
  const applySample = () => {
    setData(sampleReport());
    setModal(null);
    notify("success", "Пример загружен: фонд «Тёплый дом», отчёт за 2025 год.");
  };
  const requestSample = () => {
    if (hasContent(data)) setModal("sample");
    else applySample();
  };
  const applyClear = () => {
    setData(emptyReport());
    setActive("org");
    setModal(null);
    notify("info", "Все данные очищены — отчёт пуст.");
  };
  const requestClear = () => {
    if (hasContent(data)) setModal("clear");
    else notify("info", "Отчёт и так пуст.");
  };

  const z = exporting ? 1 : zoom;
  const innerH = pagesTotal * PAGE_H + (pagesTotal - 1) * PAGE_GAP;

  const onFail = (m: string) => notify("error", m);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ------------------------------- Верхняя панель ------------------------------- */}
      <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-pine-700/60 bg-pine-950/60 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-400 text-pine-950 shadow-[0_2px_12px_-2px_rgba(238,188,98,0.5)]">
            <Icon name="doc" size={19} strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-[16px] leading-none text-pine-50">
              Годовой отчёт НКО
            </p>
            <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-pine-300">
              конструктор публичной отчётности
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div
            key={savedAt ?? 0}
            className="mr-1 hidden items-center gap-2 md:flex"
            title="Черновик автоматически сохраняется в браузере"
          >
            <span
              className={cx(
                "h-2 w-2 rounded-full",
                savedAt ? "anim-pulsedot bg-gold-400" : "bg-pine-600"
              )}
            />
            <span className="text-[11px] text-pine-300">
              {savedAt ? "Черновик сохранён" : "Новый отчёт"}
            </span>
          </div>

          <label className="hidden items-center gap-1.5 sm:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-pine-400">
              Год
            </span>
            <select
              value={data.year}
              onChange={(e) => setData((d) => ({ ...d, year: e.target.value }))}
              className="rounded-md border border-pine-700 bg-pine-900 px-2 py-1.5 text-[13px] font-bold text-gold-300 outline-none transition-colors hover:border-pine-600 focus:border-gold-400/70"
            >
              {["2022", "2023", "2024", "2025", "2026"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <GhostButton onClick={requestSample} className="hidden sm:inline-flex">
            <Icon name="spark" size={15} /> Пример
          </GhostButton>
          <GhostButton
            onClick={requestClear}
            title="Очистить все данные"
            className="px-2.5"
          >
            <Icon name="trash" size={15} />
          </GhostButton>
          <GoldButton onClick={handleExport} disabled={Boolean(exporting)}>
            <Icon name="download" size={16} strokeWidth={2.1} />
            {exporting
              ? `Экспорт ${exporting.page}/${exporting.total}`
              : "Скачать PDF"}
          </GoldButton>
        </div>
      </header>

      {/* Мобильный переключатель */}
      <div className="flex shrink-0 border-b border-pine-700/60 bg-pine-900/40 lg:hidden">
        {(
          [
            ["editor", "Редактор", "info"],
            ["preview", "Отчёт", "eye"],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setMobileView(id)}
            className={cx(
              "flex flex-1 items-center justify-center gap-2 py-2.5 text-[13px] font-bold transition-colors",
              mobileView === id
                ? "border-b-2 border-gold-400 text-gold-300"
                : "text-pine-300 hover:text-pine-100"
            )}
          >
            <Icon name={icon} size={15} /> {label}
            {id === "preview" && (
              <span className="rounded bg-pine-800 px-1.5 py-0.5 text-[10px] text-pine-300">
                {pagesTotal} стр.
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ------------------------------- Навигация ------------------------------- */}
        <aside
          className={cx(
            "w-[222px] shrink-0 flex-col border-r border-pine-700/50 bg-pine-900/40",
            mobileView === "preview" ? "hidden lg:flex" : "flex"
          )}
        >
          <nav className="flex-1 overflow-y-auto p-3">
            <p className="px-2.5 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-pine-400">
              Разделы отчёта
            </p>
            {SECTIONS.map((s) => {
              const done = isSectionComplete(data, s.id);
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActive(s.id);
                    setMobileView("editor");
                  }}
                  className={cx(
                    "group relative mb-1 flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left transition-all duration-150",
                    isActive
                      ? "bg-pine-800 text-pine-50"
                      : "text-pine-300 hover:bg-pine-850 hover:text-pine-100"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-gold-400" />
                  )}
                  <span
                    className={cx(
                      "font-display text-[13px]",
                      isActive ? "text-gold-300" : "text-pine-500"
                    )}
                  >
                    {s.n}
                  </span>
                  <span className="flex-1 text-[13px] font-semibold leading-tight">
                    {s.title}
                  </span>
                  {done ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                      <Icon name="check" size={10} strokeWidth={2.6} />
                    </span>
                  ) : (
                    <span className="h-[7px] w-[7px] rounded-full border border-pine-600 transition-colors group-hover:border-pine-400" />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-pine-700/50 p-3.5">
            <p className="text-[10.5px] leading-relaxed text-pine-400">
              Структура — по стандарту публичной отчётности{" "}
              <span className="text-pine-200">«Точка отсчёта»</span> (Форум
              Доноров): миссия, команда, программы, прозрачные финансы.
            </p>
          </div>
        </aside>

        {/* ------------------------------- Редактор ------------------------------- */}
        <section
          className={cx(
            "min-w-0 flex-1 overflow-y-auto",
            mobileView === "preview" && "hidden lg:block"
          )}
        >
          <div className="mx-auto max-w-[780px] px-5 py-7 lg:px-9">
            {active === "org" && (
              <OrgEditor data={data} setData={setData} onFail={onFail} />
            )}
            {active === "director" && (
              <DirectorEditor data={data} setData={setData} onFail={onFail} />
            )}
            {active === "team" && (
              <TeamEditor data={data} setData={setData} onFail={onFail} />
            )}
            {active === "programs" && (
              <ProgramsEditor data={data} setData={setData} onFail={onFail} />
            )}
            {active === "finance" && (
              <FinanceEditor data={data} setData={setData} />
            )}
            {active === "partners" && (
              <PartnersEditor data={data} setData={setData} onFail={onFail} />
            )}
          </div>
        </section>

        {/* ------------------------------- Предпросмотр ------------------------------- */}
        <section
          ref={scrollRef}
          className={cx(
            "preview-dots relative min-w-0 flex-1 overflow-y-auto border-l border-pine-700/40",
            mobileView === "editor" && !exporting && "hidden lg:block"
          )}
        >
          <div className="pointer-events-none sticky top-0 z-10 flex items-center justify-between px-5 py-3">
            <span className="pointer-events-auto flex items-center gap-2 rounded-md border border-pine-700/70 bg-pine-950/85 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-pine-300 backdrop-blur">
              <Icon name="eye" size={13} />
              Предпросмотр · {pagesTotal} стр. A4
            </span>
          </div>

          <div className="flex flex-col items-center px-6 pb-16 pt-2">
            <div className="relative" style={{ width: PAGE_W * z, height: innerH * z }}>
              <div
                ref={previewRef}
                className="absolute left-0 top-0 flex flex-col"
                style={{
                  gap: PAGE_GAP,
                  transform: `scale(${z})`,
                  transformOrigin: "top left",
                }}
              >
                <ReportPreview data={data} strip={stripRemote} />
              </div>
            </div>
          </div>

          {/* Масштаб */}
          <div
            className={cx(
              "fixed bottom-5 right-5 z-20 items-center gap-1 rounded-lg border border-pine-700 bg-pine-950/90 p-1.5 shadow-xl backdrop-blur",
              mobileView === "editor" && !exporting ? "hidden lg:flex" : "flex"
            )}
          >
            <button
              onClick={() => setZoom((v) => Math.max(0.2, +(v - 0.08).toFixed(2)))}
              className="rounded-md p-1.5 text-pine-300 transition-colors hover:bg-pine-800 hover:text-gold-300"
              title="Уменьшить"
            >
              <Icon name="zoomOut" size={16} />
            </button>
            <span className="tabular w-12 text-center text-[12px] font-bold text-pine-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((v) => Math.min(1.2, +(v + 0.08).toFixed(2)))}
              className="rounded-md p-1.5 text-pine-300 transition-colors hover:bg-pine-800 hover:text-gold-300"
              title="Увеличить"
            >
              <Icon name="zoomIn" size={16} />
            </button>
            <span className="mx-0.5 h-4 w-px bg-pine-700" />
            <button
              onClick={() => setZoom(0.42)}
              className="rounded-md px-2 py-1.5 text-[11px] font-bold text-pine-300 transition-colors hover:bg-pine-800 hover:text-gold-300"
              title="Масштаб по умолчанию"
            >
              42%
            </button>
          </div>
        </section>
      </div>

      {/* ------------------------------- Оверлей экспорта ------------------------------- */}
      {exporting && (
        <div className="anim-fade fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/85 p-4 backdrop-blur-sm">
          <div className="anim-rise w-full max-w-[400px] rounded-lg border border-pine-700 bg-pine-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <span className="h-9 w-9 shrink-0 animate-spin rounded-full border-[3px] border-gold-400/25 border-t-gold-400" />
              <div>
                <p className="font-display text-[17px] text-pine-50">
                  Готовим PDF…
                </p>
                <p className="mt-0.5 text-[12.5px] text-pine-300">
                  Страница {Math.max(exporting.page, 1)} из {exporting.total} —
                  не закрывайте вкладку
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-pine-800">
              <div
                className="progress-stripes h-full rounded-full bg-gold-400 transition-all duration-300"
                style={{
                  width: `${Math.max((exporting.page / exporting.total) * 100, 4)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- Модальные окна ------------------------------- */}
      <Modal
        open={modal === "sample"}
        title="Загрузить пример?"
        onClose={() => setModal(null)}
        actions={
          <>
            <GhostButton onClick={() => setModal(null)}>Отмена</GhostButton>
            <GoldButton onClick={applySample}>
              <Icon name="spark" size={15} /> Загрузить пример
            </GoldButton>
          </>
        }
      >
        Текущие данные будут заменены демонстрационным отчётом фонда «Тёплый
        дом» за 2025 год: миссия, команда, три программы с фоторепортажами,
        финансы и партнёры. Отменить действие нельзя.
      </Modal>
      <Modal
        open={modal === "clear"}
        title="Очистить отчёт?"
        onClose={() => setModal(null)}
        actions={
          <>
            <GhostButton onClick={() => setModal(null)}>Отмена</GhostButton>
            <button
              onClick={applyClear}
              className="inline-flex items-center gap-2 rounded-md bg-[#b8432f] px-4 py-2 text-[14px] font-bold text-white transition-colors hover:bg-[#cf523c] active:translate-y-px"
            >
              <Icon name="trash" size={15} /> Очистить всё
            </button>
          </>
        }
      >
        Все введённые данные, загруженные фотографии и таблицы будут удалены.
        Отчёт вернётся к пустому шаблону.
      </Modal>

      <ToastHost toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
