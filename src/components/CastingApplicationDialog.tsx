import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload } from "lucide-react";
import { Casting } from "@/contexts/CastingContext";

interface CastingApplicationDialogProps {
  casting: Casting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CastingApplicationDialog = ({ casting, open, onOpenChange }: CastingApplicationDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    portfolio: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Candidature envoyée !",
      description: `Votre candidature pour "${casting?.title}" a été soumise avec succès.`,
    });

    // Reset form after delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ motivation: "", experience: "", availability: "", portfolio: null });
      onOpenChange(false);
    }, 2000);
  };

  if (!casting) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Candidature envoyée !</h3>
            <p className="text-muted-foreground">
              Vous recevrez une notification lorsque le producteur aura examiné votre candidature.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Postuler : {casting.title}</DialogTitle>
              <DialogDescription>
                {casting.production} • {casting.location}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">Lettre de motivation *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Expliquez pourquoi ce rôle vous intéresse et ce que vous pouvez apporter..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Expérience pertinente</Label>
                <Textarea
                  id="experience"
                  placeholder="Décrivez vos expériences passées en rapport avec ce rôle..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Disponibilité</Label>
                <Input
                  id="availability"
                  placeholder="Ex: Disponible à partir du 1er mars, flexible sur les horaires"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Documents supplémentaires (optionnel)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="portfolio"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.files?.[0] || null })}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="portfolio" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.portfolio ? formData.portfolio.name : "Cliquez pour ajouter un fichier (CV, photos, etc.)"}
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                <p>En soumettant cette candidature, vous acceptez que vos informations de profil soient partagées avec le producteur.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || !formData.motivation}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CastingApplicationDialog;
