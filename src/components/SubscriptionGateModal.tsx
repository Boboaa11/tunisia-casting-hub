import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  "Candidatures illimitées",
  "Accès aux détails des castings",
  "Profil visible aux directeurs de casting",
];

const SubscriptionGateModal = ({ open, onOpenChange }: SubscriptionGateModalProps) => {
  const navigate = useNavigate();
  const { setSubscription } = useAuth();

  const handleChoosePlan = (plan: string) => {
    // Simulate choosing a plan
    setSubscription(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Abonnez-vous pour postuler à ce casting</DialogTitle>
          <DialogDescription className="text-center">
            Choisissez le plan qui vous convient
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Monthly */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-center">Mensuel</h3>
            <p className="text-center">
              <span className="text-2xl font-bold text-foreground">19</span>
              <span className="text-sm text-muted-foreground"> TND/mois</span>
            </p>
            <ul className="space-y-1.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full text-sm" onClick={() => handleChoosePlan('monthly')}>
              Choisir ce plan
            </Button>
          </div>

          {/* Yearly */}
          <div className="border-2 border-primary rounded-lg p-4 space-y-3 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                <Star className="h-3 w-3" /> Recommandé
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground text-center pt-1">Annuel</h3>
            <p className="text-center">
              <span className="text-2xl font-bold text-foreground">149</span>
              <span className="text-sm text-muted-foreground"> TND/an</span>
            </p>
            <p className="text-xs text-center text-primary font-medium">Économisez 79 TND</p>
            <ul className="space-y-1.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Button className="w-full text-sm" onClick={() => handleChoosePlan('yearly')}>
              Choisir ce plan
            </Button>
          </div>
        </div>

        <button
          className="text-xs text-primary hover:underline text-center w-full pt-1"
          onClick={() => { onOpenChange(false); navigate('/subscription'); }}
        >
          Voir tous les avantages
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGateModal;
