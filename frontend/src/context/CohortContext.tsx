import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import type { Cohort } from '../types';

export interface Topic {
  _id: string; 
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  solvedQuestions: number;
  subTopics: string[];
}

interface CohortContextType {
  activeCohort: string;
  setActiveCohort: (cohort: string) => void;
  cohortData: Record<string, Topic[]>;
  cohorts: Cohort[];
  allCohorts: Cohort[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}


import { cohortApi, dashboardApi } from '../api';

const CohortContext = createContext<CohortContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL;
export const CohortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCohort, setActiveCohort] = useState('');
  const [cohortData, setCohortData] = useState<Record<string, Topic[]>>({});
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [allCohorts, setAllCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useUser();
  const refreshData = useCallback(async () => {
    if (!user?._id) return;

    try {
      const [dashRes, cohRes, allCohRes] = await Promise.all([
        dashboardApi.getDashboardStats(user._id),
        cohortApi.getMyCohorts(),
        cohortApi.getAll()
      ]);
      
      const dashResult = dashRes.data;
      const myCohorts = cohRes.data.success ? cohRes.data.data : [];
      const everyCohort = allCohRes.data.success ? allCohRes.data.data : [];
      
      if (dashResult.success) {
        setCohortData(dashResult.data);
      }

      setCohorts(myCohorts);
      setAllCohorts(everyCohort);

      // Only set initial activeCohort if one isn't already selected
      setActiveCohort(prev => {
        if (prev && [...myCohorts.map(c => c.name), ...Object.keys(dashResult.data || {})].includes(prev)) {
          return prev;
        }
        if (myCohorts.length > 0) return myCohorts[0].name;
        if (dashResult.success) {
          const available = Object.keys(dashResult.data);
          if (available.length > 0) return available[0];
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to fetch cohorts from backend:", error);
    }
  }, [user?._id]); 

  useEffect(() => {
    if (!user?._id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    refreshData().finally(() => setIsLoading(false));
  }, [user?._id, refreshData]);

  const contextValue = React.useMemo(() => ({ 
    activeCohort, 
    setActiveCohort, 
    cohortData, 
    cohorts, 
    allCohorts,
    isLoading, 
    refreshData 
  }), [activeCohort, cohortData, cohorts, allCohorts, isLoading, refreshData]);

  return (
    <CohortContext.Provider value={contextValue}>
      {children}
    </CohortContext.Provider>
  );
};


export const useCohort = () => {
  const context = useContext(CohortContext);
  if (context === undefined) {
    throw new Error('useCohort must be used within a CohortProvider');
  }
  return context;
};