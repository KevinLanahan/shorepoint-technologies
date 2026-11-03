import { ArrowUpRight, Braces, Workflow } from "lucide-react";

function StudioVisual() {
  return (
    <div className="studio-visual" role="img" aria-label="Illustration of a laptop with a sculptural purple display, representing custom software development">
      <div className="studio-halo" />
      <div className="laptop">
        <div className="laptop-screen">
          <div className="screen-sculpture sculpture-one" />
          <div className="screen-sculpture sculpture-two" />
          <div className="screen-caption"><Braces size={14} /><span>Designed around your business</span></div>
        </div>
        <div className="laptop-base"><span /></div>
      </div>
      <div className="studio-plinth" />
      <span className="visual-signature"><Workflow size={13} /> WEBSITES / APPLICATIONS / AUTOMATION</span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">CUSTOM SOFTWARE STUDIO</p>
          <h1 id="hero-title">Software built<br />around <span>your<br />business.</span></h1>
          <p className="hero-description">We design and modernize business websites, build custom applications, and automate everyday workflows.</p>
          <div className="hero-actions">
            <a className="button" href="#contact">Start a Project <ArrowUpRight size={17} /></a>
            <a className="button button-outline" href="#work">View Our Work</a>
          </div>
          <p className="hero-location"><span /> Based in Southern New Jersey.</p>
        </div>
        <StudioVisual />
      </div>
    </section>
  );
}
