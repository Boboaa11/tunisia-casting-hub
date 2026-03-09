import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, Calendar, MapPin, DollarSign, ListOrdered, Clock, CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_MAP: Record<string, string> = {
  new: "En attente",
  shortlisted: "Vu",
  accepted: "Acceptée",
  rejected: "Refusée",
};

const getDisplayStatus = (dbStatus: string | null) => STATUS_MAP[dbStatus || "new"] || "En attente";

interface ApplicationRow {
  id: string;
  status: string | null;
  submitted_at: string;
  cover_message: string;
  casting: {
    id: number;
    title: string;
    production: string;
    location: string;
    compensation: string;
    type: string;
    deadline: string;
  } | null;
  role: {
    id: string;
    name: string;
  } | null;
}

const formatDateFr = (dateStr: string) => format(parseISO(dateStr), "d MMMM yyyy", { locale: fr });

const MyApplications = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("id, status, submitted_at, cover_message, casting:castings(id, title, production, location, compensation, type, deadline), role:casting_roles(id, name)")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });

      if (!error && data) {
        setApplications(data as unknown as ApplicationRow[]);
      }
      setIsLoading(false);
    };

    fetchApplications();

    // Realtime subscription for auto-updates
    const channel = supabase
      .channel("my-applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications", filter: `user_id=eq.${user.id}` },
        () => fetchApplications()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Acceptée": return "bg-green-500";
      case "Refusée": return "bg-red-500";
      case "En attente": return "bg-yellow-500";
      case "Vu": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  const getStatusCount = (displayStatus: string) =>
    applications.filter(app => getDisplayStatus(app.status) === displayStatus).length;

  const filterByStatus = (displayStatus: string) =>
    applications.filter(app => getDisplayStatus(app.status) === displayStatus);

  const renderCard = (application: ApplicationRow) => {
    const displayStatus = getDisplayStatus(application.status);
    return (
      <Card key={application.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {application.role?.name || "Rôle"} — {application.casting?.title || "Casting"}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{application.casting?.production}</span>
                {application.casting?.type && <Badge variant="outline">{application.casting.type}</Badge>}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(displayStatus)} text-white`}>
              {displayStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Candidature: {formatDateFr(application.submitted_at)}</span>
            </div>
            {application.casting?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{application.casting.location}</span>
              </div>
            )}
            {application.casting?.compensation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{application.casting.compensation}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {application.casting?.id && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/castings/${application.casting.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir le casting
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (message?: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {message || "Vous n'avez pas encore postulé à un casting"}
      </h3>
      <p className="text-muted-foreground mb-6">
        Parcourez les castings disponibles et postulez dès maintenant
      </p>
      <Button asChild>
        <Link to="/castings">Découvrir les castings</Link>
      </Button>
    </div>
  );

  const renderTabContent = (filtered: ApplicationRow[], emptyMsg: string) =>
    filtered.length > 0 ? filtered.map(renderCard) : (
      <div className="text-center py-8 text-muted-foreground">{emptyMsg}</div>
    );

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Connectez-vous pour voir vos candidatures.</p>
          <Button asChild><Link to="/login">Se connecter</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Candidatures</h1>
          <p className="text-muted-foreground">Suivez l'état de vos candidatures aux castings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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

        {applications.length === 0 ? renderEmptyState() : (
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
              {renderTabContent(filterByStatus("En attente"), "Aucune candidature en attente")}
            </TabsContent>
            <TabsContent value="seen" className="space-y-4">
              {renderTabContent(filterByStatus("Vu"), "Aucune candidature consultée")}
            </TabsContent>
            <TabsContent value="accepted" className="space-y-4">
              {renderTabContent(filterByStatus("Acceptée"), "Aucune candidature acceptée")}
            </TabsContent>
            <TabsContent value="rejected" className="space-y-4">
              {renderTabContent(filterByStatus("Refusée"), "Aucune candidature refusée")}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default MyApplications;
