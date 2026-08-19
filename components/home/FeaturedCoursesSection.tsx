import React from 'react';
import Link from 'next/link';

export function FeaturedCoursesSection() {
  return (
    <>
      {/* Stories Section */}
      <section className="bg-[#f4f4f4] py-12 lg:py-20">
        <div className="max-w-[1584px] mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-[#161616] font-semibold text-[1.75rem] mb-2">Real stories. Real impact</h2>
            <p className="text-[#525252] text-base">See how these learners and educators were able to advance their careers with AI and tech skills.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#e0e0e0]">
              <div className="aspect-[16/9] bg-[#e0e0e0] w-full mb-6"></div>
              <h3 className="text-[#161616] font-semibold text-lg mb-2">Learner Success Story</h3>
              <p className="text-[#525252] text-sm">"Skyrellac helped me transition into a tech career by providing hands-on experience and industry-recognized credentials."</p>
            </div>
            <div className="bg-white p-8 border border-[#e0e0e0]">
              <div className="aspect-[16/9] bg-[#e0e0e0] w-full mb-6"></div>
              <h3 className="text-[#161616] font-semibold text-lg mb-2">Educator Success Story</h3>
              <p className="text-[#525252] text-sm">"The platform's resources have been invaluable in preparing my students for the modern workforce."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-white py-12 lg:py-20 border-b border-[#e0e0e0]">
        <div className="max-w-[1584px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <h2 className="text-[#161616] font-semibold text-[1.75rem]">Join free upcoming learning events</h2>
            <Link href="/events" className="text-[#0f62fe] text-base hover:underline inline-flex items-center gap-2">
              View all events
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Make agentic AI work for you', date: 'August 18, 2026', time: '12:00 - 13:00 PM ET' },
              { title: 'Kickstart your Data and AI journeys', date: 'August 19, 2026', time: '11:00 - 12:00 PM ET' },
              { title: 'AI racing league – Build with AI', date: 'September 28, 2026', time: '3:00 PM - 4:00 PM GMT' }
            ].map((event, idx) => (
              <div key={idx} className="bg-white border border-[#e0e0e0] p-6 hover:shadow-sm transition-shadow flex flex-col h-full">
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#f4f4f4] text-[#525252] text-xs px-2 py-1">Adult learners</span>
                </div>
                <h3 className="text-[#161616] font-semibold text-lg mb-6 flex-grow">{event.title}</h3>
                <div className="text-sm text-[#525252] space-y-1">
                  <p><span className="font-semibold text-[#161616]">Type:</span> Virtual</p>
                  <p><span className="font-semibold text-[#161616]">Date:</span> {event.date}</p>
                  <p><span className="font-semibold text-[#161616]">Time:</span> {event.time}</p>
                  <p><span className="font-semibold text-[#161616]">Language:</span> English</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-white py-12 lg:py-20 border-b border-[#e0e0e0]">
        <div className="max-w-[1584px] mx-auto px-4">
          <h2 className="text-[#161616] font-semibold text-[1.75rem] mb-12">Building a new global workforce</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Skyrellac Launches Global AI Builders Challenge for University Students' },
              { title: 'Skyrellac and Mission 44 Join Forces to Fast-Track AI Skills' },
              { title: 'Skyrellac Commits to Skill 30 Million People Globally by 2030' }
            ].map((news, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col">
                <div className="aspect-square bg-[#e0e0e0] w-full mb-4"></div>
                <p className="text-[#525252] text-xs mb-1 font-semibold uppercase tracking-wider">Newsroom</p>
                <h3 className="text-[#161616] text-base group-hover:text-[#0f62fe] group-hover:underline">{news.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
