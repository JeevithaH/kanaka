import Link from 'next/link';

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  href: string;
  action: string;
  featured?: boolean;
  note?: string;
};

const PLANS: Plan[] = [
  {
    name: 'Single course',
    price: '₹1,999',
    period: 'per course',
    description: 'A focused learning experience for one skill you want to build next.',
    features: ['Full access to one selected course', 'Training materials and learning activities', 'Learn at your own pace', 'Course completion record'],
    href: '/courses',
    action: 'Explore courses',
  },
  {
    name: 'Premium',
    price: '₹4,000',
    period: 'for 2 months',
    description: 'A guided career-building plan for learners who want more support and direction.',
    features: ['Two months of premium access', 'Free mentorship sessions', 'Free training resources', 'Portfolio management guidance', 'Priority support and career direction'],
    href: '/register',
    action: 'Choose Premium',
    featured: true,
    note: 'Best for learners building a stronger career portfolio.',
  },
  {
    name: 'Internship',
    price: 'Free',
    period: 'to join',
    description: 'Practise real skills through a guided, project-based internship program.',
    features: ['Free internship enrollment', 'Practical task experience', 'Program guidance and progress tracking', 'Certificate and task evaluation: ₹999'],
    href: '/internships',
    action: 'Explore internships',
    note: 'The ₹999 fee applies only to certificate issuance and task evaluation.',
  },
  {
    name: 'Course + internship',
    price: '₹2,999',
    period: 'combined package',
    description: 'Learn the foundations in a course, then apply them through hands-on internship work.',
    features: ['One selected course', 'Free internship enrollment', 'Practical task experience', 'A career-ready learning pathway'],
    href: '/courses',
    action: 'Build your pathway',
  },
];

function CheckMark() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-[#80664f]"><path d="m3 8.2 3 3L13 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ed]">
      <section className="bg-[#312a25] text-white border-b border-[#4d433c]">
        <div className="max-w-[1584px] mx-auto px-4 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1fr_.6fr] gap-10 items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#d9c8bb]">SIMPLE, CAREER-FOCUSED PRICING</p>
            <h1 className="mt-5 text-4xl lg:text-6xl leading-[1] tracking-[-0.04em] font-semibold">Choose the support that fits your next step.</h1>
          </div>
          <p className="text-[#ddd6d0] leading-7 max-w-lg">Start with one course, build a complete course-and-internship pathway, or choose Premium for mentorship and portfolio guidance.</p>
        </div>
      </section>

      <section className="max-w-[1584px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {PLANS.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col border bg-white ${plan.featured ? 'border-2 border-[#80664f] shadow-[0_16px_40px_rgba(49,42,37,0.14)]' : 'border-[#c8c8c8]'}`}>
              {plan.featured && <span className="absolute top-0 right-0 bg-[#80664f] text-white text-[11px] font-semibold tracking-wide px-3 py-2">MOST COMPLETE</span>}
              <div className="p-6 border-b border-[#e0e0e0]">
                <h2 className="text-xl font-semibold text-[#161616]">{plan.name}</h2>
                <p className="mt-3 min-h-[68px] text-sm leading-6 text-[#525252]">{plan.description}</p>
                <div className="mt-7 flex items-baseline gap-2"><span className="text-4xl font-semibold tracking-[-0.03em] text-[#161616]">{plan.price}</span><span className="text-sm text-[#525252]">{plan.period}</span></div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-3 text-sm leading-5 text-[#393939]">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-2"><CheckMark />{feature}</li>)}
                </ul>
                {plan.note && <p className="mt-6 pt-4 border-t border-[#e0e0e0] text-xs leading-5 text-[#6f6f6f]">{plan.note}</p>}
                <Link href={plan.href} className={`mt-auto pt-7 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${plan.featured ? 'bg-[#80664f] text-white hover:bg-[#5f4938]' : 'border border-[#80664f] text-[#80664f] hover:bg-[#80664f] hover:text-white'}`}>{plan.action}<span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 border-l-4 border-[#80664f] bg-white px-6 py-5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <p className="text-sm leading-6 text-[#393939]"><span className="font-semibold">Clear pricing, no surprises.</span> Internship enrollment is free. ₹999 applies only when you choose certificate issuance and task evaluation.</p>
          <Link href="/internships" className="shrink-0 text-sm font-semibold text-[#80664f] hover:underline">View internship details →</Link>
        </div>
      </section>
    </main>
  );
}
