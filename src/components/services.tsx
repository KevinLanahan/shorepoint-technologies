import { ArrowUpRight, PanelsTopLeft, Braces, Smartphone, Sparkles, Waypoints, type LucideIcon } from "lucide-react";
interface Service { title: string; description: string; icon: LucideIcon }
const services: Service[] = [
  { title: "Custom Software Development", description: "Manage jobs, customers, and daily operations in one place, with software built around your workflow.", icon: Braces },
  { title: "Mobile App Development", description: "Make it easier for customers to order, book appointments, or use your services from their phones.", icon: Smartphone },
  { title: "Website Design & Modernization", description: "New business websites and redesigns of outdated sites, with updated branding and layouts that work on phones, tablets, and desktops.", icon: PanelsTopLeft },
  { title: "AI & Automation", description: "Automate follow-ups and data entry, and use AI assistants to answer common customer questions.", icon: Sparkles },
  { title: "Systems Integration", description: "Connect the tools you already use so orders, customer details, and payments stay in sync.", icon: Waypoints },
];
export function Services() {
  return (
    <section className="section container services-layout" id="services" aria-labelledby="services-title">
      <div className="services-intro">
        <p className="eyebrow">SERVICES</p>
        <h2 id="services-title">Full-stack solutions<br />for growing businesses.</h2>
        <p>Websites, applications, and business tools for small and medium-sized businesses. Built around your processes and the way you work.</p>
        <a className="text-link" href="#contact">Find the right solution <ArrowUpRight size={17} /></a>
      </div>
      <div className="services-grid">
        {services.map(({ title, description, icon: Icon }) => (
          <article className="service-card" key={title}>
            <Icon size={27} strokeWidth={1.5} />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
