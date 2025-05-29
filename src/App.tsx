import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import { setupScrollAnimation } from "./utils/animation";

function App() {
  useEffect(() => {
    // Update the document title
    document.title = "The Beauty Club | O maior clube de profissionais da beleza do Brasil";
    
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Benefits />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;