import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Calendar, Star, Check, Zap, Crown, ArrowRight } from "lucide-react";

const Billing = () => {
  const [currentPlan] = useState({
    name: "Plan Professionnel",
    price: 89,
    currency: "TND",
    billingCycle: "mensuel",
    nextBilling: "2024-02-15",
    status: "Actif"
  });

  const [usage] = useState({
    castings: { used: 8, limit: 15 },
    applications: { used: 127, limit: 500 },
    messages: { used: 234, limit: 1000 },
    analytics: { used: 45, limit: 100 }
  });

  const [invoices] = useState([
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: 89,
      status: "Payée",
      description: "Plan Professionnel - Janvier 2024"
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: 89,
      status: "Payée",
      description: "Plan Professionnel - Décembre 2023"
    },
    {
      id: "INV-2023-011",
      date: "2023-11-15",
      amount: 89,
      status: "Payée",
      description: "Plan Professionnel - Novembre 2023"
    }
  ]);

  const plans = [
    {
      name: "Basique",
      price: 29,
      description: "Parfait pour débuter",
      features: [
        "5 castings actifs",
        "100 candidatures par mois",
        "Messagerie de base",
        "Support par email"
      ],
      limitations: [
        "Pas d'analytics avancées",
        "Pas de recherche de talents"
      ],
      popular: false
    },
    {
      name: "Professionnel",
      price: 89,
      description: "Le plus populaire",
      features: [
        "15 castings actifs",
        "500 candidatures par mois",
        "Messagerie avancée",
        "Analytics détaillées",
        "Recherche de talents",
        "Support prioritaire"
      ],
      limitations: [],
      popular: true
    },
    {
      name: "Entreprise",
      price: 199,
      description: "Pour les grandes productions",
      features: [
        "Castings illimités",
        "Candidatures illimitées",
        "Équipe collaborative",
        "Analytics avancées",
        "Recherche de talents premium",
        "Support dédié",
        "API access"
      ],
      limitations: [],
      popular: false
    }
  ];

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Facturation</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et vos factures</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Plan Actuel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      <p className="text-3xl font-bold text-primary">
                        {currentPlan.price} {currentPlan.currency}
                        <span className="text-sm font-normal text-muted-foreground">/{currentPlan.billingCycle}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">{currentPlan.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Prochain paiement: {currentPlan.nextBilling}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Modifier le plan
                      </Button>
                      <Button variant="outline">
                        Annuler l'abonnement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Méthode de Paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expire 12/2027</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">Visa</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Modifier la méthode de paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Paiement réussi</p>
                        <p className="text-sm text-muted-foreground">Plan Professionnel - 89 TND</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">15 Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Plan amélioré</p>
                        <p className="text-sm text-muted-foreground">Basique → Professionnel</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">01 Jan 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Castings Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Castings Actifs</CardTitle>
                  <CardDescription>
                    {usage.castings.used} sur {usage.castings.limit} utilisés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={getUsagePercentage(usage.castings.used, usage.castings.limit)} 
                    className="mb-2" 
                  />
                  <p className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.castings.used, usage.castings.limit))}`}>
                    {usage.castings.limit - usage.castings.used} restants
                  </p>
                </CardContent>
              </Card>

              {/* Applications Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidatures Reçues</CardTitle>
                  <CardDescription>
                    {usage.applications.used} sur {usage.applications.limit} ce mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={getUsagePercentage(usage.applications.used, usage.applications.limit)} 
                    className="mb-2" 
                  />
                  <p className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.applications.used, usage.applications.limit))}`}>
                    {usage.applications.limit - usage.applications.used} restantes
                  </p>
                </CardContent>
              </Card>

              {/* Messages Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Messages Envoyés</CardTitle>
                  <CardDescription>
                    {usage.messages.used} sur {usage.messages.limit} ce mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={getUsagePercentage(usage.messages.used, usage.messages.limit)} 
                    className="mb-2" 
                  />
                  <p className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.messages.used, usage.messages.limit))}`}>
                    {usage.messages.limit - usage.messages.used} restants
                  </p>
                </CardContent>
              </Card>

              {/* Analytics Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Rapports Analytics</CardTitle>
                  <CardDescription>
                    {usage.analytics.used} sur {usage.analytics.limit} ce mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={getUsagePercentage(usage.analytics.used, usage.analytics.limit)} 
                    className="mb-2" 
                  />
                  <p className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.analytics.used, usage.analytics.limit))}`}>
                    {usage.analytics.limit - usage.analytics.used} restants
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Populaire
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      {plan.name === "Basique" && <Zap className="h-5 w-5" />}
                      {plan.name === "Professionnel" && <Crown className="h-5 w-5 text-yellow-500" />}
                      {plan.name === "Entreprise" && <Star className="h-5 w-5 text-purple-500" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="py-4">
                      <span className="text-4xl font-bold">{plan.price} TND</span>
                      <span className="text-muted-foreground">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {plan.limitations.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium text-muted-foreground">Limitations:</p>
                          {plan.limitations.map((limitation) => (
                            <div key={limitation} className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full border border-muted-foreground"></div>
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button 
                        className="w-full mt-6" 
                        variant={plan.name === currentPlan.name ? "outline" : "default"}
                        disabled={plan.name === currentPlan.name}
                      >
                        {plan.name === currentPlan.name ? "Plan Actuel" : "Choisir ce plan"}
                        {plan.name !== currentPlan.name && <ArrowRight className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Factures</CardTitle>
                <CardDescription>Téléchargez vos factures et reçus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{invoice.amount} TND</p>
                          <Badge className="bg-green-500">{invoice.status}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Billing;