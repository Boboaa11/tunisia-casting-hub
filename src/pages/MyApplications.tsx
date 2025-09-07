import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, Calendar, MapPin, Clock, DollarSign } from "lucide-react";

const MyApplications = () => {
  const [applications] = useState([
    {
      id: 1,
      castingTitle: "Acteur Principal - Film Historique",
      production: "Atlas Films",
      appliedDate: "2024-01-15",
      status: "En attente",
      location: "Tunis",
      deadline: "2024-02-15",
      compensation: "5000 TND",
      type: "Film",
      message: "Candidature envoyée avec CV et photos"
    },
    {
      id: 2,
      castingTitle: "Mannequin - Campagne Publicitaire",
      production: "Creative Agency",
      appliedDate: "2024-01-10",
      status: "Acceptée",
      location: "Sousse",
      deadline: "2024-01-25",
      compensation: "2000 TND",
      type: "Publicité",
      message: "Félicitations! Vous êtes sélectionné(e)"
    },
    {
      id: 3,
      castingTitle: "Figurant - Série TV",
      production: "TV Production",
      appliedDate: "2024-01-08",
      status: "Refusée",
      location: "Sfax",
      deadline: "2024-01-20",
      compensation: "300 TND",
      type: "Série",
      message: "Merci pour votre candidature. Profil non retenu."
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "acceptée":
        return "bg-green-500";
      case "refusée":
        return "bg-red-500";
      case "en attente":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Candidatures</h1>
          <p className="text-muted-foreground">Suivez l'état de vos candidatures aux castings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">candidatures envoyées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount("En attente")}</div>
              <p className="text-xs text-muted-foreground">réponses attendues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount("Acceptée")}</div>
              <p className="text-xs text-muted-foreground">candidatures retenues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refusées</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getStatusCount("Refusée")}</div>
              <p className="text-xs text-muted-foreground">candidatures non retenues</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées</TabsTrigger>
            <TabsTrigger value="rejected">Refusées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.castingTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{application.production}</span>
                        <Badge variant="outline">{application.type}</Badge>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Candidature: {application.appliedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{application.compensation}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <p className="text-sm">{application.message}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir le casting
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            {applications.filter(app => app.status === "En attente").map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.castingTitle}</CardTitle>
                      <CardDescription>{application.production}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{application.message}</p>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le casting
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="accepted">
            {applications.filter(app => app.status === "Acceptée").map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow border-green-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.castingTitle}</CardTitle>
                      <CardDescription>{application.production}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-4">{application.message}</p>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter le producteur
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails du contrat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected">
            {applications.filter(app => app.status === "Refusée").map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow border-red-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.castingTitle}</CardTitle>
                      <CardDescription>{application.production}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-4">{application.message}</p>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir d'autres castings
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyApplications;