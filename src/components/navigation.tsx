"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./brand";
const links = [["Home", "home"], ["Services", "services"], ["Our Work", "work"], ["About", "about"], ["Contact", "contact"]];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="site-header"><div className="container nav-wrap"><Brand/><nav aria-label="Main navigation" className="desktop-nav">{links.map(([label,id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><a className="button button-small nav-cta" href="#contact">Start a Project <ArrowUpRight size={15}/></a><button className="menu-toggle" ref={toggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div><nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-nav" hidden={!open}>{links.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<a href="#contact" onClick={() => setOpen(false)}>Start a Project <ArrowUpRight size={16}/></a></nav></header>;
}
