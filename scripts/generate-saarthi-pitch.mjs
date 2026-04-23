import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "pitch");
const OUT_FILE = path.join(OUT_DIR, "SAARTHI_DemoDay_PitchDeck.pptx");

const ASSETS = {
  logo: path.join(ROOT, "public", "images", "saarthi_setu_logo.png"),
  hero: path.join(ROOT, "public", "images", "hero_farmer.png"),
  bgWide: path.join(ROOT, "public", "images", "bg_wheat_sunset_wide.png"),
};

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function must(p, label) {
  if (!exists(p)) {
    throw new Error(`Missing ${label} at: ${p}`);
  }
  return p;
}

function px(n) {
  return n / 96;
}

function addBg(slide, imgPath) {
  slide.background = { path: imgPath };
  // soft wash overlay for readability
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: "FFFFFF", transparency: 18 },
    line: { color: "FFFFFF", transparency: 100 },
  });
}

function addBrand(slide, { light = false } = {}) {
  const logo = exists(ASSETS.logo) ? ASSETS.logo : null;
  if (logo) {
    slide.addImage({
      path: logo,
      x: 0.6,
      y: 0.45,
      w: 1.15,
      h: 0.45,
      transparency: 0,
    });
  } else {
    slide.addText("SAARTHI", {
      x: 0.6,
      y: 0.45,
      w: 3,
      h: 0.4,
      fontFace: "Arial",
      fontSize: 18,
      bold: true,
      color: light ? "FFFFFF" : "1B1B1B",
    });
  }
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.6,
    y: 7.08,
    w: 12.2,
    h: 0.3,
    fontFace: "Arial",
    fontSize: 12,
    color: "5E5E5E",
  });
}

function heading(slide, text, y = 1.2) {
  slide.addText(text, {
    x: 0.8,
    y,
    w: 11.8,
    h: 0.9,
    fontFace: "Arial",
    fontSize: 44,
    bold: true,
    color: "12351A",
  });
}

function sub(slide, text, y = 2.1) {
  slide.addText(text, {
    x: 0.8,
    y,
    w: 11.8,
    h: 0.6,
    fontFace: "Arial",
    fontSize: 22,
    bold: false,
    color: "2B2B2B",
  });
}

function pill(slide, text, { x = 0.8, y = 0.95, w = 6.2 } = {}) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 0.42,
    fill: { color: "F3F7F2" },
    line: { color: "D7E6D3" },
    radius: 0.18,
  });
  slide.addText(text, {
    x: x + 0.18,
    y: y + 0.08,
    w: w - 0.36,
    h: 0.3,
    fontFace: "Arial",
    fontSize: 14,
    bold: true,
    color: "2E7D32",
  });
}

function statCard(slide, { x, y, w, title, value, note }) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 1.15,
    fill: { color: "FFFFFF", transparency: 4 },
    line: { color: "E7E7E7" },
    radius: 0.2,
  });
  slide.addText(value, {
    x: x + 0.25,
    y: y + 0.18,
    w: w - 0.5,
    h: 0.45,
    fontFace: "Arial",
    fontSize: 30,
    bold: true,
    color: "1B1B1B",
  });
  slide.addText(title, {
    x: x + 0.25,
    y: y + 0.62,
    w: w - 0.5,
    h: 0.3,
    fontFace: "Arial",
    fontSize: 14,
    bold: true,
    color: "2E7D32",
  });
  if (note) {
    slide.addText(note, {
      x: x + 0.25,
      y: y + 0.86,
      w: w - 0.5,
      h: 0.22,
      fontFace: "Arial",
      fontSize: 12,
      color: "6B6B6B",
    });
  }
}

function box(slide, { x, y, w, h, title, body }) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    fill: { color: "FFFFFF", transparency: 4 },
    line: { color: "E7E7E7" },
    radius: 0.25,
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.35,
      y: y + 0.25,
      w: w - 0.7,
      h: 0.35,
      fontFace: "Arial",
      fontSize: 16,
      bold: true,
      color: "2E7D32",
    });
  }
  if (body) {
    slide.addText(body, {
      x: x + 0.35,
      y: y + 0.65,
      w: w - 0.7,
      h: h - 0.9,
      fontFace: "Arial",
      fontSize: 18,
      color: "1F1F1F",
    });
  }
}

function slideTitle(slide, n, t) {
  pill(slide, `SLIDE ${n}`, { x: 0.8, y: 0.55, w: 2.05 });
  slide.addText(t, {
    x: 3.0,
    y: 0.5,
    w: 9.8,
    h: 0.55,
    fontFace: "Arial",
    fontSize: 22,
    bold: true,
    color: "1B1B1B",
  });
}

function ensureDirs() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "scripts"), { recursive: true });
}

function main() {
  ensureDirs();

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Godhuli Vyas";
  pptx.company = "SAARTHI";
  pptx.subject = "SAARTHI — Demo Day Pitch Deck";
  pptx.title = "SAARTHI — Pitch Deck";

  const bg = exists(ASSETS.bgWide) ? ASSETS.bgWide : null;
  const logo = exists(ASSETS.logo) ? ASSETS.logo : null;
  const hero = exists(ASSETS.hero) ? ASSETS.hero : null;

  if (bg) must(bg, "background image");
  if (logo) must(logo, "logo image");
  if (hero) must(hero, "hero image");

  // Slide 1 — Cover / Hook
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    pill(s, "Digitising trust, transport & trade for Bharat’s farmers.", { x: 0.8, y: 1.35, w: 8.25 });
    s.addText("SAARTHI", {
      x: 0.8,
      y: 2.05,
      w: 7.8,
      h: 1.0,
      fontFace: "Arial",
      fontSize: 72,
      bold: true,
      color: "12351A",
    });
    s.addText("From village to buyer — simply.", {
      x: 0.82,
      y: 3.08,
      w: 8.8,
      h: 0.6,
      fontFace: "Arial",
      fontSize: 26,
      color: "1B1B1B",
    });
    s.addShape("roundRect", {
      x: 0.8,
      y: 4.25,
      w: 6.6,
      h: 2.1,
      fill: { color: "FFFFFF", transparency: 10 },
      line: { color: "E7E7E7" },
      radius: 0.25,
    });
    s.addText("Godhuli Vyas — Founder\nMP Pilot • Logistics + Market Access • Multilingual, voice-first UX", {
      x: 1.15,
      y: 4.55,
      w: 5.9,
      h: 1.5,
      fontFace: "Arial",
      fontSize: 18,
      bold: true,
      color: "1F1F1F",
    });
    addFooter(s, "Demo Day Deck • 2026");
  }

  // Slide 2 — Problem
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 2, "The Problem");
    heading(s, "Farmers lose value\nin the gaps.", 1.25);
    sub(s, "Price opacity, fragmented logistics, and weak trust kill outcomes for small farmers.", 2.55);

    box(s, {
      x: 0.8,
      y: 3.35,
      w: 6.15,
      h: 3.2,
      title: "Farmer reality (Bharat)",
      body:
        "• Distress selling & moisture cuts\n• Long mandi waits + uncertain rates\n• No transparent buyer discovery\n• High/unclear transport costs\n• Storage discovery is hard\n• Low digital confidence",
    });
    box(s, {
      x: 7.0,
      y: 3.35,
      w: 5.55,
      h: 3.2,
      title: "System reality",
      body:
        "• Middlemen capture margins\n• Empty-return trucks waste capacity\n• Coordination happens on calls/WhatsApp\n• No single trusted workflow",
    });
    statCard(s, { x: 7.0, y: 2.85, w: 2.7, value: "85%+", title: "Small & marginal farmers", note: "Context for scale" });
    statCard(s, { x: 9.85, y: 2.85, w: 2.7, value: "Trust", title: "is the bottleneck", note: "not just logistics" });
    addFooter(s, "Problem discovered through ground research in MP clusters.");
  }

  // Slide 3 — Why I know this
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 3, "Why I know this problem");
    heading(s, "I went to the ground\nbefore building.", 1.25);
    sub(s, "Field-first learning across farmers, traders, and transporters.", 2.55);

    statCard(s, { x: 0.8, y: 3.1, w: 3.45, value: "50+", title: "Conversations", note: "Farmers • traders • logistics" });
    statCard(s, { x: 4.45, y: 3.1, w: 3.45, value: "2", title: "MVP iterations", note: "Built fast, improved from feedback" });
    statCard(s, { x: 8.1, y: 3.1, w: 4.45, value: "MP Pilot", title: "Focused geography", note: "Narrow pilot beats broad launch" });

    box(s, {
      x: 0.8,
      y: 4.45,
      w: 7.15,
      h: 2.05,
      title: "What I learned",
      body:
        "• Farmers need simple first actions, not dashboards\n• Trust + coordination matter more than features\n• Buyer network is critical for adoption\n• Voice + local language reduces friction",
    });
    box(s, {
      x: 8.1,
      y: 4.45,
      w: 4.45,
      h: 2.05,
      title: "Proof (placeholders)",
      body: "Add:\n• Field photos\n• WhatsApp chats\n• Testimonials",
    });
    addFooter(s, "Replace placeholders with your real photos/chats for maximum credibility.");
  }

  // Slide 4 — Solution
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 4, "The Solution");
    heading(s, "One platform for\nselling + booking + discovery.", 1.25);
    sub(s, "A Bharat-first workflow: demand → match → pickup → delivery → payment.", 2.55);

    box(s, {
      x: 0.8,
      y: 3.25,
      w: 6.35,
      h: 3.25,
      title: "Core modules",
      body:
        "• Farmer: list crop + accept buyer demand\n• Buyer: discover supply + place requests\n• Logistics: book pickup/drop like Uber\n• Live mandi prices + WhatsApp support\n• Multilingual + voice-first assistance",
    });
    if (hero) {
      s.addShape("roundRect", {
        x: 7.4,
        y: 3.0,
        w: 5.1,
        h: 3.55,
        fill: { color: "FFFFFF", transparency: 6 },
        line: { color: "E7E7E7" },
        radius: 0.25,
      });
      s.addImage({ path: hero, x: 7.65, y: 3.15, w: 4.6, h: 3.25 });
      s.addText("MVP UI (replace with latest screenshots)", {
        x: 7.65,
        y: 6.42,
        w: 4.6,
        h: 0.3,
        fontFace: "Arial",
        fontSize: 12,
        color: "6B6B6B",
      });
    } else {
      box(s, { x: 7.4, y: 3.25, w: 5.15, h: 3.25, title: "Product mockups", body: "Drop in:\n• Landing\n• Booking flow\n• Dashboards" });
    }
    addFooter(s, "Designed for trust + usability for Bharat’s first-time digital users.");
  }

  // Slide 5 — How it works
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 5, "How it works");
    heading(s, "SAARTHI connects\nBharat in real time.", 1.25);
    sub(s, "Example flow: Maharashtra buyer → MP farmer → transporter → delivery → payment.", 2.55);

    box(s, {
      x: 0.8,
      y: 3.25,
      w: 11.75,
      h: 3.25,
      title: "Workflow (investor-simple)",
      body:
        "1) Buyer posts demand (qty, grade, location)\n2) SAARTHI matches trusted supply (farmer availability)\n3) Farmer confirms + negotiates (optional)\n4) Transport booking: pickup → drop → driver assigned\n5) Delivery updates + confirmation\n6) Payment settlement (pilot-ready → real rails next)",
    });
    addFooter(s, "This slide pairs best with your 3D India-connection demo on the website.");
  }

  // Slide 6 — Traction + timeline
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 6, "Traction + timeline");
    heading(s, "Built, iterated,\nready for pilot.", 1.25);
    sub(s, "Fast execution with real user feedback loops.", 2.55);

    box(s, {
      x: 0.8,
      y: 3.25,
      w: 6.0,
      h: 3.25,
      title: "Since Feb 2026",
      body:
        "• Ground research in MP clusters\n• MVP v1 shipped (mandi + logistics + dashboards)\n• Feedback collected (WhatsApp + calls)\n• MVP v2 redesign (OTP + maps + improved UX)\n• Pilot readiness focus",
    });
    box(s, {
      x: 7.0,
      y: 3.25,
      w: 5.55,
      h: 3.25,
      title: "Next 9 months",
      body:
        "• Controlled pilot: onboarding farmers + transporters\n• Buyer network partnerships\n• Validate unit economics on routes\n• Trust layer: verification + simple dispute flow\n• Expand cluster-by-cluster",
    });

    statCard(s, { x: 0.8, y: 2.85, w: 3.45, value: "2", title: "MVP versions", note: "v1 + v2 shipped" });
    statCard(s, { x: 4.45, y: 2.85, w: 3.45, value: "Yes", title: "Pilot GTM ready", note: "Per tracker notes" });
    addFooter(s, "Traction is execution + learning speed — not vanity metrics.");
  }

  // Slide 7 — Business model + market
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 7, "Business model + market");
    heading(s, "Simple revenue,\nlarge market.", 1.25);
    sub(s, "Start narrow → prove operations → scale network effects.", 2.55);

    box(s, {
      x: 0.8,
      y: 3.25,
      w: 6.35,
      h: 3.25,
      title: "Revenue streams (pilot-friendly)",
      body:
        "• Logistics booking fee (take-rate)\n• Buyer platform fee (B2B sourcing)\n• Trade commission (where applicable)\n• Premium services: scheduling, verification\n\nPilot: keep farmer free / lowest friction.",
    });
    box(s, {
      x: 7.4,
      y: 3.25,
      w: 5.15,
      h: 3.25,
      title: "Differentiation",
      body:
        "• Bharat-first UX: multilingual + voice\n• One workflow: prices + buyers + logistics\n• Trust layer as product, not marketing\n• Cluster-based rollout (operationally realistic)",
    });
    addFooter(s, "No made-up numbers — replace market sizing with sourced figures when ready.");
  }

  // Slide 8 — Vision / Ask
  {
    const s = pptx.addSlide();
    if (bg) addBg(s, bg);
    addBrand(s);
    slideTitle(s, 8, "Vision + ask");
    heading(s, "If India can feed the world,\nits farmers deserve better systems.", 1.15);
    sub(s, "SAARTHI aims to become the operating system for Bharat agriculture.", 2.85);

    box(s, {
      x: 0.8,
      y: 3.65,
      w: 7.0,
      h: 2.6,
      title: "Ask (next step)",
      body:
        "• Pilot partners (farmer clusters + buyers)\n• Logistics partners (routes + fleets)\n• Mentors (agri ops + go-to-market)\n• Early believers (pre-seed / grants / angels)",
    });
    box(s, {
      x: 8.05,
      y: 3.65,
      w: 4.5,
      h: 2.6,
      title: "Contact",
      body:
        "Godhuli Vyas\nFounder, SAARTHI\n\n(Insert email)\n(Insert phone / LinkedIn)",
    });
    pill(s, "Join us in building SAARTHI.", { x: 0.8, y: 6.45, w: 4.1 });
    addFooter(s, "Deck generated from your validated research + MVP tracker notes.");
  }

  return pptx.writeFile({ fileName: OUT_FILE }).then(() => {
    // eslint-disable-next-line no-console
    console.log(`Wrote: ${OUT_FILE}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
