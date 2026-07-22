"use client";

import { type ChangeEvent, type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type Position = {
  id: number;
  period: string;
  role: string;
  bullets: string;
};

type ExperienceType = "employment" | "project" | "training" | "break";

type Experience = {
  id: number;
  type: ExperienceType;
  showTitle: boolean;
  company: string;
  location: string;
  positions: Position[];
};

type Education = {
  id: number;
  period: string;
  degree: string;
  institution: string;
  detail: string;
};

type SkillGroup = {
  id: number;
  label: string;
  skills: string;
};

type ResumeData = {
  photo: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  birthDate: string;
  intro: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  languages: string;
  interests: string;
};

type ResumeSnapshot = {
  version: 1;
  exportedAt: string;
  data: ResumeData;
  theme: ThemeName;
  font: FontName;
  density: DensityName;
  columnLayout: ColumnLayout;
  photoShape: PhotoShape;
  headingStyle: HeadingStyle;
};

type ThemeName = "sage" | "ink" | "clay" | "plum" | "ocean" | "sand";
type FontName = "sans" | "serif";
type DensityName = "compact" | "balanced" | "airy";
type ColumnLayout = "experience-left" | "experience-right";
type PhotoShape = "circle" | "rounded" | "square";
type HeadingStyle = "caps" | "editorial";
type EditorSection = "personal" | "intro" | "experience" | "education" | "skills" | "design";

type ExperienceTypeConfig = {
  value: ExperienceType;
  label: string;
  fallbackTitle: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  groupLabel: string;
  itemSingular: string;
  itemPlural: string;
  addLabel: string;
  roleLabel: string;
  rolePlaceholder: string;
  bulletsLabel: string;
  bulletsPlaceholder: string;
};

const initialData: ResumeData = {
  photo: "",
  name: "Mara Winterfeld",
  role: "Kulturmanagerin",
  email: "mara.winterfeld@example.com",
  phone: "+49 151 00000000",
  location: "Freiburg im Breisgau, Deutschland",
  website: "mara-winterfeld.example",
  birthDate: "",
  intro:
    "Kulturmanagerin mit Schwerpunkt auf partizipativen Ausstellungsformaten und regionaler Vermittlungsarbeit. Ich entwickle Programme, die unterschiedliche Perspektiven zusammenbringen, und begleite Projekte von der ersten Idee bis zur Veranstaltung vor Ort.",
  experience: [
    {
      id: 1,
      type: "employment",
      showTitle: true,
      company: "Museum am Fluss",
      location: "Freiburg",
      positions: [
        {
          id: 101,
          period: "09/2022 – heute",
          role: "Programmleitung Bildung & Vermittlung",
          bullets:
            "Jährliches Veranstaltungsprogramm für verschiedene Altersgruppen konzipiert\nKooperationen mit Schulen, Vereinen und lokalen Initiativen aufgebaut\nBudgets, Zeitpläne und externe Projektteams koordiniert",
        },
      ],
    },
    {
      id: 2,
      type: "employment",
      showTitle: true,
      company: "Kulturforum Nordlicht",
      location: "Kiel",
      positions: [
        {
          id: 201,
          period: "03/2019 – 08/2022",
          role: "Projektkoordinatorin",
          bullets:
            "Lesungen, Werkstätten und ein jährliches Stadtteilfestival organisiert\nFörderanträge vorbereitet und Projektergebnisse dokumentiert\nKommunikation mit Kunstschaffenden, Spielstätten und Presse betreut",
        },
        {
          id: 202,
          period: "10/2017 – 02/2019",
          role: "Veranstaltungsassistenz",
          bullets:
            "Abläufe für Gastspiele und Workshops vorbereitet\nTeilnehmendenmanagement und Abendkasse verantwortet",
        },
      ],
    },
  ],
  education: [
    {
      id: 1,
      period: "2015 – 2017",
      degree: "Kulturvermittlung (M.A.)",
      institution: "Universität Hildesheim",
      detail: "Schwerpunkt kulturelle Teilhabe",
    },
    {
      id: 2,
      period: "2011 – 2015",
      degree: "Kunstgeschichte und Soziologie (B.A.)",
      institution: "Universität Leipzig",
      detail: "Auslandssemester in Utrecht",
    },
  ],
  skills: [
    { id: 1, label: "Projektarbeit", skills: "Programmplanung, Budgetierung, Fördermittel" },
    { id: 2, label: "Vermittlung", skills: "Workshopkonzeption, Moderation, Barrierearme Formate" },
    { id: 3, label: "Organisation", skills: "Veranstaltungsplanung, Pressearbeit, Kooperationen" },
  ],
  languages: "Deutsch · Muttersprache\nEnglisch · sehr gut\nNiederländisch · Grundkenntnisse",
  interests: "Siebdruck, Urban Gardening, Chorgesang, Küstenwanderungen",
};

const themes: Array<{ name: ThemeName; label: string; color: string; soft: string; ink: string }> = [
  { name: "sage", label: "Salbei", color: "#376b5d", soft: "#e9f1ee", ink: "#19322b" },
  { name: "ink", label: "Tinte", color: "#34475d", soft: "#edf1f5", ink: "#182330" },
  { name: "clay", label: "Terrakotta", color: "#aa5c42", soft: "#f7ece7", ink: "#44241a" },
  { name: "plum", label: "Pflaume", color: "#705276", soft: "#f2ebf3", ink: "#352638" },
  { name: "ocean", label: "Ozean", color: "#25657a", soft: "#e7f1f4", ink: "#173a45" },
  { name: "sand", label: "Sand", color: "#8a7042", soft: "#f4f0e6", ink: "#40341f" },
];

const experienceTypes: ExperienceTypeConfig[] = [
  {
    value: "employment",
    label: "Anstellung",
    fallbackTitle: "Neues Unternehmen",
    organizationLabel: "Unternehmen",
    organizationPlaceholder: "Name des Unternehmens",
    groupLabel: "Positionen",
    itemSingular: "Rolle",
    itemPlural: "Rollen",
    addLabel: "Position hinzufügen",
    roleLabel: "Jobtitel",
    rolePlaceholder: "z. B. Senior Software Engineer",
    bulletsLabel: "Erfolge & Aufgaben",
    bulletsPlaceholder: "Eine Zeile pro Erfolg oder Aufgabe",
  },
  {
    value: "project",
    label: "Eigenes Projekt",
    fallbackTitle: "Eigenes Projekt",
    organizationLabel: "Projekt / Projektgruppe",
    organizationPlaceholder: "z. B. Vita Resume Studio",
    groupLabel: "Projektbeiträge",
    itemSingular: "Beitrag",
    itemPlural: "Beiträge",
    addLabel: "Beitrag hinzufügen",
    roleLabel: "Rolle / Schwerpunkt",
    rolePlaceholder: "z. B. Konzeption & Entwicklung",
    bulletsLabel: "Ergebnisse & Beiträge",
    bulletsPlaceholder: "Eine Zeile pro Ergebnis oder Beitrag",
  },
  {
    value: "training",
    label: "Weiterbildung",
    fallbackTitle: "Fachliche Weiterbildung",
    organizationLabel: "Anbieter / Thema",
    organizationPlaceholder: "z. B. Fachliche Vertiefung im Selbststudium",
    groupLabel: "Schwerpunkte",
    itemSingular: "Schwerpunkt",
    itemPlural: "Schwerpunkte",
    addLabel: "Schwerpunkt hinzufügen",
    roleLabel: "Weiterbildung / Schwerpunkt",
    rolePlaceholder: "z. B. Generative KI",
    bulletsLabel: "Inhalte & Ergebnisse",
    bulletsPlaceholder: "Eine Zeile pro Inhalt oder Lernergebnis",
  },
  {
    value: "break",
    label: "Auszeit",
    fallbackTitle: "Berufliche Auszeit",
    organizationLabel: "",
    organizationPlaceholder: "",
    groupLabel: "Details",
    itemSingular: "Eintrag",
    itemPlural: "Einträge",
    addLabel: "Detail hinzufügen",
    roleLabel: "Bezeichnung",
    rolePlaceholder: "z. B. Gesundheitlich bedingte Auszeit und Rehabilitation",
    bulletsLabel: "Optionaler Hinweis",
    bulletsPlaceholder: "z. B. Rehabilitationsmaßnahme abgeschlossen",
  },
];

const editorSections: Array<{ id: EditorSection; label: string; number: string }> = [
  { id: "personal", label: "Persönlich", number: "01" },
  { id: "intro", label: "Intro", number: "02" },
  { id: "experience", label: "Werdegang", number: "03" },
  { id: "education", label: "Ausbildung", number: "04" },
  { id: "skills", label: "Kenntnisse", number: "05" },
  { id: "design", label: "Design", number: "06" },
];

const inputClass = "form-input";
const introMaxLength = 700;
const storageKey = "vita-resume";
const printPageWidthMm = 210;
const printPageHeightMm = 297;
const printPageHeightPx = 1123;
const printFooterReservePx = 72;

function applyPrintScale(paper: HTMLElement, scale: number) {
  const inverseScale = 1 / scale;
  paper.style.setProperty("--print-scale", scale.toFixed(5));
  paper.style.setProperty("--print-paper-width", `${printPageWidthMm * inverseScale}mm`);
  paper.style.setProperty("--print-paper-height", `${printPageHeightMm * inverseScale}mm`);
  paper.style.setProperty("--print-padding-top", `${15 * inverseScale}mm`);
  paper.style.setProperty("--print-padding-inline", `${16.4 * inverseScale}mm`);
  paper.style.setProperty("--print-padding-bottom", `${9 * inverseScale}mm`);
  paper.style.setProperty("--print-footer-inline", `${16.4 * inverseScale}mm`);
  paper.style.setProperty("--print-footer-bottom", `${6.5 * inverseScale}mm`);
}

function fitResumeToSinglePrintPage(paper: HTMLElement | null) {
  if (!paper) return;

  applyPrintScale(paper, 1);
  paper.getBoundingClientRect();

  const columns = paper.querySelector<HTMLElement>(".resume-columns");
  const contentBottom = columns ? columns.offsetTop + columns.offsetHeight : paper.scrollHeight;
  const requiredHeight = Math.max(
    printPageHeightPx,
    paper.scrollHeight,
    contentBottom + printFooterReservePx,
  );
  const scale = Math.min(1, printPageHeightPx / requiredHeight);

  applyPrintScale(paper, scale);
  paper.dataset.printScale = scale.toFixed(3);
}

function splitLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function isExperienceType(value: unknown): value is ExperienceType {
  return experienceTypes.some((item) => item.value === value);
}

function getExperienceTypeConfig(type: ExperienceType) {
  return experienceTypes.find((item) => item.value === type) ?? experienceTypes[0];
}

function normalizeExperience(value: unknown): Experience[] {
  if (!Array.isArray(value)) return initialData.experience;

  const normalized: Experience[] = [];

  value.forEach((rawItem, companyIndex) => {
    const item = rawItem && typeof rawItem === "object" ? rawItem as Record<string, unknown> : {};
    const fallbackCompanyId = Date.now() + companyIndex * 100;
    const companyId = typeof item.id === "number" ? item.id : fallbackCompanyId;
    const type = isExperienceType(item.type) ? item.type : "employment";
    const showTitle = typeof item.showTitle === "boolean" ? item.showTitle : type !== "break";
    const company = typeof item.company === "string" ? item.company : "";
    const location = typeof item.location === "string" ? item.location : "";

    if (Array.isArray(item.positions)) {
      const positions = item.positions.map((rawPosition, positionIndex) => {
        const position = rawPosition && typeof rawPosition === "object" ? rawPosition as Record<string, unknown> : {};
        return {
          id: typeof position.id === "number" ? position.id : companyId * 100 + positionIndex + 1,
          period: typeof position.period === "string" ? position.period : "",
          role: typeof position.role === "string" ? position.role : "",
          bullets: typeof position.bullets === "string" ? position.bullets : "",
        };
      });

      normalized.push({
        id: companyId,
        type,
        showTitle,
        company,
        location,
        positions: positions.length > 0 ? positions : [{ id: companyId * 100 + 1, period: "", role: "", bullets: "" }],
      });
      return;
    }

    const legacyPosition: Position = {
      id: companyId * 100 + 1,
      period: typeof item.period === "string" ? item.period : "",
      role: typeof item.role === "string" ? item.role : "",
      bullets: typeof item.bullets === "string" ? item.bullets : "",
    };
    const matchingCompany = company.trim()
      ? normalized.find((entry) => entry.type === type
          && entry.showTitle === showTitle
          && entry.company.trim().toLocaleLowerCase() === company.trim().toLocaleLowerCase()
          && entry.location.trim().toLocaleLowerCase() === location.trim().toLocaleLowerCase())
      : undefined;

    if (matchingCompany) {
      matchingCompany.positions.push(legacyPosition);
    } else {
      normalized.push({ id: companyId, type, showTitle, company, location, positions: [legacyPosition] });
    }
  });

  return normalized.length > 0 ? normalized : initialData.experience;
}

function isThemeName(value: unknown): value is ThemeName {
  return themes.some((item) => item.name === value);
}

function isFontName(value: unknown): value is FontName {
  return value === "sans" || value === "serif";
}

function isDensityName(value: unknown): value is DensityName {
  return value === "compact" || value === "balanced" || value === "airy";
}

function isColumnLayout(value: unknown): value is ColumnLayout {
  return value === "experience-left" || value === "experience-right";
}

function isPhotoShape(value: unknown): value is PhotoShape {
  return value === "circle" || value === "rounded" || value === "square";
}

function isHeadingStyle(value: unknown): value is HeadingStyle {
  return value === "caps" || value === "editorial";
}

function readResumeSnapshot(raw: string): ResumeSnapshot | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const snapshot = parsed as Record<string, unknown>;
  if (snapshot.version !== 1 || typeof snapshot.exportedAt !== "string") return null;
  if (!snapshot.data || typeof snapshot.data !== "object") return null;
  if (!isThemeName(snapshot.theme) || !isFontName(snapshot.font) || !isDensityName(snapshot.density) || !isColumnLayout(snapshot.columnLayout) || !isPhotoShape(snapshot.photoShape) || !isHeadingStyle(snapshot.headingStyle)) {
    return null;
  }

  return {
    version: 1,
    exportedAt: snapshot.exportedAt,
    data: snapshot.data as ResumeData,
    theme: snapshot.theme,
    font: snapshot.font,
    density: snapshot.density,
    columnLayout: snapshot.columnLayout,
    photoShape: snapshot.photoShape,
    headingStyle: snapshot.headingStyle,
  };
}

export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [theme, setTheme] = useState<ThemeName>("sage");
  const [font, setFont] = useState<FontName>("sans");
  const [density, setDensity] = useState<DensityName>("balanced");
  const [columnLayout, setColumnLayout] = useState<ColumnLayout>("experience-left");
  const [photoShape, setPhotoShape] = useState<PhotoShape>("rounded");
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>("caps");
  const [activeSection, setActiveSection] = useState<EditorSection>("personal");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [storageReady, setStorageReady] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Automatisch gespeichert");
  const [photoError, setPhotoError] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const resumePaperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = readResumeSnapshot(saved);
        if (parsed) {
          setData({
            ...initialData,
            ...parsed.data,
            experience: normalizeExperience(parsed.data.experience),
          });
          setTheme(parsed.theme);
          setFont(parsed.font);
          setDensity(parsed.density);
          setColumnLayout(parsed.columnLayout);
          setPhotoShape(parsed.photoShape);
          setHeadingStyle(parsed.headingStyle);
        }
      }
    } catch {
      // The editor still works when browser storage is unavailable.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    setSaveLabel("Speichert …");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data, theme, font, density, columnLayout, photoShape, headingStyle } satisfies ResumeSnapshot));
        setSaveLabel("Automatisch gespeichert");
      } catch {
        setSaveLabel("Nur für diese Sitzung");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [data, theme, font, density, columnLayout, photoShape, headingStyle, storageReady]);

  useEffect(() => {
    const preparePrint = () => fitResumeToSinglePrintPage(resumePaperRef.current);
    window.addEventListener("beforeprint", preparePrint);
    return () => window.removeEventListener("beforeprint", preparePrint);
  }, []);

  const selectedTheme = themes.find((item) => item.name === theme) ?? themes[0];

  const completeness = useMemo(() => {
    const fields = [data.name, data.role, data.email, data.location, data.intro, data.experience[0]?.positions[0]?.role, data.education[0]?.degree, data.skills[0]?.skills];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [data]);

  const setField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const updateExperience = (id: number, field: "company" | "location", value: string) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateExperienceType = (id: number, type: ExperienceType) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => (item.id === id
        ? { ...item, type, showTitle: item.type === type ? item.showTitle : type !== "break" }
        : item)),
    }));
  };

  const updateExperienceTitleVisibility = (id: number, showTitle: boolean) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => (item.id === id ? { ...item, showTitle } : item)),
    }));
  };

  const moveExperience = (id: number, direction: -1 | 1) => {
    setData((current) => {
      const currentIndex = current.experience.findIndex((item) => item.id === id);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= current.experience.length) return current;

      const experience = [...current.experience];
      [experience[currentIndex], experience[targetIndex]] = [experience[targetIndex], experience[currentIndex]];
      return { ...current, experience };
    });
  };

  const addPosition = (experienceId: number) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => item.id === experienceId
        ? { ...item, positions: [...item.positions, { id: Date.now(), period: "", role: "", bullets: "" }] }
        : item),
    }));
  };

  const updatePosition = (experienceId: number, positionId: number, field: "period" | "role" | "bullets", value: string) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => item.id === experienceId
        ? {
            ...item,
            positions: item.positions.map((position) => position.id === positionId ? { ...position, [field]: value } : position),
          }
        : item),
    }));
  };

  const removePosition = (experienceId: number, positionId: number) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => item.id === experienceId
        ? { ...item, positions: item.positions.filter((position) => position.id !== positionId) }
        : item),
    }));
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    setData((current) => ({
      ...current,
      education: current.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateSkill = (id: number, field: keyof SkillGroup, value: string) => {
    setData((current) => ({
      ...current,
      skills: current.skills.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Bitte wähle eine Bilddatei aus.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("Das Bild darf höchstens 8 MB groß sein.");
      return;
    }

    setPhotoError("");
    const reader = new FileReader();
    reader.onerror = () => setPhotoError("Das Bild konnte nicht gelesen werden.");
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const image = new Image();
      image.onerror = () => setPhotoError("Dieses Bildformat konnte nicht verarbeitet werden.");
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const outputSize = 480;
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        canvas.width = outputSize;
        canvas.height = outputSize;
        const context = canvas.getContext("2d");
        if (!context) {
          setPhotoError("Das Bild konnte nicht verarbeitet werden.");
          return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, outputSize, outputSize);
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
        setField("photo", canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const resetResume = () => {
    if (!window.confirm("Möchtest du alle Änderungen zurücksetzen?")) return;
    setData(initialData);
    setTheme("sage");
    setFont("sans");
    setDensity("balanced");
    setColumnLayout("experience-left");
    setPhotoShape("rounded");
    setHeadingStyle("caps");
    setPhotoError("");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures on reset.
    }
  };

  const exportResume = () => {
    const snapshot: ResumeSnapshot = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
      theme,
      font,
      density,
      columnLayout,
      photoShape,
      headingStyle,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vita-resume-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const raw = await file.text();
      const snapshot = readResumeSnapshot(raw);
      if (!snapshot) {
        setSaveLabel("Ungültige JSON-Datei");
        return;
      }

      setData({
        ...initialData,
        ...snapshot.data,
        experience: normalizeExperience(snapshot.data.experience),
      });
      setTheme(snapshot.theme);
      setFont(snapshot.font);
      setDensity(snapshot.density);
      setColumnLayout(snapshot.columnLayout);
      setPhotoShape(snapshot.photoShape);
      setHeadingStyle(snapshot.headingStyle);
      setPhotoError("");
      setSaveLabel("Importiert");
    } catch {
      setSaveLabel("Import fehlgeschlagen");
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">V</span>
          <div>
            <strong>Vita</strong>
            <span>Lebenslauf Studio</span>
          </div>
        </div>
        <div className="document-status" aria-live="polite">
          <span className="status-dot" />
          <span>{saveLabel}</span>
        </div>
        <div className="header-actions">
          <button className="button button-quiet" type="button" onClick={exportResume}>JSON exportieren</button>
          <button className="button button-quiet" type="button" onClick={() => importInputRef.current?.click()}>JSON importieren</button>
          <button className="button button-quiet" type="button" onClick={resetResume}>Zurücksetzen</button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              fitResumeToSinglePrintPage(resumePaperRef.current);
              window.print();
            }}
          >
            <span aria-hidden="true">↓</span> Als PDF exportieren
          </button>
          <input ref={importInputRef} className="json-import-input" type="file" accept="application/json,.json" onChange={importResume} />
        </div>
      </header>

      <div className="mobile-view-switch" aria-label="Ansicht wechseln">
        <button type="button" className={mobileView === "edit" ? "active" : ""} onClick={() => setMobileView("edit")}>Bearbeiten</button>
        <button type="button" className={mobileView === "preview" ? "active" : ""} onClick={() => setMobileView("preview")}>Vorschau</button>
      </div>

      <div className="builder-shell">
        <aside className={`editor-panel ${mobileView === "edit" ? "mobile-active" : ""}`}>
          <div className="editor-intro">
            <div>
              <p className="eyebrow">Dein Lebenslauf</p>
              <h1>Inhalt bearbeiten</h1>
            </div>
            <div className="completion-ring" style={{ "--progress": `${completeness * 3.6}deg` } as CSSProperties}>
              <span>{completeness}%</span>
            </div>
          </div>

          <nav className="section-tabs" aria-label="Lebenslauf-Abschnitte">
            {editorSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? "active" : ""}
                onClick={() => setActiveSection(section.id)}
                aria-current={activeSection === section.id ? "step" : undefined}
              >
                <span>{section.number}</span>{section.label}
              </button>
            ))}
          </nav>

          <div className="form-scroll">
            {activeSection === "personal" && (
              <section className="form-section" aria-labelledby="personal-heading">
                <div className="section-heading">
                  <p>01 / Persönlich</p>
                  <h2 id="personal-heading">Die wichtigsten Details</h2>
                  <span>Nur Informationen eintragen, die für deine Bewerbung relevant sind.</span>
                </div>
                <div className="photo-upload-card">
                  <div className={`photo-upload-preview photo-shape-${photoShape}`}>
                    {data.photo ? (
                      <img src={data.photo} alt="Vorschau des Bewerbungsfotos" />
                    ) : (
                      <span aria-hidden="true">{data.name.trim().charAt(0) || "V"}</span>
                    )}
                  </div>
                  <div className="photo-upload-copy">
                    <strong>Bewerbungsfoto <em>optional</em></strong>
                    <p>Das Bild wird quadratisch zugeschnitten und bleibt in diesem Browser.</p>
                    <div className="photo-upload-actions">
                      <label className="upload-button" htmlFor="profile-photo-upload">
                        {data.photo ? "Bild ersetzen" : "Bild auswählen"}
                      </label>
                      <input
                        id="profile-photo-upload"
                        className="photo-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                      />
                      {data.photo && (
                        <button type="button" onClick={() => setField("photo", "")}>Entfernen</button>
                      )}
                    </div>
                    {photoError && <p className="photo-error" role="alert">{photoError}</p>}
                  </div>
                </div>
                <div className="form-grid two-columns">
                  <label className="field full-width">
                    <span>Name</span>
                    <input className={inputClass} value={data.name} onChange={(event) => setField("name", event.target.value)} placeholder="Vor- und Nachname" />
                  </label>
                  <label className="field full-width">
                    <span>Berufsbezeichnung</span>
                    <input className={inputClass} value={data.role} onChange={(event) => setField("role", event.target.value)} placeholder="z. B. Software Engineer" />
                  </label>
                  <label className="field">
                    <span>E-Mail</span>
                    <input className={inputClass} type="email" value={data.email} onChange={(event) => setField("email", event.target.value)} placeholder="name@example.com" />
                  </label>
                  <label className="field">
                    <span>Telefon</span>
                    <input className={inputClass} value={data.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="+49 …" />
                  </label>
                  <label className="field">
                    <span>Ort</span>
                    <input className={inputClass} value={data.location} onChange={(event) => setField("location", event.target.value)} placeholder="Berlin, Deutschland" />
                  </label>
                  <label className="field">
                    <span>Website / LinkedIn</span>
                    <input className={inputClass} value={data.website} onChange={(event) => setField("website", event.target.value)} placeholder="deine-website.de" />
                  </label>
                  <label className="field full-width optional-field">
                    <span>Geburtsdatum <em>optional</em></span>
                    <input className={inputClass} value={data.birthDate} onChange={(event) => setField("birthDate", event.target.value)} placeholder="TT.MM.JJJJ" />
                  </label>
                </div>
                <div className="privacy-note"><span aria-hidden="true">i</span> Eine vollständige Anschrift und das Geburtsdatum sind heute meist nicht nötig.</div>
              </section>
            )}

            {activeSection === "intro" && (
              <section className="form-section" aria-labelledby="intro-heading">
                <div className="section-heading">
                  <p>02 / Intro</p>
                  <h2 id="intro-heading">Ein starker erster Eindruck</h2>
                  <span>Fasse Profil, Erfahrung und Arbeitsweise in zwei bis vier Sätzen zusammen.</span>
                </div>
                <label className="field">
                  <span>Kurzprofil</span>
                  <textarea
                    className={`${inputClass} intro-textarea`}
                    value={data.intro}
                    onChange={(event) => setField("intro", event.target.value)}
                    maxLength={introMaxLength}
                    placeholder="Was zeichnet dich aus?"
                  />
                  <span className="character-count">{data.intro.length} / {introMaxLength} Zeichen</span>
                </label>
                <div className="writing-tip">
                  <strong>Gute Struktur</strong>
                  <p>Rolle + Erfahrung → fachlicher Schwerpunkt → was du in ein Team einbringst.</p>
                </div>
              </section>
            )}

            {activeSection === "experience" && (
              <section className="form-section" aria-labelledby="experience-heading">
                <div className="section-heading with-action">
                  <div>
                    <p>03 / Werdegang</p>
                    <h2 id="experience-heading">Beruflicher Werdegang</h2>
                    <span>Erfasse Anstellungen, eigene Projekte, Weiterbildungen und Auszeiten in der passenden Form.</span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Station hinzufügen"
                    onClick={() => {
                      const companyId = Date.now();
                      setField("experience", [...data.experience, {
                        id: companyId,
                        type: "employment",
                        showTitle: true,
                        company: "",
                        location: "",
                        positions: [{ id: companyId + 1, period: "", role: "", bullets: "" }],
                      }]);
                    }}
                  >+</button>
                </div>
                <div className="entry-list company-entry-list">
                  {data.experience.map((station, stationIndex) => {
                    const typeConfig = getExperienceTypeConfig(station.type);
                    const stationTitle = station.type === "break"
                      ? typeConfig.fallbackTitle
                      : station.company || typeConfig.fallbackTitle;

                    return (
                      <article className="entry-card company-card" key={station.id}>
                        <div className="entry-card-header">
                          <div className="station-card-title">
                            <span>{String(stationIndex + 1).padStart(2, "0")}</span>
                            <strong>{stationTitle}</strong>
                          </div>
                          <div className="station-card-actions">
                            <div className="station-order-controls" aria-label={`${stationTitle} verschieben`}>
                              <button
                                className="station-order-button"
                                type="button"
                                onClick={() => moveExperience(station.id, -1)}
                                aria-label={`${stationTitle} nach oben verschieben`}
                                title="Nach oben"
                                disabled={stationIndex === 0}
                              >↑</button>
                              <button
                                className="station-order-button"
                                type="button"
                                onClick={() => moveExperience(station.id, 1)}
                                aria-label={`${stationTitle} nach unten verschieben`}
                                title="Nach unten"
                                disabled={stationIndex === data.experience.length - 1}
                              >↓</button>
                            </div>
                            {data.experience.length > 1 && (
                              <button
                                className="station-remove-button"
                                type="button"
                                onClick={() => setField("experience", data.experience.filter((entry) => entry.id !== station.id))}
                                aria-label={`${stationTitle} entfernen`}
                              >Entfernen</button>
                            )}
                          </div>
                        </div>

                        <div className="form-grid two-columns compact-grid company-fields">
                          <label className={`field ${station.type === "break" ? "full-width" : ""}`}>
                            <span>Stationstyp</span>
                            <select
                              className={inputClass}
                              value={station.type}
                              onChange={(event) => {
                                if (isExperienceType(event.target.value)) updateExperienceType(station.id, event.target.value);
                              }}
                            >
                              {experienceTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                          </label>
                          {station.type !== "break" && (
                            <>
                              <label className="field">
                                <span>{typeConfig.organizationLabel}</span>
                                <input
                                  className={inputClass}
                                  value={station.company}
                                  onChange={(event) => updateExperience(station.id, "company", event.target.value)}
                                  placeholder={typeConfig.organizationPlaceholder}
                                />
                              </label>
                              <label className="field">
                                <span>Ort <em>optional</em></span>
                                <input className={inputClass} value={station.location} onChange={(event) => updateExperience(station.id, "location", event.target.value)} placeholder="z. B. Berlin" />
                              </label>
                            </>
                          )}
                          <label className="station-title-toggle">
                            <input
                              className="station-title-toggle-input"
                              type="checkbox"
                              checked={station.showTitle}
                              onChange={(event) => updateExperienceTitleVisibility(station.id, event.target.checked)}
                            />
                            <span className="station-title-toggle-track" aria-hidden="true" />
                            <span>Stationstitel anzeigen</span>
                          </label>
                        </div>

                        {station.type === "break" && (
                          <p className="station-hint">Eine neutrale Bezeichnung reicht aus. Medizinische Einzelheiten sind optional.</p>
                        )}

                        <div className="positions-heading">
                          <div>
                            <strong>{typeConfig.groupLabel}</strong>
                            <span>{station.positions.length} {station.positions.length === 1 ? typeConfig.itemSingular : typeConfig.itemPlural}</span>
                          </div>
                          <button type="button" onClick={() => addPosition(station.id)}><span aria-hidden="true">+</span> {typeConfig.addLabel}</button>
                        </div>

                        <div className="position-editor-list">
                          {station.positions.map((position, positionIndex) => (
                            <section className="position-editor" key={position.id} aria-label={`${typeConfig.itemSingular} ${positionIndex + 1} in ${stationTitle}`}>
                              <div className="position-editor-header">
                                <span>{typeConfig.itemSingular} {String(positionIndex + 1).padStart(2, "0")}</span>
                                {station.positions.length > 1 && (
                                  <button type="button" onClick={() => removePosition(station.id, position.id)} aria-label={`${position.role || typeConfig.itemSingular} entfernen`}>Entfernen</button>
                                )}
                              </div>
                              <div className="form-grid two-columns compact-grid">
                                <label className="field"><span>{typeConfig.roleLabel}</span><input className={inputClass} value={position.role} onChange={(event) => updatePosition(station.id, position.id, "role", event.target.value)} placeholder={typeConfig.rolePlaceholder} /></label>
                                <label className="field"><span>Zeitraum</span><input className={inputClass} value={position.period} onChange={(event) => updatePosition(station.id, position.id, "period", event.target.value)} placeholder="MM/JJJJ – MM/JJJJ" /></label>
                                <label className="field full-width"><span>{typeConfig.bulletsLabel} <em>eine Zeile pro Punkt</em></span><textarea className={`${inputClass} bullets-textarea`} value={position.bullets} onChange={(event) => updatePosition(station.id, position.id, "bullets", event.target.value)} placeholder={typeConfig.bulletsPlaceholder} /></label>
                              </div>
                            </section>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {activeSection === "education" && (
              <section className="form-section" aria-labelledby="education-heading">
                <div className="section-heading with-action">
                  <div>
                    <p>04 / Ausbildung</p>
                    <h2 id="education-heading">Ausbildung & Studium</h2>
                    <span>Abschlüsse und relevante Weiterbildungen.</span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Ausbildung hinzufügen"
                    onClick={() => setField("education", [...data.education, { id: Date.now(), period: "", degree: "", institution: "", detail: "" }])}
                  >+</button>
                </div>
                <div className="entry-list">
                  {data.education.map((item, index) => (
                    <article className="entry-card" key={item.id}>
                      <div className="entry-card-header">
                        <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.degree || "Neue Ausbildung"}</strong></div>
                        {data.education.length > 1 && (
                          <button type="button" onClick={() => setField("education", data.education.filter((entry) => entry.id !== item.id))} aria-label={`${item.degree || "Ausbildung"} entfernen`}>Entfernen</button>
                        )}
                      </div>
                      <div className="form-grid compact-grid">
                        <label className="field"><span>Abschluss / Fachrichtung</span><input className={inputClass} value={item.degree} onChange={(event) => updateEducation(item.id, "degree", event.target.value)} /></label>
                        <label className="field"><span>Institution</span><input className={inputClass} value={item.institution} onChange={(event) => updateEducation(item.id, "institution", event.target.value)} /></label>
                        <label className="field"><span>Zeitraum</span><input className={inputClass} value={item.period} onChange={(event) => updateEducation(item.id, "period", event.target.value)} /></label>
                        <label className="field"><span>Zusatz</span><input className={inputClass} value={item.detail} onChange={(event) => updateEducation(item.id, "detail", event.target.value)} placeholder="z. B. Abschlussnote" /></label>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "skills" && (
              <section className="form-section" aria-labelledby="skills-heading">
                <div className="section-heading with-action">
                  <div>
                    <p>05 / Kenntnisse</p>
                    <h2 id="skills-heading">Kenntnisse & Interessen</h2>
                    <span>Gruppierte Kenntnisse lassen sich schneller erfassen.</span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Kenntnisgruppe hinzufügen"
                    onClick={() => setField("skills", [...data.skills, { id: Date.now(), label: "", skills: "" }])}
                  >+</button>
                </div>
                <div className="entry-list skill-editor-list">
                  {data.skills.map((item) => (
                    <article className="entry-card skill-editor" key={item.id}>
                      <div className="form-grid two-columns compact-grid">
                        <label className="field"><span>Gruppe</span><input className={inputClass} value={item.label} onChange={(event) => updateSkill(item.id, "label", event.target.value)} placeholder="z. B. Frontend" /></label>
                        <label className="field"><span>Kenntnisse</span><input className={inputClass} value={item.skills} onChange={(event) => updateSkill(item.id, "skills", event.target.value)} placeholder="Kommagetrennt" /></label>
                      </div>
                      {data.skills.length > 1 && <button className="remove-skill" type="button" onClick={() => setField("skills", data.skills.filter((entry) => entry.id !== item.id))}>Gruppe entfernen</button>}
                    </article>
                  ))}
                </div>
                <div className="form-grid">
                  <label className="field"><span>Sprachen <em>eine Zeile pro Sprache</em></span><textarea className={`${inputClass} short-textarea`} value={data.languages} onChange={(event) => setField("languages", event.target.value)} /></label>
                  <label className="field"><span>Interessen</span><input className={inputClass} value={data.interests} onChange={(event) => setField("interests", event.target.value)} /></label>
                </div>
              </section>
            )}

            {activeSection === "design" && (
              <section className="form-section" aria-labelledby="design-heading">
                <div className="section-heading">
                  <p>06 / Design</p>
                  <h2 id="design-heading">Dein persönlicher Stil</h2>
                  <span>Alle Einstellungen werden sofort in der Vorschau sichtbar.</span>
                </div>

                <div className="design-setting">
                  <div className="design-setting-heading">
                    <strong>Farbschema</strong>
                    <span>{selectedTheme.label}</span>
                  </div>
                  <div className="design-color-grid">
                    {themes.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        className={theme === item.name ? "active" : ""}
                        onClick={() => setTheme(item.name)}
                        aria-pressed={theme === item.name}
                      >
                        <span style={{ "--swatch": item.color } as CSSProperties} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="design-setting">
                  <div className="design-setting-heading">
                    <strong>Schriftbild</strong>
                    <span>{font === "sans" ? "Modern" : "Klassisch"}</span>
                  </div>
                  <div className="design-choice-grid two-options">
                    <button type="button" className={font === "sans" ? "active" : ""} onClick={() => setFont("sans")} aria-pressed={font === "sans"}>
                      <b className="font-sample-sans">Aa</b><span><strong>Modern</strong><small>Klar und reduziert</small></span>
                    </button>
                    <button type="button" className={font === "serif" ? "active" : ""} onClick={() => setFont("serif")} aria-pressed={font === "serif"}>
                      <b className="font-sample-serif">Aa</b><span><strong>Klassisch</strong><small>Ruhig und editorial</small></span>
                    </button>
                  </div>
                </div>

                <div className="design-setting">
                  <div className="design-setting-heading">
                    <strong>Spaltenaufteilung</strong>
                    <span>{columnLayout === "experience-left" ? "Werdegang links" : "Werdegang rechts"}</span>
                  </div>
                  <div className="layout-choice-grid">
                    <button type="button" className={columnLayout === "experience-left" ? "active" : ""} onClick={() => setColumnLayout("experience-left")} aria-pressed={columnLayout === "experience-left"}>
                      <span className="layout-miniature layout-left"><i /><i /></span>
                      <span><strong>Werdegang links</strong><small>Ausbildung & Kenntnisse rechts</small></span>
                    </button>
                    <button type="button" className={columnLayout === "experience-right" ? "active" : ""} onClick={() => setColumnLayout("experience-right")} aria-pressed={columnLayout === "experience-right"}>
                      <span className="layout-miniature layout-right"><i /><i /></span>
                      <span><strong>Werdegang rechts</strong><small>Ausbildung & Kenntnisse links</small></span>
                    </button>
                  </div>
                </div>

                <div className="design-setting">
                  <div className="design-setting-heading">
                    <strong>Abstände</strong>
                    <span>{density === "compact" ? "Kompakt" : density === "airy" ? "Luftig" : "Ausgewogen"}</span>
                  </div>
                  <div className="segmented-design-control three-options">
                    <button type="button" className={density === "compact" ? "active" : ""} onClick={() => setDensity("compact")} aria-pressed={density === "compact"}>Kompakt</button>
                    <button type="button" className={density === "balanced" ? "active" : ""} onClick={() => setDensity("balanced")} aria-pressed={density === "balanced"}>Ausgewogen</button>
                    <button type="button" className={density === "airy" ? "active" : ""} onClick={() => setDensity("airy")} aria-pressed={density === "airy"}>Luftig</button>
                  </div>
                </div>

                <div className="design-setting split-settings">
                  <div>
                    <div className="design-setting-heading"><strong>Fotoform</strong></div>
                    <div className="shape-options" aria-label="Fotoform">
                      {(["circle", "rounded", "square"] as PhotoShape[]).map((shape) => (
                        <button key={shape} type="button" className={`${shape} ${photoShape === shape ? "active" : ""}`} onClick={() => setPhotoShape(shape)} aria-label={shape === "circle" ? "Rund" : shape === "rounded" ? "Abgerundet" : "Eckig"} aria-pressed={photoShape === shape}><span /></button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="design-setting-heading"><strong>Überschriften</strong></div>
                    <div className="segmented-design-control">
                      <button type="button" className={headingStyle === "caps" ? "active" : ""} onClick={() => setHeadingStyle("caps")} aria-pressed={headingStyle === "caps"}>Klar</button>
                      <button type="button" className={headingStyle === "editorial" ? "active" : ""} onClick={() => setHeadingStyle("editorial")} aria-pressed={headingStyle === "editorial"}>Editorial</button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </aside>

        <section className={`preview-panel ${mobileView === "preview" ? "mobile-active" : ""}`} aria-label="Lebenslauf-Vorschau">
          <div className="paper-stage">
            <article
              ref={resumePaperRef}
              className={`resume-paper resume-font-${font} resume-density-${density} resume-headings-${headingStyle} resume-photo-${photoShape}`}
              style={{ "--resume-accent": selectedTheme.color, "--resume-soft": selectedTheme.soft, "--resume-ink": selectedTheme.ink } as CSSProperties}
            >
              <header className="resume-header">
                <div className="resume-title-block">
                  <div className="resume-portrait">
                    {data.photo ? (
                      <img src={data.photo} alt={`${data.name || "Person"} – Bewerbungsfoto`} />
                    ) : (
                      <span aria-hidden="true">{data.name.trim().charAt(0) || "V"}</span>
                    )}
                  </div>
                  <div>
                    <h2>{data.name || "Dein Name"}</h2>
                    <p>{data.role || "Berufsbezeichnung"}</p>
                  </div>
                </div>
                <div className="resume-contact">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>{data.phone}</span>}
                  {data.location && <span>{data.location}</span>}
                  {data.website && <span>{data.website}</span>}
                </div>
              </header>

              {data.intro && (
                <section className="resume-intro">
                  <p>{data.intro}</p>
                </section>
              )}

              <div className={`resume-columns layout-${columnLayout}`}>
                <div className="resume-main-column">
                  {data.experience.length > 0 && (
                    <section className="resume-section">
                      <h3>Beruflicher Werdegang</h3>
                      <div className="timeline">
                        {data.experience.map((station) => {
                          const typeConfig = getExperienceTypeConfig(station.type);
                          const stationTitle = station.type === "break"
                            ? typeConfig.fallbackTitle
                            : station.company || typeConfig.fallbackTitle;

                          return (
                            <article className={`timeline-entry timeline-entry-${station.type} ${station.showTitle ? "" : "timeline-entry-title-hidden"}`} key={station.id}>
                              <div className="timeline-marker" />
                              {(station.type !== "employment" || !station.showTitle) && <p className="resume-entry-type">{typeConfig.label}</p>}
                              {station.showTitle && (
                                <div className="resume-company-heading">
                                  <h4>{stationTitle}</h4>
                                  {station.type !== "break" && station.location && <span>{station.location}</span>}
                                </div>
                              )}
                              <div className="resume-company-positions">
                                {station.positions.map((position) => (
                                  <section className="resume-position" key={position.id}>
                                    <div className="resume-position-heading">
                                      <h5>{position.role || typeConfig.itemSingular}</h5>
                                      <p className="entry-period">{position.period}</p>
                                    </div>
                                    {splitLines(position.bullets).length > 0 && (
                                      <ul>{splitLines(position.bullets).map((bullet, index) => <li key={`${position.id}-${index}`}>{bullet}</li>)}</ul>
                                    )}
                                  </section>
                                ))}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="resume-side-column">
                  {data.education.length > 0 && (
                    <section className="resume-section side-section">
                      <h3>Ausbildung</h3>
                      {data.education.map((item) => (
                        <article className="side-entry" key={item.id}>
                          <p className="entry-period">{item.period}</p>
                          <h4>{item.degree || "Abschluss"}</h4>
                          <p>{item.institution}</p>
                          {item.detail && <small>{item.detail}</small>}
                        </article>
                      ))}
                    </section>
                  )}

                  {data.skills.length > 0 && (
                    <section className="resume-section side-section">
                      <h3>Kenntnisse</h3>
                      <div className="skill-list">
                        {data.skills.map((item) => (
                          <div key={item.id}>
                            <h4>{item.label || "Kenntnisse"}</h4>
                            <p>{item.skills}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {data.languages && (
                    <section className="resume-section side-section">
                      <h3>Sprachen</h3>
                      <ul className="plain-list">{splitLines(data.languages).map((language, index) => <li key={index}>{language}</li>)}</ul>
                    </section>
                  )}

                  {(data.birthDate || data.interests) && (
                    <section className="resume-section side-section small-details">
                      {data.birthDate && <div><h4>Geburtsdatum</h4><p>{data.birthDate}</p></div>}
                      {data.interests && <div><h4>Interessen</h4><p>{data.interests}</p></div>}
                    </section>
                  )}
                </aside>
              </div>
              <footer className="resume-footer"><span>Lebenslauf</span><span>{new Date().getFullYear()}</span></footer>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
