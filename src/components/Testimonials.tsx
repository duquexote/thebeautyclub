import React, { useState, useEffect, useRef } from "react";
import { testimonials } from "../data/testimonials";
import { ChevronLeft, ChevronRight, Quote, ShoppingBag } from "lucide-react";

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const totalTestimonials = testimonials.length;
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials);
  };
  
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    animatedElements?.forEach((el) => observer.observe(el));

    return () => {
      animatedElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll translate-y-4">
            💬 O que dizem nossas sócias:
          </h2>
        </div>
        
        <div className="relative max-w-5xl mx-auto animate-on-scroll translate-y-4">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm border border-pink-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src={testimonial.imageUrl} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-2 shadow-md">
                          <Quote className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                      <p className="text-xl md:text-2xl font-medium mb-4 text-gray-800 italic">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-semibold text-lg text-gray-800">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-600">
                          {testimonial.position} – {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-purple-600" />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-pink-500 w-6" : "bg-gray-300 hover:bg-pink-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="mt-16 text-center animate-on-scroll translate-y-4">
            <a href="#join" className="btn btn-primary text-lg inline-flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> 
              Quero ser sócia do The Beauty Club
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;