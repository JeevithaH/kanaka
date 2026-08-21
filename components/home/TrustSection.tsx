import Link from 'next/link';
import Image from 'next/image';

const audiences = [
  {
    title: 'Adult learners',
    description: 'Build practical skills for a new role, a promotion, or a career change.',
    image: '/images/ux.jpg',
  },
  {
    title: 'Students and educators',
    description: 'Bring job-ready technology learning into the classroom and post-secondary programs.',
    image: '/images/ai.jpeg',
  },
  {
    title: 'Teams and organizations',
    description: 'Help people gain the skills your organization needs next to stay ahead.',
    image: '/images/data_science.jpg',
  },
];

export function TrustSection() {
  return (
    <section className="bg-white border-b border-[#e0e0e0] py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          <h2 className="text-[#1f1f1f] font-bold text-3xl leading-tight">
            Learning designed for where you want to go next
          </h2>
          <p className="lg:col-span-2 text-[#595959] text-base leading-relaxed max-w-2xl">
            Start with the foundations or deepen your expertise. Every learning experience on Skyrellac is built in collaboration with leading instructors to help you make progress that matters.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-[#e0e0e0]">
          {audiences.map((aud) => (
            <article key={aud.title} className="group flex flex-col justify-between h-full bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-[#e0e0e0]">
              {/* Image Block */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f5]">
                <Image
                  src={aud.image}
                  alt={aud.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>

              {/* Text Block */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1f1f1f] group-hover:text-[#80664f] transition-colors mb-2">
                    {aud.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#595959]">{aud.description}</p>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/courses" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#80664f] hover:underline"
                  >
                    Learn more
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.3 3.7 13.1 7.5H1v1h12.1l-3.8 3.8.7.7L15 8l-5-5z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
