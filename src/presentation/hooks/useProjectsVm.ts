import * as React from "react";

import {
  HttpProjectRepository,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  getProjectsByStatus,
  getProjectsWithLeads,
  makeProjectsAppContext,
  updateProject,
  type Project,
  type ProjectDraft,
  type ProjectId,
  type ProjectPatch,
  type ProjectStatus,
  type ProjectWithLeadView,
} from "@/project";
import { getErrorMessage } from "@/utils";

type State = {
  data: Project[];
  loading: boolean;
  error: string | null;
};

const ctx = makeProjectsAppContext({
  repos: {
    project: new HttpProjectRepository(),
  },
});

export function useProjectsVm(initialStatus?: ProjectStatus) {
  const [state, setState] = React.useState<State>({ data: [], loading: false, error: null });

  const loadAll = React.useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
  const data = await getProjects(ctx);
  setState({ data, loading: false, error: null });
      return data;
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to load projects";
      setState(s => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);

  const loadByStatus = React.useCallback(async (status: ProjectStatus) => {
  setState(s => ({ ...s, loading: true, error: null }));
    try {
  const data = await getProjectsByStatus(ctx, status);
  setState({ data, loading: false, error: null });
      return data;
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to load projects";
      setState(s => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);

   const loadWithLeads = React.useCallback(async () => {
  setState((s) => ({ ...s, loading: true, error: null }));
    try {
  const data = await getProjectsWithLeads(ctx); 
  setState({ data, loading: false, error: null });
      return data as ProjectWithLeadView[];
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to load projects with leads";
      setState((s) => ({
        ...s,
        loading: false,
        error: msg,
      }));
      throw e;
    }
  }, []);

  const create = React.useCallback(async (draft: ProjectDraft) => {
  setState(s => ({ ...s, loading: true, error: null }));
    try {
  const created = await createProject(ctx, draft);
      setState(s => ({ ...s, loading: false, data: [created, ...s.data] }));
      return created;
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to create project";
      setState(s => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);

  const update = React.useCallback(async (id: ProjectId, patch: ProjectPatch) => {
  setState(s => ({ ...s, loading: true, error: null }));
    try {
  const updated = await updateProject(ctx, id, patch);
      setState(s => ({
        ...s,
        loading: false,
        data: s.data.map(p => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to update project";
      setState(s => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);

  const remove = React.useCallback(async (id: ProjectId) => {
  setState(s => ({ ...s, loading: true, error: null }));
    try {
  await deleteProject(ctx, id);
      setState(s => ({ ...s, loading: false, data: s.data.filter(p => p.id !== id) }));
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to delete project";
      setState(s => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);


   

  React.useEffect(() => {
    if (initialStatus) void loadByStatus(initialStatus);
    else void loadAll();
  }, [initialStatus, loadAll, loadByStatus]);

  return {
    ...state,
    reload: initialStatus ? () => loadByStatus(initialStatus) : loadAll,
    loadAll,
    loadByStatus,
    loadWithLeads, 
    create,
    update,
    remove,
    getById: (id: ProjectId) => getProjectById(ctx, id),
  };
}
