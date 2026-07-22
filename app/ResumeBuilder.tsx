"use client";

import { useEffect, useMemo, useState } from "react";

type Experience = {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: string;
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

type ThemeName = "sage" | "ink" | "clay" | "plum";
type FontName = "sans" | "serif";
type EditorSection = "personal" | "intro" | "experience" | "education" | "skills";

const initialData: ResumeData = {
  name: "Alex Morgan",
  role: "Software Engineer",
  email: "alex.morgan@example.com",
  phone: "+49 176 12345678",
  location: "Berlin, Deutschland",
  website: "alexmorgan.dev",
  birthDate: "",
  intro:
    "Software Engineer mit Erfahrung in der Entwicklung moderner Webanwendungen. Ich verbinde saubere Softwarearchitektur mit einem guten Gespür für Nutzerbedürfnisse und arbeite gern in interdisziplinären, agilen Teams.",
  experience: [
    {
      id: 1,
      period: "04/2024 – heute",
      role: "Anwendungsentwickler",
      company: "Digital Health GmbH",
      location: "Berlin",
      bullets:
        "Entwicklung und Wartung einer Anwendung im medizinischen Umfeld\nZusammenarbeit im agilen Produktteam\nVerbesserung von Qualität und Wartbarkeit bestehender Komponenten",
    },
    {
      id: 2,
      period: "01/2021 – 03/2024",
      role: "Software Engineer",
      company: "Consulting SE",
      location: "Berlin",
      bullets:
        "Entwicklung wiederverwendbarer Komponenten nach Domain-Driven-Design-Prinzipien\nModernisierung bestehender Softwarearchitektur durch gezieltes Refactoring\nTechnische Beratung und direkter Austausch mit Kundenteams",
    },
    {
      id: 3,
      period: "06/2018 – 12/2020",
      role: "Software Developer",
      company: "Consulting SE",
      location: "Berlin",
      bullets:
        "Webanwendungen mit Angular und React umgesetzt\nREST-Schnittstellen und Microservices mit Spring und Node.js entwickelt",
    },
  ],
  education: [
    {
      id: 1,
      period: "2016 – 2022",
      degree: "Medieninformatik (B.Sc.)",
      institution: "Berliner Hochschule für Technik",
      detail: "Abschlussnote 1,8",
    },
    {
      id: 2,
      period: "2011 – 2014",
      degree: "Allgemeine Hochschulreife",
      institution: "OSZ Kommunikation, Information und Medientechnik",
      detail: "Schwerpunkt Medientechnik",
    },
  ],
  skills: [
    { id: 1, label: "Frontend", skills: "Vue, Angular, React, TypeScript" },
    { id: 2, label: "Backend", skills: "Node.js, Java, Spring, REST APIs" },
    { id: 3, label: "Arbeitsweise", skills: "Clean Code, DDD, Docker, Agil" },
  ],
  languages: "Deutsch · Muttersprache\nEnglisch · fließend\nSpanisch · fließend",
  interests: "Tischtennis, Musik, Gaming, Homelab",
};

const themes: Array<{ name: ThemeName; label: string; color: string; soft: string; ink: string }> = [
  { name: "sage", label: "Salbei", color: "#376b5d", soft: "#e9f1ee", ink: "#19322b" },
  { name: "ink", label: "Tinte", color: "#34475d", soft: "#edf1f5", ink: "#182330" },
  { name: "clay", label: "Terrakotta", color: "#aa5c42", soft: "#f7ece7", ink: "#44241a" },
  { name: "plum", label: "Pflaume", color: "#705276", soft: "#f2ebf3", ink: "#352638" },
];

const editorSections: Array<{ id: EditorSection; label: string; number: string }> = [
  { id: "personal", label: "Persönlich", number: "01" },
  { id: "intro", label: "Intro", number: "02" },
  { id: "experience", label: "Erfahrung", number: "03" },
  { id: "education", label: "Ausbildung", number: "04" },
  { id: "skills", label: "Kenntnisse", number: "05" },
];

const inputClass = "form-input";

function splitLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [theme, setTheme] = useState<ThemeName>("sage");
  const [font, setFont] = useState<FontName>("sans");
  const [activeSection, setActiveSection] = useState<EditorSection>("personal");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [storageReady, setStorageReady] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Automatisch gespeichert");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("vita-resume");
      if (saved) {
        const parsed = JSON.parse(saved) as { data?: ResumeData; theme?: ThemeName; font?: FontName };
        if (parsed.data) setData(parsed.data);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.font) setFont(parsed.font);
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
        window.localStorage.setItem("vita-resume", JSON.stringify({ data, theme, font }));
        setSaveLabel("Automatisch gespeichert");
      } catch {
        setSaveLabel("Nur für diese Sitzung");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [data, theme, font, storageReady]);

  const selectedTheme = themes.find((item) => item.name === theme) ?? themes[0];

  const completeness = useMemo(() => {
    const fields = [data.name, data.role, data.email, data.location, data.intro, data.experience[0]?.role, data.education[0]?.degree, data.skills[0]?.skills];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [data]);

  const setField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
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

  const resetResume = () => {
    if (!window.confirm("Möchtest du alle Änderungen zurücksetzen?")) return;
    setData(initialData);
    setTheme("sage");
    setFont("sans");
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
          <button className="button button-quiet" type="button" onClick={resetResume}>Zurücksetzen</button>
          <button className="button button-primary" type="button" onClick={() => window.print()}>
            <span aria-hidden="true">↓</span> Als PDF exportieren
          </button>
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
            <div className="completion-ring" style={{ "--progress": `${completeness * 3.6}deg` } as React.CSSProperties}>
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
                    maxLength={420}
                    placeholder="Was zeichnet dich aus?"
                  />
                  <span className="character-count">{data.intro.length} / 420 Zeichen</span>
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
                    <p>03 / Erfahrung</p>
                    <h2 id="experience-heading">Berufserfahrung</h2>
                    <span>Beginne mit deiner aktuellen oder letzten Position.</span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Position hinzufügen"
                    onClick={() => setField("experience", [...data.experience, { id: Date.now(), period: "", role: "", company: "", location: "", bullets: "" }])}
                  >+</button>
                </div>
                <div className="entry-list">
                  {data.experience.map((item, index) => (
                    <article className="entry-card" key={item.id}>
                      <div className="entry-card-header">
                        <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.role || "Neue Position"}</strong></div>
                        {data.experience.length > 1 && (
                          <button type="button" onClick={() => setField("experience", data.experience.filter((entry) => entry.id !== item.id))} aria-label={`${item.role || "Position"} entfernen`}>Entfernen</button>
                        )}
                      </div>
                      <div className="form-grid two-columns compact-grid">
                        <label className="field full-width"><span>Position</span><input className={inputClass} value={item.role} onChange={(event) => updateExperience(item.id, "role", event.target.value)} /></label>
                        <label className="field"><span>Unternehmen</span><input className={inputClass} value={item.company} onChange={(event) => updateExperience(item.id, "company", event.target.value)} /></label>
                        <label className="field"><span>Ort</span><input className={inputClass} value={item.location} onChange={(event) => updateExperience(item.id, "location", event.target.value)} /></label>
                        <label className="field full-width"><span>Zeitraum</span><input className={inputClass} value={item.period} onChange={(event) => updateExperience(item.id, "period", event.target.value)} placeholder="MM/JJJJ – MM/JJJJ" /></label>
                        <label className="field full-width"><span>Erfolge & Aufgaben <em>eine Zeile pro Punkt</em></span><textarea className={`${inputClass} bullets-textarea`} value={item.bullets} onChange={(event) => updateExperience(item.id, "bullets", event.target.value)} /></label>
                      </div>
                    </article>
                  ))}
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
          </div>
        </aside>

        <section className={`preview-panel ${mobileView === "preview" ? "mobile-active" : ""}`} aria-label="Lebenslauf-Vorschau">
          <div className="preview-toolbar">
            <div className="theme-controls">
              <span>Farbe</span>
              <div className="theme-options">
                {themes.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={theme === item.name ? "active" : ""}
                    style={{ "--swatch": item.color } as React.CSSProperties}
                    onClick={() => setTheme(item.name)}
                    aria-label={`Farbschema ${item.label}`}
                    aria-pressed={theme === item.name}
                    title={item.label}
                  />
                ))}
              </div>
            </div>
            <div className="font-controls">
              <span>Schrift</span>
              <div>
                <button className={font === "sans" ? "active" : ""} type="button" onClick={() => setFont("sans")} aria-pressed={font === "sans"}>Modern</button>
                <button className={font === "serif" ? "active" : ""} type="button" onClick={() => setFont("serif")} aria-pressed={font === "serif"}>Klassisch</button>
              </div>
            </div>
          </div>

          <div className="paper-stage">
            <article
              className={`resume-paper resume-font-${font}`}
              style={{ "--resume-accent": selectedTheme.color, "--resume-soft": selectedTheme.soft, "--resume-ink": selectedTheme.ink } as React.CSSProperties}
            >
              <header className="resume-header">
                <div className="resume-title-block">
                  <span className="resume-monogram" aria-hidden="true">{data.name.trim().charAt(0) || "V"}</span>
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

              <div className="resume-columns">
                <div className="resume-main-column">
                  {data.experience.length > 0 && (
                    <section className="resume-section">
                      <h3>Berufserfahrung</h3>
                      <div className="timeline">
                        {data.experience.map((item) => (
                          <article className="timeline-entry" key={item.id}>
                            <div className="timeline-marker" />
                            <p className="entry-period">{item.period}</p>
                            <h4>{item.role || "Position"}</h4>
                            <p className="entry-company">{item.company}{item.location ? ` · ${item.location}` : ""}</p>
                            {splitLines(item.bullets).length > 0 && (
                              <ul>{splitLines(item.bullets).map((bullet, index) => <li key={`${item.id}-${index}`}>{bullet}</li>)}</ul>
                            )}
                          </article>
                        ))}
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
