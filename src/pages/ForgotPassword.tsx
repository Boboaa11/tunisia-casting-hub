import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-hero rounded-xl shadow-glow">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Mot de passe oublié</h1>
            <p className="text-muted-foreground mt-2">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <Card className="shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-foreground">
                Réinitialisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Email envoyé !</h3>
                  <p className="text-sm text-muted-foreground">
                    Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation.
                    Vérifiez votre boîte de réception et vos spams.
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="mt-4">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre email"
                      className="shadow-card"
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
                  </Button>
                </form>
              )}

              {!sent && (
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:text-primary-glow font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Retour à la connexion
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
