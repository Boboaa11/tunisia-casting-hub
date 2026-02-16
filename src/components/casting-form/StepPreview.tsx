import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, DollarSign, Building2, Users, Clock, Eye } from "lucide-react";
import type { ProjectData } from "./StepProjectInfo";
import type { RoleData } from "./StepRoles";
import type { MediaData } from "./StepMedia";

interface StepPreviewProps {
  project: ProjectData;
  roles: RoleData[];
  media: MediaData;
}

const getRoleTypeLabel = (type: string) => {
  switch (type) {
    case "lead": return "Principal";
    case "supporting": return "Secondaire";
    case "extra": return "Figurant";
    default: return type;
  }
};

const getRoleTypeBadgeClass = (type: string) => {
  switch (type) {
    case "lead": return "bg-primary/10 text-primary border-primary/20";
    case "supporting": return "bg-secondary/30 text-secondary-foreground border-secondary/40";
    case "extra": return "bg-muted text-muted-foreground border-muted-foreground/20";
    default: return "";
  }
};

const StepPreview = ({ project, roles, media }: StepPreviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Eye className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Aperçu du casting</h3>
        <p className="text-sm text-muted-foreground ml-2">Voici comment les talents verront votre annonce</p>
      </div>

      {/* Casting Card Preview */}
      <Card className="overflow-hidden border-2 border-primary/10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left: Project info */}
          <div className="lg:col-span-3 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {project.type && (
                    <Badge variant="outline" className="text-xs">{project.type}</Badge>
                  )}
                </div>
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  {project.title || "Titre du projet"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span>{project.production || "Société de production"}</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {project.synopsis || "Synopsis du projet..."}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {project.location}
                </span>
              )}
              {project.shootingDates && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {project.shootingDates}
                </span>
              )}
              {project.compensation && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {project.compensation}
                </span>
              )}
              {project.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Limite: {project.deadline}
                </span>
              )}
            </div>
          </div>

          {/* Right: Roles */}
          <div className="lg:col-span-2 bg-muted/30 border-l border-border p-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Rôles disponibles ({roles.length})
            </h4>
            {roles.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Aucun rôle ajouté</p>
            ) : (
              roles.map((role, i) => (
                <div key={role.id} className="bg-background rounded-lg p-3 border border-border space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {role.roleType && (
                      <Badge className={`text-[10px] px-1.5 py-0 border ${getRoleTypeBadgeClass(role.roleType)}`}>
                        {getRoleTypeLabel(role.roleType)}
                      </Badge>
                    )}
                    {role.gender && <span className="text-xs text-muted-foreground">{role.gender}</span>}
                    {(role.ageMin || role.ageMax) && (
                      <span className="text-xs text-muted-foreground">{role.ageMin}-{role.ageMax} ans</span>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>
                  )}
                  {role.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">{s}</Badge>
                      ))}
                      {role.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{role.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Media & Requirements summary */}
      {(media.auditionInstructions || media.requiredDocuments.length > 0 || media.additionalNotes) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Instructions & Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {media.auditionInstructions && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Instructions d'audition</p>
                <p className="text-sm">{media.auditionInstructions}</p>
              </div>
            )}
            {media.requiredDocuments.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Documents requis</p>
                <div className="flex flex-wrap gap-1.5">
                  {media.requiredDocuments.map((d) => (
                    <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                  ))}
                </div>
              </div>
            )}
            {media.additionalNotes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{media.additionalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepPreview;
