import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users, X, ChevronDown, ChevronUp } from "lucide-react";

export interface RoleData {
  id: string;
  roleType: string;
  gender: string;
  ageMin: string;
  ageMax: string;
  ethnicity: string;
  skills: string[];
  experienceLevel: string;
  talentsNeeded: string;
  description: string;
}

interface StepRolesProps {
  roles: RoleData[];
  onChange: (roles: RoleData[]) => void;
}

const createEmptyRole = (): RoleData => ({
  id: `role-new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  roleType: "",
  gender: "",
  ageMin: "",
  ageMax: "",
  ethnicity: "",
  skills: [],
  experienceLevel: "",
  talentsNeeded: "1",
  description: "",
});

const StepRoles = ({ roles, onChange }: StepRolesProps) => {
  const [expandedRole, setExpandedRole] = useState<string | null>(roles[0]?.id || null);
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});

  const addRole = () => {
    const newRole = createEmptyRole();
    onChange([...roles, newRole]);
    setExpandedRole(newRole.id);
  };

  const removeRole = (id: string) => {
    onChange(roles.filter((r) => r.id !== id));
  };

  const updateRole = (id: string, field: keyof RoleData, value: string | string[]) => {
    onChange(roles.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addSkill = (roleId: string) => {
    const input = (skillInputs[roleId] || "").trim();
    if (!input) return;
    const role = roles.find((r) => r.id === roleId);
    if (role && !role.skills.includes(input)) {
      updateRole(roleId, "skills", [...role.skills, input]);
    }
    setSkillInputs((prev) => ({ ...prev, [roleId]: "" }));
  };

  const removeSkill = (roleId: string, skill: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      updateRole(roleId, "skills", role.skills.filter((s) => s !== skill));
    }
  };

  const getRoleTypeLabel = (type: string) => {
    switch (type) {
      case "lead": return "Principal";
      case "supporting": return "Secondaire";
      case "extra": return "Figurant";
      default: return "Rôle";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Rôles disponibles ({roles.length})
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez les rôles à pourvoir pour cette production
          </p>
        </div>
        <Button onClick={addRole} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un rôle
        </Button>
      </div>

      {roles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">Aucun rôle ajouté</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cliquez sur "Ajouter un rôle" pour commencer
            </p>
            <Button onClick={addRole} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un rôle
            </Button>
          </CardContent>
        </Card>
      )}

      {roles.map((role, index) => {
        const isExpanded = expandedRole === role.id;
        return (
          <Card key={role.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
              onClick={() => setExpandedRole(isExpanded ? null : role.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </span>
                  {role.roleType ? getRoleTypeLabel(role.roleType) : "Nouveau rôle"}
                  {role.gender && (
                    <Badge variant="secondary" className="text-xs">{role.gender}</Badge>
                  )}
                  {(role.ageMin || role.ageMax) && (
                    <Badge variant="outline" className="text-xs">
                      {role.ageMin || "?"}-{role.ageMax || "?"} ans
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); removeRole(role.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-5 pt-0 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type de rôle *</Label>
                    <Select value={role.roleType} onValueChange={(v) => updateRole(role.id, "roleType", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Principal (Lead)</SelectItem>
                        <SelectItem value="supporting">Secondaire (Supporting)</SelectItem>
                        <SelectItem value="extra">Figurant (Extra)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Genre *</Label>
                    <Select value={role.gender} onValueChange={(v) => updateRole(role.id, "gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Homme">Homme</SelectItem>
                        <SelectItem value="Femme">Femme</SelectItem>
                        <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tranche d'âge *</Label>
                    <div className="flex gap-2 items-center">
                      <Input placeholder="Min" value={role.ageMin} onChange={(e) => updateRole(role.id, "ageMin", e.target.value)} />
                      <span className="text-muted-foreground text-sm">à</span>
                      <Input placeholder="Max" value={role.ageMax} onChange={(e) => updateRole(role.id, "ageMax", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ethnicité (optionnel)</Label>
                    <Input placeholder="Ex: Méditerranéen" value={role.ethnicity} onChange={(e) => updateRole(role.id, "ethnicity", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Niveau d'expérience</Label>
                    <Select value={role.experienceLevel} onValueChange={(v) => updateRole(role.id, "experienceLevel", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Débutant">Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="Professionnel">Professionnel</SelectItem>
                        <SelectItem value="Tous niveaux">Tous niveaux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de talents recherchés</Label>
                    <Input type="number" min="1" value={role.talentsNeeded} onChange={(e) => updateRole(role.id, "talentsNeeded", e.target.value)} />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Compétences requises</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Danse, Combat scénique..."
                      value={skillInputs[role.id] || ""}
                      onChange={(e) => setSkillInputs((prev) => ({ ...prev, [role.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(role.id))}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addSkill(role.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {role.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {role.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(role.id, skill)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description du rôle</Label>
                  <Textarea
                    placeholder="Décrivez le personnage, ses traits et ce que vous recherchez..."
                    rows={3}
                    value={role.description}
                    onChange={(e) => updateRole(role.id, "description", e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default StepRoles;
