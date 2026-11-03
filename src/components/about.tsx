import { Braces, MapPin, MessageSquare, Waypoints } from "lucide-react";
const principles = [
  { icon: MessageSquare, title: "Direct collaboration", description: "Direct communication with your developer, from understanding your existing processes to discussing what you need to improve." },
  { icon: Braces, title: "Software built around you", description: "Engineering-led design and development, with software tailored to your business processes." },
  { icon: Waypoints, title: "An ongoing partnership", description: "Local collaboration and ongoing support for your websites, customer applications, and internal tools." },
];
export function About() {
  return <section className="section" id="about" aria-labelledby="about-title"><div className="container about-layout"><div className="about-copy"><p className="eyebrow">The studio</p><h2 id="about-title">A local software partner.</h2><p>Shorepoint Technologies is an independent web design and software development studio in Southern New Jersey.</p><p>We work with small and medium-sized businesses on their websites, customer applications, and internal tools. We start by understanding your existing processes and what you need to improve.</p><div className="studio-location"><span className="icon-tile"><MapPin size={25} /></span><div><strong>Based in Southern New Jersey</strong><span>Manahawkin, Stafford Township, Long Beach Island, and surrounding areas.</span></div></div></div><div className="studio-principles">{principles.map(({ icon: Icon, title, description }) => <article className="principle-card" key={title}><div><span className="icon-tile"><Icon size={20} /></span><h3>{title}</h3></div><p>{description}</p></article>)}</div></div></section>;
}
