import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, ShieldCheck, Leaf, IndianRupee, MessageSquare, FileText, Wrench, BadgeCheck,
  Sun, Home as HomeIcon, Building2, Factory, Users, Phone, MapPin, Clock,
  ArrowRight, CheckCircle2, ChevronDown, Sparkles, AlertTriangle,
} from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import Stars from '../components/ui/Stars.jsx'
import { listApprovedReviews } from '../lib/api.js'

const WA = 'https://wa.me/919875217664?text=Hi%20NAN%27S%20SOLAR%20POWER%2C%20I%20want%20a%20free%20solar%20quote'

function Eyebrow({ icon: Icon, children }) {
  return <span className="eyebrow"><Icon size={14} />{children}</span>
}
function SecHead({ eyebrow, icon, title, sub }) {
  return (
    <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-3.5 mb-10 md:mb-14">
      <Reveal><Eyebrow icon={icon}>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold">{title}</h2></Reveal>
      {sub && <Reveal delay={0.1}><p className="text-muted text-[1.06rem] max-w-[52ch]">{sub}</p></Reveal>}
    </div>
  )
}

export default function Home() {
  const [reviews, setReviews] = useState([])
  useEffect(() => { listApprovedReviews(3).then(setReviews) }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-28 -right-16 w-80 h-80 rounded-full bg-[#8fe3b3] blur-[70px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#8fd4f3] blur-[70px] opacity-50 pointer-events-none" />
        <div className="wrap relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center py-12 md:py-20">
          <div>
            <Reveal><span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm2 font-bold text-[0.82rem] text-fg-soft"><Zap size={16} className="text-amber" />Residential · Commercial · Industrial Solar</span></Reveal>
            <Reveal delay={0.05}><h1 className="text-[clamp(2.4rem,5.6vw,4.1rem)] font-extrabold mt-5">Power your life with<br /><span className="grad-text">clean solar energy</span></h1></Reveal>
            <Reveal delay={0.1}><p className="mt-4 font-display font-semibold text-[1.15rem] text-green-700">सही ऊर्जा, सही निवेश, उज्ज्वल भविष्य!</p></Reveal>
            <Reveal delay={0.13}><p className="mt-2.5 text-muted text-[1.1rem] max-w-[46ch]">NAN'S SOLAR POWER installs high-performance <b className="text-fg-soft">Adani Solar Modules</b> for homes and businesses across Bikaner, Rajasthan.</p></Reveal>
            <Reveal delay={0.16}>
              <div className="flex flex-wrap gap-3.5 mt-7">
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get a Free Quote<ArrowRight size={18} /></a>
                <a href="#products" className="btn btn-ghost">View Products</a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2.5 mt-6">
                <span className="chip"><BadgeCheck size={16} className="text-green" />Authorized Adani Dealer</span>
                <span className="chip"><ShieldCheck size={16} className="text-green" />IEC Certified Modules</span>
                <span className="chip"><Stars value={5} size={14} />4.9 Rating</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card rounded-[24px] p-6 shadow-lg2 relative">
              <div className="rounded-2xl grad-bg aspect-[16/10] grid place-items-center relative overflow-hidden">
                <span className="absolute top-3.5 left-3.5 text-[0.68rem] font-display font-bold tracking-[0.12em] uppercase text-white bg-black/20 px-2.5 py-1.5 rounded-full">Featured Module</span>
                <Sun size={72} className="text-white/90" />
              </div>
              <h3 className="text-[1.35rem] font-extrabold mt-4.5 mt-5">Adani Solar · 585 Wp</h3>
              <p className="text-muted font-semibold text-[0.92rem] mt-1">High Performance · Mono PERC · Made in India</p>
              <ul className="flex flex-col gap-2.5 mt-4.5 mt-4 text-fg-soft font-semibold text-[0.95rem]">
                <li className="flex items-center gap-2.5"><Zap size={18} className="text-green" />22.6% module efficiency</li>
                <li className="flex items-center gap-2.5"><ShieldCheck size={18} className="text-green" />IEC 61215 / 61730 certified</li>
                <li className="flex items-center gap-2.5"><Sun size={18} className="text-green" />Monocrystalline PERC technology</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SAVINGS STRIP */}
      <section className="pt-8 md:pt-10">
        <div className="wrap">
          <Reveal>
            <div className="grad-bg text-white rounded-[26px] px-6 md:px-12 py-8 md:py-11 flex flex-wrap items-center justify-between gap-7 shadow-lg2">
              <div className="max-w-[40ch]">
                <span className="font-display font-extrabold text-[clamp(2rem,4vw,2.8rem)] leading-none block"><span className="text-[clamp(3.4rem,7vw,5rem)] align-[-0.04em]">90%</span> off your bills</span>
                <p className="opacity-95 mt-2.5 font-medium">Go solar and cut your electricity bills drastically — plus full government subsidy & net-metering assistance, handled by our team.</p>
              </div>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn bg-white text-fg hover:text-green-700"><MapPin size={18} />Book a Free Site Visit</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-y">
        <div className="wrap">
          <SecHead eyebrow="How it works" icon={Sparkles} title="Your journey to solar in 4 steps" sub="Simple, transparent and fully handled by our team — from first call to lifetime service." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: 1, icon: MessageSquare, t: 'Free Enquiry', d: 'Contact us or submit a request — tell us about your home or business.' },
              { n: 2, icon: FileText, t: 'Site Survey & Quote', d: 'Free site visit, system sizing and a clear, transparent quotation.' },
              { n: 3, icon: Wrench, t: 'Installation', d: 'Expert installation of Adani solar modules by our certified team.' },
              { n: 4, icon: BadgeCheck, t: 'Subsidy & Service', d: 'We help with subsidy paperwork, net-metering and lifetime service.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className="card p-6 h-full relative hover:-translate-y-1 hover:shadow-md2 transition">
                  <div className="grid place-items-center h-12 w-12 rounded-[14px] bg-green-50 text-green-700 font-display font-extrabold text-xl">{s.n}</div>
                  <s.icon size={24} className="absolute top-6 right-6 text-border-strong" />
                  <h3 className="text-[1.14rem] font-bold mt-4.5 mt-4">{s.t}</h3>
                  <p className="text-muted text-[0.95rem] mt-2">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-y bg-bg-tint">
        <div className="wrap">
          <SecHead eyebrow="Why choose solar" icon={Leaf} title="Benefits of going solar with us" sub="High-performance Adani modules — the right energy, the right investment." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, t: 'High Efficiency', d: 'More power from every panel — up to 22.6% module efficiency.', c: 'green' },
              { icon: ShieldCheck, t: 'Durable & Reliable', d: 'Long-life performance with certified, Made-in-India Adani modules.', c: 'sky' },
              { icon: Leaf, t: 'Eco Friendly', d: 'Clean & green energy — reduce your carbon footprint every day.', c: 'green' },
              { icon: IndianRupee, t: 'Save on Bills', d: 'More savings every month — cut your electricity bills drastically.', c: 'amber' },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 0.05}>
                <Feature icon={b.icon} color={b.c} title={b.t}>{b.d}</Feature>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-y">
        <div className="wrap">
          <div className="bg-fg text-white rounded-[28px] grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 md:py-14 px-6">
            {[['500+', 'Solar Installations'], ['2 MW+', 'Capacity Installed'], ['100%', 'Genuine Adani Modules'], ['4.9★', 'Customer Rating']].map(([n, l], i) => (
              <Reveal key={l} delay={i * 0.05}>
                <div className="text-center">
                  <div className="font-display font-extrabold text-[clamp(2.4rem,4.4vw,3.4rem)] leading-none grad-text tabular-nums">{n}</div>
                  <div className="mt-2.5 text-[#AEC2B8] font-semibold text-[0.95rem]">{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="section-y bg-bg-tint">
        <div className="wrap">
          <SecHead eyebrow="Our products" icon={Zap} title="Adani Solar Module" sub="High Performance · Reliable · Made in India" />
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            <Reveal>
              <div className="grad-soft card rounded-[24px] p-8 relative">
                <span className="absolute -top-3.5 left-6 bg-surface border border-border rounded-full px-4 py-2 font-display font-bold text-[0.82rem] text-green-700 shadow-sm2 flex items-center gap-2"><BadgeCheck size={16} className="text-green" />Made in India</span>
                <div className="rounded-2xl grad-bg aspect-[4/3] grid place-items-center shadow-md2"><Sun size={88} className="text-white/90" /></div>
              </div>
            </Reveal>
            <div>
              <Reveal><h3 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold">Adani AS-6P-585 · 585 Wp</h3></Reveal>
              <Reveal delay={0.05}><p className="text-muted mt-3.5">Mono PERC high-efficiency module manufactured by Adani Solar (Mundra Solar Energy Ltd.), certified to IEC 61215 / IEC 61730 — built for long life and strong generation in Indian conditions.</p></Reveal>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[['585 Wp', 'Max Power'], ['22.6%', 'Efficiency'], ['52.3 V', 'Voc'], ['14.20 A', 'Isc']].map(([n, l]) => (
                    <div key={l} className="card rounded-xl p-4 text-center">
                      <div className="font-display font-extrabold text-xl tabular-nums">{n}</div>
                      <div className="text-muted text-[0.76rem] font-semibold mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="card rounded-xl2 overflow-hidden mt-5">
                  <div className="flex items-center gap-2.5 px-4.5 px-5 py-3.5 bg-surface-2 font-display font-bold text-[0.92rem]"><FileText size={18} className="text-green" />Technical Specifications</div>
                  <dl className="px-5 pb-3">
                    {[['Maximum Power (Pmax)', '585 Wp'], ['Voltage at Pmax (Vmp)', '43.5 V'], ['Current at Pmax (Imp)', '13.45 A'], ['Open Circuit Voltage (Voc)', '52.3 V'], ['Short Circuit Current (Isc)', '14.20 A'], ['Module Efficiency', '22.6%'], ['Standards', 'IEC 61215 / 61730']].map(([k, v], i, a) => (
                      <div key={k} className={`flex justify-between gap-4 py-2.5 text-[0.92rem] ${i < a.length - 1 ? 'border-b border-dashed border-border' : ''}`}>
                        <dt className="text-muted">{k}</dt><dd className="font-bold tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>

          {/* manufacturer + safety */}
          <div className="grid md:grid-cols-[1.25fr_1fr] gap-4.5 gap-5 mt-7">
            <Reveal>
              <div className="card p-6">
                <div className="flex items-center gap-2.5 font-display font-bold"><BadgeCheck size={20} className="text-green" />Manufactured by</div>
                <p className="text-muted text-[0.9rem] mt-2.5 leading-relaxed"><b className="text-fg">Adani Solar</b> — Mundra Solar Energy Ltd.<br />Sunview No. 8/9A, Nr. Mundra, Kachchh, Gujarat – 370&nbsp;421, India.<br />Model <b className="text-fg">AS-6P-585</b> · Made in India · Certified to IEC&nbsp;61215 / IEC&nbsp;61730 · <span className="link">www.adanigreen.com</span></p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card p-6 bg-amber-50 border-[#F3D08A]">
                <div className="flex items-center gap-2.5 font-display font-bold"><AlertTriangle size={20} className="text-[#C97E06]" />Electrical safety</div>
                <p className="text-muted text-[0.9rem] mt-2.5 leading-relaxed">When exposed to sunlight this module generates DC voltage. For use by qualified personnel only — read the installation manual before installing. Risk of electric shock: do not connect or disconnect under load. For field connection, use approved connectors only.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section-y">
        <div className="wrap">
          <SecHead eyebrow="Who we are" icon={Users} title="Why customers choose us" sub="Honest advice, genuine products and service that lasts." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: HomeIcon, t: 'Local & Trusted', d: 'A dependable solar company based in Bikaner, serving our own community.', c: 'green' },
              { icon: BadgeCheck, t: 'Genuine Adani', d: 'Authorized dealer of Adani Solar Modules — 100% genuine, Made in India.', c: 'sky' },
              { icon: Wrench, t: 'End-to-End', d: 'Survey, installation, subsidy help and service — all handled by one team.', c: 'amber' },
              { icon: ShieldCheck, t: 'After-Sales Support', d: 'Reliable installation plus ongoing maintenance & performance checks.', c: 'green' },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 0.05}><Feature icon={b.icon} color={b.c} title={b.t}>{b.d}</Feature></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-y bg-bg-tint">
        <div className="wrap">
          <SecHead eyebrow="Feedback" icon={Users} title="What our customers say" sub="Real homes & businesses, real savings across Bikaner." />
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05}>
                <div className="card p-7 h-full flex flex-col gap-4">
                  <Stars value={r.rating} size={18} />
                  <blockquote className="text-fg-soft text-[1.02rem] leading-relaxed flex-1">“{r.text}”</blockquote>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="grid h-11 w-11 place-items-center rounded-full grad-bg text-white font-display font-bold">{r.author_name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                    <div><div className="font-display font-bold text-[0.98rem]">{r.author_name}</div><div className="text-muted text-[0.84rem] font-semibold">{r.city} · {r.system_kw}</div></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-9"><Link to="/reviews" className="btn btn-ghost">Read all reviews<ArrowRight size={18} /></Link></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <div className="wrap">
          <SecHead eyebrow="Help" icon={MessageSquare} title="Frequently asked questions" />
          <div className="max-w-[820px] mx-auto flex flex-col gap-3.5">
            {[
              ['Which solar panels do you install?', 'We install genuine Adani Solar Modules (High Performance, Made in India) — including high-efficiency 585 Wp Mono PERC modules, certified to IEC 61215 / 61730.'],
              ['Do you help with the government subsidy?', 'Yes — we handle the complete subsidy paperwork and net-metering process for eligible residential rooftop systems.'],
              ['Do you serve homes, shops and factories?', 'We design and install residential, commercial and industrial solar systems — rooftop and ground-mount — with complete installation and support.'],
              ['How do I get a quote?', 'Call or WhatsApp us at 98752 17664, or submit a free enquiry. We’ll arrange a free site visit, size your system and share a clear quotation.'],
            ].map(([q, a], i) => (
              <Reveal key={i}>
                <details className="card overflow-hidden group" open={i === 0}>
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-display font-bold text-[1.05rem] list-none">{q}<ChevronDown size={22} className="text-green transition group-open:rotate-180 shrink-0" /></summary>
                  <div className="px-6 pb-5 text-muted">{a}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-y">
        <div className="wrap">
          <div className="relative overflow-hidden text-center bg-fg text-white rounded-[28px] px-6 md:px-10 py-14 md:py-[72px]">
            <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_120%,rgba(21,162,74,.4),transparent_60%),radial-gradient(50%_100%_at_80%_-10%,rgba(14,165,233,.3),transparent_55%)]" />
            <div className="relative flex flex-col items-center gap-5">
              <Eyebrow icon={Sun}>Get started</Eyebrow>
              <h2 className="text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold text-white max-w-[18ch]">Ready to power your life with the sun?</h2>
              <p className="text-[#C2D4CB] max-w-[52ch] text-[1.05rem]">Book a free site visit today. We’ll handle sizing, installation, subsidy and lifetime service — you just enjoy the savings.</p>
              <div className="flex flex-wrap gap-3.5 justify-center mt-1.5">
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><MessageSquare size={18} />Chat on WhatsApp</a>
                <Link to="/support" className="btn btn-sky">Register / Get Support<ArrowRight size={18} /></Link>
              </div>
              <span className="font-display font-bold text-white text-[1.05rem] inline-flex items-center gap-2.5 mt-1"><Phone size={18} className="text-[#7ee6a8]" />Call / WhatsApp: 98752 17664</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Feature({ icon: Icon, color = 'green', title, children }) {
  const ic = color === 'sky' ? 'bg-sky-50 text-sky-600' : color === 'amber' ? 'bg-amber-50 text-[#C97E06]' : 'bg-green-50 text-green-600'
  return (
    <div className="card p-7 h-full hover:-translate-y-1 hover:shadow-md2 transition">
      <div className={`grid place-items-center h-[54px] w-[54px] rounded-[15px] ${ic}`}><Icon size={26} /></div>
      <h3 className="text-[1.1rem] font-bold mt-4.5 mt-4">{title}</h3>
      <p className="text-muted text-[0.94rem] mt-2">{children}</p>
    </div>
  )
}
