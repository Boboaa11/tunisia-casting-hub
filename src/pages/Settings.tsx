import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  const sections = [
    {
      icon: User,
      title: "Profil",
      description: "Modifiez vos informations personnelles et professionnelles",
      link: "/profile",
      linkLabel: "Modifier le profil",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Gérez vos préférences de notifications par email et sur la plateforme",
      link: null,
      linkLabel: null,
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Changez votre mot de passe et gérez la sécurité de votre compte",
      link: null,
      linkLabel: null,
    },
    {
      icon: Palette,
      title: "Apparence",
      description: "Personnalisez l'interface selon vos préférences",
      link: null,
      linkLabel: null,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-hero rounded-xl shadow-glow">
            <SettingsIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground text-sm">Gérez les paramètres de votre compte</p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="shadow-card">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                {section.link ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={section.link}>{section.linkLabel}</Link>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Bientôt disponible</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
