import React, { useState } from "react";
import type {
  MoneyRow,
  OrgInfo,
  Program,
  ReportData,
  StatItem,
} from "../types";
import {
  newMoneyRow,
  newPartner,
  newProgram,
  newProgramResult,
  newStat,
  newTeamMember,
} from "../types";
import { fmtMoney, sum } from "../utils";
import {
  Field,
  GhostButton,
  Icon,
  ImageUpload,
  MultiPhotoUpload,
  SmallBtn,
  TextArea,
  TextInput,
} from "./ui";

type SetData = React.Dispatch<React.SetStateAction<ReportData>>;

function SectionIntro({ title, text }: { title: string; text: string }) {
  return (
    <header className="mb-7 border-b border-pine-700/60 pb-5">
      <h2 className="font-display text-[26px] leading-tight text-pine-50">
        {title}
      </h2>
      <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-pine-300">
        {text}
      </p>
      <div className="mt-3 h-[3px] w-12 bg-gold-400" />
    </header>
  );
}

/* ------------------------------- Организация ------------------------------- */

export function OrgEditor({
  data,
  setData,
  onFail,
}: {
  data: ReportData;
  setData: SetData;
  onFail: (m: string) => void;
}) {
  const patch = (p: Partial<OrgInfo>) =>
    setData((d) => ({ ...d, org: { ...d.org, ...p } }));
  const o = data.org;

  const setStat = (id: string, p: Partial<StatItem>) =>
    patch({ stats: o.stats.map((x) => (x.id === id ? { ...x, ...p } : x)) });

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Организация"
        text="Основные сведения попадут на страницы «Об организации» и «Контакты», миссия — на обложку отчёта."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Полное название" className="sm:col-span-2">
          <TextInput
            value={o.fullName}
            onChange={(e) => patch({ fullName: e.target.value })}
            placeholder="Благотворительный фонд «Название»"
          />
        </Field>
        <Field label="Краткое название">
          <TextInput
            value={o.shortName}
            onChange={(e) => patch({ shortName: e.target.value })}
            placeholder="БФ «Название»"
          />
        </Field>
        <Field label="Год основания">
          <TextInput
            value={o.founded}
            onChange={(e) => patch({ founded: e.target.value })}
            placeholder="2013"
          />
        </Field>
      </div>

      <Field label="Миссия организации" hint="выводится на обложке">
        <TextArea
          rows={3}
          value={o.mission}
          onChange={(e) => patch({ mission: e.target.value })}
          placeholder="Одно-два предложения о том, зачем существует ваша организация"
          className="border-l-2 border-l-gold-400/80"
        />
      </Field>

      <Field label="Текст «Об организации»">
        <TextArea
          rows={4}
          value={o.about}
          onChange={(e) => patch({ about: e.target.value })}
          placeholder="Короткая история: где и как давно работаете, в чём подход"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Логотип" hint="необязательно">
          <ImageUpload
            value={o.logo}
            onChange={(logo) => patch({ logo })}
            label="Загрузить логотип"
            imgClassName="h-28"
            contain
            onFail={onFail}
          />
        </Field>
        <Field label="Фото на обложку" hint="в центре обложки · формат 4:3">
          <ImageUpload
            value={o.coverPhoto}
            onChange={(coverPhoto) => patch({ coverPhoto })}
            label="Загрузить фото"
            imgClassName="h-28"
            onFail={onFail}
          />
        </Field>
      </div>

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300">
            Ключевые цифры года
          </h3>
          <SmallBtn
            type="button"
            onClick={() =>
              o.stats.length < 6 && patch({ stats: [...o.stats, newStat()] })
            }
            disabled={o.stats.length >= 6}
          >
            <Icon name="plus" size={13} /> Добавить
          </SmallBtn>
        </div>
        {o.stats.length === 0 && (
          <p className="rounded-md border border-dashed border-pine-700 px-4 py-3 text-[13px] text-pine-400">
            Добавьте 3–4 главные цифры года — они появятся в отчёте крупным
            шрифтом: подопечные, волонтёры, годы работы.
          </p>
        )}
        <div className="space-y-2">
          {o.stats.map((st) => (
            <div key={st.id} className="flex items-center gap-2">
              <TextInput
                value={st.value}
                onChange={(e) => setStat(st.id, { value: e.target.value })}
                placeholder="4 860"
                className="w-28 shrink-0 text-center font-bold"
              />
              <TextInput
                value={st.label}
                onChange={(e) => setStat(st.id, { label: e.target.value })}
                placeholder="подопечных за год"
              />
              <SmallBtn
                type="button"
                onClick={() =>
                  patch({ stats: o.stats.filter((x) => x.id !== st.id) })
                }
                title="Удалить"
                className="shrink-0 px-2"
              >
                <Icon name="trash" size={13} />
              </SmallBtn>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-pine-700/60 bg-pine-900/40 p-4">
        <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300">
          Контакты
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Город / регион">
            <TextInput
              value={o.city}
              onChange={(e) => patch({ city: e.target.value })}
            />
          </Field>
          <Field label="Адрес">
            <TextInput
              value={o.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </Field>
          <Field label="Телефон">
            <TextInput
              value={o.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <TextInput
              value={o.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </Field>
          <Field label="Сайт">
            <TextInput
              value={o.website}
              onChange={(e) => patch({ website: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-md border border-pine-700/60 bg-pine-900/40 p-4">
        <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300">
          Реквизиты и банк
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ИНН">
            <TextInput value={o.inn} onChange={(e) => patch({ inn: e.target.value })} />
          </Field>
          <Field label="ОГРН">
            <TextInput value={o.ogrn} onChange={(e) => patch({ ogrn: e.target.value })} />
          </Field>
          <Field label="Банк">
            <TextInput
              value={o.bankName}
              onChange={(e) => patch({ bankName: e.target.value })}
            />
          </Field>
          <Field label="БИК">
            <TextInput value={o.bik} onChange={(e) => patch({ bik: e.target.value })} />
          </Field>
          <Field label="Корреспондентский счёт">
            <TextInput
              value={o.corrAccount}
              onChange={(e) => patch({ corrAccount: e.target.value })}
            />
          </Field>
          <Field label="Расчётный счёт">
            <TextInput
              value={o.account}
              onChange={(e) => patch({ account: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Слово руководителя ---------------------------- */

export function DirectorEditor({
  data,
  setData,
  onFail,
}: {
  data: ReportData;
  setData: SetData;
  onFail: (m: string) => void;
}) {
  const patch = (p: Partial<ReportData["director"]>) =>
    setData((d) => ({ ...d, director: { ...d.director, ...p } }));
  const dir = data.director;

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Слово руководителя"
        text="Обращение директора — одна из самых читаемых страниц отчёта. 2–3 абзаца: итоги, благодарность, планы."
      />
      <div className="flex flex-col gap-5 sm:flex-row">
        <Field label="Фото руководителя" className="w-44 shrink-0">
          <ImageUpload
            value={dir.photo}
            onChange={(photo) => patch({ photo })}
            label="Портрет"
            imgClassName="h-52"
            onFail={onFail}
          />
        </Field>
        <div className="flex-1 space-y-4">
          <Field label="Имя и фамилия">
            <TextInput
              value={dir.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Елена Морозова"
            />
          </Field>
          <Field label="Должность">
            <TextInput
              value={dir.role}
              onChange={(e) => patch({ role: e.target.value })}
              placeholder="Директор фонда"
            />
          </Field>
        </div>
      </div>
      <Field label="Текст обращения" hint="абзацы разделяйте пустой строкой">
        <TextArea
          rows={10}
          value={dir.text}
          onChange={(e) => patch({ text: e.target.value })}
          placeholder="Дорогие друзья!…"
        />
      </Field>
    </div>
  );
}

/* --------------------------------- Команда --------------------------------- */

export function TeamEditor({
  data,
  setData,
  onFail,
}: {
  data: ReportData;
  setData: SetData;
  onFail: (m: string) => void;
}) {
  const team = data.team;
  const setList = (list: ReportData["team"]) => setData((d) => ({ ...d, team: list }));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= team.length) return;
    const next = [...team];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Команда"
        text="Люди — лицо отчёта. Фото необязательны: без них в отчёте появятся аккуратные карточки с инициалами."
      />
      {team.length === 0 && (
        <p className="rounded-md border border-dashed border-pine-700 px-4 py-3 text-[13px] text-pine-400">
          Раздел пуст — страница «Команда» в отчёте пока не появится.
        </p>
      )}
      <div className="space-y-3">
        {team.map((m, i) => (
          <div
            key={m.id}
            className="anim-fade flex gap-4 rounded-md border border-pine-700/60 bg-pine-900/40 p-3.5"
          >
            <ImageUpload
              value={m.photo}
              onChange={(photo) =>
                setList(team.map((x) => (x.id === m.id ? { ...x, photo } : x)))
              }
              label="Фото"
              hint=""
              className="w-24 shrink-0"
              imgClassName="h-24"
              onFail={onFail}
            />
            <div className="min-w-0 flex-1 space-y-2.5">
              <TextInput
                value={m.name}
                onChange={(e) =>
                  setList(team.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x)))
                }
                placeholder="Имя и фамилия"
              />
              <TextInput
                value={m.role}
                onChange={(e) =>
                  setList(team.map((x) => (x.id === m.id ? { ...x, role: e.target.value } : x)))
                }
                placeholder="Роль в организации"
              />
              <div className="flex gap-1.5">
                <SmallBtn type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Выше">
                  <Icon name="up" size={13} />
                </SmallBtn>
                <SmallBtn type="button" onClick={() => move(i, 1)} disabled={i === team.length - 1} title="Ниже">
                  <Icon name="down" size={13} />
                </SmallBtn>
                <SmallBtn
                  type="button"
                  onClick={() => setList(team.filter((x) => x.id !== m.id))}
                  title="Удалить"
                  className="ml-auto"
                >
                  <Icon name="trash" size={13} /> Удалить
                </SmallBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GhostButton
        type="button"
        onClick={() => setList([...team, newTeamMember()])}
        className="w-full border-dashed"
      >
        <Icon name="plus" size={15} /> Добавить сотрудника
      </GhostButton>
    </div>
  );
}

/* --------------------------------- Партнёры --------------------------------- */

export function PartnersEditor({
  data,
  setData,
  onFail,
}: {
  data: ReportData;
  setData: SetData;
  onFail: (m: string) => void;
}) {
  const p = data.partners;
  const setList = (list: ReportData["partners"]["list"]) =>
    setData((d) => ({ ...d, partners: { ...d.partners, list } }));

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Партнёры"
        text="Раздел необязательный: расскажите о компаниях и организациях, которые помогали в течение года. Логотипы можно не загружать — подставим монограммы."
      />
      <Field label="Вводный текст">
        <TextArea
          rows={3}
          value={p.intro}
          onChange={(e) =>
            setData((d) => ({ ...d, partners: { ...d.partners, intro: e.target.value } }))
          }
          placeholder="Несколько слов благодарности партнёрам"
        />
      </Field>
      {p.list.length === 0 && (
        <p className="rounded-md border border-dashed border-pine-700 px-4 py-3 text-[13px] text-pine-400">
          Список пуст — страница «Партнёры» в отчёте пока не появится.
        </p>
      )}
      <div className="space-y-3">
        {p.list.map((pt) => (
          <div
            key={pt.id}
            className="anim-fade flex gap-4 rounded-md border border-pine-700/60 bg-pine-900/40 p-3.5"
          >
            <ImageUpload
              value={pt.logo}
              onChange={(logo) =>
                setList(p.list.map((x) => (x.id === pt.id ? { ...x, logo } : x)))
              }
              label="Лого"
              hint=""
              className="w-24 shrink-0"
              imgClassName="h-20"
              contain
              onFail={onFail}
            />
            <div className="min-w-0 flex-1 space-y-2.5">
              <TextInput
                value={pt.name}
                onChange={(e) =>
                  setList(p.list.map((x) => (x.id === pt.id ? { ...x, name: e.target.value } : x)))
                }
                placeholder="Название партнёра"
              />
              <TextArea
                rows={2}
                value={pt.text}
                onChange={(e) =>
                  setList(p.list.map((x) => (x.id === pt.id ? { ...x, text: e.target.value } : x)))
                }
                placeholder="Чем помог в этом году"
              />
              <div className="flex justify-end">
                <SmallBtn
                  type="button"
                  onClick={() => setList(p.list.filter((x) => x.id !== pt.id))}
                >
                  <Icon name="trash" size={13} /> Удалить
                </SmallBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GhostButton
        type="button"
        onClick={() => setList([...p.list, newPartner()])}
        className="w-full border-dashed"
      >
        <Icon name="plus" size={15} /> Добавить партнёра
      </GhostButton>
    </div>
  );
}

/* --------------------------------- Финансы --------------------------------- */

function MoneyTable({
  title,
  rows,
  onChange,
  accent,
}: {
  title: string;
  rows: MoneyRow[];
  onChange: (rows: MoneyRow[]) => void;
  accent: "gold" | "pine";
}) {
  const total = sum(rows);
  return (
    <div className="rounded-md border border-pine-700/60 bg-pine-900/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3
          className={
            accent === "gold"
              ? "text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300"
              : "text-[12px] font-bold uppercase tracking-[0.16em] text-pine-300"
          }
        >
          {title}
        </h3>
        <SmallBtn
          type="button"
          onClick={() => onChange([...rows, newMoneyRow()])}
        >
          <Icon name="plus" size={13} /> Строка
        </SmallBtn>
      </div>
      {rows.length === 0 && (
        <p className="mb-3 text-[12.5px] text-pine-400">Строк пока нет.</p>
      )}
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2">
            <TextInput
              value={r.label}
              onChange={(e) =>
                onChange(rows.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))
              }
              placeholder="Статья"
            />
            <div className="relative w-40 shrink-0">
              <TextInput
                type="number"
                min={0}
                value={r.amount || ""}
                onChange={(e) =>
                  onChange(
                    rows.map((x) =>
                      x.id === r.id ? { ...x, amount: Number(e.target.value) || 0 } : x
                    )
                  )
                }
                placeholder="0"
                className="pr-7 text-right tabular"
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[13px] text-pine-400">
                ₽
              </span>
            </div>
            <SmallBtn
              type="button"
              onClick={() => onChange(rows.filter((x) => x.id !== r.id))}
              title="Удалить"
              className="shrink-0 px-2"
            >
              <Icon name="trash" size={13} />
            </SmallBtn>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-pine-700/70 pt-2.5">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-pine-300">
          Итого
        </span>
        <span className="tabular font-display text-lg text-gold-300">
          {fmtMoney(total)}
        </span>
      </div>
    </div>
  );
}

export function FinanceEditor({
  data,
  setData,
}: {
  data: ReportData;
  setData: SetData;
}) {
  const f = data.finances;
  const inc = sum(f.income);
  const exp = sum(f.expenses);

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Финансы"
        text="Прозрачность — требование стандарта «Точка отсчёта». Внесите поступления и расходы за год — таблицы, итоги и диаграмма сформируются автоматически."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <MoneyTable
          title="Поступления"
          rows={f.income}
          accent="gold"
          onChange={(income) => setData((d) => ({ ...d, finances: { ...d.finances, income } }))}
        />
        <MoneyTable
          title="Расходы"
          rows={f.expenses}
          accent="pine"
          onChange={(expenses) => setData((d) => ({ ...d, finances: { ...d.finances, expenses } }))}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-pine-700/60 bg-pine-900/60 px-4 py-3 text-[13px]">
        <span className="text-pine-300">
          Поступления: <b className="tabular text-gold-300">{fmtMoney(inc)}</b>
        </span>
        <span className="text-pine-300">
          Расходы: <b className="tabular text-pine-100">{fmtMoney(exp)}</b>
        </span>
        <span className="text-pine-300">
          Сальдо:{" "}
          <b className={"tabular " + (inc - exp >= 0 ? "text-gold-300" : "text-red-300")}>
            {inc - exp >= 0 ? "+" : "−"}
            {fmtMoney(Math.abs(inc - exp))}
          </b>
        </span>
      </div>
      <Field label="Примечание к разделу" hint="аудит, ссылки на документы">
        <TextArea
          rows={3}
          value={f.comment}
          onChange={(e) =>
            setData((d) => ({ ...d, finances: { ...d.finances, comment: e.target.value } }))
          }
          placeholder="Например: отчётность прошла независимый аудит…"
        />
      </Field>
    </div>
  );
}

/* --------------------------------- Программы --------------------------------- */

export function ProgramsEditor({
  data,
  setData,
  onFail,
}: {
  data: ReportData;
  setData: SetData;
  onFail: (m: string) => void;
}) {
  const programs = data.programs;
  const [open, setOpen] = useState<string | null>(programs[0]?.id ?? null);
  const setList = (list: Program[]) => setData((d) => ({ ...d, programs: list }));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= programs.length) return;
    const next = [...programs];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };

  return (
    <div className="anim-rise space-y-6">
      <SectionIntro
        title="Программы"
        text="Каждая программа получает в отчёте отдельную страницу-разворот: обложка, описание, результаты в цифрах и фоторепортаж с мероприятий."
      />
      {programs.length === 0 && (
        <p className="rounded-md border border-dashed border-pine-700 px-4 py-3 text-[13px] text-pine-400">
          Программ пока нет — добавьте первую, это сердце отчёта.
        </p>
      )}
      <div className="space-y-3">
        {programs.map((p, i) => {
          const isOpen = open === p.id;
          const patchP = (pp: Partial<Program>) =>
            setList(programs.map((x) => (x.id === p.id ? { ...x, ...pp } : x)));
          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-md border border-pine-700/60 bg-pine-900/40"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-pine-800/50"
              >
                <span className="font-display text-[15px] text-gold-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate text-[15px] font-semibold text-pine-100">
                  {p.title || "Программа без названия"}
                </span>
                <span className="text-[11px] text-pine-400">
                  {p.photos.length} фото
                </span>
                <Icon
                  name="chevron"
                  size={15}
                  className={
                    "text-pine-400 transition-transform duration-200 " +
                    (isOpen ? "rotate-180" : "")
                  }
                />
              </button>

              {isOpen && (
                <div className="anim-fade space-y-4 border-t border-pine-700/60 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Название программы">
                      <TextInput
                        value={p.title}
                        onChange={(e) => patchP({ title: e.target.value })}
                        placeholder="«Тепло дома»"
                      />
                    </Field>
                    <Field label="Фото обложки">
                      <ImageUpload
                        value={p.cover}
                        onChange={(cover) => patchP({ cover })}
                        label="Обложка программы"
                        imgClassName="h-[4.4rem]"
                        onFail={onFail}
                      />
                    </Field>
                  </div>
                  <Field label="Описание">
                    <TextArea
                      rows={4}
                      value={p.description}
                      onChange={(e) => patchP({ description: e.target.value })}
                      placeholder="Что делает программа и для кого"
                    />
                  </Field>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">
                        Результаты в цифрах
                      </span>
                      <SmallBtn
                        type="button"
                        onClick={() =>
                          p.results.length < 4 &&
                          patchP({ results: [...p.results, newProgramResult()] })
                        }
                        disabled={p.results.length >= 4}
                      >
                        <Icon name="plus" size={13} />
                      </SmallBtn>
                    </div>
                    <div className="space-y-2">
                      {p.results.map((r) => (
                        <div key={r.id} className="flex items-center gap-2">
                          <TextInput
                            value={r.value}
                            onChange={(e) =>
                              patchP({
                                results: p.results.map((x) =>
                                  x.id === r.id ? { ...x, value: e.target.value } : x
                                ),
                              })
                            }
                            placeholder="96"
                            className="w-28 shrink-0 text-center font-bold"
                          />
                          <TextInput
                            value={r.label}
                            onChange={(e) =>
                              patchP({
                                results: p.results.map((x) =>
                                  x.id === r.id ? { ...x, label: e.target.value } : x
                                ),
                              })
                            }
                            placeholder="домов отремонтировано"
                          />
                          <SmallBtn
                            type="button"
                            onClick={() =>
                              patchP({ results: p.results.filter((x) => x.id !== r.id) })
                            }
                            className="shrink-0 px-2"
                            title="Удалить"
                          >
                            <Icon name="trash" size={13} />
                          </SmallBtn>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">
                      Фоторепортаж с мероприятий
                    </span>
                    <MultiPhotoUpload
                      items={p.photos}
                      onChange={(photos) => patchP({ photos })}
                      onFail={onFail}
                    />
                  </div>
                  <div className="flex gap-1.5 border-t border-pine-700/60 pt-3">
                    <SmallBtn type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                      <Icon name="up" size={13} /> Выше
                    </SmallBtn>
                    <SmallBtn
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === programs.length - 1}
                    >
                      <Icon name="down" size={13} /> Ниже
                    </SmallBtn>
                    <SmallBtn
                      type="button"
                      onClick={() => {
                        setList(programs.filter((x) => x.id !== p.id));
                        if (open === p.id) setOpen(null);
                      }}
                      className="ml-auto"
                    >
                      <Icon name="trash" size={13} /> Удалить программу
                    </SmallBtn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <GhostButton
        type="button"
        onClick={() => {
          const np = newProgram();
          setList([...programs, np]);
          setOpen(np.id);
        }}
        className="w-full border-dashed"
      >
        <Icon name="plus" size={15} /> Добавить программу
      </GhostButton>
    </div>
  );
}
