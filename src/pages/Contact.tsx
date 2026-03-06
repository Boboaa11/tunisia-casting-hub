import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Layout from "@/components/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const contactInfo = [
    { icon: MapPin, title: "Adresse", details: ["Tunis, Tunisie", "Avenue Habib Bourguiba"], color: "text-blue-600" },
    { icon: Phone, title: "Téléphone", details: ["+216 71 XXX XXX", "Lundi - Vendredi, 9h - 18h"], color: "text-green-600" },
    { icon: Mail, title: "Email", details: ["info@tunisiacasting.com", "support@tunisiacasting.com"], color: "text-purple-600" },
    { icon: Clock, title: "Horaires d'ouverture", details: ["Lundi - Vendredi : 9h00 - 18h00", "Samedi : 10h00 - 16h00"], color: "text-orange-600" }
  ];

  const faqs = [
    { question: "Comment postuler aux appels de casting ?", answer: "Une fois votre compte créé et votre profil complété, vous pouvez parcourir les castings disponibles et postuler directement via la plateforme." },
    { question: "L'inscription à Tunisia Casting est-elle payante ?", answer: "L'adhésion de base est gratuite pour les talents. Nous proposons des fonctionnalités premium pour une visibilité accrue et des outils supplémentaires." },
    { question: "Comment les directeurs de casting publient-ils des opportunités ?", answer: "Les directeurs de casting peuvent nous contacter pour créer un compte et publier leurs appels de casting. Nous vérifions toutes les sociétés de production avant publication." },
    { question: "Quels types de projets sont listés ?", answer: "Nous proposons des appels de casting pour les séries TV, films, productions théâtrales, publicités, clips musicaux et autres projets de divertissement." }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Contactez-nous</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vous avez des questions ? Nous serions ravis de vous entendre. Envoyez-nous un message et nous vous répondrons dès que possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-elegant bg-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Envoyez-nous un Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Nom Complet</Label>
                        <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Votre nom complet" className="shadow-card" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="votre.email@exemple.com" className="shadow-card" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">Numéro de Téléphone</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+216 XX XXX XXX" className="shadow-card" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-foreground">Type de Demande</Label>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="shadow-card"><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Demande Générale</SelectItem>
                            <SelectItem value="talent">Support Talent</SelectItem>
                            <SelectItem value="casting">Directeur de Casting</SelectItem>
                            <SelectItem value="technical">Support Technique</SelectItem>
                            <SelectItem value="partnership">Partenariat</SelectItem>
                            <SelectItem value="press">Presse & Médias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground">Sujet</Label>
                      <Input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleChange} placeholder="Objet de votre message" className="shadow-card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground">Message</Label>
                      <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Décrivez votre demande en détail..." rows={6} className="shadow-card" />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      Envoyer le Message
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 animate-slide-up">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="shadow-card bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-100 ${info.color}`}>
                          <info.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-elegant bg-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Questions Fréquentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card bg-gradient-hero text-primary-foreground animate-slide-up">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-4">Besoin d'Aide Immédiate ?</h3>
                  <div className="space-y-3">
                    <Button variant="premium" className="w-full bg-white text-primary hover:bg-gray-100">
                      Centre d'Aide
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary">
                      État du Système
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
