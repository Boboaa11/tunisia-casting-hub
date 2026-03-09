import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, Calendar, MapPin, DollarSign, ListOrdered, Clock, CheckCircle, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const formatDateFr = (dateStr: string) => format(parseISO(dateStr), "d MMMM yyyy", { locale: fr });

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
    },
    {
      id: 4,
      castingTitle: "Rôle Secondaire - Court Métrage",
      production: "Indie Films",
      appliedDate: "2024-01-12",
      status: "Vu",
      location: "Tunis",
      deadline: "2024-02-01",
      compensation: "1500 TND",
      type: "Court métrage",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "acceptée": return "bg-green-500";
      case "refusée": return "bg-red-500";
      case "en attente": return "bg-yellow-500";
      case "vu": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusCount = (status: string) =>
    applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;

  const renderCard = (application: typeof applications[0]) => (
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
            <span>Candidature: {formatDateFr(application.appliedDate)}</span>
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
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Candidatures</h1>
          <p className="text-muted-foreground">Suivez l'état de vos candidatures aux castings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Vu</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getStatusCount("Vu")}</div>
              <p className="text-xs text-muted-foreground">consultées par le casteur</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount("Acceptée")}</div>
              <p className="text-xs text-muted-foreground">candidatures retenues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refusées</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getStatusCount("Refusée")}</div>
              <p className="text-xs text-muted-foreground">candidatures non retenues</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="seen">Vu</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées</TabsTrigger>
            <TabsTrigger value="rejected">Refusées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map(renderCard)}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            {applications.filter(a => a.status === "En attente").map(renderCard)}
          </TabsContent>
          <TabsContent value="seen" className="space-y-4">
            {applications.filter(a => a.status === "Vu").map(renderCard)}
          </TabsContent>
          <TabsContent value="accepted" className="space-y-4">
            {applications.filter(a => a.status === "Acceptée").map(renderCard)}
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            {applications.filter(a => a.status === "Refusée").map(renderCard)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyApplications;
