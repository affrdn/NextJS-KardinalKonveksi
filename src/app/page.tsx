import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Catalog from "@/components/Catalog";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Catalog />
      <Gallery />
      <Services />
      <About />
      <Testimonials />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
