import { MapPin, MessageSquare } from "lucide-react";
import { InquiryForm } from "./inquiry-form";
export function Contact() {
  return <section className="section contact-section" id="contact" aria-labelledby="contact-title"><div className="container"><div className="contact-grid"><div className="contact-copy"><p className="studio-pill"><span /> Let’s talk about your project</p><h2 id="contact-title">Have a project<br />in mind?</h2><p>Tell us what you need: a new website, a redesign, a custom application, or help with a recurring task.</p><div className="contact-details"><span><MessageSquare size={19} /> Direct communication with your developer</span><span><MapPin size={19} /> Based in Southern New Jersey</span></div></div><InquiryForm /></div></div></section>;
}
