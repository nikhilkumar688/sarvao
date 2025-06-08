import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  const scrollToMission = () => {
    const element = document.getElementById('mission');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Building an Open, <span className="text-indigo-200">Transparent</span> Future
            </h1>
            <p className="text-xl lg:text-2xl text-yellow-100 leading-relaxed">
              We develop open-source solutions that empower communities, ensure transparency, and create lasting positive impact through technology and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
                  Support Our Mission
                </Button>
              </Link>
              <Button
                onClick={scrollToMission}
                variant="outline"
                className="border-2 border-white text-indigo-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1*</div>
                <div className="text-blue-200 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1k*</div>
                <div className="text-blue-200 text-sm">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-200 text-sm">Transparency</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/images/hero-img.png" 
               alt="Team collaboration on technology projects" 
               className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-50 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-gray-800 font-medium">Live Impact Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
