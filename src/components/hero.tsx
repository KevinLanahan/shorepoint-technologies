import { ArrowRight, Braces, Database, Layers3, PanelsTopLeft, Terminal, Workflow } from "lucide-react";

function SystemPreview() {
  return (
    <div className="system-preview" role="img" aria-label="Concept illustration of websites, applications, data, and workflows connected around your business">
      <div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>shorepoint / connected systems</span><Braces size={16} /></div>
      <div className="preview-canvas">
        <div className="preview-grid" />
        <div className="preview-code"><span>{"// built around your business"}</span><br /><b>connect</b>({"{"}<br />&nbsp; websites,<br />&nbsp; applications,<br />&nbsp; workflows<br />{"}"});</div>
        <svg className="preview-connections" viewBox="0 0 500 330" fill="none" aria-hidden="true"><path d="M110 95H250V165H390M110 240H250V165M390 80V165M390 250V165" /><circle cx="250" cy="165" r="64" /><circle cx="250" cy="165" r="90" /></svg>
        <div className="preview-node preview-web"><PanelsTopLeft size={18} /><span>Websites</span></div>
        <div className="preview-node preview-data"><Database size={18} /><span>Your data</span></div>
        <div className="preview-node preview-flow"><Workflow size={18} /><span>Workflows</span></div>
        <div className="preview-center"><Layers3 size={31} strokeWidth={1.4} /><strong>Your business</strong></div>
        <div className="preview-caption"><span className="icon-tile"><Braces size={21} /></span><div><strong>Connected by design</strong><span>Software tailored to your processes</span></div><span className="concept-chip">CONCEPT</span></div>
      </div>
      <div className="preview-features"><div><span>DESIGN</span><strong>Websites</strong></div><div><span>DEVELOP</span><strong>Applications</strong></div><div><span>CONNECT</span><strong>Workflows</strong></div></div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="studio-pill"><span /> Studio · Southern New Jersey</p>
          <h1 id="hero-title">Software built around <span>your business.</span></h1>
          <p className="hero-description">We design and modernize business websites, build custom applications, and automate everyday workflows.</p>
          <div className="hero-actions"><a className="button" href="#contact">Start a Project <ArrowRight size={20} /></a><a className="button button-secondary" href="#work"><Terminal size={18} /> View Our Work</a></div>
          <div className="hero-meta"><span>Independent development studio</span><i /><span>Direct developer collaboration</span></div>
        </div>
        <SystemPreview />
      </div>
    </section>
  );
}
