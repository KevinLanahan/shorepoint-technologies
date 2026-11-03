import { PanelsTopLeft, Braces, Smartphone, Sparkles, Waypoints, Check, MessageSquare, type LucideIcon } from "lucide-react";
interface Service { title: string; description: string; icon: LucideIcon; category: string; tags: string[] }
const services: Service[] = [
  { title: "Website Design & Modernization", description: "New business websites and redesigns of outdated sites, with updated branding and layouts that work on phones, tablets, and desktops.", icon: PanelsTopLeft, category: "WEB", tags: ["Business websites", "Redesigns", "Responsive layouts"] },
  { title: "Custom Software Development", description: "Manage jobs, customers, and daily operations in one place, with software built around your workflow.", icon: Braces, category: "SOFTWARE", tags: ["Internal tools", "Customer management", "Daily operations"] },
  { title: "Mobile App Development", description: "Make it easier for customers to order, book appointments, or use your services from their phones.", icon: Smartphone, category: "MOBILE", tags: ["Mobile ordering", "Appointments", "Customer applications"] },
  { title: "AI & Automation", description: "Automate follow-ups and data entry, and use AI assistants to answer common customer questions.", icon: Sparkles, category: "AUTOMATION", tags: ["Follow-ups", "Data entry", "AI assistants"] },
  { title: "Systems Integration", description: "Connect the tools you already use so orders, customer details, and payments stay in sync.", icon: Waypoints, category: "INTEGRATION", tags: ["Connected tools", "Orders & payments", "Customer data"] },
];
export function Services() {
  return <section className="section" id="services" aria-labelledby="services-title"><div className="container services-layout">
    <div className="services-intro"><p className="eyebrow">Capabilities</p><h2 id="services-title">Full-stack solutions for growing businesses.</h2><p>Websites, applications, and business tools for small and medium-sized businesses. Built around your processes and the way you work.</p><div className="studio-assurances"><div><Check size={21} /><span>Engineering-led design and development</span></div><div><MessageSquare size={21} /><span>Direct communication with your developer</span></div></div></div>
    <div className="services-grid">{services.map(({ title, description, icon: Icon, category, tags }, index) => <article className="service-card" key={title}><div className="service-top"><span className="icon-tile"><Icon size={26} strokeWidth={1.6} /></span><span>{`0${index + 1} // ${category}`}</span></div><h3>{title}</h3><p>{description}</p><div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div>
  </div></section>;
}
