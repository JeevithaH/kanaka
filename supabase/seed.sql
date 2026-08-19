-- SKYRELLAC DEVELOPMENT SEED DATA

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('c1000000-0000-0000-0000-000000000001', 'Artificial Intelligence', 'ai', 'Master modern AI, machine learning and neural networks.', 'Cpu'),
('c1000000-0000-0000-0000-000000000002', 'Data & Analytics', 'data', 'Learn data engineering, analysis, SQL and visualization.', 'Database'),
('c1000000-0000-0000-0000-000000000003', 'Software Development', 'software', 'Full-stack engineering, web applications and modern APIs.', 'Code'),
('c1000000-0000-0000-0000-000000000004', 'Cloud Computing', 'cloud', 'Architect scalable cloud applications on AWS, Azure & GCP.', 'Cloud'),
('c1000000-0000-0000-0000-000000000005', 'Cybersecurity', 'cybersecurity', 'Defend digital infrastructure and conduct security audits.', 'ShieldCheck')
ON CONFLICT (slug) DO NOTHING;

-- Insert Skills
INSERT INTO public.skills (id, name, slug, category) VALUES
('s1000000-0000-0000-0000-000000000001', 'Python', 'python', 'Artificial Intelligence'),
('s1000000-0000-0000-0000-000000000002', 'Machine Learning', 'machine-learning', 'Artificial Intelligence'),
('s1000000-0000-0000-0000-000000000003', 'SQL & Data Modeling', 'sql', 'Data & Analytics'),
('s1000000-0000-0000-0000-000000000004', 'React & Next.js', 'react-nextjs', 'Software Development'),
('s1000000-0000-0000-0000-000000000005', 'Cloud Architecture', 'cloud-architecture', 'Cloud Computing'),
('s1000000-0000-0000-0000-000000000006', 'Generative AI & LLMs', 'generative-ai', 'Artificial Intelligence'),
('s1000000-0000-0000-0000-000000000007', 'Cyber Security Fundamentals', 'security-basics', 'Cybersecurity')
ON CONFLICT (slug) DO NOTHING;

-- Insert Courses (5 Featured Courses)
INSERT INTO public.courses (id, title, slug, description, category_id, difficulty, duration_minutes, lesson_count, credential_available, is_published) VALUES
(
  'f1000000-0000-0000-0000-000000000001',
  'Artificial Intelligence Fundamentals',
  'ai-fundamentals',
  'Master foundational artificial intelligence concepts, neural networks, machine learning algorithms, and responsible AI ethics for practical applications.',
  'c1000000-0000-0000-0000-000000000001',
  'Foundational',
  240,
  12,
  TRUE,
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000002',
  'Full-Stack Modern Web Engineering',
  'full-stack-web-engineering',
  'Build enterprise web applications with Next.js 14, modern TypeScript, Tailwind CSS, clean API routes and scalable database integration.',
  'c1000000-0000-0000-0000-000000000003',
  'Intermediate',
  360,
  16,
  TRUE,
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000003',
  'Applied Data Science & SQL Analytics',
  'data-science-sql-analytics',
  'Learn high-performance database querying, data cleaning, statistically sound data modeling, and automated visualization pipelines.',
  'c1000000-0000-0000-0000-000000000002',
  'Foundational',
  300,
  14,
  TRUE,
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000004',
  'Cloud Infrastructure & DevOps Mastery',
  'cloud-infrastructure-devops',
  'Deploy containerized cloud workloads, implement CI/CD automated deployment pipelines, and configure secure server architecture.',
  'c1000000-0000-0000-0000-000000000004',
  'Advanced',
  420,
  18,
  TRUE,
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000005',
  'Cybersecurity Principles & Threat Audit',
  'cybersecurity-principles-audit',
  'Understand network security defenses, vulnerability testing, risk management, and security protocols for modern corporate environments.',
  'c1000000-0000-0000-0000-000000000005',
  'Intermediate',
  280,
  10,
  TRUE,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Learning Paths (3 Paths)
INSERT INTO public.learning_paths (id, title, slug, description, icon, estimated_hours, is_published) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'AI & Machine Learning Engineer Path',
  'ai-machine-learning-engineer',
  'A structured 7-stage learning journey taking you from Python programming fundamentals to production Deep Learning models.',
  'Brain',
  45,
  TRUE
),
(
  'p1000000-0000-0000-0000-000000000002',
  'Full-Stack Web Architect Path',
  'full-stack-web-architect',
  'Master frontend user experience, scalable backend APIs, database management, and cloud deployment pipelines.',
  'Layers',
  50,
  TRUE
),
(
  'p1000000-0000-0000-0000-000000000003',
  'Cybersecurity Specialist Path',
  'cybersecurity-specialist',
  'Prepare for cybersecurity certifications and hands-on threat defense analysis in corporate networks.',
  'Shield',
  35,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Seed Internships (5 Verified Opportunities)
INSERT INTO public.internships (id, title, slug, organization_name, mode, location, duration_weeks, description, responsibilities, eligibility, is_published) VALUES
(
  'i1000000-0000-0000-0000-000000000001',
  'AI & Machine Learning Engineering Intern',
  'ai-ml-engineering-intern',
  'Skyrellac Innovation Labs',
  'Remote',
  'Global / Remote',
  8,
  'Work alongside senior AI research scientists to preprocess domain datasets, evaluate Transformer language models, and assist in model finetuning.',
  '• Build Python data cleaning and feature engineering pipelines.\n• Evaluate model loss and accuracy benchmarks.\n• Participate in weekly technical architecture reviews.',
  'Open to undergraduate students, graduates, and self-taught developers with strong Python and linear algebra basics.',
  TRUE
),
(
  'i1000000-0000-0000-0000-000000000002',
  'Full-Stack Developer Intern',
  'full-stack-developer-intern',
  'Global Tech Solutions',
  'Remote',
  'Global / Remote',
  12,
  'Develop frontend UI components and RESTful microservices for high-traffic enterprise applications using React, Next.js, and modern TypeScript.',
  '• Create reusable glassmorphic UI components.\n• Integrate backend API routes with PostgreSQL databases.\n• Write clean, testable TypeScript code.',
  'Basic knowledge of JavaScript/TypeScript, HTML/CSS, and Git version control.',
  TRUE
),
(
  'i1000000-0000-0000-0000-000000000003',
  'Data Analyst & BI Intern',
  'data-analyst-bi-intern',
  'Enterprise Data Systems',
  'Hybrid',
  'Tech City HQ / Remote',
  10,
  'Transform raw business data into actionable executive insights, automated interactive dashboards, and optimized SQL database reports.',
  '• Execute complex SQL joins and aggregations.\n• Design interactive data reporting dashboards.\n• Present findings to product teams.',
  'Familiarity with SQL, Excel/Google Sheets, and data visualization principles.',
  TRUE
),
(
  'i1000000-0000-0000-0000-000000000004',
  'Cloud Infrastructure & DevOps Intern',
  'cloud-devops-intern',
  'Apex Cloud Technologies',
  'Remote',
  'Global / Remote',
  8,
  'Gain hands-on experience managing Kubernetes cluster configurations, Terraform infrastructure code, and automated CI/CD build scripts.',
  '• Monitor cloud infrastructure health metrics.\n• Assist in building GitHub Actions deployment scripts.\n• Document infrastructure setups.',
  'Enthusiasm for Linux terminal commands, Docker containerization, and networking basics.',
  TRUE
),
(
  'i1000000-0000-0000-0000-000000000005',
  'Cybersecurity Threat Analyst Intern',
  'cybersecurity-analyst-intern',
  'SecureShield Systems',
  'Remote',
  'Global / Remote',
  12,
  'Monitor network security logs, assist in vulnerability assessments, and conduct penetration testing in sandbox environments.',
  '• Analyze security event telemetry for anomalies.\n• Assist in vulnerability patch audits.\n• Author technical incident reports.',
  'Completed foundational cybersecurity coursework or certifications.',
  TRUE
)
ON CONFLICT (slug) DO NOTHING;
