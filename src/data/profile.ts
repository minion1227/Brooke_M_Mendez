/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit this one file to update the entire portfolio. Nothing else needs to
 *  change. Sections with no entries are automatically hidden from the page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Social = {
  label: string;
  href: string;
  /** Icon key — see src/components/Icon.astro for available keys. */
  icon: 'linkedin' | 'github' | 'mail' | 'globe' | 'x' | 'dribbble';
};

export type Experience = {
  company: string;
  role: string;
  /** Free-form, e.g. "Jan 2022". */
  start: string;
  /** Use "Present" for current roles. */
  end: string;
  location?: string;
  /** e.g. "Full-time", "Remote", "Freelance". */
  type?: string;
  /** The client/product this role centered on, rendered as a labelled line. */
  project?: { name: string; href?: string };
  summary?: string;
  highlights?: string[];
  tech?: string[];
  href?: string;
  /** 'break' renders a muted, minimal entry — for career gaps. */
  variant?: 'role' | 'break';
};

export type Education = {
  school: string;
  degree: string;
  field?: string;
  start?: string;
  end?: string;
  location?: string;
  details?: string[];
};

export type Project = {
  name: string;
  blurb: string;
  description?: string;
  /** Shown as the company/context the work happened under. */
  context?: string;
  /**
   * Storefront screenshot under /public. Regenerate them all with
   * `npm run capture:projects`. Omit to render the card without an image.
   */
  image?: string;
  /** Where the screenshot links to. Defaults to the first entry in `links`. */
  href?: string;
  year?: string;
  tags?: string[];
  /** Measurable results, rendered as a compact stat row. */
  metrics?: { value: string; label: string }[];
  links?: { label: string; href: string }[];
  /** Featured projects render first, in a wider card. */
  featured?: boolean;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  date?: string;
  href?: string;
};

/* ── Identity ───────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Brooke A. Mendez',
  headline: 'Senior E-commerce Expert & Shopify Developer',
  /** Shown in the Contact section beside the pin icon. */
  location: '616 Clearwater Park Rd, West Palm Beach, FL 32935',
  /**
   * Structured form of the same address, used for the page's Person schema.
   * Kept in one place so the visible address and the machine-readable one can
   * never drift apart -- the schema previously hard-coded a different city.
   */
  address: {
    street: '616 Clearwater Park Rd',
    locality: 'West Palm Beach',
    region: 'FL',
    postalCode: '32935',
    country: 'US',
  },
  tagline:
    'E-commerce developer with 10+ years building and improving online stores across Shopify, BigCommerce, WooCommerce, and Adobe Commerce. Strong in storefront development, merchandising, integrations, and conversion work — with Shopify as the core focus.',
  email: 'dezmenbro@outlook.com',
  /** Shown in the Contact section as a tel: link. Set to null to hide it. */
  phone: '+1(321)-615-1737' as string | null,
  /**
   * Save your resume as public/resume.pdf. The download buttons appear
   * automatically once the file exists, and stay hidden until then.
   */
  resumeUrl: '/resume.pdf' as string | null,
  /** Save your headshot as public/avatar.jpg. Hidden until the file exists. */
  avatar: '/avatar.jpg' as string | null,
  seoDescription:
    'Brooke A. Mendez — Senior E-commerce Expert and Shopify Developer with 10+ years across Shopify, BigCommerce, WooCommerce, and Adobe Commerce. Storefront development, merchandising, integrations, and CRO.',
};

export const socials: Social[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/brooke-m', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
];

/* ── About ─────────────────────────────────────────────────────────────── */

export const about: string[] = [
  'I’m an e-commerce developer with over ten years of experience building and improving online stores. Most of that time has been spent in Shopify — themes, Liquid, storefront architecture, and the APIs behind them — alongside steady work across BigCommerce, WooCommerce, and Adobe Commerce.',
  'What I enjoy most is the part of the job that sits between engineering and the business: figuring out why a product page isn’t converting, making a complex configurator feel simple, connecting content to the products it should be selling, and giving marketing teams components they can ship campaigns with on their own.',
  'I like to keep things practical — understand what really needs to be solved, build it cleanly, and make sure the result is something the business can rely on and grow with. Across recent projects that has meant measurable movement in add-to-cart rate, average order value, and product-page abandonment.',
];

/* ── Experience ────────────────────────────────────────────────────────── */

/**
 * Rendered as a reverse-chronological timeline — keep this array newest-first.
 * Career breaks sit in their true date position, not at the end, so the gap
 * reads as part of the sequence rather than an afterthought.
 */
export const experience: Experience[] = [
  {
    company: 'NorthPeak Commerce Labs',
    role: 'Senior E-commerce Expert',
    start: 'Nov 2025',
    end: 'Present',
    location: 'Portland, OR',
    type: 'Remote',
    project: { name: 'Dusty’s Trail', href: 'https://dustystrail.com' },
    summary:
      'Lead the e-commerce work for Dusty’s Trail, covering Shopify development, storefront UX, merchandising, bundles, recipes, promotions, and ongoing optimization.',
    highlights: [
      'Simplified how products and bundles are presented, helping add-to-cart activity grow by roughly 14%.',
      'Connected recipe content more naturally with related products — visitors began spending about 18% longer on the site.',
      'Fine-tuned mobile navigation, recommendations, cart messaging, and promotional flows, contributing to an estimated 9% lift in average order value.',
      'Support broader commerce work across WooCommerce and Adobe Commerce, including catalog updates, frontend fixes, integrations, and platform-specific troubleshooting.',
    ],
    tech: ['Shopify', 'Liquid', 'Merchandising', 'CRO', 'WooCommerce', 'Adobe Commerce'],
  },
  {
    company: 'Career break',
    role: 'Career break',
    start: 'Jan 2023',
    end: 'Oct 2025',
    summary:
      'Took time away from full-time work before returning to e-commerce in late 2025.',
    variant: 'break',
  },
  {
    company: 'Fiverr & Independent Clients',
    role: 'Freelance Shopify Expert',
    start: 'Mar 2020',
    end: 'Dec 2022',
    type: 'Remote · Freelance',
    project: { name: 'Mystiqare', href: 'https://mystiqare.com' },
    summary:
      'Worked directly with clients on Shopify builds and improvements, managing projects end to end — from requirements and estimates through development, QA, launch, and follow-up support.',
    highlights: [
      'Reworked Mystiqare product pages around benefits, ingredients, routines, and related products, helping recommendation engagement rise by roughly 16%.',
      'Made the Beauty Passport / MystiCoins loyalty experience easier to find and use, supporting about 12% more repeat-customer engagement.',
      'Delivered bundles, promotions, reviews, and loyalty features alongside ongoing Shopify improvements.',
      'Handled smaller WooCommerce projects and migrations — theme updates, checkout fixes, plugin setup, and product imports.',
    ],
    tech: ['Shopify', 'Liquid', 'Loyalty', 'Bundles', 'WooCommerce', 'Migrations'],
  },
  {
    company: 'DigitalSuits',
    role: 'Shopify / E-commerce Developer',
    start: 'Jan 2018',
    end: 'Feb 2020',
    location: 'Miami, FL',
    type: 'Remote',
    project: { name: 'EASURE Scrubs', href: 'https://easurescrubs.com' },
    summary:
      'Worked across EASURE’s Shopify store, improving product pages, collections, promotions, and mobile shopping flows.',
    highlights: [
      'Made sizing, variants, and fabric details easier to understand, helping product-page abandonment fall by around 12%.',
      'Built reusable Liquid sections for campaigns, allowing the marketing team to publish updates roughly 35% faster.',
      'Improved content and mobile shopping flows, contributing to an estimated 9% increase in conversion on optimized journeys.',
      'Supported selected Magento / Adobe Commerce and WooCommerce accounts with catalog work, frontend updates, integrations, and maintenance.',
    ],
    tech: ['Shopify', 'Liquid', 'Responsive UI', 'Magento', 'WooCommerce', 'CRO'],
  },
  {
    company: 'Trellis',
    role: 'BigCommerce Developer',
    start: 'Jun 2015',
    end: 'Dec 2017',
    location: 'Boston, MA',
    type: 'Remote',
    project: { name: 'Perdido Hat Co.', href: 'https://perdidohatco.com' },
    summary:
      'Built and maintained responsive e-commerce storefronts across product pages, collections, navigation, cart flows, and promotional content.',
    highlights: [
      'Worked with BigCommerce Stencil, Handlebars, JavaScript, HTML, and CSS to create reusable storefront components.',
      'Made custom-product options easier to understand, helping customer inquiries rise by roughly 17%.',
      'Improved catalog structure and mobile browsing, helping shoppers view around 13% more products per session.',
      'Supported early WooCommerce and Magento storefront work — theme customization, catalog updates, and frontend troubleshooting.',
    ],
    tech: ['BigCommerce', 'Stencil', 'Handlebars', 'JavaScript', 'HTML5', 'CSS3'],
  },
];

/* ── Education ─────────────────────────────────────────────────────────── */

export const education: Education[] = [
  {
    school: 'Florida Institute of Technology',
    degree: 'Bachelor of Science',
    field: 'Information Systems',
    start: 'Aug 2011',
    end: 'May 2015',
    location: 'Melbourne, FL',
    details: [
      'Relevant studies: Web Development, Database Systems, E-commerce, Systems Analysis, Business Information Systems, and UX Design.',
    ],
  },
];

/* ── Projects ──────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    name: 'Dusty’s Trail',
    context: 'NorthPeak Commerce Labs',
    image: '/projects/dustys-trail.jpg',
    href: 'https://dustystrail.com',
    blurb:
      'Shopify storefront where recipe content drives product discovery — bundles, merchandising, and mobile-first shopping flows.',
    description:
      'I lead the e-commerce work on Dusty’s Trail: Shopify development, storefront UX, merchandising, bundles, recipes, promotions, and ongoing optimization. Simplifying how products and bundles are presented lifted add-to-cart activity, while connecting recipe content more naturally to related products kept visitors on site noticeably longer. Fine-tuning mobile navigation, recommendations, cart messaging, and promotional flows moved average order value.',
    year: '2025 — Present',
    tags: ['Shopify', 'Liquid', 'Bundles', 'Merchandising', 'Mobile UX', 'CRO'],
    metrics: [
      { value: '+14%', label: 'add-to-cart activity' },
      { value: '+18%', label: 'time on site' },
      { value: '+9%', label: 'average order value' },
    ],
    links: [{ label: 'dustystrail.com', href: 'https://dustystrail.com' }],
    featured: true,
  },
  {
    name: 'Mystiqare',
    context: 'Freelance',
    image: '/projects/mystiqare.jpg',
    href: 'https://mystiqare.com',
    blurb:
      'Shopify skincare experience built around routines, ingredient education, and a points-based loyalty program.',
    description:
      'Reworked product pages around benefits, ingredients, routines, and related products, which lifted recommendation engagement. Made the Beauty Passport / MystiCoins loyalty experience easier to find and use, supporting more repeat-customer engagement. Also delivered bundles, promotions, and reviews alongside ongoing Shopify improvements.',
    year: '2020 — 2022',
    tags: ['Shopify', 'Liquid', 'Loyalty', 'Bundles', 'Reviews', 'Promotions'],
    metrics: [
      { value: '+16%', label: 'recommendation engagement' },
      { value: '+12%', label: 'repeat-customer engagement' },
    ],
    links: [{ label: 'mystiqare.com', href: 'https://mystiqare.com' }],
    featured: true,
  },
  {
    name: 'EASURE Scrubs',
    context: 'DigitalSuits',
    image: '/projects/easure-scrubs.jpg',
    href: 'https://easurescrubs.com',
    blurb:
      'Medical apparel storefront — clearer sizing and variants, plus a reusable section library for campaigns.',
    description:
      'Improved product pages, collections, promotions, and mobile shopping flows. Making sizing, variants, and fabric details easier to understand brought product-page abandonment down, and reusable Liquid sections let the marketing team publish campaign updates substantially faster.',
    year: '2018 — 2020',
    tags: ['Shopify', 'Liquid', 'Variants', 'Sections', 'Responsive UI'],
    metrics: [
      { value: '−12%', label: 'product-page abandonment' },
      { value: '+35%', label: 'faster campaign publishing' },
      { value: '+9%', label: 'conversion on optimized journeys' },
    ],
    links: [{ label: 'easurescrubs.com', href: 'https://easurescrubs.com' }],
  },
  {
    name: 'Perdido Hat Co.',
    context: 'Trellis',
    image: '/projects/perdido-hat-co.jpg',
    href: 'https://perdidohatco.com',
    blurb:
      'BigCommerce storefront for highly configurable custom headwear — embroidery, patches, fabrics, private label.',
    description:
      'Built responsive storefront components with BigCommerce Stencil and Handlebars. Making custom-product options easier to understand drove a meaningful rise in customer inquiries, and improvements to catalog structure and mobile browsing increased how many products shoppers viewed per session.',
    year: '2015 — 2017',
    tags: ['BigCommerce', 'Stencil', 'Handlebars', 'Custom Options', 'Catalog'],
    metrics: [
      { value: '+17%', label: 'customer inquiries' },
      { value: '+13%', label: 'products viewed per session' },
    ],
    links: [{ label: 'perdidohatco.com', href: 'https://perdidohatco.com' }],
  },
];

/* ── Skills ────────────────────────────────────────────────────────────── */

export const skills: SkillGroup[] = [
  {
    category: 'Platforms',
    items: [
      'Shopify',
      'Shopify Plus',
      'Shopify 2.0',
      'BigCommerce',
      'WooCommerce',
      'Adobe Commerce / Magento',
    ],
  },
  {
    category: 'Frontend',
    items: [
      'Liquid',
      'Stencil',
      'Handlebars',
      'JavaScript',
      'HTML5',
      'CSS3',
      'React',
      'Responsive UI',
    ],
  },
  {
    category: 'APIs & Dev',
    items: [
      'Shopify Admin API',
      'Storefront API',
      'BigCommerce APIs',
      'WooCommerce REST API',
      'Magento APIs',
      'Node.js',
      'REST APIs',
      'Custom Integrations',
    ],
  },
  {
    category: 'Commerce',
    items: [
      'Product Merchandising',
      'Catalog Management',
      'Collections',
      'Variants',
      'Bundles',
      'Promotions',
      'Loyalty',
      'Subscriptions',
      'CRO',
      'SEO',
      'AOV Optimization',
    ],
  },
  {
    category: 'Tools',
    items: [
      'Recharge',
      'Bold',
      'PageFly',
      'Shogun',
      'GemPages',
      'Figma',
      'Adobe XD',
      'Git',
      'GitHub',
    ],
  },
  {
    category: 'Also',
    items: [
      'Custom Themes',
      'Store Migration',
      'Catalog Architecture',
      'Performance Optimization',
    ],
  },
];

/* ── Certifications ────────────────────────────────────────────────────── */

export const certifications: Certification[] = [
  // None listed. Add here if you earn any:
  // { name: 'Certification Name', issuer: 'Issuing Org', date: 'Mon YYYY', href: 'https://...' },
];

/* ── Navigation ────────────────────────────────────────────────────────── */

/** Nav entries whose section has no content are filtered out automatically. */
export const navLinks = [
  { label: 'About', href: '#about', enabled: about.length > 0 },
  { label: 'Experience', href: '#experience', enabled: experience.length > 0 },
  { label: 'Projects', href: '#projects', enabled: projects.length > 0 },
  { label: 'Skills', href: '#skills', enabled: skills.length > 0 },
  { label: 'Education', href: '#education', enabled: education.length > 0 },
  { label: 'Contact', href: '#contact', enabled: true },
].filter((l) => l.enabled);
