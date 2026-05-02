export type Day = "FRIDAY" | "SATURDAY" | "SUNDAY";
export type Stage =
  | "AREA V"
  | "AREA A"
  | "AREA B"
  | "AREA C"
  | "AREA X"
  | "AREA Y"
  | "AREA H"
  | "AREA N";

export interface Set {
  id: string;
  day: Day;
  stage: Stage;
  name: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

const RAW: Record<Day, Partial<Record<Stage, [string, string, string][]>>> = {
  FRIDAY: {
    "AREA V": [["15:00","17:30","SAIDAH"],["17:30","19:00","PEGASSI"],["19:00","20:30","PATRICK MASON"],["20:30","22:00","I HATE MODELS"],["22:00","23:30","DJ GIGOLA & FUNK TRIBU"],["23:30","01:00","AMELIE LENS"]],
    "AREA A": [["15:00","17:00","OLIVE ANGUZ"],["17:00","18:30","FRANCK & UPPER90"],["18:30","20:00","SERAFINA"],["20:00","22:00","FUTURE.666 & ÜBERKIKZ"],["22:00","23:30","CLOUDY"],["23:30","01:00","ADRIÁN MILLS"]],
    "AREA B": [["15:00","16:30","AAT"],["16:30","18:30","M-HIGH & SIDNEY CHARLES"],["18:30","20:00","CLOONEE"],["20:00","21:30","WADE"],["21:30","23:30","EAST END DUBS & VINTAGE CULTURE"],["23:30","01:00","GORDO"]],
    "AREA C": [["15:00","17:00","HELSLOOT"],["17:00","18:30","KASIA"],["18:30","20:00","MARCO FARAONE"],["20:00","21:30","ALAN FITZPATRICK"],["21:30","23:00","ANFISA LETYAGO"],["23:00","01:00","JORIS VOORN"]],
    "AREA X": [["16:00","18:00","BULLZEYE"],["18:00","19:30","ELLI ACULA"],["19:30","21:00","MARRØN"],["21:00","23:00","DJ RUSH"],["23:00","01:00","SPEEDY J"]],
    "AREA H": [["16:30","18:00","BIANKA"],["18:00","19:30","ZISKO"],["19:30","21:00","MAC DECLOS"],["21:00","22:30","PHILIPPA PACHO"],["22:30","00:00","LOBSTER"]],
    "AREA N": [["00:30","02:00","LOCUS ERROR"],["02:00","03:30","ESTELLA BOERSMA"],["03:30","05:00","LACCHESI"]],
  },
  SATURDAY: {
    "AREA V": [["13:00","15:00","BENJA & FRANC FALA"],["15:00","16:30","ADAM TEN"],["16:30","18:00","MISS MONIQUE"],["18:00","19:30","ENRICO SANGIULIANO"],["19:30","21:30","JORIS VOORN & KEVIN DE VRIES"],["21:30","23:00","JOSEPH CAPRIATI"],["23:00","01:00","ADAM BEYER"]],
    "AREA A": [["13:00","14:30","KARA OKAY"],["14:30","16:00","PAIGE TOMLINSON"],["16:00","17:45","SOUTHSTAR"],["17:45","19:15","MISCHLUFT"],["19:15","21:00","DJ HEARTSTRING"],["21:00","23:00","MALUGI"],["23:00","01:00","ANETHA"]],
    "AREA B": [["13:00","15:00","JULIAN FIJMA"],["15:00","17:00","JAMBACK & MARSOLO"],["17:00","19:00","ENZO SIRAGUSA"],["19:00","21:00","MAX DEAN & PROSPA"],["21:00","23:00","JOSH BAKER"],["23:00","01:00","KETTAMA"]],
    "AREA C": [["13:00","15:30","NIIOMI"],["15:30","18:30","NOVA:II"],["18:30","21:00","MAHMUT ORHAN & SHIMZA"],["21:00","23:00","COLYN"],["23:00","01:00","STEPHAN BODZIN (LIVE)"]],
    "AREA X": [["13:00","14:45","SHE/HER"],["14:45","16:15","GRACE DAHL"],["16:15","18:00","ADIEL"],["18:00","19:45","RØDHÅD"],["19:45","21:30","LEN FAKI"],["21:30","23:15","FJAAK"],["23:15","01:00","DAX J"]],
    "AREA Y": [["13:00","15:00","FIENE"],["15:00","16:30","DIØN"],["16:30","18:15","INDIRA PAGANOTTO"],["18:15","19:45","NICO MORENO"],["19:45","21:30","FATIMA HAJJI"],["21:30","23:15","AZYR"],["23:15","01:00","DYEN"]],
    "AREA H": [["15:00","17:00","ALI3N"],["17:00","18:30","ISABEL SOTO"],["18:30","19:30","VLADIMIR DUBYSHKIN (LIVE)"],["19:30","21:00","BESTE HIRA"],["21:00","22:30","RENE WISE"],["22:30","00:00","AKUA & HENNING BAER"]],
    "AREA N": [["00:30","02:00","VE/RA"],["02:00","03:30","AMBER BROOS & JULIET FOX"],["03:30","05:00","SECRET CINEMA"]],
  },
  SUNDAY: {
    "AREA V": [["13:00","15:00","JULYA KARMA"],["15:00","16:30","INNELLEA"],["16:30","18:00","BORIS BREJCHA"],["18:00","19:30","ADRIATIQUE"],["19:30","21:00","RICHIE HAWTIN"],["21:00","23:00","CHARLOTTE DE WITTE"]],
    "AREA A": [["13:00","14:30","LISA KORVER"],["14:30","16:00","LUCKY DONE GONE"],["16:00","18:00","LAMMER"],["18:00","19:30","BAD BOOMBOX"],["19:30","21:15","ØTTA"],["21:15","23:00","MCR-T & PARTIBOI69"]],
    "AREA B": [["13:00","15:00","EASTTOWN"],["15:00","16:30","JOËLLA JACKSON"],["16:30","18:00","TOMAN"],["18:00","19:30","MAU P"],["19:30","21:00","FRANKY RIZARDO"],["21:00","23:00","MARCO CAROLA"]],
    "AREA C": [["13:00","14:30","KAUFMANN"],["14:30","16:00","MHA IRI"],["16:00","17:45","CHRIS AVANTGARDE"],["17:45","19:15","BART SKILS"],["19:15","21:00","PAN-POT"],["21:00","23:00","ELI BROWN & HI-LO"]],
    "AREA X": [["13:00","14:45","JULIA MARIA"],["14:45","16:30","IGNEZ"],["16:30","18:00","NINA KRAVIZ"],["18:00","19:30","FREDDY K"],["19:30","21:00","BEN KLOCK"],["21:00","23:00","CHLÄR & YANAMASTE"]],
    "AREA Y": [["13:00","14:30","SAMOH (LIVE)"],["14:30","16:00","NIKOLINA"],["16:00","17:30","BIIA"],["17:30","19:00","NOVAH"],["19:00","21:00","999999999"],["21:00","23:00","CYNTHIA SPIERING & REINIER ZONNEVELD"]],
    "AREA H": [["15:00","16:30","VALODY"],["16:30","18:00","ROSATI"],["18:00","20:00","SHDW"],["20:00","22:00","STRANGER & TALISMANN"]],
    "AREA N": [["23:30","01:00","ARES CARTER"],["01:00","03:00","JOYHAUSER"]],
  },
};

export const STAGE_COLORS: Record<Stage, string> = {
  "AREA V": "#e91e63",
  "AREA A": "#ff9800",
  "AREA B": "#4caf50",
  "AREA C": "#2196f3",
  "AREA X": "#9c27b0",
  "AREA Y": "#00bcd4",
  "AREA H": "#f44336",
  "AREA N": "#607d8b",
};

export const DAYS: Day[] = ["FRIDAY", "SATURDAY", "SUNDAY"];

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeSetId(day: Day, stage: Stage, start: string, name: string) {
  return `${slug(day)}-${slug(stage)}-${start.replace(":", "")}-${slug(name)}`;
}

export const SETS: Set[] = (() => {
  const out: Set[] = [];
  (Object.keys(RAW) as Day[]).forEach((day) => {
    const stages = RAW[day];
    (Object.keys(stages) as Stage[]).forEach((stage) => {
      stages[stage]!.forEach(([start, end, name]) => {
        out.push({ id: makeSetId(day, stage, start, name), day, stage, name, start, end });
      });
    });
  });
  return out;
})();

export const SETS_BY_DAY: Record<Day, Set[]> = {
  FRIDAY: SETS.filter((s) => s.day === "FRIDAY"),
  SATURDAY: SETS.filter((s) => s.day === "SATURDAY"),
  SUNDAY: SETS.filter((s) => s.day === "SUNDAY"),
};

export const SETS_BY_ID: Record<string, Set> = Object.fromEntries(
  SETS.map((s) => [s.id, s]),
);

export function stagesForDay(day: Day): Stage[] {
  return Array.from(new Set(SETS_BY_DAY[day].map((s) => s.stage)));
}

export function parseTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Day boundaries: sets starting before noon are treated as next-day (after-midnight).
 */
export function computeDayRange(day: Day) {
  const sets = SETS_BY_DAY[day];
  let starts: number[] = [];
  let ends: number[] = [];
  sets.forEach(({ start, end }) => {
    let sm = parseTime(start);
    let em = parseTime(end);
    if (sm < 12 * 60) sm += 24 * 60;
    if (em <= sm) em += 24 * 60;
    starts.push(sm);
    ends.push(em);
  });
  const min = Math.min(...starts);
  const max = Math.max(...ends);
  return {
    start: Math.floor(min / 15) * 15,
    end: Math.ceil(max / 15) * 15,
  };
}

export function setRange(s: Set) {
  let sm = parseTime(s.start);
  let em = parseTime(s.end);
  if (sm < 12 * 60) sm += 24 * 60;
  if (em <= sm) em += 24 * 60;
  return { sm, em };
}

export function fmtTime(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
