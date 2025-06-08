import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "Mission", id: "mission" },
    { label: "Impact", id: "impact" },
    { label: "Projects", id: "projects" },
    { label: "Transparency", id: "transparency" },
    { label: "Stories", id: "testimonials" },
  ];

  return (
    <header className="bg-yellow-50 shadow-sm border-b border-gray-100 sticky top-0 z-50">

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4E22AQFQBXlSNOkA4Q/feedshare-shrink_2048_1536/B4EZdDqIr1HcAs-/0/1749186809154?e=1752105600&v=beta&t=w2cX5be-o6Kf_HiR-gO2tz5VnEvcUWeASkvH_jeTSPU" 
                alt="Sarvao Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
              <span className="text-2xl font-bold text-primary cursor-pointer">Sarvao.org</span>
            </Link>
          </div>

          {/* Nav Items - Only on Medium & Above */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right-side Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => scrollToSection('contact')}
              className="hidden md:block bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Join Initiative
            </Button>
            <Link href="/donate">
              <Button className="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition">
                Donate Now
              </Button>
            </Link>

            {/* Mobile Sheet Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-gray-600 hover:text-primary transition-colors duration-200 font-medium py-2"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button
                    onClick={() => scrollToSection('contact')}
                    className="btn-secondary mt-4"
                  >
                    Join Initiative
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </nav>
    </header>
  );
}
