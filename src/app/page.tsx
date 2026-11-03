import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { ScrollReveal } from "@/components/scroll-reveal";
export default function Home() { return <><Navigation/><main id="main"><Hero/><Marquee/><Services/><Work/><About/><Contact/></main><Footer/><ScrollReveal/></>; }
