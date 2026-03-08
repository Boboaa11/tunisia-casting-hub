import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin, Calendar, Clock, DollarSign, Users, Film, Tv, Theater,
  X, Briefcase, Globe, Star, FileText, ChevronRight, UserCheck
} from "lucide-react";
import { useCasting, Casting, CastingRole } from "@/contexts/CastingContext";
import { useAuth } from "@/contexts/AuthContext";
import CastingApplicationDialog from "@/components/CastingApplicationDialog";
import { useState, useEffect, useCallback } from "react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "tv": return Tv;
    case "film": return Film;
    case "theater": return Theater;
    default: return Briefcase;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "tv": return "bg-primary/10 text-primary";
    case "film": return "bg-accent/10 text-accent-foreground";
    case "theater": return "bg-secondary/30 text-secondary-foreground";
    case "commercial": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

interface CastingDetailPanelProps {
  castingId: number | null;
  onClose: () => void;
}

const CastingDetailPanel = ({ castingId, onClose }: CastingDetailPanelProps) => {
  const navigate = useNavigate();
  const { castings } = useCasting();
  const { user, isAuthenticated, setRedirectAfterAuth } = useAuth();

  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CastingRole | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const casting = castingId ? castings.find(c => c.id === castingId) : null;

  // Handle open/close animations
  useEffect(() => {
    if (castingId) {
      setShouldRender(true);
      // Trigger slide-in on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [castingId]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 350);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (shouldRender) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [shouldRender, handleClose]);

  const handleApplyForRole = (role: CastingRole) => {
    if (!casting) return;
    if (!isAuthenticated) {
      setRedirectAfterAuth(`/castings/${casting.id}`);
      navigate('/login?message=login_required&castingId=' + casting.id);
      return;
    }
    if (user?.role !== 'talent') return;
    if (!user?.hasSubscription) {
      navigate(`/subscription?message=subscription_required&castingId=${casting.id}`);
      return;
    }
    setSelectedRole(role);
    setApplicationDialogOpen(true);
  };

  if (!shouldRender) return null;

  const CategoryIcon = casting ? getCategoryIcon(casting.category) : Film;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[600px] lg:w-[660px] bg-background border-l border-border shadow-elegant transition-transform duration-350 ease-out"
        style={{
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transitionDuration: "350ms",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <ScrollArea className="h-full">
          {!casting ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Casting introuvable</p>
            </div>
          ) : (
            <div className="p-6 pb-12 space-y-6">
              {/* Header */}
              <div className="pr-10">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className={getCategoryColor(casting.category)}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {casting.type}
                  </Badge>
                  {casting.status && (
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      {casting.status}
                    </Badge>
                  )}
                  {casting.roles && (
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {casting.roles.length} rôle{casting.roles.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-1">{casting.title}</h2>
                <p className="text-muted-foreground font-medium">{casting.production}</p>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Lieu</p>
                    <p className="text-sm font-medium text-foreground">{casting.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Date limite</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Rémunération</p>
                    <p className="text-sm font-medium text-foreground">{casting.compensation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <Users className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Candidatures</p>
                    <p className="text-sm font-medium text-foreground">{casting.applications || 0}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Description du projet
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {casting.synopsis || casting.description}
                </p>
              </div>

              {/* Production details */}
              {(casting.productionDates || (casting.shootingLocations && casting.shootingLocations.length > 0) || casting.compensationDetails) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Détails de production</h3>
                  {casting.productionDates && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                      <span><span className="font-medium text-foreground">Tournage :</span> {casting.productionDates}</span>
                    </div>
                  )}
                  {casting.shootingLocations && casting.shootingLocations.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><span className="font-medium text-foreground">Lieux :</span> {casting.shootingLocations.join(', ')}</span>
                    </div>
                  )}
                  {casting.compensationDetails && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                      <span><span className="font-medium text-foreground">Détails :</span> {casting.compensationDetails}</span>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Roles */}
              {casting.roles && casting.roles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-primary" />
                    Rôles recherchés ({casting.roles.length})
                  </h3>
                  <div className="space-y-4">
                    {casting.roles.map((role, index) => (
                      <Card key={role.id || index} className="border-border/60">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-foreground">{role.name}</h4>
                            {role.talentsNeeded && (
                              <Badge variant="outline" className="shrink-0 text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                {role.talentsNeeded}
                              </Badge>
                            )}
                          </div>
                          {role.description && (
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          )}

                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" /> {role.ageRange}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" /> {role.gender}
                            </Badge>
                            {role.ethnicity && <Badge variant="outline" className="text-xs">{role.ethnicity}</Badge>}
                            {role.experienceLevel && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" /> {role.experienceLevel}
                              </Badge>
                            )}
                          </div>

                          {role.appearance && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Apparence :</span> {role.appearance}
                            </p>
                          )}

                          {role.skills && role.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {role.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                              ))}
                            </div>
                          )}

                          {role.languages && role.languages.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Globe className="h-3 w-3 text-primary" />
                              {role.languages.join(', ')}
                            </div>
                          )}

                          {role.specialTalents && role.specialTalents.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {role.specialTalents.map((talent, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] bg-accent/20">{talent}</Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {role.shootingDates && (
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" />{role.shootingDates}</span>
                            )}
                            {role.roleLocation && (
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{role.roleLocation}</span>
                            )}
                            {role.roleCompensation && (
                              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-primary" />{role.roleCompensation}</span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleApplyForRole(role)}
                            disabled={user?.role === 'producer'}
                            className="w-full"
                          >
                            {user?.role === 'producer' ? 'Producteur' : `Postuler pour ${role.name}`}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {casting.requirements && casting.requirements.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Exigences générales
                    </h3>
                    <ul className="space-y-1.5">
                      {casting.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    {casting.additionalRequirements && casting.additionalRequirements.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1.5">Documents requis :</h4>
                        <ul className="space-y-1">
                          {casting.additionalRequirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Deadline CTA */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Intéressé(e) ?</h3>
                  <p className="text-xs text-muted-foreground">
                    Postulez avant le {new Date(casting.deadline).toLocaleDateString('fr-FR')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>

        {casting && (
          <CastingApplicationDialog
            casting={casting}
            role={selectedRole}
            open={applicationDialogOpen}
            onOpenChange={setApplicationDialogOpen}
          />
        )}
      </div>
    </>
  );
};

export default CastingDetailPanel;
