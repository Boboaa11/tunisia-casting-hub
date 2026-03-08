import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Search, CreditCard, Eye, ChevronRight, PartyPopper, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";

const TUNISIAN_CITIES = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana",
  "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul",
  "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Tozeur",
  "Siliana", "Kébili", "Zaghouan", "Manouba", "Le Kef"
];

const TALENT_TYPES = [
  { value: "actor", label: "Acteur / Actrice" },
  { value: "model", label: "Mannequin" },
  { value: "musician", label: "Musicien(ne)" },
  { value: "dancer", label: "Danseur / Danseuse" },
  { value: "extras", label: "Figurant(e)" },
  { value: "other", label: "Autre" },
];

const TalentOnboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [pageReady, setPageReady] = useState(false);

  // Fade in the page on mount (after welcome overlay)
  useState(() => {
    const timer = setTimeout(() => setPageReady(true), 100);
    return () => clearTimeout(timer);
  });

  // Step 1 form
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [talentType, setTalentType] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const transitionTo = useCallback((nextStep: number) => {
    if (isTransitioning) return;
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(true);
      setFadeState("out");

      setTimeout(() => {
        setCurrentStep(nextStep);
        setFadeState("in");
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 350);
      }, 350);
    }, 400);
  }, [isTransitioning]);

  const handleFinish = () => {
    if (isTransitioning) return;
    setIsLoading(true);
    setTimeout(() => {
      completeOnboarding();
      navigate("/castings");
    }, 500);
  };

  const firstName = user?.name?.split(" ")[0] || "Talent";

  const progressPercent = ((currentStep - 1) / 2) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step === currentStep
                      ? "bg-primary text-primary-foreground shadow-glow scale-110"
                      : step < currentStep
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className="w-12 h-0.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-in-out"
                      style={{
                        width: step < currentStep ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground transition-opacity duration-300">
            Étape {currentStep} sur 3
          </p>

          {/* Step content with fade transition */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              fadeState === "out"
                ? "opacity-0 translate-y-3"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Step 1 — Complete your profile */}
            {currentStep === 1 && (
              <Card className="shadow-elegant bg-card">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                      Complétez votre profil
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Ces informations aideront les directeurs de casting à vous trouver
                    </p>
                  </div>

                  {/* Photo */}
                  <div className="flex flex-col items-center gap-3">
                    <label htmlFor="photo-upload" className="cursor-pointer group relative">
                      <Avatar className="h-24 w-24 border-2 border-muted group-hover:border-primary transition-colors">
                        <AvatarImage src={profilePhoto || undefined} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                          {firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-elegant">
                        <Camera className="h-4 w-4" />
                      </div>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <span className="text-sm text-muted-foreground">Photo de profil</span>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="+216 XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="shadow-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Âge</Label>
                      <Input
                        type="number"
                        placeholder="25"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="shadow-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Ville</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="shadow-card">
                        <SelectValue placeholder="Sélectionnez votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {TUNISIAN_CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Type de talent</Label>
                    <Select value={talentType} onValueChange={setTalentType}>
                      <SelectTrigger className="shadow-card">
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {TALENT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => transitionTo(2)}
                      disabled={isLoading || isTransitioning}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          Continuer
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => transitionTo(2)}
                      disabled={isLoading || isTransitioning}
                    >
                      Passer cette étape
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2 — How it works */}
            {currentStep === 2 && (
              <Card className="shadow-elegant bg-card">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                      Comment ça marche
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Découvrez comment tirer le meilleur de Tunisia Casting
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        icon: Search,
                        title: "Parcourez les castings",
                        description: "Explorez tous les rôles disponibles gratuitement. Films, séries, publicités — tout est accessible.",
                      },
                      {
                        icon: CreditCard,
                        title: "Abonnez-vous pour postuler",
                        description: "Souscrivez à un abonnement pour débloquer les candidatures et postuler aux castings qui vous intéressent.",
                      },
                      {
                        icon: Eye,
                        title: "Soyez découvert",
                        description: "Les directeurs de casting peuvent parcourir votre profil et vous contacter directement.",
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <card.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{card.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => transitionTo(3)}
                    disabled={isLoading || isTransitioning}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3 — You're ready */}
            {currentStep === 3 && (
              <Card className="shadow-elegant bg-card">
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-hero rounded-full shadow-glow">
                      <PartyPopper className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Bienvenue, {firstName} !
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Votre compte est maintenant actif. Vous êtes prêt(e) à
                      découvrir les meilleures opportunités de casting en Tunisie.
                    </p>
                  </div>

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleFinish}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirection...
                      </>
                    ) : (
                      "Découvrir les castings"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TalentOnboarding;
