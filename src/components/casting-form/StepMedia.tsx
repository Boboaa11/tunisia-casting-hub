import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, FileText, Plus, X } from "lucide-react";

export interface MediaData {
  auditionInstructions: string;
  requiredDocuments: string[];
  additionalNotes: string;
}

interface StepMediaProps {
  data: MediaData;
  onChange: (field: keyof MediaData, value: string | string[]) => void;
}

const StepMedia = ({ data, onChange }: StepMediaProps) => {
  const [newDoc, setNewDoc] = useState("");

  const addDocument = () => {
    const trimmed = newDoc.trim();
    if (trimmed && !data.requiredDocuments.includes(trimmed)) {
      onChange("requiredDocuments", [...data.requiredDocuments, trimmed]);
      setNewDoc("");
    }
  };

  const removeDocument = (doc: string) => {
    onChange("requiredDocuments", data.requiredDocuments.filter((d) => d !== doc));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Instructions d'audition
          </CardTitle>
          <CardDescription>
            Guidez les talents sur le processus de candidature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auditionInstructions">Instructions détaillées</Label>
            <Textarea
              id="auditionInstructions"
              placeholder="Ex: Préparez un monologue de 2 minutes, envoyez un self-tape en format horizontal..."
              rows={4}
              value={data.auditionInstructions}
              onChange={(e) => onChange("auditionInstructions", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Documents requis
          </CardTitle>
          <CardDescription>
            Indiquez les documents que les candidats doivent fournir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Photos professionnelles, CV artistique..."
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDocument())}
            />
            <Button type="button" variant="outline" onClick={addDocument}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {data.requiredDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.requiredDocuments.map((doc) => (
                <Badge key={doc} variant="secondary" className="gap-1 py-1.5">
                  {doc}
                  <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeDocument(doc)} />
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2 mt-4">
            <Label htmlFor="additionalNotes">Notes supplémentaires</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Toute information complémentaire pour les candidats..."
              rows={3}
              value={data.additionalNotes}
              onChange={(e) => onChange("additionalNotes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepMedia;
