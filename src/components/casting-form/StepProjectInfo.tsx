import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Calendar, DollarSign, FileText } from "lucide-react";

export interface ProjectData {
  title: string;
  type: string;
  production: string;
  synopsis: string;
  location: string;
  shootingDates: string;
  compensation: string;
  deadline: string;
}

interface StepProjectInfoProps {
  data: ProjectData;
  onChange: (field: keyof ProjectData, value: string) => void;
}

const StepProjectInfo = ({ data, onChange }: StepProjectInfoProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Informations du Projet
          </CardTitle>
          <CardDescription>
            Décrivez votre production pour attirer les meilleurs talents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du projet / Concept *</Label>
              <Input
                id="title"
                placeholder="Ex: Drame historique sur la Tunisie antique"
                value={data.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type de production *</Label>
              <Select value={data.type} onValueChange={(v) => onChange("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Film">Film</SelectItem>
                  <SelectItem value="TV Series">Série TV</SelectItem>
                  <SelectItem value="Commercial">Publicité</SelectItem>
                  <SelectItem value="Music Video">Clip Musical</SelectItem>
                  <SelectItem value="Theater">Théâtre</SelectItem>
                  <SelectItem value="Short Film">Court Métrage</SelectItem>
                  <SelectItem value="Web Series">Série Web</SelectItem>
                  <SelectItem value="Documentary">Documentaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="production" className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Société de production *
            </Label>
            <Input
              id="production"
              placeholder="Ex: Carthage Productions"
              value={data.production}
              onChange={(e) => onChange("production", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis du projet *</Label>
            <Textarea
              id="synopsis"
              placeholder="Décrivez l'histoire, l'univers et l'ambiance de votre projet..."
              rows={4}
              value={data.synopsis}
              onChange={(e) => onChange("synopsis", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Lieu de tournage
              </Label>
              <Input
                id="location"
                placeholder="Ex: Tunis, Sousse, Sidi Bou Said"
                value={data.location}
                onChange={(e) => onChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shootingDates" className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Dates de tournage
              </Label>
              <Input
                id="shootingDates"
                placeholder="Ex: Mars 2025 - Août 2025"
                value={data.shootingDates}
                onChange={(e) => onChange("shootingDates", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="compensation" className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Compensation
              </Label>
              <Input
                id="compensation"
                placeholder="Ex: Rémunéré - 2,500 TND/épisode"
                value={data.compensation}
                onChange={(e) => onChange("compensation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite de candidature *</Label>
              <Input
                id="deadline"
                type="date"
                value={data.deadline}
                onChange={(e) => onChange("deadline", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepProjectInfo;
