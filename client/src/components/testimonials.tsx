import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the communities and individuals whose lives have been transformed through our open-source initiatives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials && testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatarUrl || `https://images.unsplash.com/photo-1494790108755-2616b9c3b96a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100`}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.organization}</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="flex text-yellow-500 mr-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{testimonial.rating}.0 out of 5</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
