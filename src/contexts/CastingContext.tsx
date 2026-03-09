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
    title: "Rôle Principal - Série Dramatique Historique",
    production: "Carthage Productions",
    type: "Série TV",
    category: "tv",
    location: "Tunis",
    deadline: "2024-08-15",
    description: "Recherche acteur, 25-35 ans, pour le rôle principal dans une série dramatique historique sur Carthage antique.",
    synopsis: "Une série épique de 10 épisodes explorant l'ascension d'Hannibal Barca, de sa jeunesse à Carthage à sa légendaire traversée des Alpes. La série mêle intrigues politiques, stratégie militaire et drame personnel pour dresser le portrait de l'un des plus grands commandants militaires de l'histoire.",
    requirements: ["Expérience professionnelle en jeu d'acteur", "Bilingue arabe et français", "Disponible pendant 6 mois"],
    compensation: "Tarif professionnel",
    isPaid: true,
    compensationDetails: "2 500 TND par épisode + transport et hébergement pris en charge. Droits résiduels pour la distribution internationale.",
    status: "Actif",
    applications: 45,
    views: 320,
    createdAt: "2024-01-10",
    productionDates: "Mars 2025 - Août 2025",
    shootingLocations: ["Site archéologique de Carthage", "Sidi Bou Said", "Ruines de Dougga"],
    additionalRequirements: ["Bande démo ou showreel", "Photos professionnelles", "Auto-audition vidéo (monologue de 2 min)"],
    roles: [
      {
        id: "role-1-1",
        name: "Hannibal Barca (Principal)",
        description: "Un brillant jeune stratège militaire tiraillé entre le devoir envers Carthage et l'ambition personnelle. Doit transmettre charisme, intelligence et force physique.",
        ageRange: "25-35 ans",
        gender: "Homme",
        ethnicity: "Méditerranéen",
        appearance: "Physique athlétique, traits méditerranéens, cheveux noirs",
        skills: ["Équitation", "Combat scénique", "Jeu dramatique"],
        languages: ["Arabe", "Français", "Anglais (un plus)"],
        specialTalents: ["Escrime", "Présence de leader"],
        experienceLevel: "Professionnel (5+ ans)",
        talentsNeeded: 1,
        shootingDates: "Mars - Août 2025",
        roleLocation: "Carthage, Sidi Bou Said",
        roleCompensation: "2 500 TND/épisode"
      },
      {
        id: "role-1-2",
        name: "Sophonisba (Secondaire)",
        description: "Une noble carthaginoise et stratège politique. Intelligente, posée et farouchement loyale envers sa cité.",
        ageRange: "22-30 ans",
        gender: "Femme",
        appearance: "Élégante, port royal",
        skills: ["Jeu classique", "Profondeur émotionnelle"],
        languages: ["Arabe", "Français"],
        specialTalents: ["Mouvement d'époque", "Danse"],
        experienceLevel: "Intermédiaire (2-5 ans)",
        talentsNeeded: 1,
        shootingDates: "Avril - Juillet 2025",
        roleLocation: "Carthage",
        roleCompensation: "1 800 TND/épisode"
      },
      {
        id: "role-1-3",
        name: "Hasdrubal (Secondaire)",
        description: "Le frère cadet d'Hannibal et loyal lieutenant. Courageux mais impulsif, il apporte une touche d'humour au cœur du drame.",
        ageRange: "20-28 ans",
        gender: "Homme",
        appearance: "Jeune, énergique",
        skills: ["Combat scénique", "Comédie physique"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Débutant à Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Mars - Août 2025",
        roleLocation: "Carthage, Dougga",
        roleCompensation: "1 500 TND/épisode"
      }
    ]
  },
  {
    id: 2,
    title: "Actrice Secondaire - Comédie Romantique",
    production: "Sidi Bou Said Films",
    type: "Long Métrage",
    category: "film",
    location: "Sidi Bou Said",
    deadline: "2024-08-20",
    description: "Recherche actrice talentueuse, 20-30 ans, pour un rôle secondaire dans une comédie romantique.",
    synopsis: "Une charmante comédie romantique dans les ruelles pittoresques de Sidi Bou Said. Quand une jeune femme tuniso-américaine revient au village de sa grand-mère pour l'été, elle découvre que l'amour et les traditions familiales ne sont pas aussi démodés qu'elle le pensait.",
    requirements: ["Expérience en jeu d'acteur souhaitée", "À l'aise avec la comédie", "Disponible pendant 2 mois"],
    compensation: "Rémunération compétitive",
    isPaid: true,
    compensationDetails: "1 800 TND au total pour 3 semaines de tournage. Repas et transport local fournis.",
    status: "Actif",
    applications: 32,
    views: 180,
    createdAt: "2024-01-12",
    productionDates: "Juin 2025 - Juillet 2025",
    shootingLocations: ["Village de Sidi Bou Said", "Plage de La Marsa", "Médina de Tunis"],
    additionalRequirements: ["Showreel comédie", "Photos récentes"],
    roles: [
      {
        id: "role-2-1",
        name: "Yasmine (Rôle secondaire principal)",
        description: "La meilleure amie décalée et attachante qui donne de terribles conseils amoureux mais a un cœur en or. Excellent sens du timing comique requis.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Chaleureuse, accessible, visage expressif",
        skills: ["Comédie", "Improvisation", "Comédie physique"],
        languages: ["Arabe tunisien", "Français"],
        specialTalents: ["Chant (un plus)", "Danse"],
        experienceLevel: "Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Juin - Juillet 2025",
        roleLocation: "Sidi Bou Said, La Marsa",
        roleCompensation: "1 800 TND total"
      },
      {
        id: "role-2-2",
        name: "Grand-mère Fatma",
        description: "La grand-mère sage et spirituelle qui orchestre secrètement l'histoire d'amour. Matriarche comique à la langue acérée et au cœur tendre.",
        ageRange: "60-75 ans",
        gender: "Femme",
        appearance: "Chaleureuse, maternelle, présence distinctive",
        skills: ["Drame", "Comédie"],
        languages: ["Arabe tunisien"],
        experienceLevel: "Tous niveaux",
        talentsNeeded: 1,
        shootingDates: "Juin 2025",
        roleLocation: "Sidi Bou Said",
        roleCompensation: "1 200 TND total"
      }
    ]
  },
  {
    id: 3,
    title: "Troupe - Théâtre Contemporain",
    production: "Théâtre National de Tunisie",
    type: "Théâtre",
    category: "theater",
    location: "Tunis",
    deadline: "2024-08-25",
    description: "Plusieurs rôles disponibles pour une production théâtrale contemporaine explorant la société tunisienne moderne.",
    synopsis: "Une pièce de théâtre audacieuse et expérimentale qui entrelace cinq histoires connectées de jeunes Tunisiens naviguant entre identité, tradition et modernité. Jouée sur une scène minimaliste avec musique live et projections visuelles.",
    requirements: ["Expérience théâtrale requise", "Forte présence scénique", "Disponible pour les répétitions"],
    compensation: "Tarif théâtre",
    isPaid: true,
    compensationDetails: "800 TND/mois pendant les répétitions, 120 TND par représentation. 20 représentations prévues.",
    status: "Actif",
    applications: 28,
    views: 95,
    createdAt: "2024-01-15",
    productionDates: "Avril 2025 - Juin 2025",
    shootingLocations: ["Théâtre Municipal de Tunis", "Cité de la Culture"],
    additionalRequirements: ["Audition en direct requise", "Préparer un monologue contemporain de 3 minutes"],
    roles: [
      {
        id: "role-3-1",
        name: "Amine",
        description: "Un jeune développeur informatique qui se demande s'il doit rester en Tunisie ou émigrer. Son conflit intérieur est le moteur de son parcours.",
        ageRange: "22-28 ans",
        gender: "Homme",
        skills: ["Jeu scénique", "Interprétation de monologues"],
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
        description: "Une musicienne en herbe tiraillée entre les attentes conservatrices de sa famille et ses rêves artistiques.",
        ageRange: "18-25 ans",
        gender: "Femme",
        skills: ["Théâtre musical", "Performance vocale"],
        languages: ["Arabe"],
        specialTalents: ["Chant", "Guitare ou oud"],
        experienceLevel: "Débutant à Intermédiaire",
        talentsNeeded: 1,
        shootingDates: "Avril - Juin 2025",
        roleLocation: "Théâtre Municipal de Tunis",
        roleCompensation: "800 TND/mois + 120 TND/représentation"
      },
      {
        id: "role-3-3",
        name: "Karim",
        description: "Un artiste de rue utilisant le graffiti comme expression politique. Énergie physique et rebelle.",
        ageRange: "20-30 ans",
        gender: "Homme",
        appearance: "Mince, énergique",
        skills: ["Théâtre physique", "Mouvement"],
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
    title: "Mannequins - Campagne Mode",
    production: "Medina Fashion House",
    type: "Publicité",
    category: "commercial",
    location: "Sousse",
    deadline: "2024-08-10",
    description: "Recherche mannequins diversifiés pour une campagne mode mêlant styles traditionnels et contemporains.",
    synopsis: "Une campagne mode haut de gamme célébrant la fusion de l'artisanat traditionnel tunisien avec le design contemporain. Le shooting mettra en valeur des textiles tissés à la main réinventés dans des silhouettes modernes, photographiés dans des paysages iconiques de Tunisie.",
    requirements: ["Expérience en mannequinat", "Taille 170 cm+", "Portfolio professionnel"],
    compensation: "Tarif journalier + droits d'utilisation",
    isPaid: true,
    compensationDetails: "500 TND par jour, tournage de 2 jours. Droits d'utilisation pour l'impression et le numérique pendant 12 mois.",
    status: "Actif",
    applications: 67,
    views: 245,
    createdAt: "2024-01-08",
    productionDates: "Mai 2025 (2 jours)",
    shootingLocations: ["Médina de Sousse", "Amphithéâtre d'El Jem"],
    additionalRequirements: ["Portfolio professionnel (minimum 10 photos)", "Carte composite", "Photos en pied et gros plan"],
    roles: [
      {
        id: "role-4-1",
        name: "Mannequin Principal - Ligne Traditionnelle",
        description: "Représenter la collection patrimoniale. Doit incarner l'élégance et la fierté culturelle en portant des créations tunisiennes traditionnelles.",
        ageRange: "20-30 ans",
        gender: "Femme",
        appearance: "Taille 175 cm+, traits marquants, posture assurée",
        skills: ["Expérience défilé", "Pose"],
        languages: ["Arabe"],
        experienceLevel: "Professionnel",
        talentsNeeded: 2,
        shootingDates: "Mai 2025",
        roleLocation: "Médina de Sousse",
        roleCompensation: "500 TND/jour"
      },
      {
        id: "role-4-2",
        name: "Mannequin Principal - Ligne Moderne",
        description: "Représenter la collection contemporaine. Esthétique urbaine et audacieuse faisant le pont entre tradition et modernité.",
        ageRange: "18-28 ans",
        gender: "Non spécifié",
        appearance: "Taille 170 cm+, look unique, profils diversifiés bienvenus",
        skills: ["Mannequinat éditorial", "Mouvement"],
        languages: ["Arabe", "Français"],
        experienceLevel: "Tous niveaux",
        talentsNeeded: 3,
        shootingDates: "Mai 2025",
        roleLocation: "Amphithéâtre d'El Jem",
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
    applicantEmail: "ahmed@exemple.tn",
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
    applicantEmail: "youssef@exemple.tn",
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
    applicantEmail: "meriem@exemple.tn",
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
    applicantEmail: "sana@exemple.tn",
    coverMessage: "J'adore la comédie et je pense pouvoir apporter beaucoup à Yasmine !",
    experience: "Spectacles d'humour, 2 courts-métrages comiques",
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
