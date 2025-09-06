import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCasting } from "@/contexts/CastingContext";

const CreateCasting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCasting } = useCasting();
  
  const [formData, setFormData] = useState({
    title: "",
    production: "",
    type: "",
    location: "",
    deadline: "",
    description: "",
    requirements: "",
    compensation: "",
    ageMin: "",
    ageMax: "",
    gender: "",
    experience: "",
    languages: [] as string[],
    specialSkills: [] as string[]
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.specialSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        specialSkills: [...prev.specialSkills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      specialSkills: prev.specialSkills.filter(s => s !== skill)
    }));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon sauvegardé",
      description: "Votre casting a été sauvegardé en brouillon.",
    });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.production || !formData.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Create the casting object
    const newCasting = {
      title: formData.title,
      production: formData.production,
      type: formData.type,
      category: formData.type.toLowerCase().replace('é', 'e'),
      location: formData.location,
      deadline: formData.deadline,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      compensation: formData.compensation,
      status: "Actif",
      applications: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ageMin: formData.ageMin,
      ageMax: formData.ageMax,
      gender: formData.gender,
      experience: formData.experience,
      languages: formData.languages,
      specialSkills: formData.specialSkills
    };

    addCasting(newCasting);

    toast({
      title: "Casting publié",
      description: "Votre casting a été publié avec succès!",
    });
    
    setTimeout(() => {
      navigate("/producer-dashboard");
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/producer-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Créer un Nouveau Casting
              </h1>
              <p className="text-muted-foreground">
                Trouvez les talents parfaits pour votre production
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de Base</CardTitle>
                <CardDescription>
                  Les informations essentielles de votre casting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du casting *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Recherche acteur principal"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="production">Production *</Label>
                    <Input
                      id="production"
                      placeholder="Ex: Film Tunisien 2024"
                      value={formData.production}
                      onChange={(e) => handleInputChange("production", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cinema">Cinéma</SelectItem>
                        <SelectItem value="television">Télévision</SelectItem>
                        <SelectItem value="theatre">Théâtre</SelectItem>
                        <SelectItem value="publicite">Publicité</SelectItem>
                        <SelectItem value="clip">Clip Musical</SelectItem>
                        <SelectItem value="web">Web/Digital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      placeholder="Ex: Tunis, Sousse..."
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Date limite</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre projet, l'histoire, l'ambiance..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profil recherché */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Recherché</CardTitle>
                <CardDescription>
                  Définissez le profil idéal pour ce rôle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Tranche d'âge</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        value={formData.ageMin}
                        onChange={(e) => handleInputChange("ageMin", e.target.value)}
                      />
                      <span className="flex items-center px-2">à</span>
                      <Input
                        placeholder="Max"
                        value={formData.ageMax}
                        onChange={(e) => handleInputChange("ageMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="tous">Tous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Niveau d'expérience</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debutant">Débutant</SelectItem>
                        <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                        <SelectItem value="experimente">Expérimenté</SelectItem>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                        <SelectItem value="tous">Tous niveaux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Langues */}
                <div className="space-y-2">
                  <Label>Langues requises</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Ajouter une langue"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    />
                    <Button type="button" variant="outline" onClick={addLanguage}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((language) => (
                      <Badge key={language} variant="secondary" className="flex items-center gap-1">
                        {language}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeLanguage(language)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Compétences spéciales */}
                <div className="space-y-2">
                  <Label>Compétences spéciales</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Ex: Danse, Chant, Arts martiaux..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Exigences spécifiques</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Précisez les exigences particulières, le look recherché, les compétences nécessaires..."
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
                <CardDescription>
                  Informations sur la rémunération
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="compensation">Détails de la compensation</Label>
                  <Textarea
                    id="compensation"
                    placeholder="Ex: Rémunéré, Bénévole, À négocier, Indemnités de transport..."
                    rows={3}
                    value={formData.compensation}
                    onChange={(e) => handleInputChange("compensation", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder en brouillon
              </Button>
              <Button onClick={handlePublish}>
                <Send className="w-4 h-4 mr-2" />
                Publier le casting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCasting;