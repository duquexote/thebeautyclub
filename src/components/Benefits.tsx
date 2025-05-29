import React, { useEffect, useRef } from "react";
import { benefits } from "../data/benefits";
import * as LucideIcons from "lucide-react";
import { ShoppingBag } from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
}

const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : null;
};

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="benefits" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50" ref={sectionRef}>
      <div className="container-custom">
        <div className="text-center mb-18">
          <h2 className="section-title animate-on-scroll translate-y-4">
            🚀 Por que fazer parte do The Beauty Club?
          </h2>
          <p className="section-subtitle animate-on-scroll translate-y-4">
            Ser sócia é 100% gratuito. Os ganhos são reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="card hover:border-pink-200 group animate-on-scroll translate-y-4"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <DynamicIcon name={benefit.icon} className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-on-scroll translate-y-4">
          <a href="#join" className="btn btn-primary text-lg inline-flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" /> 
            Quero ser sócia do The Beauty Club
          </a>
        </div>
      </div>
    </section>
  );
};

export default Benefits;