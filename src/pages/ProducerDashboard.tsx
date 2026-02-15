import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, Calendar, MapPin, Users, Mail, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useCasting } from "@/contexts/CastingContext";

const ProducerDashboard = () => {
  const { castings, deleteCasting, applications, getApplicationsForCasting, getApplicationsForRole } = useCasting();
  const [selectedCastingFilter, setSelectedCastingFilter] = useState<string>("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  const producerCastings = castings.filter(casting => casting.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "bg-green-500";
      case "Brouillon": return "bg-yellow-500";
      case "Fermé": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Get filtered applications
  const filteredCasting = selectedCastingFilter !== "all"
    ? producerCastings.find(c => c.id === parseInt(selectedCastingFilter))
    : null;

  const filteredApplications = selectedCastingFilter === "all"
    ? applications
    : selectedRoleFilter === "all"
      ? getApplicationsForCasting(parseInt(selectedCastingFilter))
      : getApplicationsForRole(parseInt(selectedCastingFilter), selectedRoleFilter);

  // Get available roles for the selected casting
  const availableRoles = filteredCasting?.roles || [];

  // Group applications by role for display
  const getGroupedApplications = () => {
    const groups: Record<string, { roleName: string; castingTitle: string; apps: typeof applications }> = {};
    
    filteredApplications.forEach(app => {
      const casting = castings.find(c => c.id === app.castingId);
      const role = casting?.roles?.find(r => r.id === app.roleId);
      const key = `${app.castingId}-${app.roleId}`;
      
      if (!groups[key]) {
        groups[key] = {
          roleName: role?.name || "Rôle inconnu",
          castingTitle: casting?.title || "Casting inconnu",
          apps: [],
        };
      }
      groups[key].apps.push(app);
    });

    return groups;
  };

  const groupedApplications = getGroupedApplications();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Producteur</h1>
              <p className="text-muted-foreground">Gérez vos castings et trouvez les meilleurs talents</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/create-casting">
                <Plus className="w-4 h-4 mr-2" /> Nouveau Casting
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Castings</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{producerCastings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{producerCastings.reduce((t, c) => t + (c.views || 0), 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Castings Actifs</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{producerCastings.filter(c => c.status === "Actif").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="castings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="castings">Mes Castings</TabsTrigger>
              <TabsTrigger value="applications">
                Candidatures ({applications.length})
              </TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="castings" className="space-y-6">
              <div className="grid gap-6">
                {producerCastings.map((casting) => (
                  <Card key={casting.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{casting.title}</CardTitle>
                          <CardDescription>{casting.production}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {casting.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> Deadline: {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {casting.roles?.length || 0} rôles
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${getStatusColor(casting.status!)} text-white`}>
                            {casting.status}
                          </Badge>
                          <Badge variant="outline">{casting.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Roles summary */}
                      {casting.roles && casting.roles.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Rôles :</p>
                          <div className="flex flex-wrap gap-2">
                            {casting.roles.map(role => {
                              const roleApps = getApplicationsForRole(casting.id, role.id);
                              return (
                                <Badge key={role.id} variant="outline" className="text-xs">
                                  {role.name} — {roleApps.length} candidature{roleApps.length !== 1 ? 's' : ''}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <span>{getApplicationsForCasting(casting.id).length} candidatures</span>
                          <span>{casting.views} vues</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/casting/${casting.id}`}>
                              <Eye className="w-4 h-4 mr-1" /> Voir
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" /> Modifier
                          </Button>
                          <Button
                            variant="outline" size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteCasting(casting.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Candidatures par rôle</CardTitle>
                  <CardDescription>Filtrez et consultez les candidatures groupées par rôle</CardDescription>
                  
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <div className="flex-1">
                      <Select value={selectedCastingFilter} onValueChange={(v) => { setSelectedCastingFilter(v); setSelectedRoleFilter("all"); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrer par casting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les castings</SelectItem>
                          {producerCastings.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedCastingFilter !== "all" && availableRoles.length > 0 && (
                      <div className="flex-1">
                        <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filtrer par rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            {availableRoles.map(r => (
                              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(groupedApplications).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Aucune candidature trouvée pour les filtres sélectionnés.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedApplications).map(([key, group]) => (
                        <div key={key}>
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-foreground">{group.roleName}</h4>
                            <Badge variant="secondary" className="text-xs">{group.castingTitle}</Badge>
                            <Badge variant="outline" className="text-xs">{group.apps.length} candidature{group.apps.length !== 1 ? 's' : ''}</Badge>
                          </div>
                          <div className="grid gap-3">
                            {group.apps.map(app => (
                              <Card key={app.id} className="shadow-card">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                      <p className="font-medium text-foreground">{app.applicantName}</p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3" /> {app.applicantEmail}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-2">{app.coverMessage}</p>
                                      {app.experience && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          <span className="font-medium text-foreground">Expérience :</span> {app.experience}
                                        </p>
                                      )}
                                      {app.availability && (
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium text-foreground">Disponibilité :</span> {app.availability}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {app.photoFiles && app.photoFiles.length > 0 && (
                                          <Badge variant="outline" className="text-xs">📷 {app.photoFiles.length} photo(s)</Badge>
                                        )}
                                        {app.videoShowreel && (
                                          <Badge variant="outline" className="text-xs">🎬 Showreel</Badge>
                                        )}
                                        {app.portfolioFile && (
                                          <Badge variant="outline" className="text-xs">📄 Portfolio</Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                      <Clock className="h-3 w-3" />
                                      {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de Performance</CardTitle>
                  <CardDescription>Analysez les performances de vos castings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Les statistiques détaillées seront disponibles ici.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProducerDashboard;
