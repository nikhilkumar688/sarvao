import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function Mission() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="mission" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering communities through open-source technology, transparent operations, and collaborative innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Open Source First</h3>
              <p className="text-gray-600 leading-relaxed">
                Every solution we build is open source, ensuring transparency, community collaboration, and long-term sustainability.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time financial tracking and impact reporting ensure complete accountability to our supporters and communities.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Our initiatives are shaped by the communities we serve, ensuring solutions meet real needs and create lasting impact.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Join Our Initiative</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Be part of a movement that believes in transparency, collaboration, and sustainable impact. Whether you're a developer, designer, or passionate advocate, there's a place for you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-gray-700">Contribute to open-source projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-gray-700">Access to transparent financial reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-gray-700">Direct impact on community projects</span>
                  </div>
                </div>
                <Button onClick={scrollToContact} className="btn-secondary">
                  Join the Movement
                </Button>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Community volunteers collaborating on projects" 
                  className="rounded-xl shadow-lg w-full h-auto" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
