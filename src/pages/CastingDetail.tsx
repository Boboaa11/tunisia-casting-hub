import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Calendar, Clock, DollarSign, Users, Film, Tv, Theater,
  ArrowLeft, Briefcase, Globe, Star, FileText, ChevronRight, UserCheck
} from "lucide-react";
import Layout from "@/components/Layout";
import { useCasting, CastingRole } from "@/contexts/CastingContext";
import { useAuth } from "@/contexts/AuthContext";
import CastingApplicationDialog from "@/components/CastingApplicationDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "tv": return Tv;
    case "film": return Film;
    case "theater": return Theater;
    default: return Briefcase;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "tv": return "bg-blue-100 text-blue-800";
    case "film": return "bg-purple-100 text-purple-800";
    case "theater": return "bg-green-100 text-green-800";
    case "commercial": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const CastingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { castings } = useCasting();
  const { user, isAuthenticated, setRedirectAfterAuth } = useAuth();
  const { toast } = useToast();

  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CastingRole | null>(null);

  const casting = castings.find(c => c.id === parseInt(id || "0"));

  if (!casting) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Casting introuvable</h1>
            <Button onClick={() => navigate("/castings")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux castings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const CategoryIcon = getCategoryIcon(casting.category);

  const handleApplyForRole = (role: CastingRole) => {
    if (!isAuthenticated) {
      setRedirectAfterAuth(`/casting/${casting.id}`);
      navigate('/login?message=login_required&castingId=' + casting.id);
      return;
    }
    if (user?.role !== 'talent') return;
    if (!user?.hasSubscription) {
      navigate(`/subscription?message=subscription_required&castingId=${casting.id}`);
      return;
    }
    setSelectedRole(role);
    setApplicationDialogOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/castings")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux castings
          </Button>

          {/* Header Card */}
          <Card className="shadow-elegant mb-6 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className={getCategoryColor(casting.category)}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {casting.type}
                    </Badge>
                    {casting.status && (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        {casting.status}
                      </Badge>
                    )}
                    {casting.roles && (
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {casting.roles.length} rôle{casting.roles.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {casting.title}
                  </CardTitle>
                  <p className="text-lg text-muted-foreground font-medium">{casting.production}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-up">
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lieu</p>
                  <p className="text-sm font-semibold text-foreground">{casting.location}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date limite</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rémunération</p>
                  <p className="text-sm font-semibold text-foreground">{casting.compensation}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Candidatures</p>
                  <p className="text-sm font-semibold text-foreground">{casting.applications || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description du projet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {casting.synopsis || casting.description}
                  </p>
                </CardContent>
              </Card>

              {/* Roles with individual Apply buttons */}
              {casting.roles && casting.roles.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Rôles recherchés ({casting.roles.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {casting.roles.map((role, index) => (
                      <div key={role.id || index}>
                        {index > 0 && <Separator className="mb-6" />}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-foreground text-base">{role.name}</h4>
                            {role.talentsNeeded && (
                              <Badge variant="outline" className="shrink-0">
                                <UserCheck className="h-3 w-3 mr-1" />
                                {role.talentsNeeded} recherché{role.talentsNeeded > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" /> {role.ageRange}
                            </Badge>
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" /> {role.gender}
                            </Badge>
                            {role.ethnicity && (
                              <Badge variant="outline">{role.ethnicity}</Badge>
                            )}
                            {role.experienceLevel && (
                              <Badge variant="outline">
                                <Star className="h-3 w-3 mr-1" /> {role.experienceLevel}
                              </Badge>
                            )}
                          </div>

                          {role.appearance && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Apparence :</span> {role.appearance}
                            </p>
                          )}

                          {role.skills && role.skills.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-foreground">Compétences :</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {role.skills.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {role.languages && role.languages.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">
                                {role.languages.join(', ')}
                              </span>
                            </div>
                          )}

                          {role.specialTalents && role.specialTalents.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-foreground flex items-center gap-1">
                                <Star className="h-4 w-4 text-primary" /> Talents spéciaux :
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {role.specialTalents.map((talent, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-accent/20">{talent}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground pt-1">
                            {role.shootingDates && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-primary" />
                                {role.shootingDates}
                              </div>
                            )}
                            {role.roleLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-primary" />
                                {role.roleLocation}
                              </div>
                            )}
                            {role.roleCompensation && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-primary" />
                                {role.roleCompensation}
                              </div>
                            )}
                          </div>

                          {/* Per-role Apply button */}
                          <div className="pt-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApplyForRole(role)}
                              disabled={user?.role === 'producer'}
                            >
                              {user?.role === 'producer' ? 'Producteur' : `Postuler pour ${role.name}`}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Exigences générales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {casting.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                  {casting.additionalRequirements && casting.additionalRequirements.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h4 className="text-sm font-semibold text-foreground mb-2">Documents requis :</h4>
                      <ul className="space-y-2">
                        {casting.additionalRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Détails de production</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {casting.productionDates && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Dates de tournage</p>
                        <p className="text-sm text-muted-foreground">{casting.productionDates}</p>
                      </div>
                    </div>
                  )}
                  {casting.shootingLocations && casting.shootingLocations.length > 0 && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Lieux de tournage</p>
                        {casting.shootingLocations.map((loc, i) => (
                          <p key={i} className="text-sm text-muted-foreground">{loc}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {casting.compensationDetails && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Rémunération détaillée</p>
                        <p className="text-sm text-muted-foreground">{casting.compensationDetails}</p>
                      </div>
                    </div>
                  )}
                  {casting.createdAt && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Publié le</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(casting.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Intéressé(e) ?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choisissez un rôle ci-dessus et postulez avant le {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {casting.roles?.length || 0} rôle{(casting.roles?.length || 0) > 1 ? 's' : ''} disponible{(casting.roles?.length || 0) > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CastingApplicationDialog
        casting={casting}
        role={selectedRole}
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </Layout>
  );
};

export default CastingDetail;
