import { ArrowUpRight, Check, MapPin } from "lucide-react";
export function About() {
  return (
    <section className="section container about-layout" id="about" aria-labelledby="about-title">
      <div className="about-heading"><p className="eyebrow">ABOUT</p><h2 id="about-title">A local software<br /><span>partner.</span></h2></div>
      <div className="about-copy">
        <p>Shorepoint Technologies is an independent web design and software development studio in Southern New Jersey.</p>
        <p>We work with small and medium-sized businesses on their websites, customer applications, and internal tools. We start by understanding your existing processes and what you need to improve.</p>
        <ul>{["Engineering-led design and development", "Direct communication with your developer", "Software tailored to your business processes", "Local collaboration and ongoing support"].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
        <p className="service-area">Serving Manahawkin, Stafford Township, Long Beach Island, and surrounding areas.</p>
        <div className="about-links"><span><MapPin size={15} /> Southern New Jersey</span><a className="text-link" href="#contact">Discuss your project <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  );
}
