import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import DonationSection from "@/components/donation-section";
import Transparency from "@/components/transparency";
import Projects from "@/components/projects";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Mission />
      <DonationSection />
      <Transparency />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
