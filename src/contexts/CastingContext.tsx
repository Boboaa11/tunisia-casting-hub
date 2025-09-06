import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    requirements: ["Professional acting experience", "Fluent in Arabic and French", "Available for 6 months"],
    compensation: "Professional rate",
    status: "Actif",
    applications: 45,
    views: 320,
    createdAt: "2024-01-10"
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
    requirements: ["Acting experience preferred", "Comfortable with comedy", "Available for 2 months"],
    compensation: "Competitive pay",
    status: "Actif",
    applications: 32,
    views: 180,
    createdAt: "2024-01-12"
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
    requirements: ["Theater experience required", "Strong stage presence", "Available for rehearsals"],
    compensation: "Theater standard",
    status: "Actif",
    applications: 28,
    views: 95,
    createdAt: "2024-01-15"
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
    requirements: ["Modeling experience", "Height 170cm+", "Professional portfolio"],
    compensation: "Day rate + usage",
    status: "Actif",
    applications: 67,
    views: 245,
    createdAt: "2024-01-08"
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