const capabilities = ["Custom Software", "Web Design", "Mobile Apps", "AI & Automation", "Systems Integration"];

export function Marquee() {
  return (
    <div className="capability-marquee" role="region" aria-label="Our capabilities">
      <span className="sr-only">{capabilities.join(", ")}</span>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {capabilities.map((item) => <span className="marquee-item" key={item}><span>{item}</span><span className="marquee-separator">✳</span></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
