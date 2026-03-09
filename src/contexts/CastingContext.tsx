import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  userId?: string;
  applicantName: string;
  applicantEmail: string;
  coverMessage: string;
  experience: string;
  availability: string;
  photoFiles?: string[];
  videoShowreel?: string;
  portfolioFile?: string;
  status?: string;
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
  synopsis?: string;
  roles?: CastingRole[];
  shootingLocations?: string[];
  productionDates?: string;
  compensationDetails?: string;
  additionalRequirements?: string[];
  contactEmail?: string;
  isPaid?: boolean;
  createdBy?: string;
}

interface CastingContextType {
  castings: Casting[];
  applications: CastingApplication[];
  loading: boolean;
  addCasting: (casting: Omit<Casting, 'id'>) => Promise<void>;
  updateCasting: (id: number, casting: Partial<Casting>) => Promise<void>;
  deleteCasting: (id: number) => Promise<void>;
  addApplication: (application: Omit<CastingApplication, 'id' | 'submittedAt'>) => Promise<void>;
  getApplicationsForCasting: (castingId: number) => CastingApplication[];
  getApplicationsForRole: (castingId: number, roleId: string) => CastingApplication[];
  refreshCastings: () => Promise<void>;
}

const CastingContext = createContext<CastingContextType | undefined>(undefined);

export const useCasting = () => {
  const context = useContext(CastingContext);
  if (!context) {
    throw new Error('useCasting must be used within a CastingProvider');
  }
  return context;
};

// Map DB row to frontend Casting
function mapCasting(row: any, roles: CastingRole[]): Casting {
  return {
    id: row.id,
    title: row.title,
    production: row.production,
    type: row.type,
    category: row.category,
    location: row.location,
    deadline: row.deadline,
    description: row.description,
    requirements: row.requirements || [],
    compensation: row.compensation,
    status: row.status,
    applications: row.applications_count,
    views: row.views,
    createdAt: row.created_at,
    synopsis: row.synopsis,
    shootingLocations: row.shooting_locations,
    productionDates: row.production_dates,
    compensationDetails: row.compensation_details,
    additionalRequirements: row.additional_requirements,
    contactEmail: row.contact_email,
    isPaid: row.is_paid,
    createdBy: row.created_by,
    roles,
  };
}

function mapRole(row: any): CastingRole {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    ageRange: row.age_range || '',
    gender: row.gender || '',
    ethnicity: row.ethnicity,
    appearance: row.appearance,
    skills: row.skills,
    languages: row.languages,
    specialTalents: row.special_talents,
    experienceLevel: row.experience_level,
    talentsNeeded: row.talents_needed,
    shootingDates: row.shooting_dates,
    roleLocation: row.role_location,
    roleCompensation: row.role_compensation,
  };
}

function mapApplication(row: any): CastingApplication {
  return {
    id: row.id,
    castingId: row.casting_id,
    roleId: row.role_id,
    userId: row.user_id,
    applicantName: row.applicant_name,
    applicantEmail: row.applicant_email,
    coverMessage: row.cover_message,
    experience: row.experience || '',
    availability: row.availability || '',
    photoFiles: row.photo_files,
    videoShowreel: row.video_showreel,
    portfolioFile: row.portfolio_file,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export const CastingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [castings, setCastings] = useState<Casting[]>([]);
  const [applications, setApplications] = useState<CastingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCastings = useCallback(async () => {
    setLoading(true);
    try {
      const { data: castingRows, error: castingError } = await supabase
        .from('castings')
        .select('*')
        .order('created_at', { ascending: false });

      if (castingError) throw castingError;

      const { data: roleRows, error: roleError } = await supabase
        .from('casting_roles')
        .select('*');

      if (roleError) throw roleError;

      const rolesBycastingId: Record<number, CastingRole[]> = {};
      for (const r of roleRows || []) {
        const mapped = mapRole(r);
        if (!rolesBycastingId[r.casting_id]) rolesBycastingId[r.casting_id] = [];
        rolesBycastingId[r.casting_id].push(mapped);
      }

      const mapped = (castingRows || []).map(row =>
        mapCasting(row, rolesBycastingId[row.id] || [])
      );
      setCastings(mapped);
    } catch (err) {
      console.error('Error fetching castings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []).map(mapApplication));
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  }, []);

  useEffect(() => {
    fetchCastings();
    fetchApplications();
  }, [fetchCastings, fetchApplications]);

  const addCasting = async (newCasting: Omit<Casting, 'id'>) => {
    const { data, error } = await supabase.from('castings').insert({
      title: newCasting.title,
      production: newCasting.production,
      type: newCasting.type,
      category: newCasting.category,
      location: newCasting.location,
      deadline: newCasting.deadline,
      description: newCasting.description,
      requirements: newCasting.requirements,
      compensation: newCasting.compensation,
      synopsis: newCasting.synopsis,
      shooting_locations: newCasting.shootingLocations,
      production_dates: newCasting.productionDates,
      compensation_details: newCasting.compensationDetails,
      additional_requirements: newCasting.additionalRequirements,
      contact_email: newCasting.contactEmail,
      is_paid: newCasting.isPaid,
      created_by: newCasting.createdBy,
    }).select().single();

    if (error) { console.error('Error adding casting:', error); return; }

    // Insert roles if any
    if (newCasting.roles && newCasting.roles.length > 0 && data) {
      const roleInserts = newCasting.roles.map(role => ({
        casting_id: data.id,
        name: role.name,
        description: role.description,
        age_range: role.ageRange,
        gender: role.gender,
        ethnicity: role.ethnicity,
        appearance: role.appearance,
        skills: role.skills,
        languages: role.languages,
        special_talents: role.specialTalents,
        experience_level: role.experienceLevel,
        talents_needed: role.talentsNeeded,
        shooting_dates: role.shootingDates,
        role_location: role.roleLocation,
        role_compensation: role.roleCompensation,
      }));
      await supabase.from('casting_roles').insert(roleInserts);
    }

    await fetchCastings();
  };

  const updateCasting = async (id: number, updatedData: Partial<Casting>) => {
    const updatePayload: any = {};
    if (updatedData.title !== undefined) updatePayload.title = updatedData.title;
    if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
    if (updatedData.status !== undefined) updatePayload.status = updatedData.status;
    if (updatedData.location !== undefined) updatePayload.location = updatedData.location;

    const { error } = await supabase.from('castings').update(updatePayload).eq('id', id);
    if (error) { console.error('Error updating casting:', error); return; }
    await fetchCastings();
  };

  const deleteCasting = async (id: number) => {
    const { error } = await supabase.from('castings').delete().eq('id', id);
    if (error) { console.error('Error deleting casting:', error); return; }
    await fetchCastings();
  };

  const addApplication = async (application: Omit<CastingApplication, 'id' | 'submittedAt'>) => {
    const { error } = await supabase.from('applications').insert({
      casting_id: application.castingId,
      role_id: application.roleId,
      user_id: application.userId!,
      applicant_name: application.applicantName,
      applicant_email: application.applicantEmail,
      cover_message: application.coverMessage,
      experience: application.experience,
      availability: application.availability,
      photo_files: application.photoFiles,
      video_showreel: application.videoShowreel,
      portfolio_file: application.portfolioFile,
    });

    if (error) { console.error('Error adding application:', error); return; }

    // Increment application count
    try {
      const { data: castingData } = await supabase
        .from('castings')
        .select('applications_count')
        .eq('id', application.castingId)
        .single();
      if (castingData) {
        await supabase
          .from('castings')
          .update({ applications_count: (castingData.applications_count || 0) + 1 })
          .eq('id', application.castingId);
      }
    } catch (e) {
      console.error('Error incrementing count:', e);
    }

    await fetchApplications();
  };

  const getApplicationsForCasting = (castingId: number) => {
    return applications.filter(a => a.castingId === castingId);
  };

  const getApplicationsForRole = (castingId: number, roleId: string) => {
    return applications.filter(a => a.castingId === castingId && a.roleId === roleId);
  };

  return (
    <CastingContext.Provider value={{
      castings, applications, loading,
      addCasting, updateCasting, deleteCasting,
      addApplication, getApplicationsForCasting, getApplicationsForRole,
      refreshCastings: fetchCastings,
    }}>
      {children}
    </CastingContext.Provider>
  );
};
