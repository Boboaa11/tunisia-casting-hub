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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload, Image, Video, Users, Calendar } from "lucide-react";
import { Casting, CastingRole } from "@/contexts/CastingContext";
import { useCasting } from "@/contexts/CastingContext";
import { useAuth } from "@/contexts/AuthContext";

interface CastingApplicationDialogProps {
  casting: Casting | null;
  role: CastingRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CastingApplicationDialog = ({ casting, role, open, onOpenChange }: CastingApplicationDialogProps) => {
  const { toast } = useToast();
  const { addApplication } = useCasting();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    coverMessage: "",
    experience: "",
    availability: "",
    photos: null as FileList | null,
    videoShowreel: null as File | null,
    portfolio: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casting || !role) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    addApplication({
      castingId: casting.id,
      roleId: role.id,
      applicantName: user?.name || "Utilisateur",
      applicantEmail: user?.email || "",
      coverMessage: formData.coverMessage,
      experience: formData.experience,
      availability: formData.availability,
      photoFiles: formData.photos ? Array.from(formData.photos).map(f => f.name) : undefined,
      videoShowreel: formData.videoShowreel?.name,
      portfolioFile: formData.portfolio?.name,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Candidature envoyée !",
      description: `Votre candidature pour le rôle "${role.name}" a été soumise avec succès.`,
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ coverMessage: "", experience: "", availability: "", photos: null, videoShowreel: null, portfolio: null });
      onOpenChange(false);
    }, 2000);
  };

  if (!casting || !role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Candidature envoyée !</h3>
            <p className="text-muted-foreground">
              Votre candidature pour <strong>{role.name}</strong> sera examinée par le producteur.
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

            {/* Selected Role Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Rôle sélectionné : {role.name}
              </p>
              <p className="text-xs text-muted-foreground">{role.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" /> {role.ageRange}
                </Badge>
                <Badge variant="outline" className="text-xs">{role.gender}</Badge>
                {role.experienceLevel && (
                  <Badge variant="outline" className="text-xs">{role.experienceLevel}</Badge>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="coverMessage">Message de motivation *</Label>
                <Textarea
                  id="coverMessage"
                  placeholder="Expliquez pourquoi ce rôle vous correspond et ce que vous pouvez apporter..."
                  value={formData.coverMessage}
                  onChange={(e) => setFormData({ ...formData, coverMessage: e.target.value })}
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

              {/* Photos upload */}
              <div className="space-y-2">
                <Label htmlFor="photos">Photos (headshots, portraits) *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="photos"
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setFormData({ ...formData, photos: e.target.files })}
                  />
                  <label htmlFor="photos" className="cursor-pointer">
                    <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.photos && formData.photos.length > 0
                        ? `${formData.photos.length} photo(s) sélectionnée(s)`
                        : "Cliquez pour ajouter vos photos (JPG, PNG)"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Video / Showreel upload */}
              <div className="space-y-2">
                <Label htmlFor="videoShowreel">Vidéo / Showreel (optionnel)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="videoShowreel"
                    className="hidden"
                    accept=".mp4,.mov,.avi,.webm"
                    onChange={(e) => setFormData({ ...formData, videoShowreel: e.target.files?.[0] || null })}
                  />
                  <label htmlFor="videoShowreel" className="cursor-pointer">
                    <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.videoShowreel ? formData.videoShowreel.name : "Cliquez pour ajouter une vidéo (MP4, MOV)"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Portfolio / CV */}
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio / CV (optionnel)</Label>
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
                      {formData.portfolio ? formData.portfolio.name : "Cliquez pour ajouter un fichier (PDF, DOC)"}
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
                  disabled={isSubmitting || !formData.coverMessage}
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
