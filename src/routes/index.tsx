import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QpcrSimulator } from "@/components/QpcrSimulator";
import dataAnalysis from "@/assets/data_analysis.jpg.asset.json";
import deviceInstall from "@/assets/device_installation.jpg.asset.json";
import fieldWork from "@/assets/field_work.jpg.asset.json";
import productDemo from "@/assets/product_demonstration.jpg.asset.json";
import teamWork from "@/assets/team_work.jpg.asset.json";
import techTraining from "@/assets/technical_training.jpg.asset.json";
import techVisit from "@/assets/technical_visit.jpg.asset.json";
import ziadPortrait from "@/assets/ziad-2.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ziad Mustafa Muhammed — Field Application & Sales Specialist" },
      { name: "description", content: "Biotechnologist specialising in qPCR, molecular diagnostics (IVD), field application support and technical sales. Includes an interactive qPCR simulator." },
      { property: "og:title", content: "Ziad Mustafa Muhammed — Molecular Diagnostics Portfolio" },
      { property: "og:description", content: "Field application, qPCR training and technical sales across Egypt. Try the interactive qPCR lab simulator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const KPIS = [
  { v: 80, s: "", l: "Lab demonstrations" },
  { v: 2000, s: "", l: "Samples handled" },
  { v: 25, s: "+", l: "Client accounts" },
  { v: 1000, s: "+", l: "Event participants" },
  { v: 9, s: "", l: "Podcast episodes" },
  { v: 10, s: "%", l: "Sales increase" },
];

const EXPERIENCE = [
  {
    id: "EXP-01",
    role: "Field Application & Sales Specialist",
    org: "Reme-D Inc.",
    period: "Oct 2025 — Present",
    place: "Cairo, Egypt",
    points: [
      "Support & training for governmental and private laboratories on qPCR devices and molecular diagnostic kits.",
      "Hands-on with DT-Lite, StepOne, Bio-Rad CFX, Rotor-Gene and MG-NA 32 extraction systems.",
      "Drive sales by demonstrating product value and representing Reme-D across Egypt.",
      "~1,000 samples handled in a major HCV/HBV project.",
    ],
  },
  {
    id: "EXP-02",
    role: "Project Coordinator",
    org: "Science Operation Leaders in Egypt",
    period: "Nov 2023 — Feb 2024",
    place: "Giza, Egypt",
    points: [
      "Planned an event for 1,000+ participants from 20+ universities.",
      "Owned logistics, timeline and team coordination.",
      "Secured partnerships with 5 sponsors.",
    ],
  },
  {
    id: "EXP-03",
    role: "Marketing & Sales Specialist",
    org: "Creative Egyptian Biotechnologists",
    period: "May 2023 — May 2024",
    place: "Giza, Egypt",
    points: [
      "Represented the company at industry events and workshops.",
      "Directed production of 9 podcast episodes.",
      "Contributed to a 10% increase in sales.",
    ],
  },
];

const SKILLS = {
  Technical: ["Real-time PCR (qPCR)", "Conventional & one-step PCR", "Manual & automated NA extraction", "DNA / RNA handling", "Gel electrophoresis", "Cytogenetics & FISH", "NGS data analysis basics", "Troubleshooting & user training"],
  Commercial: ["Technical sales", "Product positioning", "CRM", "Market research", "Competitor analysis", "Negotiation", "Business development", "Event representation"],
  Personal: ["Presentation", "Communication", "Teamwork", "Problem-solving", "Time management", "Dependability", "AI-assisted workflows"],
};

const PLATFORMS = [
  { n: "DT-Lite", b: "DNA Technology", t: "Real-time PCR" },
  { n: "StepOne", b: "Applied Biosystems", t: "Real-time PCR" },
  { n: "CFX", b: "Bio-Rad", t: "Real-time PCR" },
  { n: "Rotor-Gene", b: "Qiagen", t: "Real-time PCR" },
  { n: "MG-NA 32", b: "Automated", t: "NA extraction" },
];

const TOOLS = [
  { n: "Microsoft Excel", p: 95 },
  { n: "Microsoft PowerPoint", p: 95 },
  { n: "Microsoft Word", p: 95 },
  { n: "Google Workspace", p: 95 },
  { n: "R language", p: 35 },
  { n: "MATLAB", p: 30 },
];

const TRAINING = [
  ["Aug 2026", "Genomic Data Analysis", "National Research Center", "FASTQ, alignment, variant calling — Linux, Conda, R"],
  ["May 2025", "Molecular Biology Workshop", "Reme-D Inc.", "Nucleic acid extraction & dengue virus diagnosis"],
  ["Aug 2023", "Protein Isolation & Purification", "SRTA City", "Protein isolation and purification techniques"],
  ["Aug 2023", "Scientific Research Training", "Cairo University", "Research basics, scientific writing, referencing"],
  ["Jul 2023", "Molecular Biology Intern", "Babirus Labs", "Extraction, PCR, gel electrophoresis"],
  ["Aug 2022", "Drug Design Course", "Zewail City", "Protein purification and docking"],
  ["Jul 2022", "Cytogenetics Course", "British University in Cairo", "Karyotyping, FISH, chromosome analysis"],
];

const GALLERY = [
  { src: fieldWork.url, t: "Field work", c: "md:row-span-2" },
  { src: productDemo.url, t: "Product demonstration", c: "md:row-span-2" },
  { src: deviceInstall.url, t: "Device installation", c: "" },
  { src: techTraining.url, t: "Technical training", c: "" },
  { src: dataAnalysis.url, t: "Data analysis across software", c: "md:row-span-2" },
  { src: teamWork.url, t: "Team work", c: "" },
  { src: techVisit.url, t: "Technical visit", c: "" },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const [el, setEl] = useState<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / 1400, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [el, to]);
  return (
    <span ref={setEl}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function SectionHead({ num, title, kicker }: { num: string; title: string; kicker: string }) {
  return (
    <div className="reveal mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        § {num} — {kicker}
      </p>
      <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
    </div>
  );
}

function Index() {
  useReveal();
  const [skillTab, setSkillTab] = useState<keyof typeof SKILLS>("Technical");
  const [openExp, setOpenExp] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const nav = [
    ["about", "About"],
    ["experience", "Experience"],
    ["skills", "Skills"],
    ["simulator", "qPCR Lab"],
    ["gallery", "Field"],
    ["research", "Research"],
    ["contact", "Contact"],
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="font-mono text-sm font-bold">
            ZMM<span className="text-primary">.</span>bio
          </a>
          <nav className="hidden gap-5 font-mono text-xs uppercase tracking-wider md:flex">
            {nav.map(([id, l]) => (
              <a key={id} href={`#${id}`} className="text-muted-foreground transition hover:text-primary">
                {l}
              </a>
            ))}
          </nav>
          <a href="#simulator" className="rounded-full border border-primary px-3 py-1 font-mono text-xs text-primary hover:bg-primary hover:text-primary-foreground">
            Try simulator
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative bg-lab-grid pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan h-1/3 w-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="animate-blink mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
              IFU-CV-001 · v1.0 · Elqalyubia, Egypt
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              Ziad Mustafa
              <br />
              <span className="text-primary text-glow">Muhammed</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Field Application & Sales Specialist in molecular diagnostics — turning qPCR science into
              results laboratories can trust, and products customers understand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
              <a href="#simulator" className="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-110">
                ▶ Run the qPCR lab
              </a>
              <a href="#contact" className="rounded-md border px-5 py-3 hover:border-primary hover:text-primary">
                Get in touch
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl border border-primary/40" />
            <img src={ziadPortrait.url} alt="Ziad Mustafa Muhammed standing beside a molecular diagnostics instrument in the lab" className="relative aspect-[3/4] w-full rounded-xl object-cover object-top" />
            <div className="absolute -bottom-5 -left-5 rounded-lg border bg-card px-4 py-3 font-mono text-xs">
              <p className="text-muted-foreground">CURRENTLY @</p>
              <p className="font-bold text-primary">Reme-D Inc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y md:grid-cols-6 md:divide-y-0">
          {KPIS.map((k) => (
            <div key={k.l} className="px-4 py-8 text-center">
              <p className="font-display text-3xl font-bold text-primary md:text-4xl">
                <Counter to={k.v} suffix={k.s} />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead num="01" kicker="Intended use" title="Where biotech meets business" />
        <div className="grid gap-10 md:grid-cols-2">
          <div className="reveal space-y-4 text-lg text-muted-foreground">
            <p>
              A biotechnology graduate from <span className="text-foreground">Ain Shams University</span> with practical
              experience across molecular diagnostics, laboratory applications, technical sales and scientific marketing.
            </p>
            <p>
              I support governmental and private laboratories with qPCR platforms and extraction workflows — training
              users, troubleshooting runs and translating technical capability into customer value.
            </p>
            <p>Open to international opportunities, with full willingness to travel and relocate.</p>
          </div>
          <div className="reveal grid grid-cols-2 gap-3 font-mono text-sm">
            {["Molecular Diagnostics", "In Vitro Diagnostics", "Field Application", "Technical Sales", "Business Development", "Genomics & Bioinformatics"].map((s, i) => (
              <div key={s} className="group rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:border-primary">
                <p className="text-xs text-muted-foreground">0{i + 1}</p>
                <p className="mt-2 font-bold group-hover:text-primary">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="border-t bg-lab-grid py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead num="02" kicker="Kit components" title="Experience" />
          <div className="space-y-3">
            {EXPERIENCE.map((e, i) => (
              <div key={e.id} className={`reveal rounded-xl border bg-card transition ${openExp === i ? "border-primary" : ""}`}>
                <button onClick={() => setOpenExp(openExp === i ? -1 : i)} className="flex w-full flex-wrap items-center gap-4 p-5 text-left">
                  <span className="font-mono text-xs text-primary">{e.id}</span>
                  <span className="flex-1">
                    <span className="block font-display text-xl font-bold">{e.role}</span>
                    <span className="text-sm text-muted-foreground">
                      {e.org} · {e.place}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                  <span className="font-mono text-xl text-primary">{openExp === i ? "−" : "+"}</span>
                </button>
                {openExp === i && (
                  <ul className="space-y-2 border-t px-5 py-4 text-muted-foreground">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="text-primary">▸</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="reveal mt-12 grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-[auto_1fr]">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Education</p>
            <div>
              <p className="font-display text-xl font-bold">BSc Applied Biotechnology — Ain Shams University</p>
              <p className="text-sm text-muted-foreground">Faculty of Science · Oct 2021 – May 2025 · GPA 3.4 (B+)</p>
              <p className="mt-3 text-muted-foreground">
                Graduation project: <span className="text-foreground">Integrated Optical Biosensor Kit for Point-of-Care PSA Detection</span> —
                1st place at the Bio-Pioneers and Science Innovate entrepreneurship competitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead num="03" kicker="Materials & equipment" title="Skills & platforms" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="reveal">
            <div className="mb-5 flex gap-2 font-mono text-xs">
              {(Object.keys(SKILLS) as (keyof typeof SKILLS)[]).map((k) => (
                <button key={k} onClick={() => setSkillTab(k)} className={`rounded-full border px-4 py-1.5 transition ${skillTab === k ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>
                  {k}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS[skillTab].map((s, i) => (
                <span key={s} className="animate-in fade-in zoom-in-95 rounded-md border bg-card px-3 py-2 text-sm transition hover:border-primary hover:text-primary" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}>
                  {s}
                </span>
              ))}
            </div>

            <p className="mt-10 mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Software & digital tools</p>
            <div className="space-y-3">
              {TOOLS.map((t) => (
                <div key={t.n}>
                  <div className="mb-1 flex justify-between font-mono text-xs">
                    <span>{t.n}</span>
                    <span className="text-muted-foreground">{t.p > 50 ? "Excellent" : "Beginner"}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${t.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">Languages · Arabic (native) · English (B2)</p>
          </div>

          <div className="reveal">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Instrument exposure</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLATFORMS.map((p) => (
                <div key={p.n} className="group relative overflow-hidden rounded-xl border bg-card p-5 transition hover:border-primary">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 transition group-hover:scale-150" />
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{p.b}</p>
                  <p className="font-display text-2xl font-bold">{p.n}</p>
                  <p className="mt-2 font-mono text-xs text-primary">{p.t}</p>
                </div>
              ))}
              <img src={deviceInstall.url} alt="Installing a qPCR device" className="h-full min-h-40 w-full rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SIMULATOR */}
      <section id="simulator" className="border-y bg-lab-grid py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead num="04" kicker="Reaction setup" title="Interactive qPCR lab simulator" />
          <p className="reveal -mt-6 mb-10 max-w-2xl text-muted-foreground">
            Pick an instrument, set up the plate, adjust template loads and the threshold, then start the run. Watch
            amplification curves rise, Ct values appear and controls validate — just like in a real field training.
          </p>
          <QpcrSimulator />
        </div>
      </section>

      {/* TROUBLESHOOTING */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead num="05" kicker="Troubleshooting guide" title="How I solve lab problems" />
        <div className="grid gap-3 md:grid-cols-7">
          {["Identify", "Collect", "Root cause", "Correct", "Verify", "Document", "Follow-up"].map((s, i) => (
            <div key={s} className="reveal group rounded-lg border bg-card p-4 transition hover:-translate-y-2 hover:border-primary" style={{ transitionDelay: `${i * 60}ms` }}>
              <p className="font-mono text-2xl font-bold text-primary/40 group-hover:text-primary">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-bold">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="border-t py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead num="06" kicker="In the field" title="Field application in action" />
          <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-4">
            {GALLERY.map((g, i) => (
              <button key={g.t} onClick={() => setLightbox(i)} className={`group relative overflow-hidden rounded-xl border ${g.c}`}>
                <img src={g.src} alt={g.t} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 font-mono text-xs uppercase tracking-wider">{g.t}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && GALLERY[lightbox] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6" onClick={() => setLightbox(null)}>
          <img src={GALLERY[lightbox]!.src} alt={GALLERY[lightbox]!.t} className="max-h-[85vh] max-w-full rounded-xl" />
          <p className="absolute bottom-6 font-mono text-sm">{GALLERY[lightbox]!.t} · click to close</p>
        </div>
      )}

      {/* TRAINING + RESEARCH */}
      <section id="research" className="border-t bg-card/40 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
          <div>
            <SectionHead num="07" kicker="Stability" title="Training timeline" />
            <ol className="relative border-l pl-6">
              {TRAINING.map(([d, t, o, x]) => (
                <li key={t} className="reveal mb-7">
                  <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="font-mono text-xs text-primary">{d}</p>
                  <p className="font-bold">{t}</p>
                  <p className="text-sm text-muted-foreground">
                    {o} — {x}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHead num="08" kicker="Research" title="Publication" />
            <a href="https://doi.org/10.1155/sci/1054968" target="_blank" rel="noreferrer" className="reveal block rounded-xl border bg-card p-6 transition hover:border-primary">
              <p className="font-mono text-xs text-accent">PUB-01 · DOI 10.1155/sci/1054968</p>
              <p className="mt-3 font-display text-2xl font-bold">Beyond the Cell: Stem Cell-Derived Exosomes as Next-Generation Tools in Regenerative Therapy</p>
              <p className="mt-3 text-sm text-muted-foreground">Regenerative medicine · stem cell-derived exosomes · translational research</p>
              <p className="mt-4 font-mono text-xs text-primary">Read paper →</p>
            </a>
            <a href="https://orcid.org/0009-0009-8374-8885" target="_blank" rel="noreferrer" className="reveal mt-3 block rounded-xl border bg-card p-5 font-mono text-sm hover:border-primary">
              ORCID · 0009-0009-8374-8885 →
            </a>
            <img src={teamWork.url} alt="Team work" className="reveal mt-3 h-64 w-full rounded-xl object-cover" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden border-t bg-lab-grid py-28">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">§ 09 — Technical support</p>
          <h2 className="mt-4 font-display text-5xl font-bold md:text-6xl">
            Let's amplify <span className="text-primary text-glow">something</span>.
          </h2>
          <div className="mt-10 grid gap-3 font-mono text-sm sm:grid-cols-3">
            <a href="mailto:ziadmustafamuhammed@gmail.com" className="rounded-lg border bg-card p-4 hover:border-primary hover:text-primary">Email</a>
            <a href="tel:+201002470735" className="rounded-lg border bg-card p-4 hover:border-primary hover:text-primary">+20 100 247 0735</a>
            <a href="https://www.linkedin.com/in/ziad-mustafa-abdelwahab" target="_blank" rel="noreferrer" className="rounded-lg border bg-card p-4 hover:border-primary hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center font-mono text-xs text-muted-foreground">
        Ziad Mustafa Muhammed · 2026 · For professional use only
      </footer>
    </div>
  );
}
