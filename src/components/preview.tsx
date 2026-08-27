import React from "react";
import type { MoneyRow, Program, ReportData } from "../types";
import { fmtMoney, fmtShort, initials, isRemote, sum } from "../utils";
import type { ReportTheme } from "../themes";
import { DEFAULT_THEME_ID, getTheme, hexToRgba, themeVars } from "../themes";

export const PAGE_W = 794;
export const PAGE_H = 1123;

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
    return <div className={`${className} bg-(--rp-strip)`} aria-hidden />;
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
      className={`flex items-center justify-center bg-(--rp-dark2) font-display text-(--rp-accent) ${className}`}
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
        <span className="font-display text-[17px] leading-none text-(--rp-accent-deep)">
          {index}
        </span>
        <span className="h-[2px] w-9 bg-(--rp-accent-mid)" />
        <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-(--rp-ink)/50">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-2.5 font-display text-[38px] leading-[1.08] text-(--rp-ink)">
        {title}
      </h2>
      <div className="mt-3.5 h-[3px] w-14 bg-(--rp-accent-mid)" />
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
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-(--rp-ink)/70">
              {o.shortName || o.fullName || "Ваша организация"}
            </span>
          </div>
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-(--rp-ink)/45">
            Годовой отчёт {data.year}
          </span>
        </div>
        <div className="mt-3.5 h-px bg-(--rp-ink)/15" />
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-6">
        {children}
      </main>
      <footer className="flex items-center justify-between pt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--rp-ink)/45">
        <span>{o.website || o.email || "публичный годовой отчёт"}</span>
        <span className="flex items-center gap-2 text-(--rp-ink)/60">
          <span className="inline-block h-[7px] w-[7px] bg-(--rp-accent-mid)" />
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </footer>
    </div>
  );
}

const pageBase: React.CSSProperties = { width: PAGE_W, height: PAGE_H };

/* --------------------------------- Обложка --------------------------------- */

function CoverPage({
  data,
  t,
  strip,
}: {
  data: ReportData;
  t: ReportTheme;
  strip?: boolean;
}) {
  const o = data.org;
  return (
    <div
      className="relative h-full w-full text-(--rp-on-dark)"
      style={{
        background: `linear-gradient(163deg,${t.dark1} 0%,${t.dark2} 52%,${t.dark3} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-[18px] border border-(--rp-accent)/40" />
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
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-(--rp-on-dark)/80">
              {o.website}
            </span>
          )}
        </div>

        {/* Заголовок отчёта */}
        <div className="mt-7">
          <div className="h-[3px] w-14 bg-(--rp-accent)" />
          <p className="mt-3.5 text-[11.5px] font-bold uppercase tracking-[0.3em] text-(--rp-accent)">
            Публичный годовой отчёт
          </p>
          <h1 className="mt-2 line-clamp-3 font-display text-[34px] leading-[1.15] text-(--rp-on-dark)">
            {o.fullName || "Название вашей организации"}
          </h1>
          {(o.address || o.city) && (
            <p className="mt-2 line-clamp-2 max-w-[560px] text-[11.5px] leading-snug text-(--rp-on-dark)/85">
              {o.address || o.city}
            </p>
          )}
          <p className="mt-2.5 font-display text-[23px] leading-none text-(--rp-accent)">
            за {data.year} год
          </p>
          {o.mission && (
            <p className="mt-4 line-clamp-3 max-w-[560px] border-l-2 border-(--rp-accent)/70 pl-3.5 text-[13px] leading-[1.6] text-(--rp-on-dark)/90">
              {o.mission}
            </p>
          )}
        </div>

        {/* Классическое фото 4:3 в двойной рамке */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-5">
          {o.coverPhoto ? (
            <div className="max-w-full border border-(--rp-accent)/60 bg-(--rp-dark1)/50 p-[9px] shadow-[0_26px_60px_-22px_rgba(0,0,0,0.75)]">
              <div className="border border-(--rp-accent)/25 p-[3px]">
                <PImg
                  src={o.coverPhoto}
                  strip={strip}
                  className="block aspect-[4/3] w-[452px] max-w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-[452px] max-w-full flex-col items-center justify-center gap-2 border border-dashed border-(--rp-accent)/45 bg-(--rp-dark1)/35 text-(--rp-on-dark)/80">
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
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-(--rp-on-dark)/60">
                раздел «Организация» · формат 4:3
              </p>
            </div>
          )}
        </div>

        {/* Подпись платформы */}
        <div className="border-t border-(--rp-accent)/30 pt-3.5 text-center">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.24em] text-(--rp-on-dark)/70">
            Отчёт подготовлен на платформе
          </p>
          <p className="mt-1 text-[11px] font-semibold leading-snug text-(--rp-on-dark)">
            АНО «Общественный центр социальных инициатив» — ресурсный центр
            поддержки НКО
          </p>
          <p className="mt-0.5 text-[10.5px] font-bold text-(--rp-accent)">
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
        <p className="mt-7 font-display text-[21px] leading-[1.5] text-(--rp-ink)">
          <span className="mr-1.5 align-[-6px] text-[42px] leading-none text-(--rp-accent-mid)">
            «
          </span>
          {o.mission}
          <span className="ml-1 text-[42px] leading-none text-(--rp-accent-mid)">
            »
          </span>
        </p>
      ) : (
        <p className="mt-7 border border-dashed border-(--rp-ink)/25 px-5 py-4 text-[13px] text-(--rp-ink)/50">
          Миссия появится здесь — заполните её в редакторе слева.
        </p>
      )}
      {o.about && (
        <p className="mt-6 max-w-[620px] text-[13.5px] leading-[1.7] text-(--rp-ink)/80">
          {o.about}
        </p>
      )}

      <div className="mt-9 grid grid-cols-[1fr_250px] gap-10">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-(--rp-ink)/50">
            Основные сведения
          </p>
          {info.length === 0 ? (
            <p className="mt-3 border border-dashed border-(--rp-ink)/25 px-4 py-3 text-[12px] text-(--rp-ink)/45">
              Реквизиты и контакты — в разделе «Организация».
            </p>
          ) : (
            info.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-b border-(--rp-ink)/10 py-2.5"
              >
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-(--rp-ink)/50">
                  {k}
                </span>
                <span className="text-right text-[13px] font-semibold text-(--rp-ink)">
                  {v}
                </span>
              </div>
            ))
          )}
        </div>
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-(--rp-ink)/50">
            {data.year} год в цифрах
          </p>
          {o.stats.length === 0 ? (
            <p className="border border-dashed border-(--rp-ink)/25 px-4 py-3 text-[12px] text-(--rp-ink)/45">
              Ключевые цифры — в разделе «Организация».
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              {o.stats.slice(0, 4).map((s) => (
                <div key={s.id}>
                  <div className="font-display text-[32px] leading-none text-(--rp-accent-deep)">
                    {s.value || "—"}
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-(--rp-ink)/60">
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
            <div className="absolute -left-2.5 -top-2.5 h-full w-full border border-(--rp-accent-mid)/70" />
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
          <p className="mt-5 text-[15px] font-bold leading-tight text-(--rp-ink)">
            {d.name || "Имя руководителя"}
          </p>
          <p className="mt-0.5 text-[11.5px] text-(--rp-ink)/60">
            {d.role || "Руководитель организации"}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[64px] leading-[0.55] text-(--rp-accent-mid)">
            «
          </div>
          {paragraphs.length === 0 ? (
            <p className="mt-5 border border-dashed border-(--rp-ink)/25 px-4 py-3 text-[12.5px] text-(--rp-ink)/45">
              Текст обращения появится здесь.
            </p>
          ) : (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-[13.5px] leading-[1.72] text-(--rp-ink)/85 first:mt-5"
              >
                {p}
              </p>
            ))
          )}
          <div className="mt-7 flex items-end justify-between border-t border-(--rp-ink)/15 pt-3.5">
            <div>
              <p className="text-[14px] font-bold text-(--rp-ink)">
                {d.name || "—"}
              </p>
              <p className="text-[11px] text-(--rp-ink)/55">{d.role || ""}</p>
            </div>
            <span className="pb-0.5 text-[10px] uppercase tracking-[0.2em] text-(--rp-ink)/40">
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
      <p className="mt-4 text-[12.5px] text-(--rp-ink)/60">
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
            <p className="mt-2.5 text-[13.5px] font-bold leading-tight text-(--rp-ink)">
              {m.name || "Имя Фамилия"}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-(--rp-ink)/60">
              {m.role || " "}
            </p>
          </div>
        ))}
      </div>
      {data.team.length > 12 && (
        <p className="mt-5 text-[11.5px] italic text-(--rp-ink)/55">
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
  t,
  n,
  total,
  strip,
}: {
  program: Program;
  index: number;
  data: ReportData;
  t: ReportTheme;
  n: number;
  total: number;
  strip?: boolean;
}) {
  const results = program.results.filter((r) => r.value || r.label).slice(0, 4);
  const photos = program.photos.filter((p) => p.src).slice(0, 4);
  const desc =
    program.description.length > 560
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
              background: `linear-gradient(to top, ${hexToRgba(t.dark1, 0.9)} 6%, ${hexToRgba(
                t.dark1,
                0.28
              )} 52%, ${hexToRgba(t.dark1, 0.1)} 100%)`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-14 pb-6">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.3em] text-(--rp-accent)">
              Программа {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1.5 font-display text-[34px] leading-[1.08] text-(--rp-on-dark)">
              {program.title || "Название программы"}
            </h3>
          </div>
        </div>
      ) : (
        <div className="relative -mx-14 -mt-6 flex h-[150px] flex-col justify-end bg-(--rp-dark2) px-14 pb-5">
          <span className="absolute right-12 top-4 font-display text-[86px] leading-none text-(--rp-accent)/25">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.3em] text-(--rp-accent)">
            Программа {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1.5 font-display text-[32px] leading-[1.08] text-(--rp-on-dark)">
            {program.title || "Название программы"}
          </h3>
        </div>
      )}

      {desc && (
        <p className="mt-6 max-w-[640px] text-[13px] leading-[1.7] text-(--rp-ink)/85">
          {desc}
        </p>
      )}

      {results.length > 0 && (
        <div
          className="mt-6 grid border-y-[1.5px] border-(--rp-ink)/15"
          style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}
        >
          {results.map((r, i) => (
            <div
              key={r.id}
              className={`px-4 py-4 ${
                i === 0 ? "pl-0" : "border-l border-(--rp-ink)/10"
              }`}
            >
              <div className="font-display text-[27px] leading-none text-(--rp-accent-deep)">
                {r.value || "—"}
              </div>
              <div className="mt-1.5 text-[9.5px] font-semibold uppercase leading-snug tracking-[0.13em] text-(--rp-ink)/55">
                {r.label || "результат"}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 bg-(--rp-accent-mid)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-(--rp-ink)/65">
              Фоторепортаж
            </span>
            <span className="h-px flex-1 bg-(--rp-ink)/15" />
          </div>
          {photos.length === 1 ? (
            <div className="mt-3.5">
              <PImg
                src={photos[0].src}
                strip={strip}
                className="h-[240px] w-full rounded-[3px] object-cover"
              />
              {photos[0].caption && (
                <p className="mt-1.5 text-[10.5px] italic leading-snug text-(--rp-ink)/55">
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
                    <p className="mt-1.5 text-[10px] italic leading-snug text-(--rp-ink)/55">
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
      <div className="flex items-center justify-between bg-(--rp-dark2) px-3.5 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--rp-on-dark)">
          {title}
        </span>
        <span className="tabular text-[12px] font-bold text-(--rp-accent)">
          {fmtMoney(total)}
        </span>
      </div>
      {filled.length === 0 ? (
        <p className="border border-t-0 border-(--rp-ink)/15 px-3.5 py-4 text-[11.5px] text-(--rp-ink)/45">
          Нет данных — добавьте строки в редакторе.
        </p>
      ) : (
        <div className="border border-t-0 border-(--rp-ink)/15">
          {filled.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-baseline justify-between gap-3 px-3.5 py-[7px] text-[12px] ${
                i % 2 === 1 ? "" : "bg-white/60"
              }`}
              style={i % 2 === 1 ? { background: "var(--rp-row)" } : undefined}
            >
              <span className="text-(--rp-ink)/85">{r.label || "—"}</span>
              <span className="tabular font-semibold text-(--rp-ink)">
                {fmtMoney(r.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between border-t-2 border-(--rp-accent-mid) px-3.5 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--rp-ink)/70">
              Итого
            </span>
            <span className="tabular font-display text-[15px] text-(--rp-accent-deep)">
              {fmtMoney(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseDonut({ rows, t }: { rows: MoneyRow[]; t: ReportTheme }) {
  const total = sum(rows);
  const R = 72;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = rows
    .filter((r) => r.amount > 0)
    .map((r, i) => {
      const len = total ? (r.amount / total) * C : 0;
      const el = {
        len,
        offset: acc,
        color: t.donut[i % t.donut.length],
        label: r.label,
        amount: r.amount,
      };
      acc += len;
      return el;
    });

  return (
    <div className="flex items-center gap-7">
      <svg width="185" height="185" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={R} fill="none" stroke={t.track} strokeWidth="27" />
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
          fill={t.ink}
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
          fill={hexToRgba(t.ink, 0.55)}
        >
          РАСХОДЫ {""}
        </text>
      </svg>
      <div className="flex-1">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-(--rp-ink)/50">
          Структура расходов
        </p>
        {segs.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 border-b border-(--rp-ink)/8 py-[7px] last:border-0"
          >
            <span
              className="inline-block h-[10px] w-[10px] shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 truncate text-[11.5px] text-(--rp-ink)/80">
              {s.label || "—"}
            </span>
            <span className="tabular text-[11.5px] font-bold text-(--rp-ink)">
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
  t,
}: {
  data: ReportData;
  n: number;
  total: number;
  sec: string;
  t: ReportTheme;
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
        <div className="border border-(--rp-ink)/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-(--rp-ink)/50">
            Поступления
          </p>
          <p className="tabular mt-1 font-display text-[21px] text-(--rp-accent-deep)">
            {fmtMoney(inc)}
          </p>
        </div>
        <div className="border border-(--rp-ink)/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-(--rp-ink)/50">
            Расходы
          </p>
          <p className="tabular mt-1 font-display text-[21px] text-(--rp-ink)">
            {fmtMoney(exp)}
          </p>
        </div>
        <div className="border border-(--rp-ink)/15 bg-white/70 px-4 py-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-(--rp-ink)/50">
            Сальдо за год
          </p>
          <p
            className={`tabular mt-1 font-display text-[21px] ${
              diff >= 0 ? "text-(--rp-dark2)" : "text-[#a33d2e]"
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
        <div className="mt-7 border-t border-(--rp-ink)/12 pt-5">
          <ExpenseDonut rows={f.expenses} t={t} />
        </div>
      )}

      {f.comment && (
        <p className="mt-6 border-l-2 border-(--rp-accent-mid) pl-3.5 text-[11px] italic leading-relaxed text-(--rp-ink)/60">
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
        <p className="mt-5 max-w-[620px] text-[13px] leading-[1.68] text-(--rp-ink)/80">
          {p.intro}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {p.list.slice(0, 8).map((pt) => (
          <div
            key={pt.id}
            className="flex gap-3.5 border border-(--rp-ink)/15 bg-white/70 p-4"
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
              <p className="text-[13.5px] font-bold leading-tight text-(--rp-ink)">
                {pt.name || "Название партнёра"}
              </p>
              {pt.text && (
                <p className="mt-1 text-[11px] leading-snug text-(--rp-ink)/65">
                  {pt.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto border-t border-(--rp-ink)/12 pt-4 text-[12px] italic text-(--rp-ink)/60">
        Мы благодарим всех, кто был рядом в {data.year} году: компании,
        волонтёров и каждого частного донора.
      </p>
    </LightPage>
  );
}

/* ---------------------------------- Контакты ---------------------------------- */

function ContactsPage({
  data,
  t,
  n,
  total,
}: {
  data: ReportData;
  t: ReportTheme;
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
      className="relative h-full w-full text-(--rp-on-dark)"
      style={{
        background: `linear-gradient(163deg,${t.dark1} 0%,${t.dark2} 55%,${t.dark3} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-[18px] border border-(--rp-accent)/35" />
      <div className="flex h-full flex-col px-16 py-12">
        <div className="flex items-start justify-between">
          {o.logo ? (
            <img src={o.logo} alt="" className="h-10 max-w-[150px] object-contain" />
          ) : (
            <Monogram
              name={o.shortName || o.fullName || "НКО"}
              className="h-10 w-10 rounded-[3px] text-[15px]"
            />
          )}
          <span className="pt-1 text-[9.5px] font-semibold uppercase tracking-[0.26em] text-(--rp-on-dark)/70">
            Годовой отчёт {data.year}
          </span>
        </div>

        <div className="mt-12 max-w-[520px]">
          <div className="h-[3px] w-14 bg-(--rp-accent)" />
          <h2 className="mt-6 font-display text-[40px] leading-[1.15] text-(--rp-on-dark)">
            Спасибо, что были рядом в {data.year} году!
          </h2>
          <p className="mt-4 text-[13.5px] leading-[1.65] text-(--rp-on-dark)/90">
            Этот отчёт — публичный: задавайте вопросы, проверяйте цифры,
            предлагайте помощь. Мы открыты для каждого.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5">
          <div className="border border-(--rp-accent)/30 bg-white/[0.045] px-4 py-4">
            <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-(--rp-accent)">
              Банковские реквизиты
            </p>
            {req.length === 0 ? (
              <p className="text-[11.5px] text-(--rp-on-dark)/60">
                Реквизиты не заполнены.
              </p>
            ) : (
              req.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-3 border-b border-white/10 py-[6px] last:border-0"
                >
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-(--rp-on-dark)/70">
                    {k}
                  </span>
                  <span className="tabular text-right text-[11.5px] text-(--rp-on-dark)/95">
                    {v}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="border border-(--rp-accent)/30 bg-white/[0.045] px-4 py-4">
            <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-(--rp-accent)">
              Контакты
            </p>
            {contacts.length === 0 ? (
              <p className="text-[11.5px] text-(--rp-on-dark)/60">
                Контакты не заполнены.
              </p>
            ) : (
              contacts.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 border-b border-white/10 py-[7px] last:border-0"
                >
                  <span className="mt-[5px] inline-block h-[6px] w-[6px] shrink-0 bg-(--rp-accent)" />
                  <span className="text-[11.5px] leading-snug text-(--rp-on-dark)/95">
                    {c}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-(--rp-accent)/25 pt-4 text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.24em] text-(--rp-on-dark)/70">
              Отчёт подготовлен на платформе
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-snug text-(--rp-on-dark)">
              АНО «Общественный центр социальных инициатив» — ресурсный центр
              поддержки НКО
            </p>
            <p className="mt-0.5 text-[10.5px] font-bold text-(--rp-accent)">
              anoocsi.ru&ensp;·&ensp;anoocsi@yandex.ru
            </p>
          </div>
          <div className="mt-3.5 flex items-end justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-(--rp-on-dark)/60">
              © {data.year} {o.shortName || o.fullName || "НКО"}
            </p>
            {o.website && (
              <p className="font-display text-[22px] text-(--rp-accent)">
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

function buildPages(
  data: ReportData,
  theme: ReportTheme,
  strip: boolean
): PageDef[] {
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
    {
      key: "cover",
      render: () => <CoverPage data={data} t={theme} strip={strip} />,
    },
    {
      key: "org",
      render: (n, t2) => (
        <OrgPage data={data} n={n} total={t2} sec={secOrg} strip={strip} />
      ),
    },
  ];
  if (hasDirector) {
    pages.push({
      key: "director",
      render: (n, t2) => (
        <DirectorPage data={data} n={n} total={t2} sec={secDir} strip={strip} />
      ),
    });
  }
  if (hasTeam) {
    pages.push({
      key: "team",
      render: (n, t2) => (
        <TeamPage data={data} n={n} total={t2} sec={secTeam} strip={strip} />
      ),
    });
  }
  if (secProg) {
    data.programs.forEach((p, i) => {
      pages.push({
        key: `program-${p.id}`,
        render: (n, t2) => (
          <ProgramPage
            program={p}
            index={i}
            data={data}
            t={theme}
            n={n}
            total={t2}
            strip={strip}
          />
        ),
      });
    });
  }
  if (hasFinance) {
    pages.push({
      key: "finance",
      render: (n, t2) => (
        <FinancePage data={data} n={n} total={t2} sec={secFin} t={theme} />
      ),
    });
  }
  if (hasPartners) {
    pages.push({
      key: "partners",
      render: (n, t2) => (
        <PartnersPage data={data} n={n} total={t2} sec={secPart} strip={strip} />
      ),
    });
  }
  pages.push({
    key: "contacts",
    render: (n, t2) => (
      <ContactsPage data={data} t={theme} n={n} total={t2} />
    ),
  });
  return pages;
}

export function countPages(data: ReportData): number {
  // количество страниц от темы не зависит
  return buildPages(data, getTheme(DEFAULT_THEME_ID), false).length;
}

export function ReportPreview({
  data,
  theme,
  strip = false,
}: {
  data: ReportData;
  theme: ReportTheme;
  strip?: boolean;
}) {
  const pages = buildPages(data, theme, strip);
  return (
    <div className="contents" style={themeVars(theme)}>
      {pages.map((p, i) => (
        <div
          key={p.key}
          className="report-page relative overflow-hidden bg-(--rp-paper) font-body text-(--rp-ink)"
          style={pageBase}
        >
          {p.render(i + 1, pages.length)}
        </div>
      ))}
    </div>
  );
}
