import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { LeadType, LeadStatus } from "../types/enums";
import type { Lead } from "@/types";
import type {
  LeadsState,
  LeadsAction,
  LeadsContextType,
  LeadsProviderProps
} from "../types/contexts/leads";

const initialState: LeadsState = {
  leads: [],
  isLoading: false,
  error: null,
};

const leadsReducer = (state: LeadsState, action: LeadsAction): LeadsState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_LEADS":
      return { ...state, leads: action.payload, isLoading: false, error: null };

    case "ADD_LEAD":
      return {
        ...state,
        leads: [...state.leads, action.payload],
        isLoading: false,
        error: null,
      };

    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === action.payload.id ? action.payload : lead
        ),
        isLoading: false,
        error: null,
      };

    case "DELETE_LEAD":
      return {
        ...state,
        leads: state.leads.filter((lead) => lead.id !== action.payload),
        isLoading: false,
        error: null,
      };

    case "CLEAR_LEADS":
      return { ...state, leads: [], error: null };

    default:
      return state;
  }
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const useLeads = (): LeadsContextType => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
};

export const LeadsProvider: React.FC<LeadsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(leadsReducer, initialState);

  const addLead = useCallback(
    (lead: Lead) => dispatch({ type: "ADD_LEAD", payload: lead }),
    []
  );
  const updateLead = useCallback(
    (lead: Lead) => dispatch({ type: "UPDATE_LEAD", payload: lead }),
    []
  );
  const deleteLead = useCallback(
    (leadId: number) => dispatch({ type: "DELETE_LEAD", payload: leadId }),
    []
  );
  const setLeads = useCallback(
    (leads: Lead[]) => dispatch({ type: "SET_LEADS", payload: leads }),
    []
  );
  const setLoading = useCallback(
    (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }),
    []
  );
  const setError = useCallback(
    (error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
    []
  );

  const getLeadsByType = useCallback(
    (type: LeadType): Lead[] => {
      return state.leads.filter((lead) => lead.leadType === type);
    },
    [state.leads]
  );

  const getLeadsByStatus = useCallback(
    (status: LeadStatus): Lead[] => {
      return state.leads.filter((lead) => lead.status === status);
    },
    [state.leads]
  );

  const getUndeterminedLeads = useCallback((): Lead[] => {
    return state.leads.filter((lead) => !lead.status || lead.status === null);
  }, [state.leads]);

  const getPendingLeads = useCallback((): Lead[] => {
    return state.leads.filter((lead) => lead.status === LeadStatus.TO_DO);
  }, [state.leads]);

  const getInProgressLeads = useCallback((): Lead[] => {
    return state.leads.filter((lead) => lead.status === LeadStatus.IN_PROGRESS);
  }, [state.leads]);

  const getCompletedLeads = useCallback((): Lead[] => {
    return state.leads.filter((lead) => lead.status === LeadStatus.DONE);
  }, [state.leads]);

  const getLostLeads = useCallback((): Lead[] => {
    return state.leads.filter((lead) => lead.status === LeadStatus.LOST);
  }, [state.leads]);

  // Valor del contexto memoizado
  const value: LeadsContextType = useMemo(
    () => ({
      ...state,
      dispatch,
      addLead,
      updateLead,
      deleteLead,
      setLeads,
      setLoading,
      setError,
      getLeadsByType,
      getLeadsByStatus,
      getUndeterminedLeads,
      getPendingLeads,
      getInProgressLeads,
      getCompletedLeads,
      getLostLeads,
    }),
    [
      state,
      addLead,
      updateLead,
      deleteLead,
      setLeads,
      setLoading,
      setError,
      getLeadsByType,
      getLeadsByStatus,
      getUndeterminedLeads,
      getPendingLeads,
      getInProgressLeads,
      getCompletedLeads,
      getLostLeads,
    ]
  );

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
};
