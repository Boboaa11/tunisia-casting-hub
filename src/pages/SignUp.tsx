import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Star, Users, Clapperboard, ArrowLeft, Sparkles, CheckCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, validateEmail, validatePassword, validateConfirmPassword, validateRequired, validatePhone } from "@/hooks/useFormValidation";
import FormFieldError from "@/components/FormFieldError";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";

 type AccountType = 'talent' | 'producer' | null;
 
const SignUp = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { signup, redirectAfterAuth, setRedirectAfterAuth } = useAuth();
   const { toast } = useToast();
   
   const locationState = location.state as { accountType?: AccountType } | null;
   const [step, setStep] = useState<'choose' | 'form'>(locationState?.accountType ? 'form' : 'choose');
   const [accountType, setAccountType] = useState<AccountType>(locationState?.accountType || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
   
   // Talent form data
   const [talentFormData, setTalentFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

   // Producer/Casting Director request form data
   const [producerFormData, setProducerFormData] = useState({
     fullName: "",
     email: "",
     phone: "",
     companyName: "",
     productionType: "",
     description: "",
     certifyInfo: false,
   });
   const [requestSubmitted, setRequestSubmitted] = useState(false);
 
  const talentValidation = useFormValidation();
  const producerValidation = useFormValidation();

  const validateTalentField = useCallback((name: string, value: string) => {
    switch (name) {
      case "firstName": return validateRequired(value, "Le prénom");
      case "lastName": return validateRequired(value, "Le nom");
      case "email": return validateEmail(value);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(talentFormData.password, value);
      default: return "";
    }
  }, [talentFormData.password]);

  const validateProducerField = useCallback((name: string, value: string) => {
    switch (name) {
      case "fullName": return validateRequired(value, "Le prénom et nom");
      case "email": return validateEmail(value);
      case "phone": return validatePhone(value);
      case "companyName": return validateRequired(value, "Le nom de la société");
      default: return "";
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     
    if (accountType === 'talent') {
      const fieldsToValidate = ["firstName", "lastName", "email", "password", "confirmPassword"];
      let hasError = false;
      for (const field of fieldsToValidate) {
        const error = validateTalentField(field, (talentFormData as any)[field]);
        talentValidation.setFieldError(field, error);
        talentValidation.markTouched(field);
        if (error) hasError = true;
      }
      if (hasError) {
        toast({ title: "Erreur", description: "Veuillez corriger les erreurs du formulaire", variant: "destructive" });
        return;
      }
      const name = `${talentFormData.firstName} ${talentFormData.lastName}`;
      signup(talentFormData.email, talentFormData.password, name, accountType);
      if (redirectAfterAuth) {
        toast({ title: "Compte créé avec succès !", description: "Bienvenue sur Tunisia Casting en tant que Talent" });
        const redirect = redirectAfterAuth;
        setRedirectAfterAuth(null);
        navigate(redirect);
      } else {
        setWelcomeName(talentFormData.firstName);
        setShowWelcomeOverlay(true);
        setTimeout(() => { navigate('/onboarding'); }, 1400);
      }
      return;
    }

    // Producer request form
    const fieldsToValidate = ["fullName", "email", "phone", "companyName"];
    let hasError = false;
    for (const field of fieldsToValidate) {
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

  const handleTalentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setTalentFormData({ ...talentFormData, [name]: newValue });
    if (talentValidation.isTouched(name) && type !== "checkbox") {
      talentValidation.setFieldError(name, validateTalentField(name, value));
    }
    if (name === "password" && talentValidation.isTouched("confirmPassword")) {
      talentValidation.setFieldError("confirmPassword", validateConfirmPassword(value, talentFormData.confirmPassword));
    }
  };

  const handleTalentBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    talentValidation.markTouched(name);
    talentValidation.setFieldError(name, validateTalentField(name, value));
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

   const handleSelectAccountType = (type: AccountType) => {
     setAccountType(type);
     setStep('form');
   };
 
   // Account type selection screen
   if (step === 'choose') {
     return (
       <Layout>
         <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
           <div className="max-w-2xl w-full space-y-8 animate-fade-in">
             <div className="text-center">
               <div className="flex justify-center mb-4">
                 <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                   <Star className="h-8 w-8 text-primary-foreground" />
                 </div>
               </div>
               <h1 className="text-3xl font-bold text-foreground">Rejoignez Tunisia Casting</h1>
               <p className="text-muted-foreground mt-2">
                 Choisissez votre type de compte pour commencer
               </p>
             </div>
 
             <div className="grid md:grid-cols-2 gap-6">
               {/* Talent Card */}
               <Card 
                 className="shadow-elegant bg-card cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 border-2 border-transparent hover:border-primary"
                 onClick={() => handleSelectAccountType('talent')}
               >
                 <CardContent className="p-8 text-center">
                   <div className="flex justify-center mb-4">
                     <div className="p-4 bg-gradient-hero rounded-full">
                       <Users className="h-10 w-10 text-primary-foreground" />
                     </div>
                   </div>
                   <h2 className="text-2xl font-bold text-foreground mb-2">Je suis un Talent</h2>
                   <p className="text-muted-foreground mb-4">
                     Acteur, mannequin, danseur, musicien... Trouvez votre prochaine opportunité
                   </p>
                   <ul className="text-sm text-muted-foreground space-y-2 text-left">
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Accès aux castings exclusifs
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Créez votre profil professionnel
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Postulez en un clic
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Recevez des notifications
                     </li>
                   </ul>
                   <Button variant="hero" className="w-full mt-6">
                     S'inscrire comme Talent
                   </Button>
                 </CardContent>
               </Card>
 
               {/* Producer Card */}
               <Card 
                 className="shadow-elegant bg-card cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 border-2 border-transparent hover:border-primary"
                 onClick={() => handleSelectAccountType('producer')}
               >
                 <CardContent className="p-8 text-center">
                   <div className="flex justify-center mb-4">
                     <div className="p-4 bg-gradient-to-r from-accent to-accent/80 rounded-full">
                       <Clapperboard className="h-10 w-10 text-accent-foreground" />
                     </div>
                   </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Je suis Directeur de Casting</h2>
                    <p className="text-muted-foreground mb-4">
                      Agence, studio, réalisateur... Demandez un accès pour publier vos castings
                    </p>
                   <ul className="text-sm text-muted-foreground space-y-2 text-left">
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Publiez vos castings
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Accès à la base de talents
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Gérez vos candidatures
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-primary">✓</span> Outils de sélection avancés
                     </li>
                   </ul>
                   <Button variant="outline" className="w-full mt-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                     S'inscrire comme Producteur
                   </Button>
                 </CardContent>
               </Card>
             </div>
 
             <div className="text-center">
               <p className="text-sm text-muted-foreground">
                 Vous avez déjà un compte ?{" "}
                 <Link
                   to="/login"
                   className="text-primary hover:text-primary-glow font-medium transition-colors"
                 >
                   Connectez-vous ici
                 </Link>
               </p>
             </div>
           </div>
         </div>
       </Layout>
     );
   }
 
   // Talent Registration Form
   if (accountType === 'talent') {
      return (
        <>
          {/* Welcome overlay */}
          {showWelcomeOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-hero rounded-full shadow-glow">
                    <Sparkles className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Bienvenue sur Tunisia Casting 🎬
                </h1>
                <p className="text-lg text-muted-foreground">
                  Ravi de vous avoir, {welcomeName} !
                </p>
              </div>
            </div>
          )}
          <Layout>
          <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
           <div className="max-w-lg w-full space-y-8 animate-fade-in">
             <div className="text-center">
               <Button 
                 variant="ghost" 
                 className="mb-4"
                 onClick={() => setStep('choose')}
               >
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Retour
               </Button>
               <div className="flex justify-center mb-4">
                 <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                   <Users className="h-8 w-8 text-primary-foreground" />
                 </div>
               </div>
               <h1 className="text-3xl font-bold text-foreground">Inscription Talent</h1>
               <p className="text-muted-foreground mt-2">
                 Créez votre profil et commencez votre carrière
               </p>
             </div>
 
             <Card className="shadow-elegant bg-card">
               <CardHeader>
                 <CardTitle className="text-2xl text-center text-foreground">Informations personnelles</CardTitle>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground">Prénom *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={talentFormData.firstName}
                          onChange={handleTalentChange}
                          onBlur={handleTalentBlur}
                          placeholder="Votre prénom"
                          className={`shadow-card ${talentValidation.getError("firstName") ? "border-destructive" : ""}`}
                        />
                        <FormFieldError error={talentValidation.getError("firstName")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">Nom *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={talentFormData.lastName}
                          onChange={handleTalentChange}
                          onBlur={handleTalentBlur}
                          placeholder="Votre nom"
                          className={`shadow-card ${talentValidation.getError("lastName") ? "border-destructive" : ""}`}
                        />
                        <FormFieldError error={talentValidation.getError("lastName")} />
                      </div>
                    </div>
 
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Adresse email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={talentFormData.email}
                        onChange={handleTalentChange}
                        onBlur={handleTalentBlur}
                        placeholder="votre@email.com"
                        className={`shadow-card ${talentValidation.getError("email") ? "border-destructive" : ""}`}
                      />
                      <FormFieldError error={talentValidation.getError("email")} />
                    </div>
 
                     <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Mot de passe *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={talentFormData.password}
                          onChange={handleTalentChange}
                          onBlur={handleTalentBlur}
                          placeholder="Créez un mot de passe"
                          className={`shadow-card pr-10 ${talentValidation.getError("password") ? "border-destructive" : ""}`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <PasswordStrengthBar password={talentFormData.password} />
                      <FormFieldError error={talentValidation.getError("password")} />
                    </div>
 
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={talentFormData.confirmPassword}
                          onChange={handleTalentChange}
                          onBlur={handleTalentBlur}
                          placeholder="Confirmez votre mot de passe"
                          className={`shadow-card pr-10 ${talentValidation.getError("confirmPassword") ? "border-destructive" : ""}`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <FormFieldError error={talentValidation.getError("confirmPassword")} />
                   </div>
 
                   <div className="space-y-4">
                     <div className="flex items-center space-x-2">
                       <Checkbox
                         id="agreeToTerms"
                         checked={talentFormData.agreeToTerms}
                         onCheckedChange={(checked) => 
                           setTalentFormData({...talentFormData, agreeToTerms: checked as boolean})
                         }
                         required
                       />
                       <Label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
                         J'accepte les{" "}
                         <Link to="/terms" className="text-primary hover:text-primary-glow">
                           Conditions d'utilisation
                         </Link>{" "}
                         et la{" "}
                         <Link to="/privacy" className="text-primary hover:text-primary-glow">
                           Politique de confidentialité
                         </Link>
                       </Label>
                     </div>
 
                     <div className="flex items-center space-x-2">
                       <Checkbox
                         id="agreeToMarketing"
                         checked={talentFormData.agreeToMarketing}
                         onCheckedChange={(checked) => 
                           setTalentFormData({...talentFormData, agreeToMarketing: checked as boolean})
                         }
                       />
                       <Label htmlFor="agreeToMarketing" className="text-sm text-muted-foreground">
                         Je souhaite recevoir des notifications sur les nouveaux castings
                       </Label>
                     </div>
                   </div>
 
                   <Button type="submit" variant="hero" className="w-full">
                     Créer mon compte Talent
                   </Button>
                 </form>
 
                 <div className="mt-6 text-center">
                   <p className="text-sm text-muted-foreground">
                     Vous avez déjà un compte ?{" "}
                     <Link
                       to="/login"
                       className="text-primary hover:text-primary-glow font-medium transition-colors"
                     >
                       Connectez-vous ici
                     </Link>
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
        </Layout>
        </>
      );
   }
 
   // Casting Director Request Form
   if (requestSubmitted) {
     return (
       <Layout>
         <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
           <div className="max-w-lg w-full animate-fade-in">
             <Card className="shadow-elegant bg-card text-center">
               <CardContent className="p-12 space-y-6">
                 <div className="flex justify-center">
                   <div className="p-4 bg-green-100 rounded-full">
                     <CheckCircle className="h-12 w-12 text-green-600" />
                   </div>
                 </div>
                 <h1 className="text-3xl font-bold text-foreground">Demande envoyée ✓</h1>
                 <p className="text-muted-foreground text-lg leading-relaxed">
                   Merci pour votre demande ! Notre équipe va examiner vos informations et vous contacter dans un délai de <strong>48 heures</strong> par email ou téléphone.
                 </p>
                 <p className="text-sm text-muted-foreground">
                   Si vous avez des questions, n'hésitez pas à nous contacter via notre{" "}
                   <Link to="/contact" className="text-primary hover:text-primary-glow font-medium">
                     page de contact
                   </Link>.
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
         <div className="max-w-lg w-full space-y-8 animate-fade-in">
          <div className="text-center">
             <Button 
               variant="ghost" 
               className="mb-4"
               onClick={() => setStep('choose')}
             >
               <ArrowLeft className="h-4 w-4 mr-2" />
               Retour
             </Button>
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-gradient-to-r from-accent to-accent/80 rounded-xl shadow-glow">
                 <Clapperboard className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
             <h1 className="text-3xl font-bold text-foreground">Demande d'accès Directeur de Casting</h1>
            <p className="text-muted-foreground mt-2">
               Remplissez le formulaire ci-dessous. Notre équipe examinera votre demande.
            </p>
          </div>

          <Card className="shadow-elegant bg-card">
            <CardHeader>
               <CardTitle className="text-2xl text-center text-foreground">Informations professionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">Prénom et Nom *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={producerFormData.fullName}
                      onChange={handleProducerChange}
                      onBlur={handleProducerBlur}
                      placeholder="Votre prénom et nom"
                      className={`shadow-card ${producerValidation.getError("fullName") ? "border-destructive" : ""}`}
                    />
                    <FormFieldError error={producerValidation.getError("fullName")} />
                  </div>

                 <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email professionnel *</Label>
                   <Input
                     id="email"
                     name="email"
                     type="email"
                     required
                      value={producerFormData.email}
                      onChange={handleProducerChange}
                      onBlur={handleProducerBlur}
                      placeholder="contact@entreprise.com"
                     className={`shadow-card ${producerValidation.getError("email") ? "border-destructive" : ""}`}
                   />
                   <FormFieldError error={producerValidation.getError("email")} />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="phone" className="text-foreground">Numéro de téléphone *</Label>
                   <Input
                     id="phone"
                     name="phone"
                     type="tel"
                     required
                     value={producerFormData.phone}
                     onChange={handleProducerChange}
                     onBlur={handleProducerBlur}
                     placeholder="+216 XX XXX XXX"
                     className={`shadow-card ${producerValidation.getError("phone") ? "border-destructive" : ""}`}
                   />
                   <FormFieldError error={producerValidation.getError("phone")} />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-foreground">Nom de la société ou production *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={producerFormData.companyName}
                      onChange={handleProducerChange}
                      onBlur={handleProducerBlur}
                      placeholder="Nom de votre société"
                      className={`shadow-card ${producerValidation.getError("companyName") ? "border-destructive" : ""}`}
                    />
                    <FormFieldError error={producerValidation.getError("companyName")} />
                  </div>

                 <div className="space-y-2">
                   <Label htmlFor="productionType" className="text-foreground">Type de production *</Label>
                   <Select onValueChange={(value) => setProducerFormData({...producerFormData, productionType: value})}>
                     <SelectTrigger className="shadow-card">
                       <SelectValue placeholder="Sélectionnez un type" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="agence_pub">Agence publicitaire</SelectItem>
                       <SelectItem value="maison_prod">Maison de production</SelectItem>
                       <SelectItem value="chaine_tv">Chaîne TV</SelectItem>
                       <SelectItem value="theatre">Théâtre</SelectItem>
                       <SelectItem value="projet_independant">Projet indépendant</SelectItem>
                       <SelectItem value="autre">Autre</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">Description du projet ou de l'activité</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={producerFormData.description}
                      onChange={handleProducerChange}
                      placeholder="Décrivez brièvement votre activité ou votre projet (optionnel)"
                      className="shadow-card min-h-[100px]"
                    />
                 </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="certifyInfo"
                    checked={producerFormData.certifyInfo}
                    onCheckedChange={(checked) => 
                       setProducerFormData({...producerFormData, certifyInfo: checked as boolean})
                    }
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="certifyInfo" className="text-sm text-muted-foreground">
                     Je certifie que les informations fournies sont exactes
                  </Label>
                </div>

                 <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                   <Send className="h-4 w-4 mr-2" />
                   Envoyer ma demande
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                   Vous avez déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary-glow font-medium transition-colors"
                  >
                     Connectez-vous ici
                  </Link>
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