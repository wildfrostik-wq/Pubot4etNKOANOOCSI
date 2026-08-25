import React from "react";
import type { MoneyRow, Program, ReportData } from "../types";
import { fmtMoney, fmtShort, initials, isRemote, sum } from "../utils";

export const PAGE_W = 794;
export const PAGE_H = 1123;

const GOLD_DARK = "#c48a2b";
const INK = "#16352e";

/* ------------------------------ вспомогательное ------------------------------ */

function PImg({
  src,
  alt = "",
  className = "",
  strip,
}: {
  src: string;
  alt?: string;
  className?: string;
  strip?: boolean;
}) {
  if (!src) return null;
  if (strip && isRemote(src))
    return <div className={`${className} bg-[#e3dcc8]`} aria-hidden />;
  return <img src={src} alt={alt} className={className} />;
}

function Monogram({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-pine-800 font-display text-gold-300 ${className}`}
    >
      {initials(name)}
    </div>
  );
}

function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-display text-[17px] leading-none text-gold-600">
          {index}
        </span>
        <span className="h-[2px] w-9 bg-gold-500" />
        <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-ink/50">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-2.5 font-display text-[38px] leading-[1.08] text-ink">
        {title}
      </h2>
      <div className="mt-3.5 h-[3px] w-14 bg-gold-500" />
    </div>
  );
}

function LightPage({
  data,
  n,
  total,
  children,
}: {
  data: ReportData;
  n: number;
  total: number;
  children: React.ReactNode;
}) {
  const o = data.org;
  return (
    <div className="flex h-full flex-col px-14 pb-8 pt-9">
      <header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {o.logo ? (
              <img src={o.logo} alt="" className="h-7 max-w-[110px] object-contain" />
            ) : (
              <Monogram
                name={o.shortName || o.fullName || "НКО"}
                className="h-7 w-7 rounded-[3px] text-[11px]"
              />
            )}
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink/70">
              {o.shortName || o.fullName || "Ваша организация"}
            </span>
          </div>
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-ink/45">
            Годовой отчёт {data.year}
          </span>
        </div>
        <div className="mt-3.5 h-px bg-ink/15" />
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-6">
        {children}
      </main>
      <footer className="flex items-center justify-between pt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/45">
        <span>{o.website || o.email || "публичный годовой отчёт"}</span>
        <span className="flex items-center gap-2 text-ink/60">
          <span className="inline-block h-[7px] w-[7px] bg-gold-500" />
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </footer>
    </div>
  );
}

const pageBase: React.CSSProperties = { width: PAGE_W, height: PAGE_H };

/* --------------------------------- Обложка --------------------------------- */

function CoverPage({ data, strip }: { data: ReportData; strip?: boolean }) {
  const o = data.org;
  return (
    <div
      className="relative h-full w-full text-paper"
      style={{
        background: "linear-gradient(163deg,#06231e 0%,#092f29 52%,#0d4038 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-[18px] border border-gold-400/40" />
      <div className="relative flex h-full flex-col px-16 py-11">
        <div className="flex items-center justify-between">
          {o.logo ? (
            <img
              src={o.logo}
              alt=""
              className="h-11 max-w-[170px] object-contain"
            />
          ) : (
            <Monogram
              name={o.shortName || o.fullName || "НКО"}
              className="h-11 w-11 rounded-[3px] text-[17px]"
            />
          )}
          {o.website && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-pine-200/80">
              {o.website}
            </span>
          )}
        </div>

        {/* Заголовок отчёта */}
        <div className="mt-7">
          <div className="h-[3px] w-14 bg-gold-400" />
          <p className="mt-3.5 text-[11.5px] font-bold uppercase tracking-[0.3em] text-gold-300">
            Публичный годовой отчёт
          </p>
          <h1 className="mt-2 line-clamp-3 font-display text-[34px] leading-[1.15] text-pine-50">
            {o.fullName || "Название вашей организации"}
          </h1>
          {(o.address || o.city) && (
            <p className="mt-2 line-clamp-2 max-w-[560px] text-[11.5px] leading-snug text-pine-200/85">
              {o.address || o.city}
            </p>
          )}
          <p className="mt-2.5 font-display text-[23px] leading-none text-gold-400">
            за {data.year} год
          </p>
          {o.mission && (
            <p className="mt-4 line-clamp-3 max-w-[560px] border-l-2 border-gold-400/70 pl-3.5 text-[13px] leading-[1.6] text-pine-100/90">
              {o.mission}
            </p>
          )}
        </div>

        {/* Классическое фото 4:3 в двойной рамке */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-5">
          {o.coverPhoto ? (
            <div className="max-w-full border border-gold-400/60 bg-pine-950/50 p-[9px] shadow-[0_26px_60px_-22px_rgba(0,0,0,0.75)]">
              <div className="border border-gold-400/25 p-[3px]">
                <PImg
                  src={o.coverPhoto}
                  strip={strip}
                  className="block aspect-[4/3] w-[452px] max-w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-[452px] max-w-full flex-col items-center justify-center gap-2 border border-dashed border-gold-400/45 bg-pine-950/35 text-pine-200/80">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8.5 7 10 4h4l1.5 3" />
                <circle cx="12" cy="13.5" r="3.5" />
              </svg>
              <p className="text-[12px] font-semibold">Фотография на обложку</p>
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-pine-300/70">
                раздел «Организация» · формат 4:3
              </p>
            </div>
          )}
        </div>

        {/* Подпись платформы */}
        <div className="border-t border-gold-400/30 pt-3.5 text-center">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.24em] text-pine-300/85">
            Отчёт подготовлен на платформе
          </p>
          <p className="mt-1 text-[11px] font-semibold leading-snug text-pine-100">
            АНО «Общественный центр социальных инициатив» — ресурсный центр
            поддержки НКО
          </p>
          <p className="mt-0.5 text-[10.5px] font-bold text-gold-300">
            anoocsi.ru&ensp;·&ensp;anoocsi@yandex.ru
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Об организации ------------------------------- */

function OrgPage({
  data,
  n,
  total,
  sec,
  strip,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
  strip?: boolean;
}) {
  const o = data.org;
  const info: [string, string][] = [
    ["Год основания", o.founded],
    ["География", o.city],
    ["ИНН", o.inn],
    ["ОГРН", o.ogrn],
    ["E-mail", o.email],
    ["Сайт", o.website],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <LightPage data={data} n={n} total={total}>
      <SectionHead index={sec} eyebrow="Об организации" title="Кто мы" />
      {o.mission ? (
        <p className="mt-7 font-display text-[21px] leading-[1.5] text-ink">
          <span className="mr-1.5 align-[-6px] text-[42px] leading-none text-gold-500">
            «
          </span>
          {o.mission}
          <span className="ml-1 text-[42px] leading-none text-gold-500">»</span>
        </p>
      ) : (
        <p className="mt-7 border border-dashed border-ink/25 px-5 py-4 text-[13px] text-ink/50">
          Миссия появится здесь — заполните её в редакторе слева.
        </p>
      )}
      {o.about && (
        <p className="mt-6 max-w-[620px] text-[13.5px] leading-[1.7] text-ink/80">
          {o.about}
        </p>
      )}

      <div className="mt-9 grid grid-cols-[1fr_250px] gap-10">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-ink/50">
            Основные сведения
          </p>
          {info.length === 0 ? (
            <p className="mt-3 border border-dashed border-ink/25 px-4 py-3 text-[12px] text-ink/45">
              Реквизиты и контакты — в разделе «Организация».
            </p>
          ) : (
            info.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-2.5"
              >
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                  {k}
                </span>
                <span className="text-right text-[13px] font-semibold text-ink">
                  {v}
                </span>
              </div>
            ))
          )}
        </div>
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-ink/50">
            {data.year} год в цифрах
          </p>
          {o.stats.length === 0 ? (
            <p className="border border-dashed border-ink/25 px-4 py-3 text-[12px] text-ink/45">
              Ключевые цифры — в разделе «Организация».
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              {o.stats.slice(0, 4).map((s) => (
                <div key={s.id}>
                  <div className="font-display text-[32px] leading-none text-gold-600">
                    {s.value || "—"}
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-ink/60">
                    {s.label || "показатель"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {strip ? null : null}
    </LightPage>
  );
}

/* ----------------------------- Слово руководителя ----------------------------- */

function DirectorPage({
  data,
  n,
  total,
  sec,
  strip,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
  strip?: boolean;
}) {
  const d = data.director;
  const paragraphs = d.text
    .split(/\n{2,}|\n/)
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <LightPage data={data} n={n} total={total}>
      <SectionHead index={sec} eyebrow="Обращение" title="Слово руководителя" />
      <div className="mt-8 flex gap-10">
        <div className="w-[205px] shrink-0">
          <div className="relative">
            <div className="absolute -left-2.5 -top-2.5 h-full w-full border border-gold-500/70" />
            {d.photo ? (
              <PImg
                src={d.photo}
                strip={strip}
                className="relative aspect-[4/5] w-full object-cover"
              />
            ) : (
              <Monogram
                name={d.name || "Р"}
                className="relative aspect-[4/5] w-full text-[54px]"
              />
            )}
          </div>
          <p className="mt-5 text-[15px] font-bold leading-tight text-ink">
            {d.name || "Имя руководителя"}
          </p>
          <p className="mt-0.5 text-[11.5px] text-ink/60">
            {d.role || "Руководитель организации"}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[64px] leading-[0.55] text-gold-500">
            «
          </div>
          {paragraphs.length === 0 ? (
            <p className="mt-5 border border-dashed border-ink/25 px-4 py-3 text-[12.5px] text-ink/45">
              Текст обращения появится здесь.
            </p>
          ) : (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-[13.5px] leading-[1.72] text-ink/85 first:mt-5"
              >
                {p}
              </p>
            ))
          )}
          <div className="mt-7 flex items-end justify-between border-t border-ink/15 pt-3.5">
            <div>
              <p className="text-[14px] font-bold text-ink">{d.name || "—"}</p>
              <p className="text-[11px] text-ink/55">{d.role || ""}</p>
            </div>
            <span className="pb-0.5 text-[10px] uppercase tracking-[0.2em] text-ink/40">
              {data.year} год
            </span>
          </div>
        </div>
      </div>
    </LightPage>
  );
}

/* ---------------------------------- Команда ---------------------------------- */

function TeamPage({
  data,
  n,
  total,
  sec,
  strip,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
  strip?: boolean;
}) {
  const team = data.team.slice(0, 12);
  return (
    <LightPage data={data} n={n} total={total}>
      <SectionHead index={sec} eyebrow="Люди" title="Команда" />
      <p className="mt-4 text-[12.5px] text-ink/60">
        В команде — {team.length}{" "}
        {team.length % 10 === 1 && team.length % 100 !== 11
          ? "человек"
          : team.length % 10 >= 2 &&
              team.length % 10 <= 4 &&
              (team.length % 100 < 12 || team.length % 100 > 14)
            ? "человека"
            : "человек"}
        . Это штат и ключевые координаторы программ.
      </p>
      <div className="mt-7 grid grid-cols-3 gap-x-7 gap-y-7">
        {team.map((m) => (
          <div key={m.id}>
            {m.photo ? (
              <PImg
                src={m.photo}
                strip={strip}
                className="aspect-[4/5] w-full rounded-[3px] object-cover"
              />
            ) : (
              <Monogram
                name={m.name || "НКО"}
                className="aspect-[4/5] w-full rounded-[3px] text-[38px]"
              />
            )}
            <p className="mt-2.5 text-[13.5px] font-bold leading-tight text-ink">
              {m.name || "Имя Фамилия"}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-ink/60">
              {m.role || " "}
            </p>
          </div>
        ))}
      </div>
      {data.team.length > 12 && (
        <p className="mt-5 text-[11.5px] italic text-ink/55">
          …и ещё {data.team.length - 12} человек — полный список на сайте
          организации.
        </p>
      )}
    </LightPage>
  );
}

/* --------------------------------- Программа --------------------------------- */

function ProgramPage({
  program,
  index,
  data,
  n,
  total,
  strip,
}: {
  program: Program;
  index: number;
  data: ReportData;
  n: number;
  total: number;
  strip?: boolean;
}) {
  const results = program.results.filter((r) => r.value || r.label).slice(0, 4);
  const photos = program.photos.filter((p) => p.src).slice(0, 4);
  const desc = program.description.length > 560
    ? program.description.slice(0, 557).trimEnd() + "…"
    : program.description;

  return (
    <LightPage data={data} n={n} total={total}>
      {program.cover ? (
        <div className="relative -mx-14 -mt-6 h-[292px]">
          <PImg
            src={program.cover}
            strip={strip}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(4,26,22,0.9) 6%, rgba(4,26,22,0.28) 52%, rgba(4,26,22,0.1) 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-14 pb-6">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.3em] text-gold-300">
              Программа {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1.5 font-display text-[34px] leading-[1.08] text-pine-50">
              {program.title || "Название программы"}
            </h3>
          </div>
        </div>
      ) : (
        <div className="relative -mx-14 -mt-6 flex h-[150px] flex-col justify-end bg-pine-800 px-14 pb-5">
          <span className="absolute right-12 top-4 font-display text-[86px] leading-none text-gold-400/25">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.3em] text-gold-300">
            Программа {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1.5 font-display text-[32px] leading-[1.08] text-pine-50">
            {program.title || "Название программы"}
          </h3>
        </div>
      )}

      {desc && (
        <p className="mt-6 max-w-[640px] text-[13px] leading-[1.7] text-ink/85">
          {desc}
        </p>
      )}

      {results.length > 0 && (
        <div
          className="mt-6 grid border-y-[1.5px] border-ink/15"
          style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}
        >
          {results.map((r, i) => (
            <div
              key={r.id}
              className={`px-4 py-4 ${i === 0 ? "pl-0" : "border-l border-ink/10"}`}
            >
              <div className="font-display text-[27px] leading-none text-gold-600">
                {r.value || "—"}
              </div>
              <div className="mt-1.5 text-[9.5px] font-semibold uppercase leading-snug tracking-[0.13em] text-ink/55">
                {r.label || "результат"}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 bg-gold-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-ink/65">
              Фоторепортаж
            </span>
            <span className="h-px flex-1 bg-ink/15" />
          </div>
          {photos.length === 1 ? (
            <div className="mt-3.5">
              <PImg
                src={photos[0].src}
                strip={strip}
                className="h-[240px] w-full rounded-[3px] object-cover"
              />
              {photos[0].caption && (
                <p className="mt-1.5 text-[10.5px] italic leading-snug text-ink/55">
                  {photos[0].caption}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-3.5 grid grid-cols-2 gap-3.5">
              {photos.map((p) => (
                <div key={p.id}>
                  <PImg
                    src={p.src}
                    strip={strip}
                    className="h-[172px] w-full rounded-[3px] object-cover"
                  />
                  {p.caption && (
                    <p className="mt-1.5 text-[10px] italic leading-snug text-ink/55">
                      {p.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </LightPage>
  );
}

/* ---------------------------------- Финансы ---------------------------------- */

function FinanceTable({ title, rows }: { title: string; rows: MoneyRow[] }) {
  const filled = rows.filter((r) => r.label || r.amount);
  const total = sum(rows);
  return (
    <div>
      <div className="flex items-center justify-between bg-pine-800 px-3.5 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pine-50">
          {title}
        </span>
        <span className="tabular text-[12px] font-bold text-gold-300">
          {fmtMoney(total)}
        </span>
      </div>
      {filled.length === 0 ? (
        <p className="border border-t-0 border-ink/15 px-3.5 py-4 text-[11.5px] text-ink/45">
          Нет данных — добавьте строки в редакторе.
        </p>
      ) : (
        <div className="border border-t-0 border-ink/15">
          {filled.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-baseline justify-between gap-3 px-3.5 py-[7px] text-[12px] ${
                i % 2 === 1 ? "bg-[#efe8d6]/80" : "bg-white/60"
              }`}
            >
              <span className="text-ink/85">{r.label || "—"}</span>
              <span className="tabular font-semibold text-ink">
                {fmtMoney(r.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between border-t-2 border-gold-500 px-3.5 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70">
              Итого
            </span>
            <span className="tabular font-display text-[15px] text-gold-700">
              {fmtMoney(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const DONUT_COLORS = [
  GOLD_DARK,
  "#0c3b33",
  "#4f8f80",
  "#dfa63e",
  "#8fbcae",
  "#125147",
  "#c3d9d0",
];

function ExpenseDonut({ rows }: { rows: MoneyRow[] }) {
  const total = sum(rows);
  const R = 72;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = rows
    .filter((r) => r.amount > 0)
    .map((r, i) => {
      const len = total ? (r.amount / total) * C : 0;
      const el = { len, offset: acc, color: DONUT_COLORS[i % DONUT_COLORS.length], label: r.label, amount: r.amount };
      acc += len;
      return el;
    });

  return (
    <div className="flex items-center gap-7">
      <svg width="185" height="185" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#e8e2d0" strokeWidth="27" />
        {segs.map((s, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="27"
            strokeDasharray={`${Math.max(s.len - 1.5, 0.6)} ${C}`}
            strokeDashoffset={-s.offset}
            transform="rotate(-90 100 100)"
          />
        ))}
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fontFamily="Prata, serif"
          fontSize="19"
          fill={INK}
        >
          {fmtShort(total)}
        </text>
        <text
          x="100"
          y="114"
          textAnchor="middle"
          fontFamily="Golos Text, sans-serif"
          fontSize="9"
          letterSpacing="1.4"
          fill="rgba(22,53,46,0.55)"
        >
          РАСХОДЫ {""}
        </text>
      </svg>
      <div className="flex-1">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/50">
          Структура расходов
        </p>
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-ink/8 py-[7px] last:border-0">
            <span
              className="inline-block h-[10px] w-[10px] shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 truncate text-[11.5px] text-ink/80">
              {s.label || "—"}
            </span>
            <span className="tabular text-[11.5px] font-bold text-ink">
              {total ? Math.round((s.amount / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancePage({
  data,
  n,
  total,
  sec,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
}) {
  const f = data.finances;
  const inc = sum(f.income);
  const exp = sum(f.expenses);
  const diff = inc - exp;

  return (
    <LightPage data={data} n={n} total={total}>
      <SectionHead
        index={sec}
        eyebrow="Прозрачность"
        title={`Финансы ${data.year}`}
      />
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="border border-ink/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Поступления
          </p>
          <p className="tabular mt-1 font-display text-[21px] text-gold-600">
            {fmtMoney(inc)}
          </p>
        </div>
        <div className="border border-ink/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Расходы
          </p>
          <p className="tabular mt-1 font-display text-[21px] text-ink">
            {fmtMoney(exp)}
          </p>
        </div>
        <div className="border border-ink/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Сальдо за год
          </p>
          <p
            className={`tabular mt-1 font-display text-[21px] ${
              diff >= 0 ? "text-pine-600" : "text-[#a33d2e]"
            }`}
          >
            {diff >= 0 ? "+" : "−"}
            {fmtMoney(Math.abs(diff))}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <FinanceTable title="Поступления" rows={f.income} />
        <FinanceTable title="Расходы" rows={f.expenses} />
      </div>

      {sum(f.expenses) > 0 && (
        <div className="mt-7 border-t border-ink/12 pt-5">
          <ExpenseDonut rows={f.expenses} />
        </div>
      )}

      {f.comment && (
        <p className="mt-6 border-l-2 border-gold-500 pl-3.5 text-[11px] italic leading-relaxed text-ink/60">
          {f.comment}
        </p>
      )}
    </LightPage>
  );
}

/* ---------------------------------- Партнёры ---------------------------------- */

function PartnersPage({
  data,
  n,
  total,
  sec,
  strip,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
  strip?: boolean;
}) {
  const p = data.partners;
  return (
    <LightPage data={data} n={n} total={total}>
      <SectionHead index={sec} eyebrow="Благодарность" title="Партнёры" />
      {p.intro && (
        <p className="mt-5 max-w-[620px] text-[13px] leading-[1.68] text-ink/80">
          {p.intro}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {p.list.slice(0, 8).map((pt) => (
          <div
            key={pt.id}
            className="flex gap-3.5 border border-ink/15 bg-white/70 p-4"
          >
            {pt.logo ? (
              <PImg
                src={pt.logo}
                strip={strip}
                className="h-11 w-14 shrink-0 rounded-[2px] bg-white object-contain"
              />
            ) : (
              <Monogram
                name={pt.name || "П"}
                className="h-11 w-11 shrink-0 rounded-[2px] text-[15px]"
              />
            )}
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold leading-tight text-ink">
                {pt.name || "Название партнёра"}
              </p>
              {pt.text && (
                <p className="mt-1 text-[11px] leading-snug text-ink/65">
                  {pt.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto border-t border-ink/12 pt-4 text-[12px] italic text-ink/60">
        Мы благодарим всех, кто был рядом в {data.year} году: компании,
        волонтёров и каждого частного донора.
      </p>
    </LightPage>
  );
}

/* ---------------------------------- Контакты ---------------------------------- */

function ContactsPage({
  data,
  n,
  total,
}: {
  data: ReportData;
  n: number;
  total: number;
}) {
  const o = data.org;
  const req: [string, string][] = [
    ["ИНН", o.inn],
    ["ОГРН", o.ogrn],
    ["Банк", o.bankName],
    ["БИК", o.bik],
    ["Корр. счёт", o.corrAccount],
    ["Расч. счёт", o.account],
  ].filter(([, v]) => v) as [string, string][];
  const contacts: string[] = [o.address, o.phone, o.email, o.website].filter(
    Boolean
  );

  return (
    <div
      className="relative h-full w-full text-paper"
      style={{
        background: "linear-gradient(163deg,#06231e 0%,#092f29 55%,#0d4038 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-[18px] border border-gold-400/35" />
      <div className="flex h-full flex-col px-16 py-14">
        <div className="flex items-start justify-between">
          {o.logo ? (
            <img src={o.logo} alt="" className="h-10 max-w-[150px] object-contain" />
          ) : (
            <Monogram
              name={o.shortName || o.fullName || "НКО"}
              className="h-10 w-10 rounded-[3px] text-[15px]"
            />
          )}
          <span className="pt-1 text-[9.5px] font-semibold uppercase tracking-[0.26em] text-pine-200/70">
            Годовой отчёт {data.year}
          </span>
        </div>

        <div className="mt-16 max-w-[520px]">
          <div className="h-[3px] w-14 bg-gold-400" />
          <h2 className="mt-6 font-display text-[40px] leading-[1.15] text-pine-50">
            Спасибо, что были рядом в {data.year} году!
          </h2>
          <p className="mt-4 text-[13.5px] leading-[1.65] text-pine-200/90">
            Этот отчёт — публичный: задавайте вопросы, проверяйте цифры,
            предлагайте помощь. Мы открыты для каждого.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-5">
          <div className="border border-gold-400/30 bg-white/[0.045] p-4.5 px-4 py-4">
            <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-gold-300">
              Банковские реквизиты
            </p>
            {req.length === 0 ? (
              <p className="text-[11.5px] text-pine-200/60">
                Реквизиты не заполнены.
              </p>
            ) : (
              req.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-3 border-b border-white/10 py-[6px] last:border-0"
                >
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-pine-300/90">
                    {k}
                  </span>
                  <span className="tabular text-right text-[11.5px] text-pine-50/95">
                    {v}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="border border-gold-400/30 bg-white/[0.045] px-4 py-4">
            <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-gold-300">
              Контакты
            </p>
            {contacts.length === 0 ? (
              <p className="text-[11.5px] text-pine-200/60">
                Контакты не заполнены.
              </p>
            ) : (
              contacts.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 border-b border-white/10 py-[7px] last:border-0">
                  <span className="mt-[5px] inline-block h-[6px] w-[6px] shrink-0 bg-gold-400" />
                  <span className="text-[11.5px] leading-snug text-pine-50/95">
                    {c}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-gold-400/25 pt-4 text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.24em] text-pine-300/85">
              Отчёт подготовлен на платформе
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-snug text-pine-100">
              АНО «Общественный центр социальных инициатив» — ресурсный центр
              поддержки НКО
            </p>
            <p className="mt-0.5 text-[10.5px] font-bold text-gold-300">
              anoocsi.ru&ensp;·&ensp;anoocsi@yandex.ru
            </p>
          </div>
          <div className="mt-3.5 flex items-end justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-pine-200/60">
              © {data.year} {o.shortName || o.fullName || "НКО"}
            </p>
            {o.website && (
              <p className="font-display text-[22px] text-gold-300">
                {o.website}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Сборка отчёта --------------------------------- */

interface PageDef {
  key: string;
  render: (n: number, total: number) => React.ReactNode;
}

function buildPages(data: ReportData, strip: boolean): PageDef[] {
  let sec = 0;
  const next = () => String(++sec).padStart(2, "0");

  const hasDirector = Boolean(data.director.name || data.director.text);
  const hasTeam = data.team.length > 0;
  const hasFinance =
    data.finances.income.some((r) => r.label || r.amount > 0) ||
    data.finances.expenses.some((r) => r.label || r.amount > 0);
  const hasPartners = data.partners.list.length > 0;

  const secOrg = next();
  const secDir = hasDirector ? next() : "";
  const secTeam = hasTeam ? next() : "";
  const secProg = data.programs.length ? next() : "";
  const secFin = hasFinance ? next() : "";
  const secPart = hasPartners ? next() : "";

  const pages: PageDef[] = [
    { key: "cover", render: () => <CoverPage data={data} strip={strip} /> },
    {
      key: "org",
      render: (n, t) => (
        <OrgPage data={data} n={n} total={t} sec={secOrg} strip={strip} />
      ),
    },
  ];
  if (hasDirector) {
    pages.push({
      key: "director",
      render: (n, t) => (
        <DirectorPage data={data} n={n} total={t} sec={secDir} strip={strip} />
      ),
    });
  }
  if (hasTeam) {
    pages.push({
      key: "team",
      render: (n, t) => (
        <TeamPage data={data} n={n} total={t} sec={secTeam} strip={strip} />
      ),
    });
  }
  if (secProg) {
    data.programs.forEach((p, i) => {
      pages.push({
        key: `program-${p.id}`,
        render: (n, t) => (
          <ProgramPage
            program={p}
            index={i}
            data={data}
            n={n}
            total={t}
            strip={strip}
          />
        ),
      });
    });
  }
  if (hasFinance) {
    pages.push({
      key: "finance",
      render: (n, t) => <FinancePage data={data} n={n} total={t} sec={secFin} />,
    });
  }
  if (hasPartners) {
    pages.push({
      key: "partners",
      render: (n, t) => (
        <PartnersPage data={data} n={n} total={t} sec={secPart} strip={strip} />
      ),
    });
  }
  pages.push({
    key: "contacts",
    render: (n, t) => <ContactsPage data={data} n={n} total={t} />,
  });
  return pages;
}

export function countPages(data: ReportData): number {
  return buildPages(data, false).length;
}

export function ReportPreview({
  data,
  strip = false,
}: {
  data: ReportData;
  strip?: boolean;
}) {
  const pages = buildPages(data, strip);
  return (
    <>
      {pages.map((p, i) => (
        <div
          key={p.key}
          className="report-page relative overflow-hidden bg-paper font-body text-ink"
          style={pageBase}
        >
          {p.render(i + 1, pages.length)}
        </div>
      ))}
    </>
  );
}
