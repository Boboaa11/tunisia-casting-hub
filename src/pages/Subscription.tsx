import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Subscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setSubscription, redirectAfterAuth } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const castingId = searchParams.get('castingId');
  const showMessage = searchParams.get('message') === 'subscription_required';

  const plans = [
    {
      id: "monthly",
      name: "Mensuel",
      price: "29",
      period: "/mois",
      description: "Parfait pour commencer",
      features: [
        "Accès illimité aux castings",
        "Postuler à tous les rôles",
        "Profil visible par les producteurs",
        "Notifications en temps réel",
        "Support par email"
      ],
      popular: false
    },
    {
      id: "quarterly",
      name: "Trimestriel",
      price: "69",
      period: "/3 mois",
      originalPrice: "87",
      description: "Économisez 20%",
      features: [
        "Tout du plan Mensuel",
        "Profil mis en avant",
        "Statistiques de visibilité",
        "Badge vérifié",
        "Support prioritaire"
      ],
      popular: true
    },
    {
      id: "yearly",
      name: "Annuel",
      price: "199",
      period: "/an",
      originalPrice: "348",
      description: "Meilleure valeur - Économisez 43%",
      features: [
        "Tout du plan Trimestriel",
        "Profil en tête des recherches",
        "Accès anticipé aux castings",
        "Coaching carrière mensuel",
        "Support téléphonique VIP"
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubscription(true);
    setIsProcessing(false);

    toast({
      title: "Abonnement activé !",
      description: "Bienvenue dans la communauté Tunisia Casting. Vous pouvez maintenant postuler à tous les castings.",
    });

    // Redirect to casting if there was one
    if (castingId) {
      navigate(`/castings?apply=${castingId}`);
    } else if (redirectAfterAuth) {
      navigate(redirectAfterAuth);
    } else {
      navigate('/castings');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            {showMessage && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
                <p className="text-amber-800 font-medium">
                  🎬 Un abonnement est requis pour postuler aux castings
                </p>
              </div>
            )}
            
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Devenez membre Talent
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Accédez à des centaines de castings exclusifs et lancez votre carrière dans l'industrie du divertissement tunisienne
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Zap, text: "Candidatures illimitées" },
              { icon: Star, text: "Profil premium" },
              { icon: Check, text: "Notifications instantanées" },
              { icon: Crown, text: "Support prioritaire" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-card">
                <benefit.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative shadow-card hover:shadow-elegant transition-all duration-300 ${
                  plan.popular ? 'border-primary border-2 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Le plus populaire
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through mr-2">
                        {plan.originalPrice} TND
                      </span>
                    )}
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> TND{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      "Traitement en cours..."
                    ) : (
                      <>
                        Choisir ce plan
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">🔒 Paiement sécurisé • Annulation à tout moment • Satisfait ou remboursé 14 jours</p>
            <p className="text-xs">Plus de 2,000 talents nous font déjà confiance</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
