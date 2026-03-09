import { useAuth, getProfileCompletion } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ProfileCompletionBanner = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== 'talent') return null;

  const { percentage } = getProfileCompletion(user);
  if (percentage >= 100) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              Votre profil est complété à {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            Les directeurs de casting consultent les profils complets en priorité
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/profile')}
          className="flex-shrink-0"
        >
          Compléter mon profil
        </Button>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;
