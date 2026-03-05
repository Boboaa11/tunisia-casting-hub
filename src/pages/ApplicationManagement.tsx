import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Search, Filter, Star, X, MessageSquare, Eye, Users, ChevronLeft,
  Clock, MapPin, Briefcase, SlidersHorizontal, UserCheck, UserX, Sparkles
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCasting } from "@/contexts/CastingContext";

type AppStatus = "new" | "shortlisted" | "rejected";
type SortOption = "newest" | "oldest" | "best-match";

interface EnrichedApplication {
  id: string;
  castingId: number;
  roleId: string;
  applicantName: string;
  applicantEmail: string;
  coverMessage: string;
  experience: string;
  availability: string;
  photoFiles?: string[];
  videoShowreel?: string;
  portfolioFile?: string;
  submittedAt: string;
  // Enriched mock fields
  age: number;
  gender: string;
  location: string;
  skills: string[];
  languages: string[];
  experienceLevel: string;
  status: AppStatus;
  matchScore: number;
}

const mockEnrich = (app: any, index: number): EnrichedApplication => {
  const genders = ["Homme", "Femme", "Homme", "Femme"];
  const locations = ["Tunis", "Sousse", "Sfax", "Sidi Bou Said", "Monastir", "Bizerte"];
  const skills = [
    ["Acting", "Stage combat", "Horseback riding"],
    ["Comedy", "Improvisation", "Dance"],
    ["Drama", "Classical acting", "Singing"],
    ["Modeling", "Posing", "Movement"],
    ["Physical theater", "Acrobatics", "Mime"],
  ];
  const expLevels = ["Débutant", "Intermédiaire", "Professionnel", "Expert"];
  const langs = [
    ["Arabe", "Français"],
    ["Arabe", "Français", "Anglais"],
    ["Arabe"],
    ["Arabe", "Français", "Italien"],
  ];
  const statuses: AppStatus[] = ["new", "new", "shortlisted", "new"];

  return {
    ...app,
    age: 20 + (index * 7) % 20,
    gender: genders[index % genders.length],
    location: locations[index % locations.length],
    skills: skills[index % skills.length],
    languages: langs[index % langs.length],
    experienceLevel: expLevels[index % expLevels.length],
    status: statuses[index % statuses.length],
    matchScore: 60 + (index * 13) % 40,
  };
};

const ApplicationManagement = () => {
  const [searchParams] = useSearchParams();
  const castingIdParam = searchParams.get("castingId");
  const { castings, applications, getApplicationsForCasting } = useCasting();

  const [selectedCastingId, setSelectedCastingId] = useState<string>(castingIdParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [statusTab, setStatusTab] = useState("all");
  const [appStatuses, setAppStatuses] = useState<Record<string, AppStatus>>({});

  const producerCastings = castings.filter(c => c.status);

  const enrichedApps: EnrichedApplication[] = useMemo(() => {
    const baseApps = selectedCastingId === "all"
      ? applications
      : getApplicationsForCasting(parseInt(selectedCastingId));
    return baseApps.map((app, i) => {
      const enriched = mockEnrich(app, i);
      if (appStatuses[app.id]) enriched.status = appStatuses[app.id];
      return enriched;
    });
  }, [selectedCastingId, applications, appStatuses, getApplicationsForCasting]);

  const selectedCasting = selectedCastingId !== "all"
    ? producerCastings.find(c => c.id === parseInt(selectedCastingId))
    : null;

  const filteredApps = useMemo(() => {
    let result = [...enrichedApps];

    if (statusTab === "shortlisted") result = result.filter(a => a.status === "shortlisted");
    else if (statusTab === "rejected") result = result.filter(a => a.status === "rejected");
    else if (statusTab === "new") result = result.filter(a => a.status === "new");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.applicantName.toLowerCase().includes(q) ||
        a.applicantEmail.toLowerCase().includes(q)
      );
    }
    if (genderFilter !== "all") result = result.filter(a => a.gender === genderFilter);
    if (locationFilter !== "all") result = result.filter(a => a.location === locationFilter);
    if (expFilter !== "all") result = result.filter(a => a.experienceLevel === expFilter);
    if (roleFilter !== "all") result = result.filter(a => a.roleId === roleFilter);

    if (sortBy === "newest") result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    else result.sort((a, b) => b.matchScore - a.matchScore);

    return result;
  }, [enrichedApps, statusTab, searchQuery, genderFilter, locationFilter, expFilter, roleFilter, sortBy]);

  const shortlistedCount = enrichedApps.filter(a => a.status === "shortlisted").length;
  const newCount = enrichedApps.filter(a => a.status === "new").length;
  const rejectedCount = enrichedApps.filter(a => a.status === "rejected").length;

  const updateStatus = (appId: string, status: AppStatus) => {
    setAppStatuses(prev => ({ ...prev, [appId]: status }));
  };

  const getStatusBadge = (status: AppStatus) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-500/15 text-blue-700 border-blue-200">Nouvelle</Badge>;
      case "shortlisted": return <Badge className="bg-green-500/15 text-green-700 border-green-200">Présélectionné</Badge>;
      case "rejected": return <Badge className="bg-destructive/15 text-destructive border-destructive/20">Refusé</Badge>;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-muted-foreground";
  };

  const uniqueLocations = [...new Set(enrichedApps.map(a => a.location))];
  const availableRoles = selectedCasting?.roles || [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/producer-dashboard"><ChevronLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Gestion des Candidatures</h1>
              <p className="text-muted-foreground">
                Examinez, filtrez et gérez les candidatures de vos castings
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{enrichedApps.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{newCount}</p>
                  <p className="text-xs text-muted-foreground">Nouvelles</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{shortlistedCount}</p>
                  <p className="text-xs text-muted-foreground">Présélectionnés</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4 flex items-center gap-3">
                <UserX className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-xs text-muted-foreground">Refusés</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm text-foreground">Filtres</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un talent..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCastingId} onValueChange={v => { setSelectedCastingId(v); setRoleFilter("all"); }}>
                  <SelectTrigger><SelectValue placeholder="Casting" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les castings</SelectItem>
                    {producerCastings.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableRoles.length > 0 && (
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      {availableRoles.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger><SelectValue placeholder="Ville" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {uniqueLocations.map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Select value={expFilter} onValueChange={setExpFilter}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Expérience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Professionnel">Professionnel</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Trier par" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récentes</SelectItem>
                    <SelectItem value="oldest">Plus anciennes</SelectItem>
                    <SelectItem value="best-match">Meilleur match</SelectItem>
                  </SelectContent>
                </Select>
                {(searchQuery || genderFilter !== "all" || locationFilter !== "all" || expFilter !== "all" || roleFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSearchQuery(""); setGenderFilter("all"); setLocationFilter("all"); setExpFilter("all"); setRoleFilter("all"); }}
                  >
                    <X className="h-4 w-4 mr-1" /> Réinitialiser
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Tabs + Application Cards */}
          <Tabs value={statusTab} onValueChange={setStatusTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes ({enrichedApps.length})</TabsTrigger>
              <TabsTrigger value="new">Nouvelles ({newCount})</TabsTrigger>
              <TabsTrigger value="shortlisted">Présélectionnés ({shortlistedCount})</TabsTrigger>
              <TabsTrigger value="rejected">Refusés ({rejectedCount})</TabsTrigger>
            </TabsList>

            {["all", "new", "shortlisted", "rejected"].map(tab => (
              <TabsContent key={tab} value={tab}>
                {filteredApps.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Aucune candidature trouvée pour ces critères.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{filteredApps.length} résultat{filteredApps.length > 1 ? "s" : ""}</p>
                    {filteredApps.map(app => {
                      const casting = castings.find(c => c.id === app.castingId);
                      const role = casting?.roles?.find(r => r.id === app.roleId);
                      return (
                        <Card key={app.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <Avatar className="h-14 w-14 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                  {app.applicantName.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-semibold text-foreground text-base">{app.applicantName}</h3>
                                  {getStatusBadge(app.status)}
                                  <span className={`text-xs font-medium ${getMatchColor(app.matchScore)}`}>
                                    {app.matchScore}% match
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2 flex-wrap">
                                  <span>{app.gender} · {app.age} ans</span>
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>
                                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{app.experienceLevel}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(app.submittedAt).toLocaleDateString("fr-FR")}</span>
                                </div>

                                {/* Role & Casting */}
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  {role && <Badge variant="outline" className="text-xs">{role.name}</Badge>}
                                  {casting && <span className="text-xs text-muted-foreground">— {casting.title}</span>}
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {app.skills.slice(0, 4).map(s => (
                                    <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
                                  ))}
                                  {app.languages.map(l => (
                                    <Badge key={l} variant="outline" className="text-xs font-normal">{l}</Badge>
                                  ))}
                                </div>

                                {/* Cover message preview */}
                                <p className="text-sm text-muted-foreground line-clamp-2">{app.coverMessage}</p>

                                {/* Media indicators */}
                                <div className="flex gap-2 mt-2">
                                  {app.photoFiles && app.photoFiles.length > 0 && (
                                    <span className="text-xs text-muted-foreground">📷 {app.photoFiles.length} photo(s)</span>
                                  )}
                                  {app.videoShowreel && <span className="text-xs text-muted-foreground">🎬 Showreel</span>}
                                  {app.portfolioFile && <span className="text-xs text-muted-foreground">📄 Portfolio</span>}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> Profil
                                </Button>
                                {app.status !== "shortlisted" ? (
                                  <Button
                                    size="sm"
                                    onClick={() => updateStatus(app.id, "shortlisted")}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Star className="h-4 w-4 mr-1" /> Présélectionner
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateStatus(app.id, "new")}
                                    className="border-green-300 text-green-700"
                                  >
                                    <Star className="h-4 w-4 mr-1 fill-green-500" /> Présélectionné
                                  </Button>
                                )}
                                {app.status !== "rejected" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => updateStatus(app.id, "rejected")}
                                  >
                                    <X className="h-4 w-4 mr-1" /> Refuser
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateStatus(app.id, "new")}
                                  >
                                    Restaurer
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationManagement;
