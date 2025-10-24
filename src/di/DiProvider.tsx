// src/di/DiProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import type { ContactsAppContext } from "@/contact";
import { makeContactsAppContext } from "@/contact";
import { ContactHttpRepository } from "@/contact";

import type { LeadsAppContext } from "@/leads";
import { makeLeadsAppContext, SystemClock } from "@/leads";
import {
  ContactRepositoryAdapterForLeads,
  LeadHttpRepository,
  LeadNumberAvailabilityHttpService,
  ProjectTypeHttpRepository,
} from "@/leads";

import type { ProjectsAppContext } from "@/project";
import { makeProjectsAppContext } from "@/project";
import { HttpProjectRepository } from "@/project";

const ContactsCtx = createContext<ContactsAppContext | null>(null);
const LeadsCtx = createContext<LeadsAppContext | null>(null);
const ProjectsCtx = createContext<ProjectsAppContext | null>(null);

export const useContactsApp = (): ContactsAppContext => {
  const ctx = useContext(ContactsCtx);
  if (!ctx) throw new Error("useContactsApp must be used within <DiProvider/>");
  return ctx;
};

export const useLeadsApp = (): LeadsAppContext => {
  const ctx = useContext(LeadsCtx);
  if (!ctx) throw new Error("useLeadsApp must be used within <DiProvider/>");
  return ctx;
};

export const useProjectsApp = (): ProjectsAppContext => {
  const ctx = useContext(ProjectsCtx);
  if (!ctx) throw new Error("useProjectsApp must be used within <DiProvider/>");
  return ctx;
};

export const DiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const contactsCtx = useMemo<ContactsAppContext>(() => {
    return makeContactsAppContext({
      repos: {
        contact: new ContactHttpRepository(),
      },
    });
  }, []);

  const leadsCtx = useMemo<LeadsAppContext>(() => {
    return makeLeadsAppContext({
      clock: SystemClock,
      repos: {
        lead: new LeadHttpRepository(),
        contact: new ContactRepositoryAdapterForLeads(),
        projectType: new ProjectTypeHttpRepository(),
      },
      services: {
        leadNumberAvailability: new LeadNumberAvailabilityHttpService(),
      },
    });
  }, []);

  const projectsCtx = useMemo<ProjectsAppContext>(() => {
    return makeProjectsAppContext({
      repos: { project: new HttpProjectRepository() },
    });
  }, []);

  return (
    <ContactsCtx.Provider value={contactsCtx}>
      <LeadsCtx.Provider value={leadsCtx}>
        <ProjectsCtx.Provider value={projectsCtx}>
          {children}
        </ProjectsCtx.Provider>
      </LeadsCtx.Provider>
    </ContactsCtx.Provider>
  );
};
