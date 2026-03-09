import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Star, Users, Clapperboard, CheckCircle, Send, Camera, Check } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, validateEmail, validatePassword, validateConfirmPassword, validateRequired, validatePhone } from "@/hooks/useFormValidation";
import FormFieldError from "@/components/FormFieldError";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import Layout from "@/components/Layout";

type AccountType = 'talent' | 'producer' | null;

const TUNISIAN_CITIES = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana",
  "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul",
  "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Tozeur",
  "Siliana", "Kébili", "Zaghouan", "Manouba", "Le Kef"
];

const TALENT_TYPES = [
  { value: "actor", label: "Acteur / Actrice" },
  { value: "model", label: "Mannequin" },
  { value: "dancer", label: "Danseur / Danseuse" },
  { value: "musician", label: "Musicien / Musicienne" },
  { value: "extras", label: "Figurant" },
  { value: "other", label: "Autre" },
];

const PLAN_FEATURES = [
  "Candidatures illimitées",
  "Accès aux détails des castings",
  "Profil visible aux directeurs de casting",
];

// Minimal navbar for the talent registration flow
const RegistrationNav = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-card backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-hero rounded-lg shadow-elegant group-hover:shadow-glow transition-all duration-300">
              <Star className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Tunisia Casting
            </span>
          </Link>
          <button
            onClick={() => navigate('/castings')}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Passer
          </button>
        </div>
      </div>
    </header>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, setSubscription } = useAuth();
  const { toast } = useToast();

  const locationState = location.state as { accountType?: AccountType } | null;
  const [mainStep, setMainStep] = useState<'choose' | 'talent-flow' | 'producer-form'>(
    locationState?.accountType === 'talent' ? 'talent-flow' :
    locationState?.accountType === 'producer' ? 'producer-form' : 'choose'
  );

  // Talent 3-step flow state
  const [talentStep, setTalentStep] = useState(1);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [talentType, setTalentType] = useState("");
  const [city, setCity] = useState("");

  // Producer form
  const [producerFormData, setProducerFormData] = useState({
    fullName: "", email: "", phone: "", companyName: "", productionType: "", description: "", certifyInfo: false,
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const step1Validation = useFormValidation();
  const producerValidation = useFormValidation();

  const transitionTo = useCallback((nextStep: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFadeState("out");
    setTimeout(() => {
      setTalentStep(nextStep);
      setFadeState("in");
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  }, [isTransitioning]);

  // Step 1 submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    step1Validation.setFieldError("email", emailErr);
    step1Validation.setFieldError("password", passErr);
    step1Validation.setFieldError("confirmPassword", confirmErr);
    step1Validation.markTouched("email");
    step1Validation.markTouched("password");
    step1Validation.markTouched("confirmPassword");
    if (emailErr || passErr || confirmErr) {
      toast({ title: "Erreur", description: "Veuillez corriger les erreurs", variant: "destructive" });
      return;
    }
    // Create the account
    signup(email, password, "", 'talent');
    transitionTo(2);
  };

  // Step 2 continue
  const handleStep2Continue = () => {
    // Optional — just move forward, profile info is optional
    transitionTo(3);
  };

  // Step 3 — choose plan
  const handleChoosePlan = (plan: 'monthly' | 'yearly') => {
    setSubscription(true);
    toast({ title: "Abonnement activé", description: plan === 'monthly' ? "Plan mensuel — 19 TND/mois" : "Plan annuel — 149 TND/an" });
    navigate('/castings');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Producer form handlers
  const validateProducerField = useCallback((name: string, value: string) => {
    switch (name) {
      case "fullName": return validateRequired(value, "Le prénom et nom");
      case "email": return validateEmail(value);
      case "phone": return validatePhone(value);
      case "companyName": return validateRequired(value, "Le nom de la société");
      default: return "";
    }
  }, []);

  const handleProducerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ["fullName", "email", "phone", "companyName"];
    let hasError = false;
    for (const field of fields) {
      const error = validateProducerField(field, (producerFormData as any)[field]);
      producerValidation.setFieldError(field, error);
      producerValidation.markTouched(field);
      if (error) hasError = true;
    }
    if (!producerFormData.certifyInfo) {
      toast({ title: "Erreur", description: "Veuillez certifier que les informations sont exactes", variant: "destructive" });
      return;
    }
    if (!producerFormData.productionType) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un type de production", variant: "destructive" });
      return;
    }
    if (hasError) {
      toast({ title: "Erreur", description: "Veuillez corriger les erreurs du formulaire", variant: "destructive" });
      return;
    }
    setRequestSubmitted(true);
  };

  const handleProducerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducerFormData({ ...producerFormData, [name]: value });
    if (producerValidation.isTouched(name)) {
      producerValidation.setFieldError(name, validateProducerField(name, value));
    }
  };

  const handleProducerBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    producerValidation.markTouched(name);
    producerValidation.setFieldError(name, validateProducerField(name, value));
  };

  // ===================== ROLE SELECTION =====================
  if (mainStep === 'choose') {
    return (
      <Layout>
        <div className="h-[calc(100vh-4rem)] bg-gradient-card flex items-center justify-center px-4">
          <div className="max-w-2xl w-full space-y-4 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-2">
                <div className="p-2.5 bg-gradient-hero rounded-xl shadow-glow">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Rejoignez Tunisia Casting</h1>
              <p className="text-sm text-muted-foreground">
                Choisissez votre type de compte pour commencer
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card
                className="shadow-elegant bg-card cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-[1.03] border-2 border-transparent hover:border-primary"
                onClick={() => setMainStep('talent-flow')}
              >
                <CardContent className="p-5 text-center">
                  <div className="flex justify-center mb-2.5">
                    <div className="p-3 bg-gradient-hero rounded-full">
                      <Users className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Je suis un Talent</h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    Acteur, mannequin, danseur, musicien... Trouvez votre prochaine opportunité
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 text-left">
                    {["Accès aux castings exclusifs", "Créez votre profil professionnel", "Postulez en un clic", "Recevez des notifications"].map(t => (
                      <li key={t} className="flex items-center gap-1.5"><span className="text-primary">✓</span> {t}</li>
                    ))}
                  </ul>
                  <Button variant="hero" className="w-full mt-4 h-9 text-sm">S'inscrire comme Talent</Button>
                </CardContent>
              </Card>

              <Card
                className="shadow-elegant bg-card cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-[1.03] border-2 border-transparent hover:border-primary"
                onClick={() => setMainStep('producer-form')}
              >
                <CardContent className="p-5 text-center">
                  <div className="flex justify-center mb-2.5">
                    <div className="p-3 bg-gradient-to-r from-accent to-accent/80 rounded-full">
                      <Clapperboard className="h-7 w-7 text-accent-foreground" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Je suis Directeur de Casting</h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    Agence, studio, réalisateur... Demandez un accès pour publier vos castings
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 text-left">
                    {["Publiez vos castings", "Accès à la base de talents", "Gérez vos candidatures", "Outils de sélection avancés"].map(t => (
                      <li key={t} className="flex items-center gap-1.5"><span className="text-primary">✓</span> {t}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 h-9 text-sm border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    Demander un accès
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-colors">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ===================== TALENT 3-STEP FLOW =====================
  if (mainStep === 'talent-flow') {
    return (
      <div className="min-h-screen bg-gradient-card">
        <RegistrationNav />
        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full space-y-4">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s === talentStep ? "bg-primary text-primary-foreground shadow-glow scale-110"
                    : s < talentStep ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {s < talentStep ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className="w-10 h-0.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: s < talentStep ? "100%" : "0%" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">Étape {talentStep} sur 3</p>

            {/* Step content with fade */}
            <div className={`transition-all duration-300 ease-in-out ${fadeState === "out" ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>

              {/* STEP 1 — Create account */}
              {talentStep === 1 && (
                <Card className="shadow-elegant bg-card">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-foreground">Créer mon compte</h2>
                    </div>
                    <form onSubmit={handleStep1Submit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Adresse email</Label>
                        <Input
                          id="email" type="email" required
                          value={email} onChange={e => { setEmail(e.target.value); if (step1Validation.isTouched("email")) step1Validation.setFieldError("email", validateEmail(e.target.value)); }}
                          onBlur={() => { step1Validation.markTouched("email"); step1Validation.setFieldError("email", validateEmail(email)); }}
                          placeholder="votre@email.com"
                          className={`shadow-card ${step1Validation.getError("email") ? "border-destructive" : ""}`}
                        />
                        <FormFieldError error={step1Validation.getError("email")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password" type={showPassword ? "text" : "password"} required
                            value={password} onChange={e => {
                              setPassword(e.target.value);
                              if (step1Validation.isTouched("password")) step1Validation.setFieldError("password", validatePassword(e.target.value));
                              if (step1Validation.isTouched("confirmPassword")) step1Validation.setFieldError("confirmPassword", validateConfirmPassword(e.target.value, confirmPassword));
                            }}
                            onBlur={() => { step1Validation.markTouched("password"); step1Validation.setFieldError("password", validatePassword(password)); }}
                            placeholder="Créez un mot de passe"
                            className={`shadow-card pr-10 ${step1Validation.getError("password") ? "border-destructive" : ""}`}
                          />
                          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                        <PasswordStrengthBar password={password} />
                        <FormFieldError error={step1Validation.getError("password")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                            value={confirmPassword} onChange={e => {
                              setConfirmPassword(e.target.value);
                              if (step1Validation.isTouched("confirmPassword")) step1Validation.setFieldError("confirmPassword", validateConfirmPassword(password, e.target.value));
                            }}
                            onBlur={() => { step1Validation.markTouched("confirmPassword"); step1Validation.setFieldError("confirmPassword", validateConfirmPassword(password, confirmPassword)); }}
                            placeholder="Confirmez votre mot de passe"
                            className={`shadow-card pr-10 ${step1Validation.getError("confirmPassword") ? "border-destructive" : ""}`}
                          />
                          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                        <FormFieldError error={step1Validation.getError("confirmPassword")} />
                      </div>
                      <Button type="submit" variant="hero" className="w-full">Continuer</Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground">
                      Vous avez déjà un compte ?{" "}
                      <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-colors">Connexion</Link>
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* STEP 2 — Profile */}
              {talentStep === 2 && (
                <Card className="shadow-elegant bg-card">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-foreground">Votre profil</h2>
                    </div>

                    {/* Photo */}
                    <div className="flex flex-col items-center gap-2">
                      <label htmlFor="photo-upload" className="cursor-pointer group relative">
                        <Avatar className="h-20 w-20 border-2 border-muted group-hover:border-primary transition-colors">
                          <AvatarImage src={profilePhoto || undefined} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                            {firstName ? firstName[0]?.toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-elegant">
                          <Camera className="h-3.5 w-3.5" />
                        </div>
                      </label>
                      <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      <span className="text-xs text-muted-foreground">Photo de profil</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Prénom</Label>
                        <Input placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow-card" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Nom</Label>
                        <Input placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow-card" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Type de talent</Label>
                      <Select value={talentType} onValueChange={setTalentType}>
                        <SelectTrigger className="shadow-card"><SelectValue placeholder="Sélectionnez votre spécialité" /></SelectTrigger>
                        <SelectContent>
                          {TALENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Ville</Label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="shadow-card"><SelectValue placeholder="Sélectionnez votre ville" /></SelectTrigger>
                        <SelectContent>
                          {TUNISIAN_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="hero" className="w-full" onClick={handleStep2Continue}>Continuer</Button>
                    <button
                      onClick={() => transitionTo(3)}
                      className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Passer cette étape
                    </button>
                  </CardContent>
                </Card>
              )}

              {/* STEP 3 — Choose plan */}
              {talentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Choisissez votre plan</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Monthly */}
                    <Card className="shadow-elegant bg-card border-2 border-transparent hover:border-primary transition-all duration-300">
                      <CardContent className="p-6 space-y-4 text-center">
                        <h3 className="text-lg font-bold text-foreground">Mensuel</h3>
                        <div>
                          <span className="text-3xl font-bold text-foreground">19</span>
                          <span className="text-muted-foreground ml-1">TND/mois</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2 text-left">
                          {PLAN_FEATURES.map(f => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full" onClick={() => handleChoosePlan('monthly')}>
                          Choisir ce plan
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Yearly */}
                    <Card className="shadow-elegant bg-card border-2 border-primary relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3">Recommandé</Badge>
                      </div>
                      <CardContent className="p-6 space-y-4 text-center">
                        <h3 className="text-lg font-bold text-foreground">Annuel</h3>
                        <div>
                          <span className="text-3xl font-bold text-foreground">149</span>
                          <span className="text-muted-foreground ml-1">TND/an</span>
                        </div>
                        <p className="text-xs font-semibold text-primary">Économisez 79 TND</p>
                        <ul className="text-sm text-muted-foreground space-y-2 text-left">
                          {PLAN_FEATURES.map(f => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button variant="hero" className="w-full" onClick={() => handleChoosePlan('yearly')}>
                          Choisir ce plan
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <button
                    onClick={() => navigate('/castings')}
                    className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Commencer gratuitement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== PRODUCER REQUEST =====================
  if (requestSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
          <div className="max-w-lg w-full animate-fade-in">
            <Card className="shadow-elegant bg-card text-center">
              <CardContent className="p-12 space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Demande envoyée ✓</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Merci pour votre demande ! Notre équipe va examiner vos informations et vous contacter dans un délai de <strong>48 heures</strong> par email ou téléphone.
                </p>
                <p className="text-sm text-muted-foreground">
                  Si vous avez des questions, n'hésitez pas à nous contacter via notre{" "}
                  <Link to="/contact" className="text-primary hover:text-primary-glow font-medium">page de contact</Link>.
                </p>
                <Button variant="outline" asChild className="mt-4">
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Producer form
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <Button variant="ghost" className="mb-4" onClick={() => setMainStep('choose')}>
              ← Retour
            </Button>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-accent to-accent/80 rounded-xl shadow-glow">
                <Clapperboard className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Demande d'accès Directeur de Casting</h1>
            <p className="text-muted-foreground mt-2">Remplissez le formulaire ci-dessous. Notre équipe examinera votre demande.</p>
          </div>

          <Card className="shadow-elegant bg-card">
            <CardContent className="p-6">
              <form onSubmit={handleProducerSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Prénom et Nom *</Label>
                  <Input id="fullName" name="fullName" required value={producerFormData.fullName} onChange={handleProducerChange} onBlur={handleProducerBlur} placeholder="Votre prénom et nom" className={`shadow-card ${producerValidation.getError("fullName") ? "border-destructive" : ""}`} />
                  <FormFieldError error={producerValidation.getError("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prodEmail" className="text-foreground">Email professionnel *</Label>
                  <Input id="prodEmail" name="email" type="email" required value={producerFormData.email} onChange={handleProducerChange} onBlur={handleProducerBlur} placeholder="contact@entreprise.com" className={`shadow-card ${producerValidation.getError("email") ? "border-destructive" : ""}`} />
                  <FormFieldError error={producerValidation.getError("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Numéro de téléphone *</Label>
                  <Input id="phone" name="phone" type="tel" required value={producerFormData.phone} onChange={handleProducerChange} onBlur={handleProducerBlur} placeholder="+216 XX XXX XXX" className={`shadow-card ${producerValidation.getError("phone") ? "border-destructive" : ""}`} />
                  <FormFieldError error={producerValidation.getError("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-foreground">Nom de la société ou production *</Label>
                  <Input id="companyName" name="companyName" required value={producerFormData.companyName} onChange={handleProducerChange} onBlur={handleProducerBlur} placeholder="Nom de votre société" className={`shadow-card ${producerValidation.getError("companyName") ? "border-destructive" : ""}`} />
                  <FormFieldError error={producerValidation.getError("companyName")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Type de production *</Label>
                  <Select onValueChange={v => setProducerFormData({...producerFormData, productionType: v})}>
                    <SelectTrigger className="shadow-card"><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger>
                    <SelectContent>
                      {["Agence publicitaire", "Maison de production", "Chaîne TV", "Théâtre", "Projet indépendant", "Autre"].map(t => (
                        <SelectItem key={t} value={t.toLowerCase().replace(/ /g, "_")}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description du projet ou de l'activité</Label>
                  <Textarea name="description" value={producerFormData.description} onChange={handleProducerChange} placeholder="Décrivez brièvement votre activité (optionnel)" className="shadow-card min-h-[100px]" />
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="certifyInfo" checked={producerFormData.certifyInfo} onCheckedChange={c => setProducerFormData({...producerFormData, certifyInfo: c as boolean})} className="mt-1" />
                  <Label htmlFor="certifyInfo" className="text-sm text-muted-foreground">Je certifie que les informations fournies sont exactes</Label>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="h-4 w-4 mr-2" /> Envoyer ma demande
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-colors">Connectez-vous ici</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
