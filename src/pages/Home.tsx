import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Story from "../components/Story";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import { setupScrollAnimation } from "../utils/animation";

const Home: React.FC = () => {
  useEffect(() => {
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <main>
      <Hero />
      <Story />
      <Benefits />
      <Testimonials />
      <CallToAction />
    </main>
  );
};

export default Home;
