'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type TabType = 'Trending' | 'AI' | 'Cybersecurity' | 'Data' | 'Cloud' | 'Industry';

const TABS: TabType[] = ['Trending', 'AI', 'Cybersecurity', 'Data', 'Cloud', 'Industry'];

const TAB_CONTENT: Record<TabType, { bg: string; desc: string; courses: string[]; linkText: string; topic: string }> = {
  Trending: {
    bg: '#e8daff',
    desc: 'Enroll in courses and learning pathways based on in-demand jobs and skills',
    courses: ['AI Fundamentals', 'Web Development Essentials', 'Data Analytics Basics', 'Cybersecurity Principles'],
    linkText: 'See all courses',
    topic: 'trending'
  },
  AI: {
    bg: '#d0e2ff',
    desc: 'Discover learning experiences that can give you a head start in areas like generative AI, machine learning, and more',
    courses: ['AI Fundamentals', 'Machine Learning with Python', 'Responsible AI', 'Deep Learning'],
    linkText: 'See all AI courses',
    topic: 'ai'
  },
  Cybersecurity: {
    bg: '#a7f0ba',
    desc: 'Gain core skills for threat intelligence, including network security, incident response, and cybersecurity tools',
    courses: ['Cybersecurity Principles', 'Network Security', 'Threat Analysis', 'Security Operations'],
    linkText: 'See all Cybersecurity courses',
    topic: 'security'
  },
  Data: {
    bg: '#ffd6e8',
    desc: 'Learn skills and apply analytic tools to analyze data, predict outcomes, and visualize results professionally',
    courses: ['Data Science Essentials', 'SQL Analytics', 'Data Visualization', 'Statistical Modeling'],
    linkText: 'See all data courses',
    topic: 'data'
  },
  Cloud: {
    bg: '#bae6ff',
    desc: 'Learn cloud computing fundamentals and discover how organizations use it',
    courses: ['Cloud Computing Basics', 'DevOps Fundamentals', 'Kubernetes', 'Infrastructure as Code'],
    linkText: 'See all cloud courses',
    topic: 'cloud'
  },
  Industry: {
    bg: '#f8e5a0',
    desc: 'Learn the tools that help global brands elevate their experiences',
    courses: ['Digital Marketing', 'Healthcare IT', 'Financial Tech', 'Supply Chain Management'],
    linkText: 'See courses by industry',
    topic: 'industry'
  }
};

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabType>('Trending');

  const content = TAB_CONTENT[activeTab];

  return (
    <section className="bg-white py-12 lg:py-20 border-b border-[#e0e0e0]">
      <div className="max-w-[1584px] mx-auto px-4">
        <h2 className="text-[#161616] font-semibold text-2xl mb-8">
          Explore learning aligned to real-world careers
        </h2>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#e0e0e0] mb-8 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-[#161616] border-[#0f62fe]'
                  : 'text-[#525252] border-transparent hover:text-[#161616]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div 
          className="p-8 lg:p-12 min-h-[300px] flex flex-col lg:flex-row gap-12 transition-colors duration-300"
          style={{ backgroundColor: content.bg }}
        >
          <div className="lg:w-1/2 flex flex-col items-start justify-center">
            <h3 className="text-[#161616] text-xl font-medium mb-6">
              {content.desc}
            </h3>
            <Link 
              href={`/courses?topic=${content.topic}`}
              className="text-[#161616] inline-flex items-center gap-2 text-sm border border-[#161616] px-4 py-3 hover:bg-[#161616] hover:text-white transition-colors"
            >
              {content.linkText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
          </div>
          
          <div className="lg:w-1/2 flex flex-col justify-center">
            <ul className="w-full">
              {content.courses.map((course, idx) => (
                <li key={idx} className="border-b border-black/10 last:border-0">
                  <Link 
                    href="/courses" 
                    className="flex justify-between items-center py-4 text-[#161616] text-sm hover:text-[#0f62fe] group"
                  >
                    <span>{course}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
