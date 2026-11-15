// The demo companies on the landing. Their articles are synced into `app/data/examples/<id>/<article>.json`;
// Topiqu's notes on them live in `app/data/notes/<id>/<article>.json`. Every note quotes a sentence of the
// published article word for word (tests/examples.test.ts) and points to the company file or public source behind it.

export type ExampleLocale = 'cs' | 'en'
export type NoteKind = 'source' | 'computed' | 'research' | 'restraint' | 'voice' | 'corrected'
export const NOTE_KINDS: NoteKind[] = ['source', 'computed', 'research', 'restraint', 'voice', 'corrected']

export type ExampleNote = {
  /** A sentence or phrase of the article, verbatim and inside one text run. */
  quote: string
  kind: NoteKind
  text: string
  /** The arithmetic behind a `computed` note, one step per line. */
  calc?: string
  /** A company file in `public/examples/<id>/`. */
  file?: string
  url?: string
  /** Verbatim from the file or the source. */
  excerpt?: string
  /** The Czech original of `excerpt` on the English page. */
  original?: string
}

export type ExampleFile = { name: string; cs: string; en: string }

export type Example = {
  id: 'heatwise' | 'mlynek' | 'dubina'
  domain: string
  company: string
  industry: 'eshop' | 'services' | 'b2b'
  /** The demo blog's accent, so each article looks like it is on its own company blog. */
  brand: string
  /** The exported articles in the demo seed; the first one is on the homepage. */
  articles: string[]
  /** The homepage article's notes, by index. */
  featured: number[]
  files: ExampleFile[]
}

const brandVoice = { name: 'hlas-znacky.md', cs: 'Pravidla hlasu značky', en: 'Brand voice rules' }

export const EXAMPLES: Example[] = [
  {
    id: 'mlynek',
    domain: 'mlynek-ukazka.topiqu.com',
    company: 'Mlýnek & spol.',
    industry: 'eshop',
    brand: '#92400e',
    articles: ['cena-salku', 'mleko', 'zrnka', 'odvapneni'],
    featured: [1, 2, 5],
    files: [
      { name: 'web.md', cs: 'Web e-shopu', en: 'The shop website' },
      { name: 'katalog-2026.md', cs: 'Katalog a ceník 2026', en: 'Catalogue and prices 2026' },
      { name: 'mereni-a-davkovani.md', cs: 'Měření spotřeby a dávkování', en: 'Consumption and dosing measurements' },
      { name: 'obchodni-podminky-a-servis.md', cs: 'Obchodní podmínky a servis', en: 'Terms and service' },
      { name: 'porada-2026-10-21.md', cs: 'Zápis z porady 21. 10. 2026', en: 'Meeting notes, 21 October 2026' },
      brandVoice,
    ],
  },
  {
    id: 'heatwise',
    domain: 'heatwise-ukazka.topiqu.com',
    company: 'Heatwise',
    industry: 'services',
    brand: '#ea580c',
    articles: ['stary-dum', 'mrazy', 'hluk', 'umisteni'],
    featured: [0, 3, 6],
    files: [
      { name: 'web.md', cs: 'Web firmy', en: 'The company website' },
      { name: 'cenik-instalaci-2026.md', cs: 'Ceník instalací 2026', en: 'Installation prices 2026' },
      { name: 'technicky-list-hw-8.md', cs: 'Technický list HW-8', en: 'HW-8 data sheet' },
      { name: 'technicky-list-hw-12.md', cs: 'Technický list HW-12', en: 'HW-12 data sheet' },
      { name: 'realizace.md', cs: 'Realizace ve starších domech', en: 'Installations in older houses' },
      { name: 'porada-2026-10-14.md', cs: 'Zápis z porady 14. 10. 2026', en: 'Meeting notes, 14 October 2026' },
      brandVoice,
    ],
  },
  {
    id: 'dubina',
    domain: 'dubina-ukazka.topiqu.com',
    company: 'Dubina nábytek',
    industry: 'b2b',
    brand: '#15803d',
    articles: ['eudr', 'pefc-fsc', 'pece', 'dub-buk'],
    featured: [0, 4, 5],
    files: [
      { name: 'web.md', cs: 'Web výrobce', en: 'The manufacturer website' },
      { name: 'sortiment-a-celni-kody.md', cs: 'Sortiment a celní kódy', en: 'Products and customs codes' },
      { name: 'dodavatele-dreva-2025.md', cs: 'Dodavatelé dřeva', en: 'Timber suppliers' },
      {
        name: 'eudr-pracovni-skupina-2026-10-28.md',
        cs: 'Zápis pracovní skupiny EUDR 28. 10. 2026',
        en: 'EUDR working group notes, 28 October 2026',
      },
      {
        name: 'porada-obchodu-2026-11-05.md',
        cs: 'Zápis z porady obchodu 5. 11. 2026',
        en: 'Sales meeting notes, 5 November 2026',
      },
      brandVoice,
    ],
  },
]

export const exampleById = (id: string) => EXAMPLES.find((example) => example.id === id)
