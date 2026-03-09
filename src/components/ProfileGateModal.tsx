import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { ProfileCompletionItem } from "@/contexts/AuthContext";

interface ProfileGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  percentage: number;
  items: ProfileCompletionItem[];
}

const ProfileGateModal = ({ open, onOpenChange, percentage, items }: ProfileGateModalProps) => {
  const navigate = useNavigate();

  const missingItems = items.filter(i => !i.complete);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Complétez votre profil</DialogTitle>
          <DialogDescription className="text-center">
            Votre profil doit être complété à 90% minimum pour postuler aux castings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="text-center">
            <span className="text-3xl font-bold text-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2.5" />

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Éléments manquants</p>
            {missingItems.map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
            {items.filter(i => i.complete).map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => { onOpenChange(false); navigate('/profile'); }}
          >
            Compléter mon profil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileGateModal;
