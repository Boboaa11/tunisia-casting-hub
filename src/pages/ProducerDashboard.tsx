import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ProducerDashboard = () => {
  // Simulation de castings créés par le producteur
  const [castings] = useState([
    {
      id: 1,
      title: "Recherche Acteur Principal",
      production: "Film Tunisien 2024",
      type: "Cinéma",
      location: "Tunis",
      deadline: "2024-02-15",
      status: "Actif",
      applications: 24,
      views: 156,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Figuration Série TV",
      production: "Série Ramadan",
      type: "Télévision",
      location: "Sousse",
      deadline: "2024-02-20",
      status: "Brouillon",
      applications: 0,
      views: 0,
      createdAt: "2024-01-20"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-500";
      case "Brouillon":
        return "bg-yellow-500";
      case "Fermé":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard Producteur
              </h1>
              <p className="text-muted-foreground">
                Gérez vos castings et trouvez les meilleurs talents
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/create-casting">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Casting
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
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  +1 ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +12 cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +45 cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Castings Actifs</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  1 en brouillon
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="castings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="castings">Mes Castings</TabsTrigger>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="castings" className="space-y-6">
              <div className="grid gap-6">
                {castings.map((casting) => (
                  <Card key={casting.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{casting.title}</CardTitle>
                          <CardDescription>{casting.production}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {casting.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Deadline: {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(casting.status)} text-white`}
                          >
                            {casting.status}
                          </Badge>
                          <Badge variant="outline">{casting.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <span>{casting.applications} candidatures</span>
                          <span>{casting.views} vues</span>
                          <span>Créé le {new Date(casting.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
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
                  <CardTitle>Candidatures Récentes</CardTitle>
                  <CardDescription>
                    Gérez les candidatures reçues pour vos castings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Les candidatures apparaîtront ici une fois que vous aurez publié vos castings.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de Performance</CardTitle>
                  <CardDescription>
                    Analysez les performances de vos castings
                  </CardDescription>
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