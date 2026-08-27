export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface MoneyRow {
  id: string;
  label: string;
  amount: number;
}

export interface TeamMember {
  id: string;
  photo: string;
  name: string;
  role: string;
}

export interface Partner {
  id: string;
  logo: string;
  name: string;
  text: string;
}

export interface ReportPhoto {
  id: string;
  src: string;
  caption: string;
}

export interface ProgramResult {
  id: string;
  value: string;
  label: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  cover: string;
  results: ProgramResult[];
  photos: ReportPhoto[];
}

export interface OrgInfo {
  fullName: string;
  shortName: string;
  mission: string;
  about: string;
  logo: string;
  coverPhoto: string;
  founded: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  inn: string;
  ogrn: string;
  bankName: string;
  bik: string;
  corrAccount: string;
  account: string;
  stats: StatItem[];
}

export interface DirectorInfo {
  photo: string;
  name: string;
  role: string;
  text: string;
}

export interface FinancesInfo {
  income: MoneyRow[];
  expenses: MoneyRow[];
  comment: string;
}

export interface ReportData {
  year: string;
  org: OrgInfo;
  director: DirectorInfo;
  team: TeamMember[];
  partners: { intro: string; list: Partner[] };
  finances: FinancesInfo;
  programs: Program[];
}

export type SectionId =
  | "org"
  | "director"
  | "team"
  | "programs"
  | "finance"
  | "partners";

const s = () => Math.random().toString(36).slice(2, 10);

export function emptyReport(): ReportData {
  return {
    year: "2025", // отчёт формируется за 2025 год
    org: {
      fullName: "",
      shortName: "",
      mission: "",
      about: "",
      logo: "",
      coverPhoto: "",
      founded: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      inn: "",
      ogrn: "",
      bankName: "",
      bik: "",
      corrAccount: "",
      account: "",
      stats: [],
    },
    director: { photo: "", name: "", role: "", text: "" },
    team: [],
    partners: { intro: "", list: [] },
    finances: { income: [], expenses: [], comment: "" },
    programs: [],
  };
}

export const newStat = (): StatItem => ({ id: s(), value: "", label: "" });
export const newMoneyRow = (): MoneyRow => ({ id: s(), label: "", amount: 0 });
export const newTeamMember = (): TeamMember => ({
  id: s(),
  photo: "",
  name: "",
  role: "",
});
export const newPartner = (): Partner => ({ id: s(), logo: "", name: "", text: "" });
export const newProgramResult = (): ProgramResult => ({
  id: s(),
  value: "",
  label: "",
});
export const newProgram = (): Program => ({
  id: s(),
  title: "",
  description: "",
  cover: "",
  results: [newProgramResult(), newProgramResult(), newProgramResult()],
  photos: [],
});
