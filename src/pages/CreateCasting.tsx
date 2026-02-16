import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Send, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCasting } from "@/contexts/CastingContext";
import StepProjectInfo, { type ProjectData } from "@/components/casting-form/StepProjectInfo";
import StepRoles, { type RoleData } from "@/components/casting-form/StepRoles";
import StepMedia, { type MediaData } from "@/components/casting-form/StepMedia";
import StepPreview from "@/components/casting-form/StepPreview";

const STEPS = [
  { label: "Projet", number: 1 },
  { label: "Rôles", number: 2 },
  { label: "Médias", number: 3 },
  { label: "Aperçu", number: 4 },
];

const CreateCasting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCasting } = useCasting();
  const [currentStep, setCurrentStep] = useState(1);

  const [project, setProject] = useState<ProjectData>({
    title: "",
    type: "",
    production: "",
    synopsis: "",
    location: "",
    shootingDates: "",
    compensation: "",
    deadline: "",
  });

  const [roles, setRoles] = useState<RoleData[]>([]);

  const [media, setMedia] = useState<MediaData>({
    auditionInstructions: "",
    requiredDocuments: [],
    additionalNotes: "",
  });

  const handleProjectChange = (field: keyof ProjectData, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (field: keyof MediaData, value: string | string[]) => {
    setMedia((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!project.title || !project.type || !project.production || !project.deadline) {
          toast({ title: "Champs requis", description: "Veuillez remplir le titre, le type, la société de production et la date limite.", variant: "destructive" });
          return false;
        }
        return true;
      case 2:
        if (roles.length === 0) {
          toast({ title: "Ajoutez au moins un rôle", description: "Votre casting doit contenir au moins un rôle.", variant: "destructive" });
          return false;
        }
        const incomplete = roles.find((r) => !r.roleType || !r.gender);
        if (incomplete) {
          toast({ title: "Rôle incomplet", description: "Chaque rôle doit avoir un type et un genre.", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSaveDraft = () => {
    toast({ title: "Brouillon sauvegardé", description: "Votre casting a été sauvegardé en brouillon." });
  };

  const handlePublish = () => {
    if (!validateStep(1) || !validateStep(2)) return;

    const castingRoles = roles.map((r) => ({
      id: r.id,
      name: `${r.roleType === "lead" ? "Principal" : r.roleType === "supporting" ? "Secondaire" : "Figurant"} - ${r.gender}`,
      description: r.description,
      ageRange: `${r.ageMin || "?"}-${r.ageMax || "?"} ans`,
      gender: r.gender,
      ethnicity: r.ethnicity || undefined,
      skills: r.skills,
      experienceLevel: r.experienceLevel || undefined,
      talentsNeeded: parseInt(r.talentsNeeded) || 1,
    }));

    const newCasting = {
      title: project.title,
      production: project.production,
      type: project.type,
      category: project.type.toLowerCase().replace(/\s+/g, "-"),
      location: project.location,
      deadline: project.deadline,
      description: project.synopsis,
      synopsis: project.synopsis,
      requirements: media.requiredDocuments,
      compensation: project.compensation,
      compensationDetails: project.compensation,
      status: "Actif",
      applications: 0,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      productionDates: project.shootingDates,
      shootingLocations: project.location ? [project.location] : [],
      additionalRequirements: media.requiredDocuments,
      roles: castingRoles,
      isPaid: !!project.compensation,
    };

    addCasting(newCasting);
    toast({ title: "Casting publié !", description: "Votre casting est maintenant visible par les talents." });
    setTimeout(() => navigate("/producer-dashboard"), 1500);
  };

  const progressValue = (currentStep / 4) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/producer-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Créer un Casting
              </h1>
              <p className="text-sm text-muted-foreground">
                Publiez votre appel de casting en 4 étapes simples
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step) => (
                <button
                  key={step.number}
                  onClick={() => {
                    if (step.number < currentStep) setCurrentStep(step.number);
                  }}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    step.number === currentStep
                      ? "text-primary"
                      : step.number < currentStep
                      ? "text-primary/60 cursor-pointer hover:text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-3.5 h-3.5" /> : step.number}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              ))}
            </div>
            <Progress value={progressValue} className="h-1.5" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <StepProjectInfo data={project} onChange={handleProjectChange} />
            )}
            {currentStep === 2 && (
              <StepRoles roles={roles} onChange={setRoles} />
            )}
            {currentStep === 3 && (
              <StepMedia data={media} onChange={handleMediaChange} />
            )}
            {currentStep === 4 && (
              <StepPreview project={project} roles={roles} media={media} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Brouillon
              </Button>
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handlePublish} variant="hero">
                  <Send className="w-4 h-4 mr-2" />
                  Publier le casting
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCasting;
