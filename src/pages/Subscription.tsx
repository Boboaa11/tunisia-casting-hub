import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Crown, CreditCard, RefreshCw, XCircle, AlertTriangle,
  Calendar, DollarSign, CheckCircle, Megaphone, Send,
  ClipboardList, Bell, ArrowRight, Shield
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock subscription data based on user state
  const isActive = user?.hasSubscription ?? false;
  const plan = {
    name: isActive ? "Talent Mensuel" : "Aucun abonnement",
    price: isActive ? "29 TND/mois" : "—",
    startDate: isActive ? "15 Janvier 2026" : "—",
    nextBilling: isActive ? "15 Avril 2026" : "—",
  };

  const benefits = [
    { icon: Send, label: "Postuler à des castings illimités" },
    { icon: Megaphone, label: "Contacter les producteurs directement" },
    { icon: ClipboardList, label: "Suivre vos candidatures en temps réel" },
    { icon: Bell, label: "Recevoir des alertes casting personnalisées" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-10 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">

          {/* Page Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-hero rounded-xl shadow-glow">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mon Abonnement</h1>
              <p className="text-muted-foreground text-sm">Gérez votre adhésion et vos avantages</p>
            </div>
          </div>

          {/* Expired Banner */}
          {!isActive && (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ml-2">
                <span className="text-destructive font-medium">
                  Votre abonnement a expiré. Renouvelez pour continuer à postuler aux castings.
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => navigate("/subscription/plans")}
                  className="shrink-0"
                >
                  Renouveler <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Subscription Card */}
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Détails de votre abonnement actuel</p>
              </div>
              {isActive ? (
                <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1.5 px-3 py-1">
                  <Shield className="h-3.5 w-3.5" /> Pro Member
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1.5 px-3 py-1">
                  <XCircle className="h-3.5 w-3.5" /> Expiré
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, label: "Statut", value: isActive ? "Actif" : "Expiré", color: isActive ? "text-green-600" : "text-destructive" },
                  { icon: DollarSign, label: "Prix", value: plan.price, color: "text-foreground" },
                  { icon: Calendar, label: "Date de début", value: plan.startDate, color: "text-foreground" },
                  { icon: Calendar, label: "Prochaine facturation", value: plan.nextBilling, color: "text-foreground" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2 border-t">
                <Button variant="outline" size="sm" className="gap-2">
                  <CreditCard className="h-4 w-4" /> Modifier le paiement
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Changer de plan
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="h-4 w-4" /> Annuler l'abonnement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Avantages de l'abonnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                    <div className="p-2 rounded-md bg-primary/10">
                      <b.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{b.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
