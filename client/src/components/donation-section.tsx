import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Code, Users, Heart, Shield, Eye } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function DonationSection() {
  const [customAmount, setCustomAmount] = useState("");

  const donationAmounts = [
    { category: "Development", amounts: [25, 50, 100], icon: Code, color: "from-primary to-blue-700", textColor: "text-primary" },
    { category: "Community", amounts: [75, 150, 300], icon: Users, color: "from-secondary to-green-700", textColor: "text-secondary" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Support Transparent Impact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your contribution directly funds open-source projects and community initiatives. See exactly how every dollar is used.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {donationAmounts.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className={`bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Fund {category.category}</h3>
                    <p className="text-blue-100">
                      {category.category === "Development" 
                        ? "Support ongoing development of critical open-source infrastructure"
                        : "Enable training, workshops, and community outreach initiatives"
                      }
                    </p>
                    <div className="space-y-3">
                      {category.amounts.map((amount) => (
                        <Link key={amount} href={`/donate?amount=${amount}`}>
                          <Button className="w-full bg-white text-primary py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                            ${amount} - {amount <= 50 ? "Basic Support" : amount <= 150 ? "Active Contribution" : "Major Impact"}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Custom Amount</h3>
                <p className="text-gray-600">Choose your own contribution amount that works for you</p>
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="text-center text-lg font-semibold"
                  />
                  <Link href={`/donate${customAmount ? `?amount=${customAmount}` : ''}`}>
                    <Button className="w-full btn-accent">
                      Donate Now
                    </Button>
                  </Link>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="flex items-center justify-center"><Shield className="w-4 h-4 mr-2" />Secure Stripe Processing</p>
                  <p className="flex items-center justify-center"><Eye className="w-4 h-4 mr-2" />100% Transparent Tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-16 bg-muted/50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Your Impact in Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">125K</div>
                <div className="text-gray-600">Lines of Code</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">89</div>
                <div className="text-gray-600">Developers Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">23</div>
                <div className="text-gray-600">Communities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">47</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
