import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Star, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isLoading, redirectAfterAuth, user } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const showLoginMessage = searchParams.get('message') === 'login_required';
  const castingId = searchParams.get('castingId');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'talent' && !user.hasSubscription && castingId) {
        navigate(`/subscription?message=subscription_required&castingId=${castingId}`);
      } else if (redirectAfterAuth) {
        navigate(redirectAfterAuth);
      } else {
        navigate('/castings');
      }
    }
  }, [isAuthenticated, user, navigate, redirectAfterAuth, castingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);
    if (result.error) {
      toast({ title: "Erreur de connexion", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Connexion réussie !", description: "Bienvenue sur Tunisia Casting." });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {showLoginMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">Compte Talent requis</p>
                <p className="text-amber-700 text-sm mt-1">
                  Pour postuler à ce casting, veuillez vous connecter ou créer un compte Talent.
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Bienvenue</h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous à votre compte Tunisia Casting
            </p>
          </div>

          <Card className="shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-foreground">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Adresse email</Label>
                  <Input
                    id="email" name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="Entrez votre email" className="shadow-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password" name="password"
                      type={showPassword ? "text" : "password"} required
                      value={formData.password} onChange={handleChange}
                      placeholder="Entrez votre mot de passe" className="shadow-card pr-10"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary-glow font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas de compte ?{" "}
                  <Link
                    to={`/signup${castingId ? `?castingId=${castingId}` : ''}`}
                    className="text-primary hover:text-primary-glow font-medium transition-colors"
                  >
                    Inscrivez-vous ici
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

export default Login;
