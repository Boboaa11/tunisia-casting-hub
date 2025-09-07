import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, Star, Eye, MessageCircle, Calendar } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "Amira",
    lastName: "Ben Salem",
    email: "amira.bensalem@email.com",
    phone: "+216 98 123 456",
    dateOfBirth: "1995-05-15",
    city: "Tunis",
    address: "Rue de la République, La Marsa",
    bio: "Actrice passionnée avec 5 ans d'expérience dans le théâtre et le cinéma. Spécialisée dans les rôles dramatiques et comiques.",
    talentType: "Acteur/Actrice",
    experience: "Intermédiaire",
    height: "165",
    weight: "55",
    eyeColor: "Marron",
    hairColor: "Brun",
    languages: "Arabe, Français, Anglais",
    skills: "Théâtre, Improvisation, Danse, Chant"
  });

  const [stats] = useState({
    profileViews: 1247,
    applications: 15,
    responses: 8,
    rating: 4.8
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would save to your backend
    console.log("Saving profile:", profile);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-32 h-32">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{profile.firstName} {profile.lastName}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mb-2">{profile.talentType}</Badge>
                <p>{profile.city}</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Évaluation</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{stats.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.profileViews}</div>
                    <div className="text-xs text-muted-foreground">Vues du profil</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.applications}</div>
                    <div className="text-xs text-muted-foreground">Candidatures</div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger CV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
                  <TabsTrigger value="professional">Professionnel</TabsTrigger>
                  <TabsTrigger value="physical">Caractéristiques</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date de Naissance</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Select value={profile.city} onValueChange={(value) => handleInputChange('city', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tunis">Tunis</SelectItem>
                          <SelectItem value="Sfax">Sfax</SelectItem>
                          <SelectItem value="Sousse">Sousse</SelectItem>
                          <SelectItem value="Kairouan">Kairouan</SelectItem>
                          <SelectItem value="Bizerte">Bizerte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="talentType">Type de Talent</Label>
                      <Select value={profile.talentType} onValueChange={(value) => handleInputChange('talentType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Acteur/Actrice">Acteur/Actrice</SelectItem>
                          <SelectItem value="Mannequin">Mannequin</SelectItem>
                          <SelectItem value="Figurant">Figurant</SelectItem>
                          <SelectItem value="Danseur/Danseuse">Danseur/Danseuse</SelectItem>
                          <SelectItem value="Chanteur/Chanteuse">Chanteur/Chanteuse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Niveau d'Expérience</Label>
                      <Select value={profile.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Débutant">Débutant</SelectItem>
                          <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                          <SelectItem value="Expérimenté">Expérimenté</SelectItem>
                          <SelectItem value="Professionnel">Professionnel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Décrivez votre parcours, vos expériences et vos objectifs..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="languages">Langues Parlées</Label>
                    <Input
                      id="languages"
                      value={profile.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      placeholder="Ex: Arabe, Français, Anglais"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Compétences Spéciales</Label>
                    <Input
                      id="skills"
                      value={profile.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="Ex: Danse, Chant, Arts martiaux, Équitation"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="physical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input
                        id="height"
                        value={profile.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="165"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        value={profile.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="55"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eyeColor">Couleur des Yeux</Label>
                      <Select value={profile.eyeColor} onValueChange={(value) => handleInputChange('eyeColor', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Marron">Marron</SelectItem>
                          <SelectItem value="Noir">Noir</SelectItem>
                          <SelectItem value="Vert">Vert</SelectItem>
                          <SelectItem value="Bleu">Bleu</SelectItem>
                          <SelectItem value="Noisette">Noisette</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hairColor">Couleur des Cheveux</Label>
                      <Select value={profile.hairColor} onValueChange={(value) => handleInputChange('hairColor', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Noir">Noir</SelectItem>
                          <SelectItem value="Brun">Brun</SelectItem>
                          <SelectItem value="Châtain">Châtain</SelectItem>
                          <SelectItem value="Blond">Blond</SelectItem>
                          <SelectItem value="Roux">Roux</SelectItem>
                          <SelectItem value="Gris">Gris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Photos du Portfolio</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Ajouter une photo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline">Annuler</Button>
                  <Button onClick={handleSave}>Sauvegarder</Button>
                </div>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;