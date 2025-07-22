import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Star, Globe, Award } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Arts",
      description: "We believe in the transformative power of entertainment and the arts in Tunisian culture."
    },
    {
      icon: Target,
      title: "Connecting Opportunities",
      description: "Our mission is to bridge the gap between talent and casting directors efficiently."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where talent can grow and thrive together."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for the highest standards in service and user experience."
    }
  ];

  const team = [
    {
      name: "Amira Ben Salem",
      role: "Founder & CEO",
      bio: "Former casting director with 15 years of experience in Tunisian cinema and television.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Karim Mansouri",
      role: "Head of Technology",
      bio: "Tech entrepreneur passionate about using technology to support creative industries.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Leila Gharbi",
      role: "Industry Relations",
      bio: "Veteran producer with extensive connections in North African entertainment industry.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const stats = [
    { icon: Users, label: "Registered Talent", value: "500+" },
    { icon: Globe, label: "Productions Connected", value: "80+" },
    { icon: Award, label: "Successful Castings", value: "200+" },
    { icon: Star, label: "Industry Partners", value: "50+" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Tunisia Casting
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90">
              Connecting Tunisia's creative talent with entertainment opportunities, 
              one casting call at a time.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tunisia Casting was born from a simple yet powerful vision: to democratize access to 
                entertainment opportunities in Tunisia. We recognized that talented individuals often 
                struggled to find casting calls, while production companies had difficulty reaching 
                the right talent. Our platform bridges this gap, creating a thriving ecosystem where 
                creativity meets opportunity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300 bg-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <value.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Impact</h2>
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

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Passionate professionals dedicated to supporting Tunisia's entertainment industry
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300 bg-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-card"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2023, Tunisia Casting emerged from the personal experiences of our founder, 
                  Amira Ben Salem, who witnessed firsthand the challenges faced by both talent and 
                  casting directors in Tunisia's growing entertainment industry.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  After years of working in traditional casting methods, Amira realized that technology 
                  could revolutionize how casting works in Tunisia. She assembled a team of industry 
                  veterans and tech innovators to create a platform that would serve the unique needs 
                  of our local entertainment ecosystem.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, Tunisia Casting is proud to be the leading platform connecting talent with 
                  opportunities across television, film, theater, and commercial productions throughout 
                  Tunisia and beyond. We're committed to supporting the growth of our vibrant creative 
                  community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Whether you're a talented performer or a casting director, Tunisia Casting is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="premium" size="lg" asChild className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
                <Link to="/signup">Join as Talent</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;