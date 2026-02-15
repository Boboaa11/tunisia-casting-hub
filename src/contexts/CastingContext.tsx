import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CastingRole {
  name: string;
  description: string;
  ageRange: string;
  gender: string;
  appearance?: string;
  skills?: string[];
  languages?: string[];
  specialTalents?: string[];
}

export interface Casting {
  id: number;
  title: string;
  production: string;
  type: string;
  category: string;
  location: string;
  deadline: string;
  description: string;
  requirements: string[];
  compensation: string;
  status?: string;
  applications?: number;
  views?: number;
  createdAt?: string;
  ageMin?: string;
  ageMax?: string;
  gender?: string;
  experience?: string;
  languages?: string[];
  specialSkills?: string[];
  synopsis?: string;
  roles?: CastingRole[];
  shootingLocations?: string[];
  productionDates?: string;
  compensationDetails?: string;
  additionalRequirements?: string[];
  contactEmail?: string;
  isPaid?: boolean;
}

interface CastingContextType {
  castings: Casting[];
  addCasting: (casting: Omit<Casting, 'id'>) => void;
  updateCasting: (id: number, casting: Partial<Casting>) => void;
  deleteCasting: (id: number) => void;
}

const CastingContext = createContext<CastingContextType | undefined>(undefined);

export const useCasting = () => {
  const context = useContext(CastingContext);
  if (!context) {
    throw new Error('useCasting must be used within a CastingProvider');
  }
  return context;
};

const initialCastings: Casting[] = [
  {
    id: 1,
    title: "Lead Role - Historical Drama Series",
    production: "Carthage Productions",
    type: "TV Series",
    category: "tv",
    location: "Tunis",
    deadline: "2024-08-15",
    description: "Seeking male actor, 25-35 years old, for lead role in historical drama series about ancient Carthage.",
    synopsis: "An epic 10-episode series exploring the rise of Hannibal Barca, from his youth in Carthage to his legendary crossing of the Alps. The series blends political intrigue, war strategy, and personal drama to paint a vivid picture of one of history's greatest military commanders.",
    requirements: ["Professional acting experience", "Fluent in Arabic and French", "Available for 6 months"],
    compensation: "Professional rate",
    isPaid: true,
    compensationDetails: "2,500 TND per episode + travel and accommodation covered. Residuals for international distribution.",
    status: "Actif",
    applications: 45,
    views: 320,
    createdAt: "2024-01-10",
    productionDates: "Mars 2025 - Août 2025",
    shootingLocations: ["Carthage Archaeological Site", "Sidi Bou Said", "Dougga Ruins"],
    additionalRequirements: ["Showreel or demo reel", "Professional headshots", "Self-tape audition (2 min monologue)"],
    roles: [
      {
        name: "Hannibal Barca (Lead)",
        description: "A brilliant young military strategist torn between duty to Carthage and personal ambition. Must convey charisma, intelligence, and physical strength.",
        ageRange: "25-35 ans",
        gender: "Homme",
        appearance: "Athletic build, Mediterranean features, dark hair",
        skills: ["Horseback riding", "Stage combat", "Dramatic acting"],
        languages: ["Arabe", "Français", "Anglais (un plus)"],
        specialTalents: ["Sword fighting", "Leadership presence"]
      },
      {
        name: "Sophonisba (Supporting)",
        description: "A Carthaginian noblewoman and political strategist. Intelligent, poised, and fiercely loyal to her city.",
        ageRange: "22-30 ans",
        gender: "Femme",
        appearance: "Elegant, regal bearing",
        skills: ["Classical acting", "Emotional depth"],
        languages: ["Arabe", "Français"],
        specialTalents: ["Period movement", "Dance"]
      }
    ]
  },
  {
    id: 2,
    title: "Supporting Actress - Romantic Comedy",
    production: "Sidi Bou Said Films",
    type: "Feature Film",
    category: "film",
    location: "Sidi Bou Said",
    deadline: "2024-08-20",
    description: "Looking for talented actress, 20-30 years old, for supporting role in romantic comedy.",
    synopsis: "A charming romantic comedy set in the picturesque streets of Sidi Bou Said. When a Tunisian-American woman returns to her grandmother's village for the summer, she discovers that love and family traditions aren't as old-fashioned as she thought.",
    requirements: ["Acting experience preferred", "Comfortable with comedy", "Available for 2 months"],
    compensation: "Competitive pay",
    isPaid: true,
    compensationDetails: "1,800 TND total for 3 weeks of shooting. Meals and local transport provided.",
    status: "Actif",
    applications: 32,
    views: 180,
    createdAt: "2024-01-12",
    productionDates: "Juin 2025 - Juillet 2025",
    shootingLocations: ["Sidi Bou Said village", "La Marsa Beach", "Tunis Medina"],
    additionalRequirements: ["Comedy showreel", "Recent headshots"],
    roles: [
      {
        name: "Yasmine (Supporting Lead)",
        description: "The quirky, lovable best friend who gives terrible dating advice but has a heart of gold. Great comedic timing required.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Warm, approachable, expressive face",
        skills: ["Comedy", "Improvisation", "Physical comedy"],
        languages: ["Arabe tunisien", "Français"],
        specialTalents: ["Singing (a plus)", "Dance"]
      }
    ]
  },
  {
    id: 3,
    title: "Ensemble Cast - Modern Theater",
    production: "National Theater of Tunisia",
    type: "Theater",
    category: "theater",
    location: "Tunis",
    deadline: "2024-08-25",
    description: "Multiple roles available for contemporary theater production exploring modern Tunisian society.",
    synopsis: "A bold, experimental theater piece that weaves together five interconnected stories of Tunisian youth navigating identity, tradition, and modernity. Performed on a minimalist stage with live music and projected visuals.",
    requirements: ["Theater experience required", "Strong stage presence", "Available for rehearsals"],
    compensation: "Theater standard",
    isPaid: true,
    compensationDetails: "800 TND/month during rehearsals, 120 TND per performance. 20 performances planned.",
    status: "Actif",
    applications: 28,
    views: 95,
    createdAt: "2024-01-15",
    productionDates: "Avril 2025 - Juin 2025",
    shootingLocations: ["Théâtre Municipal de Tunis", "Cité de la Culture"],
    additionalRequirements: ["Live audition required", "Prepare a 3-minute contemporary monologue"],
    roles: [
      {
        name: "Amine",
        description: "A young software developer questioning whether to stay in Tunisia or emigrate. Internal conflict drives his arc.",
        ageRange: "22-28 ans",
        gender: "Homme",
        skills: ["Stage acting", "Monologue delivery"],
        languages: ["Arabe", "Français"]
      },
      {
        name: "Nour",
        description: "An aspiring musician caught between conservative family expectations and artistic dreams.",
        ageRange: "18-25 ans",
        gender: "Femme",
        skills: ["Musical theater", "Vocal performance"],
        languages: ["Arabe"],
        specialTalents: ["Singing", "Guitar or oud"]
      },
      {
        name: "Karim",
        description: "A street artist using graffiti as political expression. Physical, rebellious energy.",
        ageRange: "20-30 ans",
        gender: "Homme",
        appearance: "Lean, energetic",
        skills: ["Physical theater", "Movement"],
        languages: ["Arabe", "Français"]
      }
    ]
  },
  {
    id: 4,
    title: "Commercial Models - Fashion Brand",
    production: "Medina Fashion House",
    type: "Commercial",
    category: "commercial",
    location: "Sousse",
    deadline: "2024-08-10",
    description: "Seeking diverse models for upcoming fashion campaign featuring traditional and modern styles.",
    synopsis: "A high-end fashion campaign celebrating the fusion of traditional Tunisian craftsmanship with contemporary design. The shoot will feature handwoven textiles reimagined in modern silhouettes, photographed across iconic Tunisian landscapes.",
    requirements: ["Modeling experience", "Height 170cm+", "Professional portfolio"],
    compensation: "Day rate + usage",
    isPaid: true,
    compensationDetails: "500 TND per day, 2-day shoot. Usage rights for print and digital for 12 months.",
    status: "Actif",
    applications: 67,
    views: 245,
    createdAt: "2024-01-08",
    productionDates: "Mai 2025 (2 jours)",
    shootingLocations: ["Sousse Medina", "El Jem Amphitheater"],
    additionalRequirements: ["Professional portfolio (minimum 10 photos)", "Comp card", "Full-body and close-up photos"],
    roles: [
      {
        name: "Lead Model - Traditional Line",
        description: "Represent the heritage collection. Must embody elegance and cultural pride while wearing traditional Tunisian designs.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Height 175cm+, striking features, confident posture",
        skills: ["Runway experience", "Posing"],
        languages: ["Arabe"]
      },
      {
        name: "Lead Model - Modern Line",
        description: "Represent the contemporary collection. Urban, edgy aesthetic that bridges tradition and modernity.",
        ageRange: "18-28 ans",
        gender: "Non spécifié",
        appearance: "Height 170cm+, unique look, diverse backgrounds welcome",
        skills: ["Editorial modeling", "Movement"],
        languages: ["Arabe", "Français"]
      }
    ]
  }
];

export const CastingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [castings, setCastings] = useState<Casting[]>(initialCastings);

  const addCasting = (newCasting: Omit<Casting, 'id'>) => {
    const id = Math.max(...castings.map(c => c.id), 0) + 1;
    setCastings(prev => [...prev, { ...newCasting, id }]);
  };

  const updateCasting = (id: number, updatedData: Partial<Casting>) => {
    setCastings(prev => prev.map(casting => 
      casting.id === id ? { ...casting, ...updatedData } : casting
    ));
  };

  const deleteCasting = (id: number) => {
    setCastings(prev => prev.filter(casting => casting.id !== id));
  };

  return (
    <CastingContext.Provider value={{ castings, addCasting, updateCasting, deleteCasting }}>
      {children}
    </CastingContext.Provider>
  );
};