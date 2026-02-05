 import { useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
 import { Eye, EyeOff, Star, Users, Clapperboard, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
 import { useAuth } from "@/contexts/AuthContext";
 import { useToast } from "@/hooks/use-toast";

 type AccountType = 'talent' | 'producer' | null;
 
const SignUp = () => {
   const navigate = useNavigate();
   const { signup, redirectAfterAuth, setRedirectAfterAuth } = useAuth();
   const { toast } = useToast();
   
   const [step, setStep] = useState<'choose' | 'form'>('choose');
   const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   
   // Talent form data
   const [talentFormData, setTalentFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    talentType: "",
     age: "",
     city: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

   // Producer form data
   const [producerFormData, setProducerFormData] = useState({
     companyName: "",
     contactName: "",
     email: "",
     phone: "",
     password: "",
     confirmPassword: "",
     productionType: "",
     website: "",
     agreeToTerms: false,
     agreeToMarketing: false
   });
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     
     const formData = accountType === 'talent' ? talentFormData : producerFormData;
     const name = accountType === 'talent' 
       ? `${talentFormData.firstName} ${talentFormData.lastName}`
       : producerFormData.contactName;
     
     if (formData.password !== formData.confirmPassword) {
       toast({
         title: "Erreur",
         description: "Les mots de passe ne correspondent pas",
         variant: "destructive"
       });
       return;
     }
     
     signup(formData.email, formData.password, name, accountType);
     
     toast({
       title: "Compte créé avec succès !",
       description: `Bienvenue sur Tunisia Casting en tant que ${accountType === 'talent' ? 'Talent' : 'Producteur'}`,
     });
     
     if (redirectAfterAuth) {
       const redirect = redirectAfterAuth;
       setRedirectAfterAuth(null);
       navigate(redirect);
     } else {
       navigate(accountType === 'talent' ? '/castings' : '/producer-dashboard');
     }
  };

   const handleTalentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
     setTalentFormData({
       ...talentFormData,
      [name]: type === "checkbox" ? checked : value
    });
  };

   const handleProducerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, type, checked, value } = e.target;
     setProducerFormData({
       ...producerFormData,
       [name]: type === "checkbox" ? checked : value
    });
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
                   <h2 className="text-2xl font-bold text-foreground mb-2">Je suis un Producteur</h2>
                   <p className="text-muted-foreground mb-4">
                     Agence, studio, réalisateur... Trouvez les talents parfaits
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
                       <Label htmlFor="firstName" className="text-foreground">Prénom</Label>
                       <Input
                         id="firstName"
                         name="firstName"
                         type="text"
                         required
                         value={talentFormData.firstName}
                         onChange={handleTalentChange}
                         placeholder="Votre prénom"
                         className="shadow-card"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="lastName" className="text-foreground">Nom</Label>
                       <Input
                         id="lastName"
                         name="lastName"
                         type="text"
                         required
                         value={talentFormData.lastName}
                         onChange={handleTalentChange}
                         placeholder="Votre nom"
                         className="shadow-card"
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="email" className="text-foreground">Adresse email</Label>
                     <Input
                       id="email"
                       name="email"
                       type="email"
                       required
                       value={talentFormData.email}
                       onChange={handleTalentChange}
                       placeholder="votre@email.com"
                       className="shadow-card"
                     />
                   </div>
 
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                       <Input
                         id="phone"
                         name="phone"
                         type="tel"
                         value={talentFormData.phone}
                         onChange={handleTalentChange}
                         placeholder="+216 XX XXX XXX"
                         className="shadow-card"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="age" className="text-foreground">Âge</Label>
                       <Input
                         id="age"
                         name="age"
                         type="number"
                         value={talentFormData.age}
                         onChange={handleTalentChange}
                         placeholder="25"
                         className="shadow-card"
                       />
                     </div>
                   </div>
 
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="city" className="text-foreground">Ville</Label>
                       <Input
                         id="city"
                         name="city"
                         type="text"
                         value={talentFormData.city}
                         onChange={handleTalentChange}
                         placeholder="Tunis"
                         className="shadow-card"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="talentType" className="text-foreground">Type de talent</Label>
                       <Select onValueChange={(value) => setTalentFormData({...talentFormData, talentType: value})}>
                         <SelectTrigger className="shadow-card">
                           <SelectValue placeholder="Sélectionnez" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="actor">Acteur</SelectItem>
                           <SelectItem value="actress">Actrice</SelectItem>
                           <SelectItem value="model">Mannequin</SelectItem>
                           <SelectItem value="voice-actor">Doubleur</SelectItem>
                           <SelectItem value="dancer">Danseur</SelectItem>
                           <SelectItem value="musician">Musicien</SelectItem>
                           <SelectItem value="other">Autre</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                     <div className="relative">
                       <Input
                         id="password"
                         name="password"
                         type={showPassword ? "text" : "password"}
                         required
                         value={talentFormData.password}
                         onChange={handleTalentChange}
                         placeholder="Créez un mot de passe"
                         className="shadow-card pr-10"
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
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe</Label>
                     <div className="relative">
                       <Input
                         id="confirmPassword"
                         name="confirmPassword"
                         type={showConfirmPassword ? "text" : "password"}
                         required
                         value={talentFormData.confirmPassword}
                         onChange={handleTalentChange}
                         placeholder="Confirmez votre mot de passe"
                         className="shadow-card pr-10"
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
     );
   }
 
   // Producer Registration Form
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
             <h1 className="text-3xl font-bold text-foreground">Inscription Producteur</h1>
            <p className="text-muted-foreground mt-2">
               Créez votre compte et trouvez les meilleurs talents
            </p>
          </div>

          <Card className="shadow-elegant bg-card">
            <CardHeader>
               <CardTitle className="text-2xl text-center text-foreground">Informations de l'entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                   <Label htmlFor="companyName" className="text-foreground">Nom de l'entreprise / Agence</Label>
                   <Input
                     id="companyName"
                     name="companyName"
                     type="text"
                     required
                     value={producerFormData.companyName}
                     onChange={handleProducerChange}
                     placeholder="Nom de votre entreprise"
                     className="shadow-card"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="contactName" className="text-foreground">Nom du contact</Label>
                   <Input
                     id="contactName"
                     name="contactName"
                     type="text"
                     required
                     value={producerFormData.contactName}
                     onChange={handleProducerChange}
                     placeholder="Votre nom complet"
                     className="shadow-card"
                   />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="email" className="text-foreground">Email professionnel</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                     value={producerFormData.email}
                     onChange={handleProducerChange}
                     placeholder="contact@entreprise.com"
                    className="shadow-card"
                  />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                     <Input
                       id="phone"
                       name="phone"
                       type="tel"
                       value={producerFormData.phone}
                       onChange={handleProducerChange}
                       placeholder="+216 XX XXX XXX"
                       className="shadow-card"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="productionType" className="text-foreground">Type de production</Label>
                     <Select onValueChange={(value) => setProducerFormData({...producerFormData, productionType: value})}>
                       <SelectTrigger className="shadow-card">
                         <SelectValue placeholder="Sélectionnez" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="film">Cinéma</SelectItem>
                         <SelectItem value="tv">Télévision</SelectItem>
                         <SelectItem value="advertising">Publicité</SelectItem>
                         <SelectItem value="theater">Théâtre</SelectItem>
                         <SelectItem value="music">Musique</SelectItem>
                         <SelectItem value="agency">Agence de casting</SelectItem>
                         <SelectItem value="other">Autre</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="website" className="text-foreground">Site web (optionnel)</Label>
                   <Input
                     id="website"
                     name="website"
                     type="url"
                     value={producerFormData.website}
                     onChange={handleProducerChange}
                     placeholder="https://www.entreprise.com"
                     className="shadow-card"
                   />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                       value={producerFormData.password}
                       onChange={handleProducerChange}
                       placeholder="Créez un mot de passe"
                      className="shadow-card pr-10"
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
                </div>

                <div className="space-y-2">
                   <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                       value={producerFormData.confirmPassword}
                       onChange={handleProducerChange}
                       placeholder="Confirmez votre mot de passe"
                      className="shadow-card pr-10"
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                       checked={producerFormData.agreeToTerms}
                      onCheckedChange={(checked) => 
                         setProducerFormData({...producerFormData, agreeToTerms: checked as boolean})
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
                       checked={producerFormData.agreeToMarketing}
                      onCheckedChange={(checked) => 
                         setProducerFormData({...producerFormData, agreeToMarketing: checked as boolean})
                      }
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm text-muted-foreground">
                       Je souhaite recevoir des mises à jour sur les nouveaux talents
                    </Label>
                  </div>
                </div>

                 <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                   Créer mon compte Producteur
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