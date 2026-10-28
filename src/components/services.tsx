import { ArrowUpRight, Braces, Smartphone, Sparkles, Waypoints, type LucideIcon } from "lucide-react";
interface Service { title: string; description: string; icon: LucideIcon; detail: string }
const services: Service[] = [
  { title: "Custom Software Development", description: "Internal dashboards, management systems, and tailored business applications.", icon: Braces, detail: "BUILT FOR YOUR OPERATIONS" },
  { title: "Mobile App Development", description: "iOS and cross-platform applications designed around real business needs.", icon: Smartphone, detail: "YOUR BUSINESS, ON THE GO" },
  { title: "AI & Automation", description: "AI assistants, workflow automation, and intelligent business integrations.", icon: Sparkles, detail: "LESS REPETITION. MORE POSSIBILITY." },
  { title: "Systems Integration", description: "Connecting APIs, databases, payment platforms, and existing business tools.", icon: Waypoints, detail: "EVERYTHING WORKING TOGETHER" },
];
export function Services() { return <section className="section container" id="services" aria-labelledby="services-title"><div className="section-heading"><div><p className="eyebrow">01 / WHAT WE DO</p><h2 id="services-title">The right technology.<br/><span>A real difference.</span></h2></div><p>From the first idea to the systems you rely on.<br/>Thoughtfully designed. Carefully engineered.</p></div><div className="services-grid">{services.map(({title,description,icon:Icon,detail}, index) => <article className="service-card" key={title}><div className="service-top"><Icon size={25} strokeWidth={1.5}/><span>0{index+1}</span></div><h3>{title}</h3><p>{description}</p><div className="service-detail"><span>{detail}</span><ArrowUpRight size={16}/></div></article>)}</div></section>; }
