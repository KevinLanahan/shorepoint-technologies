import { PanelsTopLeft, Braces, Smartphone, Sparkles, Waypoints, type LucideIcon } from "lucide-react";
interface Service { title: string; description: string; icon: LucideIcon }
const services: Service[] = [
  { title: "Website Design & Modernization", description: "New business websites and redesigns of outdated sites, with updated branding and layouts that work on phones, tablets, and desktops.", icon: PanelsTopLeft },
  { title: "Custom Software Development", description: "Manage jobs, customers, and daily operations in one place, with software built around your workflow.", icon: Braces },
  { title: "Mobile App Development", description: "Make it easier for customers to order, book appointments, or use your services from their phones.", icon: Smartphone },
  { title: "AI & Automation", description: "Automate follow-ups and data entry, and use AI assistants to answer common customer questions.", icon: Sparkles },
  { title: "Systems Integration", description: "Connect the tools you already use so orders, customer details, and payments stay in sync.", icon: Waypoints },
];
export function Services() { return <section className="section container" id="services" aria-labelledby="services-title"><div className="section-heading"><div><h2 id="services-title">Our services</h2></div><p>Websites, applications, and business tools<br/>for small and medium-sized businesses.</p></div><div className="services-grid">{services.map(({title,description,icon:Icon}, index) => <article className={`service-card${index === 0 ? " service-card-featured" : ""}`} key={title}><div className="service-top"><Icon size={25} strokeWidth={1.5}/></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>; }
