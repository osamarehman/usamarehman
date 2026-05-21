// notes-data.js — Notes (essays) catalog.
// Currently seeded with 2 placeholder drafts so the blog system can be shipped
// and styled. Replace these with real essays as you write them. The article
// page reads from window.NOTES.

const NOTES = [
  {
    slug: "draft-spreadsheet-debt",
    idx: "N01",
    title: "Spreadsheet <em>debt</em> compounds quietly",
    dek: "Every workflow held together by a shared sheet is a loan you took out from your future operations team. Four signs the interest is killing you.",
    tag: "Operations",
    readMin: 7,
    date: "2026-04-12",
    dateLabel: "Apr 12, 2026",
    featured: true,
    lead: true,
    status: "draft",
  },
  {
    slug: "draft-discovery-week",
    idx: "N02",
    title: "Why I start every project with a paid <em>discovery</em> week",
    dek: "A field report on what one focused week of shadowing an ops team reliably uncovers — and what it costs to skip it.",
    tag: "Process",
    readMin: 5,
    date: "2026-03-28",
    dateLabel: "Mar 28, 2026",
    featured: true,
    status: "draft",
  },
  {
    slug: "draft-boring-stacks",
    idx: "N03",
    title: "Pick the <em>boring</em> stack on purpose",
    dek: "Postgres, server-rendered HTML, and a queue worker will outlast the next six framework cycles. A defense of choosing nothing fancy.",
    tag: "Engineering",
    readMin: 6,
    date: "2026-03-09",
    dateLabel: "Mar 9, 2026",
    featured: true,
    status: "draft",
  },
];

const NOTE_TAGS = ["All", "Operations", "Engineering", "Process", "Practice"];

window.NOTES = NOTES;
window.NOTE_TAGS = NOTE_TAGS;
