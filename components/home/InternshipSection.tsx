import Link from 'next/link';

const INTERNSHIPS = [
  { title: 'AI & Prompt Engineering Intern', track: 'Artificial Intelligence', level: 'Beginner', duration: '8 weeks', skills: 'Prompt design · AI tools · Responsible AI', initials: 'AI', tone: 'bg-[#e4d9cf]' },
  { title: 'Data Analyst Intern', track: 'Data & Analytics', level: 'Beginner', duration: '10 weeks', skills: 'Excel · SQL · Dashboards', initials: 'DA', tone: 'bg-[#d9dcda]' },
  { title: 'Full-Stack Developer Intern', track: 'Software Development', level: 'Intermediate', duration: '12 weeks', skills: 'React · APIs · Databases', initials: 'FS', tone: 'bg-[#e8e0d8]' },
  { title: 'Cybersecurity Analyst Intern', track: 'Cybersecurity', level: 'Beginner', duration: '8 weeks', skills: 'Networks · Threat analysis · Linux', initials: 'CS', tone: 'bg-[#d5d4d1]' },
  { title: 'Cloud & DevOps Intern', track: 'Cloud Computing', level: 'Intermediate', duration: '10 weeks', skills: 'Cloud · CI/CD · Containers', initials: 'CD', tone: 'bg-[#e1dbd5]' },
];

export function InternshipSection() {
  return (
    <section className="bg-white py-14 lg:py-20 border-t border-[#c8c8c8]">
      <div className="max-w-[1584px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#5f4938] mb-3">CAREER EXPERIENCE</p>
            <h2 className="text-3xl lg:text-[2.5rem] leading-tight font-semibold text-[#161616] tracking-[-0.02em]">Start with experience, not just a certificate</h2>
            <p className="mt-3 max-w-2xl text-[#525252] leading-6">Choose an internship track, complete guided projects, and build work you can confidently show to employers.</p>
          </div>
          <Link href="/internships" className="inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-[#80664f] hover:text-[#5f4938] hover:underline">View all internships <span aria-hidden="true">→</span></Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {INTERNSHIPS.map((internship) => (
            <Link key={internship.title} href="/internships" className="group flex flex-col bg-white border border-[#c8c8c8] hover:border-[#80664f] hover:shadow-lg transition-all duration-200 min-h-[350px]">
              <div className={`${internship.tone} h-32 p-4 flex items-start justify-between`}>
                <span className="text-xs font-semibold text-[#393939]">Skyrellac</span>
                <span className="w-11 h-11 bg-white/75 border border-[#8d8d8d] flex items-center justify-center text-sm font-semibold text-[#5f4938]">{internship.initials}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-[#525252] mb-2">{internship.track}</p>
                <h3 className="text-lg leading-6 font-semibold text-[#161616] group-hover:text-[#80664f] transition-colors">{internship.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#525252]">Skills you&apos;ll practise: {internship.skills}</p>
                <div className="mt-auto pt-5">
                  <p className="text-xs text-[#525252]">{internship.level} · {internship.duration}</p>
                  <div className="mt-4 pt-4 border-t border-[#e0e0e0] flex items-center justify-between text-sm font-semibold text-[#80664f]">Explore program <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-[#efebe7] border-l-4 border-[#80664f] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-[#393939]"><span className="font-semibold">Designed for career starters.</span> Every program includes practical tasks and a clear record of your progress.</p>
          <Link href="/internships" className="text-sm font-semibold text-[#80664f] hover:underline shrink-0">How internships work →</Link>
        </div>
      </div>
    </section>
  );
}
