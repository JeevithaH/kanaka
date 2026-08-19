import { connectToDatabase } from './mongodb';
import { Internship } from '@/models/Internship';

export async function seedInternshipsIfEmpty() {
  await connectToDatabase();
  const count = await Internship.countDocuments();
  if (count === 0) {
    const seedData = [
      {
        internshipId: 'ai-ml-engineering-intern',
        title: 'AI & Machine Learning Engineering Intern',
        description:
          'Work alongside senior AI research scientists to preprocess domain datasets, evaluate Transformer language models, and assist in model finetuning.',
        organization: 'Skyrellac Innovation Labs',
        mode: 'Remote',
        location: 'Global / Remote',
        durationWeeks: 8,
        type: 'Project-based',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'SQL'],
        validationFee: 499,
        certificateEligible: true,
        isPublished: true,
        tasks: [
          {
            taskId: 'ai-task-1',
            title: 'Dataset Preprocessing & Exploratory Data Analysis',
            description: 'Clean raw text telemetry, normalize feature matrices, and author an EDA Jupyter summary report.',
            instructions: 'Submit a GitHub repository URL or clean code snippet demonstrating data normalization.',
            deadlineDays: 7,
            maxScore: 100,
          },
          {
            taskId: 'ai-task-2',
            title: 'Transformer Architecture Benchmark Evaluation',
            description: 'Evaluate loss and accuracy benchmarks across 3 pretrained huggingface model checkpoints.',
            instructions: 'Provide evaluation metric tables and loss curves in your submission.',
            deadlineDays: 14,
            maxScore: 100,
          },
          {
            taskId: 'ai-task-3',
            title: 'Final Model Deployment & Capstone Presentation',
            description: 'Package the fine-tuned model into an interactive FastAPI demo container.',
            instructions: 'Submit the live deployment URL or container deployment instructions.',
            deadlineDays: 21,
            maxScore: 100,
          },
        ],
      },
      {
        internshipId: 'full-stack-developer-intern',
        title: 'Full-Stack Web Developer Intern',
        description:
          'Develop frontend UI components and RESTful microservices for high-traffic enterprise applications using React, Next.js, and modern TypeScript.',
        organization: 'Global Tech Solutions',
        mode: 'Remote',
        location: 'Global / Remote',
        durationWeeks: 12,
        type: 'Full-time',
        requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
        validationFee: 499,
        certificateEligible: true,
        isPublished: true,
        tasks: [
          {
            taskId: 'web-task-1',
            title: 'Reusable Glassmorphic UI Component Library',
            description: 'Build 5 production-ready accessible UI components matching brand design tokens.',
            instructions: 'Submit GitHub link to component storybook or code repository.',
            deadlineDays: 7,
            maxScore: 100,
          },
          {
            taskId: 'web-task-2',
            title: 'RESTful API & Mongoose Schema Integration',
            description: 'Design database models and API routes with Zod schema validation and error middleware.',
            instructions: 'Provide endpoint documentation and Postman collection or code repository link.',
            deadlineDays: 14,
            maxScore: 100,
          },
          {
            taskId: 'web-task-3',
            title: 'Production Build Optimization & Deployment',
            description: 'Configure Next.js SSR middleware, image optimization, and Vercel deployment pipeline.',
            instructions: 'Submit live application production URL for review.',
            deadlineDays: 21,
            maxScore: 100,
          },
        ],
      },
    ];

    await Internship.insertMany(seedData);
    console.log('Seeded 2 initial internship programs into MongoDB.');
  }
}
