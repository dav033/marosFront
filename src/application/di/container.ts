// Simple Dependency Injection Container
import { httpClient } from "../../infrastructure/http/httpClient";
import { LeadRestRepository } from "../../infrastructure/repositories/LeadRestRepository";
import { ContactRestRepository } from "../../infrastructure/repositories/ContactRestRepository";
import { ProjectTypeRestRepository } from "../../infrastructure/repositories/ProjectTypeRestRepository";

// Use Case Functions
import { listLeads } from "../leads/ListLeads";
import { getLeadById } from "../leads/GetLeadById";
import { createLeadWithExistingContact } from "../leads/CreateLeadWithExistingContact";
import { createLeadWithNewContact } from "../leads/CreateLeadWithNewContact";
import { updateLead } from "../leads/UpdateLead";
import { deleteLead } from "../leads/DeleteLead";
import { validateLeadNumber } from "../leads/ValidateLeadNumber";

import { listContacts } from "../contacts/ListContacts";
import { getContactById } from "../contacts/GetContactById";
import { createContact } from "../contacts/CreateContact";
import { updateContact } from "../contacts/UpdateContact";
import { deleteContact } from "../contacts/DeleteContact";
import { validateContactAvailability } from "../contacts/ValidateContactAvailability";

import { listProjectTypes } from "../project-types/ListProjectTypes";

export class DIContainer {
  private static instance: DIContainer;
  
  // Infrastructure
  private readonly leadRepository: LeadRestRepository;
  private readonly contactRepository: ContactRestRepository;
  private readonly projectTypeRepository: ProjectTypeRestRepository;

  private constructor() {
    // Infrastructure setup
    this.leadRepository = new LeadRestRepository(httpClient);
    this.contactRepository = new ContactRestRepository(httpClient);
    this.projectTypeRepository = new ProjectTypeRestRepository(httpClient);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Lead Use Cases - Return bound functions
  getListLeads() { 
    return (type?: Parameters<typeof listLeads>[1]) => listLeads(this.leadRepository, type);
  }
  
  getGetLeadById() { 
    return (id: Parameters<typeof getLeadById>[1]) => getLeadById(this.leadRepository, id);
  }
  
  getCreateLeadWithExistingContact() { 
    return (input: Parameters<typeof createLeadWithExistingContact>[1]) => createLeadWithExistingContact(this.leadRepository, input);
  }
  
  getCreateLeadWithNewContact() { 
    return (input: Parameters<typeof createLeadWithNewContact>[1]) => createLeadWithNewContact(this.leadRepository, input);
  }
  
  getUpdateLead() { 
    return (id: Parameters<typeof updateLead>[1], patch: Parameters<typeof updateLead>[2]) => updateLead(this.leadRepository, id, patch);
  }
  
  getDeleteLead() { 
    return (id: Parameters<typeof deleteLead>[1]) => deleteLead(this.leadRepository, id);
  }
  
  getValidateLeadNumber() { 
    return (leadNumber: Parameters<typeof validateLeadNumber>[1]) => validateLeadNumber(this.leadRepository, leadNumber);
  }

  // Contact Use Cases - Return bound functions
  getListContacts() { 
    return () => listContacts(this.contactRepository);
  }
  
  getGetContactById() { 
    return (id: Parameters<typeof getContactById>[1]) => getContactById(this.contactRepository, id);
  }
  
  getCreateContact() { 
    return (contact: Parameters<typeof createContact>[1]) => createContact(this.contactRepository, contact);
  }
  
  getUpdateContact() { 
    return (id: Parameters<typeof updateContact>[1], patch: Parameters<typeof updateContact>[2]) => updateContact(this.contactRepository, id, patch);
  }
  
  getDeleteContact() { 
    return (id: Parameters<typeof deleteContact>[1]) => deleteContact(this.contactRepository, id);
  }
  
  getValidateContactAvailability() { 
    return (params: Parameters<typeof validateContactAvailability>[1]) => validateContactAvailability(this.contactRepository, params);
  }

  // Project Type Use Cases
  getListProjectTypes() { 
    return () => listProjectTypes(this.projectTypeRepository);
  }

  // Direct repository access (if needed for specific cases)
  getLeadRepository(): LeadRestRepository { return this.leadRepository; }
  getContactRepository(): ContactRestRepository { return this.contactRepository; }
  getProjectTypeRepository(): ProjectTypeRestRepository { return this.projectTypeRepository; }
}

// Convenient accessor
export const container = DIContainer.getInstance();