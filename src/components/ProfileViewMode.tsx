import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  Eye, 
  FileText, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Ruler,
  Weight,
  Palette,
  Pencil
} from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  address: string;
  bio: string;
  talentType: string;
  experience: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
  languages: string;
  skills: string;
}

interface ProfileStats {
  profileViews: number;
  applications: number;
  responses: number;
  rating: number;
}

interface ProfileViewModeProps {
  profile: ProfileData;
  stats: ProfileStats;
  onEdit: () => void;
}

const ProfileViewMode = ({ profile, stats, onEdit }: ProfileViewModeProps) => {
  const languagesList = profile.languages.split(",").map(l => l.trim()).filter(Boolean);
  const skillsList = profile.skills.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-32" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row gap-6 -mt-16">
            <Avatar className="w-32 h-32 border-4 border-background shadow-elegant">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="default">{profile.talentType}</Badge>
                    <Badge variant="secondary">{profile.experience}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </span>
                  </div>
                </div>
                
                <Button onClick={onEdit} className="shrink-0">
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-2xl font-bold">{stats.rating}</span>
          </div>
          <p className="text-sm text-muted-foreground">Évaluation</p>
        </Card>
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Eye className="h-5 w-5" />
            <span className="text-2xl font-bold">{stats.profileViews}</span>
          </div>
          <p className="text-sm text-muted-foreground">Vues du profil</p>
        </Card>
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <FileText className="h-5 w-5" />
            <span className="text-2xl font-bold">{stats.applications}</span>
          </div>
          <p className="text-sm text-muted-foreground">Candidatures</p>
        </Card>
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Calendar className="h-5 w-5" />
            <span className="text-2xl font-bold">{stats.responses}</span>
          </div>
          <p className="text-sm text-muted-foreground">Réponses</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Biographie</h2>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>

          {/* Languages & Skills */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Langues</h3>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src="/placeholder.svg" 
                      alt={`Portfolio ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Physical Characteristics */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taille</p>
                    <p className="font-medium">{profile.height} cm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Weight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Poids</p>
                    <p className="font-medium">{profile.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yeux</p>
                    <p className="font-medium">{profile.eyeColor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cheveux</p>
                    <p className="font-medium">{profile.hairColor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{profile.address}</p>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-muted-foreground">{profile.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewMode;
