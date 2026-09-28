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
   * Screenshot of the project's site under /public. Regenerate them all with
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
  headline: 'Senior Data Scientist & Machine Learning Engineer',
  /** Shown in the Contact section beside the pin icon. */
  location: 'West Palm Beach, FL 32935',
  /**
   * Structured form of the same address, used for the page's Person schema.
   * Kept in one place so the visible address and the machine-readable one can
   * never drift apart -- the schema previously hard-coded a different city.
   */
  address: {
    locality: 'West Palm Beach',
    region: 'FL',
    postalCode: '32935',
    country: 'US',
  },
  tagline:
    'Data scientist and ML engineer with 8+ years building data products, predictive models, Generative AI applications, and production analytics systems — from data preparation and feature engineering through evaluation, deployment, and monitoring.',
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
    'Brooke A. Mendez — Senior Data Scientist and Machine Learning Engineer with 8+ years building data products, predictive models, Generative AI and RAG applications, and production analytics systems with Python, SQL, Spark, Databricks, and AWS.',
};

export const socials: Social[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/brooke-m', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
];

/* ── About ─────────────────────────────────────────────────────────────── */

export const about: string[] = [
  'I’m a data scientist and machine learning engineer with more than eight years of experience building data products, predictive models, Generative AI applications, and production analytics systems. My day-to-day tools are Python, SQL, Spark, Databricks, and AWS, with Scikit-learn, TensorFlow, and LangChain on the modeling side.',
  'Most of my recent work is in Generative AI: LLM applications built on retrieval-augmented generation, semantic search, and embeddings, and the evaluation work behind them — improving retrieval quality, response quality, and latency. Before that I built predictive models for government and enterprise AI platforms, Snowflake and AWS data pipelines for business intelligence, and product analytics for feature launches.',
  'I work across the full ML lifecycle — from data preparation and feature engineering through evaluation, deployment, and monitoring — and care just as much about the stakeholder-facing analytics that make a model useful to the people relying on it.',
];

/* ── Experience ────────────────────────────────────────────────────────── */

/**
 * Rendered as a reverse-chronological timeline — keep this array newest-first.
 * Career breaks sit in their true date position, not at the end, so the gap
 * reads as part of the sequence rather than an afterthought.
 */
export const experience: Experience[] = [
  {
    company: 'Allwyn Corporation',
    role: 'Senior Data Scientist',
    start: 'Nov 2024',
    end: 'Present',
    location: 'Arlington, VA',
    type: 'Remote',
    project: {
      name: 'Generative AI Bot for Citizen Services — Allwyn Digital Modernization Platform',
      href: 'https://allwyncorp.com',
    },
    highlights: [
      'Developed LLM-powered citizen-service applications using RAG and LangChain, reducing manual knowledge-retrieval effort by 8% and improving response time by 6%.',
      'Built semantic-search and NLP pipelines for question answering, document summarization, and conversational AI using embedding models and vector-search workflows.',
      'Designed Python, Spark, Databricks, and AWS pipelines processing approximately 500 GB of structured and unstructured data per day for downstream analytics and AI workflows.',
      'Evaluated and tuned retrieval and LLM application quality through prompt iteration, vector-search optimization, semantic relevance checks, and evaluation frameworks, achieving 4.5% lower latency and 12% higher measured accuracy.',
      'Partnered with engineering and product teams to deploy production-grade AI services and improve reliability, automation, and end-user support workflows.',
    ],
    tech: ['LLMs', 'RAG', 'LangChain', 'Semantic Search', 'LLM Evaluation', 'Databricks', 'AWS'],
  },
  {
    company: 'Career break',
    role: 'Career break',
    start: 'Jan 2023',
    end: 'Oct 2024',
    summary:
      'Took time away from full-time work before returning to data science in late 2024.',
    variant: 'break',
  },
  {
    company: 'Cardinality.ai',
    role: 'Senior Data Scientist',
    start: 'Mar 2020',
    end: 'Dec 2022',
    location: 'Gaithersburg, MD',
    type: 'Remote',
    project: { name: 'Embedded AI & Intelligence Platform', href: 'https://prnewswire.com' },
    highlights: [
      'Developed predictive analytics and machine-learning models for government AI platforms using Python, SQL, and Scikit-learn, improving prediction accuracy by 7% over baseline models.',
      'Built scalable ETL pipelines and automated data workflows for large structured and unstructured datasets supporting analytics and model development.',
      'Applied NLP, statistical analysis, feature engineering, cross-validation, and model evaluation techniques to improve operational intelligence and citizen-outcome predictions.',
      'Designed Tableau and Power BI dashboards for KPI tracking, real-time analytics, and executive reporting.',
      'Deployed cloud-based ML solutions using AWS, Docker, Airflow, Snowflake, and Kubernetes to improve portability, scalability, and production reliability.',
    ],
    tech: ['Python', 'SQL', 'Scikit-learn', 'NLP', 'Snowflake', 'Airflow', 'Docker', 'Kubernetes'],
  },
  {
    company: 'Hypergiant Industries',
    role: 'Machine Learning Engineer',
    start: 'Jan 2018',
    end: 'Feb 2020',
    location: 'Austin, TX',
    type: 'Remote',
    project: { name: 'Hypergiant CommandCenter Platform', href: 'https://hypergiant.com' },
    highlights: [
      'Developed predictive analytics and machine-learning models for enterprise AI applications using Python and Scikit-learn.',
      'Analyzed large-scale structured and unstructured datasets, performed feature engineering, and translated model outputs into operational business insights.',
      'Built automated ETL pipelines and data workflows using SQL, Airflow, and cloud analytics tools, reducing manual reporting effort by 3%.',
      'Developed Snowflake data models and AWS ingestion pipelines using S3 and Redshift to support scalable business-intelligence reporting.',
      'Managed Docker-based data services and Kubernetes workloads for analytics applications and created dashboards for real-time operational monitoring.',
    ],
    tech: ['Python', 'Scikit-learn', 'SQL', 'Airflow', 'Snowflake', 'AWS', 'Docker', 'Kubernetes'],
  },
  {
    company: 'Airtable',
    role: 'Data Analyst',
    start: 'Jun 2015',
    end: 'Dec 2017',
    location: 'San Francisco, CA',
    type: 'Remote',
    project: {
      name: 'Airtable Product Usage & Feature Adoption Analytics',
      href: 'https://airtable.com',
    },
    highlights: [
      'Analyzed user-interaction data for the Gallery View and Kanban View feature launches to identify product-adoption and engagement trends.',
      'Built SQL dashboards to monitor feature adoption, retention, engagement, and workflow-usage metrics.',
      'Performed exploratory data analysis using Python and Tableau and delivered KPI reports and analytical insights to product and business teams.',
    ],
    tech: ['SQL', 'Python', 'Tableau', 'EDA', 'Product Analytics'],
  },
];

/* ── Education ─────────────────────────────────────────────────────────── */

export const education: Education[] = [
  {
    school: 'Florida Institute of Technology',
    degree: 'Master of Science',
    field: 'Data Science',
    start: 'Sep 2015',
    end: 'Mar 2018',
    location: 'Melbourne, FL',
    details: [
      'Relevant coursework: Machine Learning, Data Mining, Statistics, Database Systems, Artificial Intelligence, Data Analytics, Predictive Modeling, and Software Engineering.',
    ],
  },
  {
    school: 'Florida Institute of Technology',
    degree: 'Bachelor of Science',
    field: 'Information Systems',
    start: 'Aug 2011',
    end: 'May 2015',
    location: 'Melbourne, FL',
    details: [
      'Relevant coursework: Database Systems, Programming, Statistics, Systems Analysis, Business Information Systems, Data Management, and Web Development.',
    ],
  },
];

/* ── Projects ──────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    name: 'Generative AI Bot for Citizen Services',
    context: 'Allwyn Corporation',
    image: '/projects/allwyn.jpg',
    href: 'https://allwyncorp.com',
    blurb:
      'RAG-based question answering, summarization, and semantic search for citizen-service support workflows, tuned through prompt optimization and LLM and retrieval evaluation.',
    description:
      'Part of the Allwyn Digital Modernization Platform. I built LLM-powered applications with RAG and LangChain, semantic-search and NLP pipelines for question answering and document summarization, and the Python / Spark / Databricks / AWS pipelines that process roughly 500 GB of structured and unstructured data a day. Prompt iteration, vector-search optimization, semantic relevance checks, and evaluation frameworks raised measured accuracy while cutting latency.',
    year: '2024 — Present',
    tags: ['LLMs', 'RAG', 'LangChain', 'Semantic Search', 'LLM Evaluation', 'Databricks', 'AWS'],
    metrics: [
      { value: '+12%', label: 'retrieval & LLM accuracy' },
      { value: '−8%', label: 'manual knowledge-retrieval effort' },
      { value: '~500 GB', label: 'data processed per day' },
    ],
    links: [{ label: 'allwyncorp.com', href: 'https://allwyncorp.com' }],
    featured: true,
  },
  {
    name: 'Embedded AI & Intelligence Platform',
    context: 'Cardinality.ai',
    image: '/projects/cardinality.jpg',
    href: 'https://prnewswire.com',
    blurb:
      'Government predictive intelligence — Python and SQL machine-learning workflows combining structured and unstructured data, NLP, and executive BI reporting.',
    description:
      'Built predictive models with Python, SQL, and Scikit-learn that beat baseline accuracy, using NLP, statistical analysis, feature engineering, cross-validation, and model evaluation to improve citizen-outcome predictions. Built the ETL pipelines and automated workflows behind them, delivered Tableau and Power BI dashboards for KPI tracking and executive reporting, and deployed the work with AWS, Docker, Airflow, Snowflake, and Kubernetes.',
    year: '2020 — 2022',
    tags: ['Predictive Analytics', 'Scikit-learn', 'NLP', 'Feature Engineering', 'Power BI', 'Snowflake'],
    metrics: [
      { value: '+7%', label: 'prediction accuracy over baseline' },
    ],
    links: [{ label: 'prnewswire.com', href: 'https://prnewswire.com' }],
    featured: true,
  },
  {
    name: 'Hypergiant CommandCenter Platform',
    context: 'Hypergiant Industries',
    image: '/projects/hypergiant.jpg',
    href: 'https://hypergiant.com',
    blurb:
      'Enterprise analytics platform — ML-driven analytics on Snowflake data models, with AWS S3 and Redshift ingestion, Airflow orchestration, and containerized services on Kubernetes.',
    description:
      'Developed predictive models with Python and Scikit-learn, performed feature engineering, and translated model outputs into operational business insights. Built the data layer behind them — automated ETL workflows with SQL and Airflow, Snowflake data models, and AWS ingestion pipelines on S3 and Redshift for business-intelligence reporting — and ran the analytics services on Docker and Kubernetes, with dashboards for real-time operational monitoring.',
    year: '2018 — 2020',
    tags: ['Predictive Analytics', 'Scikit-learn', 'Airflow', 'Snowflake', 'AWS Redshift', 'Kubernetes'],
    metrics: [{ value: '−3%', label: 'manual reporting effort' }],
    links: [{ label: 'hypergiant.com', href: 'https://hypergiant.com' }],
  },
  {
    name: 'Airtable Product Usage & Feature Adoption Analytics',
    context: 'Airtable',
    image: '/projects/airtable.jpg',
    href: 'https://airtable.com',
    blurb:
      'Adoption, retention, and engagement analytics for the Gallery View and Kanban View launches.',
    description:
      'Analyzed user-interaction data to identify product-adoption and engagement trends, built SQL dashboards for feature adoption, retention, and workflow usage, and delivered KPI reports and insights from exploratory analysis in Python and Tableau.',
    year: '2015 — 2017',
    tags: ['SQL', 'Python', 'Tableau', 'EDA', 'KPI Reporting'],
    links: [{ label: 'airtable.com', href: 'https://airtable.com' }],
  },
];

/* ── Skills ────────────────────────────────────────────────────────────── */

export const skills: SkillGroup[] = [
  {
    category: 'Programming & Analytics',
    items: ['Python', 'SQL', 'R', 'Pandas', 'NumPy', 'SciPy', 'Jupyter'],
  },
  {
    category: 'Machine Learning',
    items: [
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'XGBoost',
      'Regression',
      'Classification',
      'Clustering',
      'Random Forest',
      'Decision Trees',
      'Neural Networks',
      'Feature Engineering',
    ],
  },
  {
    category: 'Generative AI & NLP',
    items: [
      'LLMs',
      'RAG',
      'Embeddings',
      'Vector Databases',
      'Semantic Search',
      'Prompt Engineering',
      'OpenAI APIs',
      'LangChain',
      'Question Answering',
      'Document Summarization',
    ],
  },
  {
    category: 'AI & Model Evaluation',
    items: [
      'LLM Evaluation',
      'Retrieval Evaluation',
      'Response Quality Assessment',
      'Semantic Relevance',
      'Accuracy/Latency Benchmarking',
      'Cross-Validation',
      'Precision',
      'Recall',
      'F1',
      'ROC-AUC',
      'RMSE',
      'MAE',
    ],
  },
  {
    category: 'Data Engineering',
    items: [
      'ETL/ELT',
      'Data Wrangling',
      'Data Cleaning',
      'Apache Spark',
      'Airflow',
      'Databricks',
      'Snowflake',
      'BigQuery',
      'Data Pipelines',
    ],
  },
  {
    category: 'Cloud & MLOps',
    items: [
      'AWS',
      'Docker',
      'Kubernetes',
      'REST APIs',
      'FastAPI',
      'Model Deployment',
      'Model Monitoring',
    ],
  },
  {
    category: 'Visualization & Databases',
    items: [
      'Tableau',
      'Power BI',
      'Matplotlib',
      'Seaborn',
      'Plotly',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
    ],
  },
  {
    category: 'Statistics',
    items: ['Probability', 'Hypothesis Testing', 'A/B Testing', 'Time Series', 'Hyperparameter Tuning'],
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
