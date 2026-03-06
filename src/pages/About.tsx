import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Star, Globe, Award } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion pour les Arts",
      description: "Nous croyons au pouvoir transformateur du divertissement et des arts dans la culture tunisienne."
    },
    {
      icon: Target,
      title: "Connecter les Opportunités",
      description: "Notre mission est de combler le fossé entre les talents et les directeurs de casting efficacement."
    },
    {
      icon: Users,
      title: "Communauté d'Abord",
      description: "Construire une communauté solidaire où les talents peuvent grandir et s'épanouir ensemble."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Nous visons les plus hauts standards en matière de service et d'expérience utilisateur."
    }
  ];

  const team = [
    {
      name: "Amira Ben Salem",
      role: "Fondatrice & PDG",
      bio: "Ancienne directrice de casting avec 15 ans d'expérience dans le cinéma et la télévision tunisiens.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Karim Mansouri",
      role: "Directeur Technologie",
      bio: "Entrepreneur tech passionné par l'utilisation de la technologie au service des industries créatives.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Leila Gharbi",
      role: "Relations Industrie",
      bio: "Productrice chevronnée avec un vaste réseau dans l'industrie du divertissement nord-africain.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const stats = [
    { icon: Users, label: "Talents Inscrits", value: "500+" },
    { icon: Globe, label: "Productions Connectées", value: "80+" },
    { icon: Award, label: "Castings Réussis", value: "200+" },
    { icon: Star, label: "Partenaires Industrie", value: "50+" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À Propos de Tunisia Casting
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90">
              Connecter les talents créatifs de la Tunisie aux opportunités du divertissement, 
              un casting à la fois.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Notre Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tunisia Casting est né d'une vision simple mais puissante : démocratiser l'accès aux 
                opportunités du divertissement en Tunisie. Nous avons constaté que les individus talentueux 
                avaient souvent du mal à trouver des appels de casting, tandis que les sociétés de production 
                peinaient à atteindre les bons talents. Notre plateforme comble ce fossé, créant un écosystème 
                florissant où la créativité rencontre l'opportunité.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Notre Impact</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Notre Équipe</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Des professionnels passionnés dédiés au soutien de l'industrie du divertissement tunisien
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Notre Histoire</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Fondée en 2023, Tunisia Casting est née des expériences personnelles de notre fondatrice, 
                  Amira Ben Salem, qui a été témoin des défis auxquels sont confrontés tant les talents que 
                  les directeurs de casting dans l'industrie du divertissement en pleine croissance en Tunisie.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Après des années de travail avec les méthodes de casting traditionnelles, Amira a réalisé que la technologie 
                  pouvait révolutionner le fonctionnement du casting en Tunisie. Elle a rassemblé une équipe de 
                  vétérans de l'industrie et d'innovateurs technologiques pour créer une plateforme qui répondrait aux besoins 
                  uniques de notre écosystème local du divertissement.
                </p>
                <p className="text-lg leading-relaxed">
                  Aujourd'hui, Tunisia Casting est fière d'être la plateforme leader connectant les talents aux 
                  opportunités dans la télévision, le cinéma, le théâtre et les productions commerciales à travers 
                  la Tunisie et au-delà. Nous nous engageons à soutenir la croissance de notre vibrante communauté 
                  créative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Rejoindre Notre Communauté ?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Que vous soyez un artiste talentueux ou un directeur de casting, Tunisia Casting est là pour vous aider à réussir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="premium" size="lg" asChild className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
                <Link to="/signup">Rejoindre comme Talent</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Contactez-nous</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
