import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CastingRole {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  gender: string;
  ethnicity?: string;
  appearance?: string;
  skills?: string[];
  languages?: string[];
  specialTalents?: string[];
  experienceLevel?: string;
  talentsNeeded?: number;
  shootingDates?: string;
  roleLocation?: string;
  roleCompensation?: string;
}

export interface CastingApplication {
  id: string;
  castingId: number;
  roleId: string;
  applicantName: string;
  applicantEmail: string;
  coverMessage: string;
  experience: string;
  availability: string;
  photoFiles?: string[];
  videoShowreel?: string;
  portfolioFile?: string;
  submittedAt: string;
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
  applications: CastingApplication[];
  addCasting: (casting: Omit<Casting, 'id'>) => void;
  updateCasting: (id: number, casting: Partial<Casting>) => void;
  deleteCasting: (id: number) => void;
  addApplication: (application: Omit<CastingApplication, 'id' | 'submittedAt'>) => void;
  getApplicationsForCasting: (castingId: number) => CastingApplication[];
  getApplicationsForRole: (castingId: number, roleId: string) => CastingApplication[];
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
        id: "role-1-1",
        name: "Hannibal Barca (Lead)",
        description: "A brilliant young military strategist torn between duty to Carthage and personal ambition. Must convey charisma, intelligence, and physical strength.",
        ageRange: "25-35 ans",
        gender: "Homme",
        ethnicity: "Méditerranéen",
        appearance: "Athletic build, Mediterranean features, dark hair",
        skills: ["Horseback riding", "Stage combat", "Dramatic acting"],
        languages: ["Arabe", "Français", "Anglais (un plus)"],
        specialTalents: ["Sword fighting", "Leadership presence"],
        experienceLevel: "Professionnel (5+ ans)",
        talentsNeeded: 1,
        shootingDates: "Mars - Août 2025",
        roleLocation: "Carthage, Sidi Bou Said",
        roleCompensation: "2,500 TND/épisode"
      },
      {
        id: "role-1-2",
        name: "Sophonisba (Supporting)",
        description: "A Carthaginian noblewoman and political strategist. Intelligent, poised, and fiercely loyal to her city.",
        ageRange: "22-30 ans",
        gender: "Femme",
        appearance: "Elegant, regal bearing",
        skills: ["Classical acting", "Emotional depth"],
        languages: ["Arabe", "Français"],
        specialTalents: ["Period movement", "Dance"],
        experienceLevel: "Intermédiaire (2-5 ans)",
        talentsNeeded: 1,
        shootingDates: "Avril - Juillet 2025",
        roleLocation: "Carthage",
        roleCompensation: "1,800 TND/épisode"
      },
      {
        id: "role-1-3",
        name: "Hasdrubal (Supporting)",
        description: "Hannibal's younger brother and loyal lieutenant. Brave but impulsive, provides comic relief amid the drama.",
        ageRange: "20-28 ans",
        gender: "Homme",
        appearance: "Youthful, energetic",
        skills: ["Stage combat", "Physical comedy"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Débutant à Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Mars - Août 2025",
        roleLocation: "Carthage, Dougga",
        roleCompensation: "1,500 TND/épisode"
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
        id: "role-2-1",
        name: "Yasmine (Supporting Lead)",
        description: "The quirky, lovable best friend who gives terrible dating advice but has a heart of gold. Great comedic timing required.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Warm, approachable, expressive face",
        skills: ["Comedy", "Improvisation", "Physical comedy"],
        languages: ["Arabe tunisien", "Français"],
        specialTalents: ["Singing (a plus)", "Dance"],
        experienceLevel: "Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Juin - Juillet 2025",
        roleLocation: "Sidi Bou Said, La Marsa",
        roleCompensation: "1,800 TND total"
      },
      {
        id: "role-2-2",
        name: "Grand-mère Fatma",
        description: "The wise and witty grandmother who secretly orchestrates the love story. Comedic matriarch with sharp tongue and warm heart.",
        ageRange: "60-75 ans",
        gender: "Femme",
        appearance: "Warm, maternal, distinctive presence",
        skills: ["Drama", "Comedy"],
        languages: ["Arabe tunisien"],
        experienceLevel: "Tous niveaux",
        talentsNeeded: 1,
        shootingDates: "Juin 2025",
        roleLocation: "Sidi Bou Said",
        roleCompensation: "1,200 TND total"
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
        id: "role-3-1",
        name: "Amine",
        description: "A young software developer questioning whether to stay in Tunisia or emigrate. Internal conflict drives his arc.",
        ageRange: "22-28 ans",
        gender: "Homme",
        skills: ["Stage acting", "Monologue delivery"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Avril - Juin 2025",
        roleLocation: "Théâtre Municipal de Tunis",
        roleCompensation: "800 TND/mois + 120 TND/représentation"
      },
      {
        id: "role-3-2",
        name: "Nour",
        description: "An aspiring musician caught between conservative family expectations and artistic dreams.",
        ageRange: "18-25 ans",
        gender: "Femme",
        skills: ["Musical theater", "Vocal performance"],
        languages: ["Arabe"],
        specialTalents: ["Singing", "Guitar or oud"],
        experienceLevel: "Débutant à Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Avril - Juin 2025",
        roleLocation: "Théâtre Municipal de Tunis",
        roleCompensation: "800 TND/mois + 120 TND/représentation"
      },
      {
        id: "role-3-3",
        name: "Karim",
        description: "A street artist using graffiti as political expression. Physical, rebellious energy.",
        ageRange: "20-30 ans",
        gender: "Homme",
        appearance: "Lean, energetic",
        skills: ["Physical theater", "Movement"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Avril - Juin 2025",
        roleLocation: "Cité de la Culture",
        roleCompensation: "800 TND/mois + 120 TND/représentation"
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
        id: "role-4-1",
        name: "Lead Model - Traditional Line",
        description: "Represent the heritage collection. Must embody elegance and cultural pride while wearing traditional Tunisian designs.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Height 175cm+, striking features, confident posture",
        skills: ["Runway experience", "Posing"],
        languages: ["Arabe"],
        experienceLevel: "Professionnel",
        talentsNeeded: 2,
        shootingDates: "Mai 2025",
        roleLocation: "Sousse Medina",
        roleCompensation: "500 TND/jour"
      },
      {
        id: "role-4-2",
        name: "Lead Model - Modern Line",
        description: "Represent the contemporary collection. Urban, edgy aesthetic that bridges tradition and modernity.",
        ageRange: "18-28 ans",
        gender: "Non spécifié",
        appearance: "Height 170cm+, unique look, diverse backgrounds welcome",
        skills: ["Editorial modeling", "Movement"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Tous niveaux",
        talentsNeeded: 3,
        shootingDates: "Mai 2025",
        roleLocation: "El Jem Amphitheater",
        roleCompensation: "500 TND/jour"
      }
    ]
  }
];

const initialApplications: CastingApplication[] = [
  {
    id: "app-1",
    castingId: 1,
    roleId: "role-1-1",
    applicantName: "Ahmed Ben Ali",
    applicantEmail: "ahmed@example.com",
    coverMessage: "Passionné d'histoire et d'art dramatique, je suis convaincu de pouvoir incarner Hannibal avec authenticité.",
    experience: "5 ans de théâtre, 2 films tunisiens",
    availability: "Disponible de mars à août 2025",
    submittedAt: "2024-02-15T10:30:00Z"
  },
  {
    id: "app-2",
    castingId: 1,
    roleId: "role-1-1",
    applicantName: "Youssef Chaari",
    applicantEmail: "youssef@example.com",
    coverMessage: "Acteur formé au conservatoire, j'ai une expérience significative dans les rôles historiques.",
    experience: "8 ans d'expérience, rôle principal dans 3 séries",
    availability: "Totalement disponible",
    submittedAt: "2024-02-16T14:20:00Z"
  },
  {
    id: "app-3",
    castingId: 1,
    roleId: "role-1-2",
    applicantName: "Meriem Jouini",
    applicantEmail: "meriem@example.com",
    coverMessage: "Le rôle de Sophonisba me parle profondément. Mon expérience en théâtre classique est un atout.",
    experience: "3 ans de théâtre classique, 1 film",
    availability: "Disponible d'avril à juillet",
    submittedAt: "2024-02-17T09:15:00Z"
  },
  {
    id: "app-4",
    castingId: 2,
    roleId: "role-2-1",
    applicantName: "Sana Trabelsi",
    applicantEmail: "sana@example.com",
    coverMessage: "J'adore la comédie et je pense pouvoir apporter beaucoup à Yasmine !",
    experience: "Stand-up comedy, 2 courts-métrages comiques",
    availability: "Disponible juin-juillet 2025",
    submittedAt: "2024-02-18T11:00:00Z"
  }
];

export const CastingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [castings, setCastings] = useState<Casting[]>(initialCastings);
  const [applications, setApplications] = useState<CastingApplication[]>(initialApplications);

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

  const addApplication = (application: Omit<CastingApplication, 'id' | 'submittedAt'>) => {
    const newApp: CastingApplication = {
      ...application,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setApplications(prev => [...prev, newApp]);
    // Increment application count on casting
    setCastings(prev => prev.map(c =>
      c.id === application.castingId
        ? { ...c, applications: (c.applications || 0) + 1 }
        : c
    ));
  };

  const getApplicationsForCasting = (castingId: number) => {
    return applications.filter(a => a.castingId === castingId);
  };

  const getApplicationsForRole = (castingId: number, roleId: string) => {
    return applications.filter(a => a.castingId === castingId && a.roleId === roleId);
  };

  return (
    <CastingContext.Provider value={{
      castings, applications,
      addCasting, updateCasting, deleteCasting,
      addApplication, getApplicationsForCasting, getApplicationsForRole
    }}>
      {children}
    </CastingContext.Provider>
  );
};
