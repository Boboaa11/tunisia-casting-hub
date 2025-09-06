import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Star, Film, Camera, Megaphone } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-casting.jpg";

const Index = () => {
  const features = [
    {
      icon: Search,
      title: "Find Opportunities",
      description: "Browse casting calls for TV, cinema, and theater productions across Tunisia."
    },
    {
      icon: Users,
      title: "Connect with Talent",
      description: "Join a community of actors, models, and entertainment professionals."
    },
    {
      icon: Star,
      title: "Launch Your Career",
      description: "Take the first step towards your dreams in the entertainment industry."
    }
  ];

  const stats = [
    { icon: Film, label: "TV Productions", value: "50+" },
    { icon: Camera, label: "Film Projects", value: "30+" },
    { icon: Megaphone, label: "Active Castings", value: "25+" },
    { icon: Users, label: "Registered Talent", value: "500+" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Stage Awaits in 
            <span className="bg-gradient-accent bg-clip-text text-transparent block">
              Tunisia
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Connect with casting directors and find your next big role in Tunisia's thriving entertainment industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/signup">Start Your Journey</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/castings">Browse Castings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose Tunisia Casting?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The premier platform connecting talent with opportunities across Tunisia's entertainment landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 bg-gradient-card">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Tunisia's premier casting platform and connect with opportunities that match your talent.
          </p>
          <Button variant="hero" size="lg" asChild className="text-lg px-8 py-6">
            <Link to="/signup">Join Tunisia Casting</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
