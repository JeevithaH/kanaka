import { Course } from '@/models/Course';

export const SEED_COURSES = [
  {
    courseId: 'ai-fundamentals',
      title: 'Artificial Intelligence Fundamentals',
      description: 'Master the core concepts of artificial intelligence, machine learning algorithms, neural networks, and modern generative AI applications in business and engineering.',
      instructor: {
        name: 'Dr. Aisha Patel',
        title: 'AI Research Lead & Former Senior Scientist',
        avatarUrl: '',
      },
      image: '/images/ai.jpg',
      originalPrice: 1999,
      discountedPrice: 199,
      discountPercentage: 90,
      rating: 4.8,
      studentsCount: 3420,
      category: 'Artificial Intelligence',
      difficulty: 'Foundational',
      durationMinutes: 360,
      lessonCount: 16,
      certificateEligible: true,
      isPublished: true,
      skills: ['Machine Learning', 'Neural Networks', 'NLP', 'Computer Vision', 'Generative AI'],
      modules: [
        {
          id: 'mod1',
          title: 'Module 1: Introduction to Artificial Intelligence',
          description: 'Understanding AI history, taxonomy, search algorithms, and intelligent agents.',
          lessons: [
            { id: 'mod1-lesson1', title: '1.1 What is Artificial Intelligence?', duration: '15 mins', contentType: 'video', contentText: 'Introduction to AI definition, history, strong vs weak AI, and real-world applications.' },
            { id: 'mod1-lesson2', title: '1.2 Intelligent Agents & Environments', duration: '20 mins', contentType: 'video', contentText: 'Exploring PEAS frameworks, deterministic vs stochastic environments, and agent design.' },
            { id: 'mod1-lesson3', title: '1.3 Problem Solving by Search', duration: '25 mins', contentType: 'video', contentText: 'Uninformed and informed search algorithms including BFS, DFS, and A* search.' },
            { id: 'mod1-lesson4', title: '1.4 Knowledge Representation & Logic', duration: '20 mins', contentType: 'text', contentText: 'Propositional logic, first-order logic, and ontology representation.' },
          ],
        },
        {
          id: 'mod2',
          title: 'Module 2: Machine Learning Foundations',
          description: 'Supervised, unsupervised, and reinforcement learning principles.',
          lessons: [
            { id: 'mod2-lesson1', title: '2.1 Supervised vs Unsupervised Learning', duration: '20 mins', contentType: 'video', contentText: 'Understanding regression, classification, clustering, and dimensionality reduction.' },
            { id: 'mod2-lesson2', title: '2.2 Linear & Logistic Regression', duration: '25 mins', contentType: 'video', contentText: 'Mathematical formulation of linear model fitting, gradient descent, and cost functions.' },
            { id: 'mod2-lesson3', title: '2.3 Decision Trees & Random Forests', duration: '30 mins', contentType: 'video', contentText: 'Entropy, Gini impurity, information gain, and ensemble learning.' },
            { id: 'mod2-lesson4', title: '2.4 Model Evaluation & Cross-Validation', duration: '20 mins', contentType: 'text', contentText: 'Precision, recall, F1-score, ROC curves, and k-fold cross-validation.' },
            { id: 'mod2-lesson5', title: '2.5 Overfitting, Underfitting & Regularization', duration: '25 mins', contentType: 'video', contentText: 'Bias-variance tradeoff, L1 (Lasso) and L2 (Ridge) regularization methods.' },
            { id: 'mod2-lesson6', title: '2.6 Clustering Algorithms (K-Means & DBSCAN)', duration: '25 mins', contentType: 'video', contentText: 'Unsupervised partitioning, centroid updating, and density-based clustering.' },
          ],
        },
        {
          id: 'mod3',
          title: 'Module 3: Neural Networks & Deep Learning',
          description: 'Deep neural architectures, backpropagation, and transformer models.',
          lessons: [
            { id: 'mod3-lesson1', title: '3.1 Perceptrons & Artificial Neural Networks', duration: '25 mins', contentType: 'video', contentText: 'Single perceptron mechanics, activation functions (ReLU, Sigmoid, Softmax).' },
            { id: 'mod3-lesson2', title: '3.2 Backpropagation & Gradient Descent', duration: '30 mins', contentType: 'video', contentText: 'Derivation of error backpropagation using chain rule matrix calculus.' },
            { id: 'mod3-lesson3', title: '3.3 Convolutional Neural Networks (CNNs)', duration: '30 mins', contentType: 'video', contentText: 'Feature maps, pooling layers, and image recognition pipelines.' },
            { id: 'mod3-lesson4', title: '3.4 Natural Language Processing & Transformers', duration: '30 mins', contentType: 'video', contentText: 'Self-attention mechanisms, encoder-decoder architectures, and Large Language Models.' },
            { id: 'mod3-lesson5', title: '3.5 AI Ethics & Responsible Deployment', duration: '20 mins', contentType: 'text', contentText: 'Algorithmic bias, fairness, transparency, and safety protocols.' },
            { id: 'mod3-lesson6', title: '3.6 Capstone Project Overview', duration: '15 mins', contentType: 'project', contentText: 'Building an end-to-end sentiment analyzer and classifier.' },
          ],
        },
      ],
      tests: [
        {
          id: 'test-1',
          title: 'AI Fundamentals Final Certification Test',
          durationMinutes: 30,
          passingScorePct: 70,
          totalMarks: 100,
          questions: [
            {
              id: 'q1',
              questionText: 'What is the primary goal of supervised learning?',
              options: [
                'To discover hidden clusters in unlabeled datasets',
                'To learn a mapping function from input features to target labels',
                'To maximize cumulative reward through environmental trial and error',
                'To compress data dimensions without loss'
              ],
              correctOptionIndex: 1,
              explanation: 'Supervised learning trains models on labeled input-output pairs to predict outputs for new inputs.'
            },
            {
              id: 'q2',
              questionText: 'Which activation function is most commonly used in hidden layers of deep neural networks to prevent vanishing gradients?',
              options: ['Sigmoid', 'Tanh', 'Rectified Linear Unit (ReLU)', 'Step Function'],
              correctOptionIndex: 2,
              explanation: 'ReLU outputs 0 for negative inputs and x for positive inputs, avoiding gradient saturation for positive values.'
            },
            {
              id: 'q3',
              questionText: 'What mechanism powers modern Transformer architectures (such as GPT and BERT)?',
              options: ['Recurrent hidden states', 'Convolutional kernels', 'Self-Attention', 'Genetic mutations'],
              correctOptionIndex: 2,
              explanation: 'Self-attention allows transformers to weigh relationships between all tokens in a sequence simultaneously.'
            },
            {
              id: 'q4',
              questionText: 'How does L2 (Ridge) regularization help prevent model overfitting?',
              options: [
                'By zeroing out irrelevant features completely',
                'By adding a penalty proportional to the square of parameter weights',
                'By increasing model training iterations',
                'By removing training samples with high noise'
              ],
              correctOptionIndex: 1,
              explanation: 'L2 regularization adds sum of squared weights to loss, shrinking weights towards zero without eliminating them.'
            },
            {
              id: 'q5',
              questionText: 'What metric is best suited for evaluating a classifier on a heavily imbalanced dataset?',
              options: ['Accuracy', 'F1-Score / Area Under PR Curve', 'Mean Absolute Error', 'R-squared'],
              correctOptionIndex: 1,
              explanation: 'Accuracy is misleading on imbalanced datasets; F1-score balances precision and recall.'
            }
          ]
        }
      ]
    },
    {
      courseId: 'full-stack-web-engineering',
      title: 'Full-Stack Modern Web Engineering',
      description: 'Build enterprise scalable web applications using React, Next.js, Node.js, Express, TypeScript, and MongoDB/PostgreSQL database management.',
      instructor: {
        name: 'Marcus Chen',
        title: 'Senior Full-Stack Architect',
        avatarUrl: '',
      },
      image: '/images/web.jpg',
      originalPrice: 1999,
      discountedPrice: 199,
      discountPercentage: 90,
      rating: 4.9,
      studentsCount: 5100,
      category: 'Web Development',
      difficulty: 'Intermediate',
      durationMinutes: 480,
      lessonCount: 20,
      certificateEligible: true,
      isPublished: true,
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'REST & GraphQL APIs'],
      modules: [
        {
          id: 'mod1',
          title: 'Module 1: Frontend Architecture with Next.js & React',
          description: 'Modern component design, App Router, Server Components, and State Management.',
          lessons: [
            { id: 'mod1-lesson1', title: '1.1 Modern Web Stack Architecture', duration: '20 mins', contentType: 'video', contentText: 'Overview of Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).' },
            { id: 'mod1-lesson2', title: '1.2 React 18 Concurrent & Server Components', duration: '25 mins', contentType: 'video', contentText: 'Understanding RSC, streaming HTML, hydration, and client vs server boundaries.' },
            { id: 'mod1-lesson3', title: '1.3 Next.js 14 App Router Routing & Layouts', duration: '30 mins', contentType: 'video', contentText: 'Nested routes, loading states, error boundaries, parallel routes, and intercepting routes.' },
            { id: 'mod1-lesson4', title: '1.4 State Management & Data Fetching', duration: '25 mins', contentType: 'text', contentText: 'SWR, React Query, Zustand, and server action mutation flows.' },
          ],
        },
        {
          id: 'mod2',
          title: 'Module 2: Backend Development & REST APIs',
          description: 'Building robust Node.js services, database modeling, and authentication.',
          lessons: [
            { id: 'mod2-lesson1', title: '2.1 Node.js Runtime & Express Server Design', duration: '25 mins', contentType: 'video', contentText: 'Event loop architecture, non-blocking I/O, middleware chain, and express API setup.' },
            { id: 'mod2-lesson2', title: '2.2 Database Modeling with Mongoose & MongoDB', duration: '30 mins', contentType: 'video', contentText: 'Schema design, indexing strategies, population, aggregate queries, and transactions.' },
            { id: 'mod2-lesson3', title: '2.3 Authentication & Session Security (JWT/Cookies)', duration: '30 mins', contentType: 'video', contentText: 'Password hashing with bcrypt, HTTP-only cookies, JWT verification, and CORS configuration.' },
            { id: 'mod2-lesson4', title: '2.4 API Validation & Input Sanitization', duration: '20 mins', contentType: 'text', contentText: 'Schema validation using Zod, handling edge cases, and standardized error responses.' },
          ],
        },
        {
          id: 'mod3',
          title: 'Module 3: Production Engineering & Deployment',
          description: 'CI/CD pipelines, Docker containerization, and cloud hosting.',
          lessons: [
            { id: 'mod3-lesson1', title: '3.1 Containerization with Docker', duration: '25 mins', contentType: 'video', contentText: 'Writing Dockerfiles, multi-stage builds, docker-compose environments.' },
            { id: 'mod3-lesson2', title: '3.2 CI/CD with GitHub Actions', duration: '25 mins', contentType: 'video', contentText: 'Automated testing, linting, preview builds, and production deployments.' },
            { id: 'mod3-lesson3', title: '3.3 Web Security & OWASP Top 10', duration: '30 mins', contentType: 'text', contentText: 'Mitigating XSS, CSRF, SQL Injection, and Rate Limiting.' },
            { id: 'mod3-lesson4', title: '3.4 Performance Optimization & Web Vitals', duration: '25 mins', contentType: 'video', contentText: 'LCP, CLS, FID optimization, code splitting, asset caching, and CDN distribution.' },
          ],
        },
      ],
      tests: [
        {
          id: 'test-1',
          title: 'Full-Stack Web Engineering Certification Assessment',
          durationMinutes: 30,
          passingScorePct: 70,
          totalMarks: 100,
          questions: [
            {
              id: 'q1',
              questionText: 'What is the main operational difference between React Server Components (RSC) and Client Components?',
              options: [
                'Server Components run on the browser while Client Components run on Node.js',
                'Server Components execute exclusively on the server and send zero JS payload to the browser',
                'Client Components cannot use React hooks like useState or useEffect',
                'Server Components cannot fetch database data directly'
              ],
              correctOptionIndex: 1,
              explanation: 'RSC execute only on the server, producing UI structure without shipping bundle JavaScript to the client.'
            },
            {
              id: 'q2',
              questionText: 'Why should authentication session tokens be stored in HTTP-Only cookies rather than localStorage?',
              options: [
                'HTTP-Only cookies are faster to access via JavaScript',
                'HTTP-Only cookies cannot be read by client-side scripts, protecting against XSS attacks',
                'localStorage expires automatically after 24 hours',
                'HTTP-Only cookies are automatically encrypted by the browser'
              ],
              correctOptionIndex: 1,
              explanation: 'HTTP-Only flag prevents malicious XSS scripts from stealing user credentials or tokens.'
            },
            {
              id: 'q3',
              questionText: 'In MongoDB Mongoose, which method allows combining documents from related collections?',
              options: ['JOIN()', 'populate()', 'merge()', 'concat()'],
              correctOptionIndex: 1,
              explanation: 'populate() substitutes referenced ObjectId paths with documents from another collection.'
            },
            {
              id: 'q4',
              questionText: 'What is the purpose of multi-stage Docker builds in production deployments?',
              options: [
                'To run multiple web servers inside one container',
                'To separate build-time dependencies from the minimal runtime image, reducing image size',
                'To automatically restart crashed containers',
                'To bypass container security scanners'
              ],
              correctOptionIndex: 1,
              explanation: 'Multi-stage builds leave compiler tools behind, producing smaller, faster, more secure production images.'
            },
            {
              id: 'q5',
              questionText: 'Which HTTP method should be used for idempotent update requests where sending the same request twice produces the same result?',
              options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
              correctOptionIndex: 1,
              explanation: 'PUT replaces the target resource representation entirely and is specified to be idempotent.'
            }
          ]
        }
      ]
    },
    {
      courseId: 'data-science-sql-analytics',
      title: 'Applied Data Science & SQL Analytics',
      description: 'Transform raw enterprise data into actionable business intelligence using Python, Pandas, SQL queries, statistical modeling, and data visualization dashboards.',
      instructor: {
        name: 'Dr. Sarah Kim',
        title: 'Data Science Director & Economist',
        avatarUrl: '',
      },
      image: '/images/data_science.jpg',
      originalPrice: 1999,
      discountedPrice: 199,
      discountPercentage: 90,
      rating: 4.7,
      studentsCount: 2890,
      category: 'Data Science',
      difficulty: 'Foundational',
      durationMinutes: 300,
      lessonCount: 14,
      certificateEligible: true,
      isPublished: true,
      skills: ['Python', 'SQL', 'Pandas', 'Matplotlib / Seaborn', 'Statistical Modeling'],
      modules: [
        {
          id: 'mod1',
          title: 'Module 1: Data Analysis with Python & Pandas',
          description: 'Data manipulation, cleaning, filtering, and aggregation.',
          lessons: [
            { id: 'mod1-lesson1', title: '1.1 Introduction to Python Data Ecosystem', duration: '15 mins', contentType: 'video', contentText: 'Setting up Jupyter notebooks, NumPy arrays, and Pandas DataFrames.' },
            { id: 'mod1-lesson2', title: '1.2 Data Wrangling & Cleaning', duration: '25 mins', contentType: 'video', contentText: 'Handling missing values, data type casting, string methods, and duplicate removal.' },
            { id: 'mod1-lesson3', title: '1.3 Grouping, Aggregation & Pivot Tables', duration: '25 mins', contentType: 'video', contentText: 'Groupby mechanics, multi-indexing, and reshaping data.' },
            { id: 'mod1-lesson4', title: '1.4 Exploratory Data Analysis (EDA)', duration: '20 mins', contentType: 'text', contentText: 'Summary statistics, outlier detection, and correlation matrices.' },
          ],
        },
        {
          id: 'mod2',
          title: 'Module 2: Advanced SQL Analytics',
          description: 'Complex SQL queries, window functions, and analytical reporting.',
          lessons: [
            { id: 'mod2-lesson1', title: '2.1 Relational Database Design & Joins', duration: '20 mins', contentType: 'video', contentText: 'INNER, LEFT, RIGHT, FULL OUTER joins and primary/foreign keys.' },
            { id: 'mod2-lesson2', title: '2.2 Window Functions (RANK, DENSE_RANK, LEAD, LAG)', duration: '30 mins', contentType: 'video', contentText: 'Partitioning, order clauses, cumulative sums, and running averages.' },
            { id: 'mod2-lesson3', title: '2.3 Common Table Expressions (CTEs) & Subqueries', duration: '25 mins', contentType: 'video', contentText: 'Modular SQL writing with WITH clauses and recursive CTEs.' },
            { id: 'mod2-lesson4', title: '2.4 Database Performance Tuning & Indexing', duration: '20 mins', contentType: 'text', contentText: 'EXPLAIN query plans, B-Tree indexes, and query optimization.' },
          ],
        },
        {
          id: 'mod3',
          title: 'Module 3: Visualization & Business Intelligence',
          description: 'Creating interactive data stories and dashboards.',
          lessons: [
            { id: 'mod3-lesson1', title: '3.1 Visualizing Distributions & Relationships', duration: '20 mins', contentType: 'video', contentText: 'Histograms, box plots, scatter plots with Seaborn and Matplotlib.' },
            { id: 'mod3-lesson2', title: '3.2 Statistical Hypothesis Testing', duration: '25 mins', contentType: 'video', contentText: 'T-tests, Chi-square tests, p-values, and confidence intervals.' },
            { id: 'mod3-lesson3', title: '3.3 Executive Dashboard Design', duration: '25 mins', contentType: 'project', contentText: 'Building an interactive Streamlit analytics dashboard.' },
          ],
        },
      ],
      tests: [
        {
          id: 'test-1',
          title: 'Data Science & SQL Final Certification Test',
          durationMinutes: 30,
          passingScorePct: 70,
          totalMarks: 100,
          questions: [
            {
              id: 'q1',
              questionText: 'What is the key difference between RANK() and DENSE_RANK() in SQL window functions?',
              options: [
                'RANK() skips rank numbers after ties, whereas DENSE_RANK() does not skip rank numbers',
                'DENSE_RANK() can only be used on string columns',
                'RANK() orders values in descending order by default',
                'DENSE_RANK() requires a GROUP BY clause'
              ],
              correctOptionIndex: 0,
              explanation: 'If two rows tie for 1st place, RANK() gives the next row 3rd place; DENSE_RANK() gives it 2nd place.'
            },
            {
              id: 'q2',
              questionText: 'In Pandas, which method is recommended for filling missing NA/NaN values with a specified value or strategy?',
              options: ['dropna()', 'fillna()', 'replace()', 'clean_na()'],
              correctOptionIndex: 1,
              explanation: 'fillna() provides parameters to fill NA values with static values or forward/backward fill algorithms.'
            },
            {
              id: 'q3',
              questionText: 'What does a p-value less than 0.05 typically indicate in hypothesis testing?',
              options: [
                'Strong evidence to reject the null hypothesis in favor of the alternative hypothesis',
                'That the sample size was too small to draw conclusions',
                'That the alternative hypothesis is 100% false',
                'That no statistical test can be applied'
              ],
              correctOptionIndex: 0,
              explanation: 'A p-value below the standard significance threshold (α = 0.05) indicates statistically significant results.'
            },
            {
              id: 'q4',
              questionText: 'Which SQL clause is used to filter aggregated data generated by a GROUP BY clause?',
              options: ['WHERE', 'HAVING', 'FILTER', 'QUALIFY'],
              correctOptionIndex: 1,
              explanation: 'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY.'
            },
            {
              id: 'q5',
              questionText: 'What type of plot is best suited to display the distribution and quartile summary of a numerical variable across categories?',
              options: ['Line Chart', 'Box Plot (Box-and-Whisker)', 'Pie Chart', 'Scatter Plot'],
              correctOptionIndex: 1,
              explanation: 'Box plots display median, IQR, min/max, and outliers clearly across multiple categories.'
            }
          ]
        }
      ]
    },
    {
      courseId: 'cybersecurity-principles',
      title: 'Cybersecurity Principles & Practice',
      description: 'Learn modern network security, cryptography fundamentals, incident response protocols, threat analysis, and ethical hacking fundamentals to defend digital infrastructure.',
      instructor: {
        name: 'James Rodriguez',
        title: 'Chief Information Security Officer & Ethical Hacker',
        avatarUrl: '',
      },
      image: '/images/cyber_security.jpg',
      originalPrice: 1999,
      discountedPrice: 199,
      discountPercentage: 90,
      rating: 4.6,
      studentsCount: 1950,
      category: 'Cybersecurity',
      difficulty: 'Foundational',
      durationMinutes: 270,
      lessonCount: 12,
      certificateEligible: true,
      isPublished: true,
      skills: ['Network Security', 'Cryptography', 'Threat Analysis', 'Incident Response', 'Ethical Hacking'],
      modules: [
        {
          id: 'mod1',
          title: 'Module 1: Information Security Core Principles',
          description: 'CIA Triad, threat modeling, and access control models.',
          lessons: [
            { id: 'mod1-lesson1', title: '1.1 The CIA Triad & Security Architecture', duration: '15 mins', contentType: 'video', contentText: 'Confidentiality, Integrity, Availability triad breakdown.' },
            { id: 'mod1-lesson2', title: '1.2 Authentication & Access Control (RBAC, ABAC)', duration: '20 mins', contentType: 'video', contentText: 'Role-based access control, attribute-based access control, and MFA mechanisms.' },
            { id: 'mod1-lesson3', title: '1.3 Threat Vectors & Attack Surface', duration: '25 mins', contentType: 'video', contentText: 'Phishing, social engineering, malware types (ransomware, trojans, rootkits).' },
            { id: 'mod1-lesson4', title: '1.4 Risk Management & Compliance Frameworks', duration: '20 mins', contentType: 'text', contentText: 'NIST CSF, ISO 27001, SOC 2, and risk assessment methodologies.' },
          ],
        },
        {
          id: 'mod2',
          title: 'Module 2: Network Security & Cryptography',
          description: 'TLS encryption, firewalls, VPNs, and public key infrastructure (PKI).',
          lessons: [
            { id: 'mod2-lesson1', title: '2.1 Symmetric vs Asymmetric Cryptography', duration: '25 mins', contentType: 'video', contentText: 'AES, RSA, ECC, hashing algorithms (SHA-256), and digital signatures.' },
            { id: 'mod2-lesson2', title: '2.2 TLS/SSL & HTTPS Protocol Handshake', duration: '25 mins', contentType: 'video', contentText: 'Certificate Authorities, key exchange (Diffie-Hellman), and secure socket establishment.' },
            { id: 'mod2-lesson3', title: '2.3 Firewalls, IDS/IPS & Network Segmentation', duration: '25 mins', contentType: 'video', contentText: 'Packet filtering, stateful inspection, intrusion detection systems, and zero trust.' },
            { id: 'mod2-lesson4', title: '2.4 Wireless & Cloud Security', duration: '20 mins', contentType: 'text', contentText: 'WPA3 standards, cloud IAM security policies, and VPC network controls.' },
          ],
        },
        {
          id: 'mod3',
          title: 'Module 3: Incident Response & Security Operations',
          description: 'SOC operations, threat hunting, and breach remediation.',
          lessons: [
            { id: 'mod3-lesson1', title: '3.1 Incident Response Lifecycle (NIST)', duration: '20 mins', contentType: 'video', contentText: 'Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned.' },
            { id: 'mod3-lesson2', title: '3.2 Log Analysis & SIEM Operations', duration: '25 mins', contentType: 'video', contentText: 'Correlating security logs with Splunk/Elastic SIEM systems.' },
            { id: 'mod3-lesson3', title: '3.3 Vulnerability Management & Patching', duration: '20 mins', contentType: 'project', contentText: 'Running vulnerability scans and prioritizing CVE remediation.' },
          ],
        },
      ],
      tests: [
        {
          id: 'test-1',
          title: 'Cybersecurity Principles Final Certification Assessment',
          durationMinutes: 30,
          passingScorePct: 70,
          totalMarks: 100,
          questions: [
            {
              id: 'q1',
              questionText: 'What three core tenets make up the foundational CIA Triad of information security?',
              options: [
                'Control, Identity, Authorization',
                'Confidentiality, Integrity, Availability',
                'Compliance, Inspection, Audit',
                'Crypto, Isolation, Authentication'
              ],
              correctOptionIndex: 1,
              explanation: 'Confidentiality (privacy), Integrity (accuracy), and Availability (accessibility) form the CIA triad.'
            },
            {
              id: 'q2',
              questionText: 'Which cryptographic mechanism uses a pair of keys (public and private key)?',
              options: ['Symmetric Encryption (AES)', 'Asymmetric Cryptography (RSA/ECC)', 'Hashing (SHA-256)', 'Salted Encoding'],
              correctOptionIndex: 1,
              explanation: 'Asymmetric cryptography utilizes public keys for encryption/verification and private keys for decryption/signing.'
            },
            {
              id: 'q3',
              questionText: 'What is the primary objective of a Zero Trust network architecture policy?',
              options: [
                'Trust all requests coming from internal corporate IPs',
                'Never trust, always verify every access request regardless of origin',
                'Disable all external internet traffic',
                'Encrypt only database backup files'
              ],
              correctOptionIndex: 1,
              explanation: 'Zero Trust assumes threats exist inside and outside networks, requiring continuous verification.'
            },
            {
              id: 'q4',
              questionText: 'Which phase comes immediately after Containment in the NIST Incident Response lifecycle?',
              options: ['Preparation', 'Eradication', 'Recovery', 'Lessons Learned'],
              correctOptionIndex: 1,
              explanation: 'The NIST lifecycle flows: Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery.'
            },
            {
              id: 'q5',
              questionText: 'What security attack involves injecting malicious script into web pages viewed by other users?',
              options: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Buffer Overflow', 'Man-in-the-Middle (MitM)'],
              correctOptionIndex: 1,
              explanation: 'XSS occurs when unvalidated input is rendered in browser context, executing arbitrary script.'
            }
          ]
        }
      ]
    }
  ];

export async function seedCoursesIfEmpty() {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(SEED_COURSES);
    }
  } catch (e) {
    console.warn('seedCoursesIfEmpty notice:', e);
  }
}
