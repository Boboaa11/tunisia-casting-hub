import { useState, useEffect, useRef } from "react";
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
import { Camera, Upload, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProfileViewMode from "@/components/ProfileViewMode";
import AvatarCropDialog from "@/components/AvatarCropDialog";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  bio: string;
  talentType: string;
  experience: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
  languages: string;
  skills: string;
  bookUrl: string;
  photoUrl: string;
}

const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  city: "",
  bio: "",
  talentType: "",
  experience: "",
  height: "",
  weight: "",
  eyeColor: "",
  hairColor: "",
  languages: "",
  skills: "",
  bookUrl: "",
  photoUrl: "",
};

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [stats] = useState({ profileViews: 0, applications: 0 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("talent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: user.email || "",
          phone: "",
          dateOfBirth: "",
          city: data.city || "",
          bio: data.bio || "",
          talentType: data.talent_type || "",
          experience: "",
          height: data.height || "",
          weight: data.weight || "",
          eyeColor: data.eye_color || "",
          hairColor: data.hair_color || "",
          languages: (data.languages || []).join(", "),
          skills: (data.skills || []).join(", "),
          bookUrl: data.book_url || "",
          photoUrl: data.photo_url || "",
        });
      } else {
        setProfile({ ...emptyProfile, email: user.email || "" });
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => {
        if (count !== null) {
          stats.applications = count;
        }
      });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une image.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L'image ne doit pas dépasser 10 Mo.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCropImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleCroppedUpload = async (blob: Blob) => {
    if (!user) return;
    setIsUploading(true);

    const filePath = `${user.id}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, { upsert: true, contentType: "image/jpeg" });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast({ title: "Erreur", description: "Impossible de télécharger la photo.", variant: "destructive" });
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("talent_profiles")
      .update({ photo_url: photoUrl })
      .eq("user_id", user.id);

    setIsUploading(false);
    setCropImageSrc(null);

    if (updateError) {
      console.error("Update error:", updateError);
      toast({ title: "Erreur", description: "Impossible de mettre à jour le profil.", variant: "destructive" });
      return;
    }

    setProfile((prev) => ({ ...prev, photoUrl }));
    toast({ title: "Photo mise à jour", description: "Votre photo de profil a été mise à jour." });
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const languagesArr = profile.languages.split(",").map((l) => l.trim()).filter(Boolean);
    const skillsArr = profile.skills.split(",").map((s) => s.trim()).filter(Boolean);

    const completionItems = [
      !!profile.photoUrl,
      !!profile.talentType,
      !!profile.city,
      !!profile.bio,
      skillsArr.length > 0,
      !!(profile.height && profile.weight && profile.eyeColor && profile.hairColor),
    ];
    const completionPct = Math.round(
      (completionItems.filter(Boolean).length / completionItems.length) * 100
    );

    const { error } = await supabase
      .from("talent_profiles")
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
        city: profile.city || null,
        bio: profile.bio || null,
        talent_type: profile.talentType || null,
        height: profile.height || null,
        weight: profile.weight || null,
        eye_color: profile.eyeColor || null,
        hair_color: profile.hairColor || null,
        languages: languagesArr,
        skills: skillsArr,
        book_url: profile.bookUrl || null,
        profile_completion_percentage: completionPct,
      })
      .eq("user_id", user.id);

    setIsSaving(false);

    if (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le profil.", variant: "destructive" });
      console.error("Save error:", error);
      return;
    }

    toast({ title: "Profil sauvegardé", description: "Vos modifications ont été enregistrées." });
    setIsEditing(false);
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isEditing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ProfileViewMode
            profile={profile}
            stats={stats}
            onEdit={() => setIsEditing(true)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au profil
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Modifier mon profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-32 h-32">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.photoUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
              </div>
              <CardTitle className="text-xl">{profile.firstName} {profile.lastName}</CardTitle>
              <CardDescription>
                {profile.talentType && <Badge variant="outline" className="mb-2">{profile.talentType}</Badge>}
                {profile.city && <p>{profile.city}</p>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.bookUrl ? (
                  <Button className="w-full" variant="outline" onClick={() => window.open(profile.bookUrl, '_blank')}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Voir le Book
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

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
                      <Input id="firstName" value={profile.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" value={profile.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Select value={profile.city} onValueChange={(value) => handleInputChange('city', value)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner une ville" /></SelectTrigger>
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
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="talentType">Type de Talent</Label>
                      <Select value={profile.talentType} onValueChange={(value) => handleInputChange('talentType', value)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                    <Textarea id="bio" rows={4} value={profile.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Décrivez votre parcours..." />
                  </div>
                  <div>
                    <Label htmlFor="languages">Langues Parlées</Label>
                    <Input id="languages" value={profile.languages} onChange={(e) => handleInputChange('languages', e.target.value)} placeholder="Ex: Arabe, Français, Anglais" />
                  </div>
                  <div>
                    <Label htmlFor="skills">Compétences Spéciales</Label>
                    <Input id="skills" value={profile.skills} onChange={(e) => handleInputChange('skills', e.target.value)} placeholder="Ex: Danse, Chant, Arts martiaux" />
                  </div>
                </TabsContent>

                <TabsContent value="physical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input id="height" value={profile.height} onChange={(e) => handleInputChange('height', e.target.value)} placeholder="165" />
                    </div>
                    <div>
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input id="weight" value={profile.weight} onChange={(e) => handleInputChange('weight', e.target.value)} placeholder="55" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eyeColor">Couleur des Yeux</Label>
                      <Select value={profile.eyeColor} onValueChange={(value) => handleInputChange('eyeColor', value)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                </TabsContent>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Sauvegarder
                  </Button>
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
