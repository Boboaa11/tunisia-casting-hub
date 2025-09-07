import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Star, MapPin, MessageCircle, Eye, Heart } from "lucide-react";

const TalentSearch = () => {
  const [filters, setFilters] = useState({
    search: "",
    talentType: "",
    city: "",
    ageRange: [18, 50],
    experience: "",
    gender: "",
    availability: false
  });

  const [talents] = useState([
    {
      id: 1,
      name: "Amira Ben Salem",
      age: 28,
      city: "Tunis",
      talentType: "Actrice",
      experience: "Intermédiaire",
      rating: 4.8,
      reviews: 24,
      avatar: "/placeholder.svg",
      bio: "Actrice passionnée avec 5 ans d'expérience dans le théâtre et le cinéma.",
      skills: ["Théâtre", "Improvisation", "Danse"],
      languages: ["Arabe", "Français", "Anglais"],
      height: "165 cm",
      availability: "Disponible",
      profileViews: 1247,
      lastActive: "En ligne"
    },
    {
      id: 2,
      name: "Karim Mezghani",
      age: 32,
      city: "Sfax",
      talentType: "Acteur",
      experience: "Expérimenté",
      rating: 4.9,
      reviews: 36,
      avatar: "/placeholder.svg",
      bio: "Acteur professionnel spécialisé dans les rôles dramatiques.",
      skills: ["Théâtre", "Cinéma", "Arts martiaux"],
      languages: ["Arabe", "Français"],
      height: "180 cm",
      availability: "Disponible",
      profileViews: 2156,
      lastActive: "Il y a 2h"
    },
    {
      id: 3,
      name: "Leila Trabelsi",
      age: 24,
      city: "Sousse",
      talentType: "Mannequin",
      experience: "Débutant",
      rating: 4.6,
      reviews: 12,
      avatar: "/placeholder.svg",
      bio: "Jeune mannequin passionnée par la mode et la photographie.",
      skills: ["Photographie", "Défilé", "Mode"],
      languages: ["Arabe", "Français", "Italien"],
      height: "172 cm",
      availability: "Occupé",
      profileViews: 856,
      lastActive: "Il y a 1j"
    },
    {
      id: 4,
      name: "Mohamed Gharbi",
      age: 45,
      city: "Tunis",
      talentType: "Figurant",
      experience: "Professionnel",
      rating: 4.7,
      reviews: 48,
      avatar: "/placeholder.svg",
      bio: "Figurant professionnel avec une grande expérience dans le cinéma tunisien.",
      skills: ["Figuration", "Caractérisation"],
      languages: ["Arabe", "Français"],
      height: "175 cm",
      availability: "Disponible",
      profileViews: 1893,
      lastActive: "En ligne"
    }
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         talent.bio.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.talentType || talent.talentType === filters.talentType;
    const matchesCity = !filters.city || talent.city === filters.city;
    const matchesAge = talent.age >= filters.ageRange[0] && talent.age <= filters.ageRange[1];
    const matchesExperience = !filters.experience || talent.experience === filters.experience;
    const matchesAvailability = !filters.availability || talent.availability === "Disponible";

    return matchesSearch && matchesType && matchesCity && matchesAge && matchesExperience && matchesAvailability;
  });

  const toggleFavorite = (talentId: number) => {
    setFavorites(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Recherche de Talents</h1>
          <p className="text-muted-foreground">Trouvez les talents parfaits pour vos projets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Nom, compétences..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>

              {/* Talent Type */}
              <div>
                <Label>Type de Talent</Label>
                <Select value={filters.talentType} onValueChange={(value) => setFilters(prev => ({ ...prev, talentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="Acteur">Acteur</SelectItem>
                    <SelectItem value="Actrice">Actrice</SelectItem>
                    <SelectItem value="Mannequin">Mannequin</SelectItem>
                    <SelectItem value="Figurant">Figurant</SelectItem>
                    <SelectItem value="Danseur">Danseur</SelectItem>
                    <SelectItem value="Chanteur">Chanteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label>Ville</Label>
                <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    <SelectItem value="Tunis">Tunis</SelectItem>
                    <SelectItem value="Sfax">Sfax</SelectItem>
                    <SelectItem value="Sousse">Sousse</SelectItem>
                    <SelectItem value="Kairouan">Kairouan</SelectItem>
                    <SelectItem value="Bizerte">Bizerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range */}
              <div>
                <Label>Âge: {filters.ageRange[0]} - {filters.ageRange[1]} ans</Label>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}
                  max={70}
                  min={16}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Experience */}
              <div>
                <Label>Expérience</Label>
                <Select value={filters.experience} onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous niveaux</SelectItem>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Expérimenté">Expérimenté</SelectItem>
                    <SelectItem value="Professionnel">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability"
                  checked={filters.availability}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, availability: checked as boolean }))}
                />
                <Label htmlFor="availability">Disponible uniquement</Label>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({
                  search: "",
                  talentType: "",
                  city: "",
                  ageRange: [18, 50],
                  experience: "",
                  gender: "",
                  availability: false
                })}
              >
                Réinitialiser
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                {filteredTalents.length} talent{filteredTalents.length !== 1 ? 's' : ''} trouvé{filteredTalents.length !== 1 ? 's' : ''}
              </p>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="experience">Plus expérimentés</SelectItem>
                  <SelectItem value="views">Plus vus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTalents.map((talent) => (
                <Card key={talent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={talent.avatar} />
                            <AvatarFallback>{talent.name.split(' ').map(n => n.charAt(0)).join('')}</AvatarFallback>
                          </Avatar>
                          {talent.lastActive === "En ligne" && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{talent.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Badge variant="outline">{talent.talentType}</Badge>
                            <span>•</span>
                            <span>{talent.age} ans</span>
                          </CardDescription>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{talent.rating}</span>
                            <span className="text-sm text-muted-foreground">({talent.reviews} avis)</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(talent.id)}
                        className="p-2"
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            favorites.includes(talent.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{talent.bio}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{talent.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{talent.profileViews} vues</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {talent.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={talent.availability === "Disponible" ? "default" : "secondary"}
                          className={talent.availability === "Disponible" ? "bg-green-500" : ""}
                        >
                          {talent.availability}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{talent.lastActive}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir le profil
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contacter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTalents.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun talent trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche pour obtenir plus de résultats.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TalentSearch;