import { httpClient, type HttpClient } from "../http/httpClient";
import { LeadRestRepository } from "../repositories/LeadRestRepository";
import { ContactRestRepository } from "../repositories/ContactRestRepository";
import { ProjectTypeRestRepository } from "../repositories/ProjectTypeRestRepository";

export type Repositories = {
  leadRepo: ReturnType<typeof makeLeadRepo>;
  contactRepo: ReturnType<typeof makeContactRepo>;
  projectTypeRepo: ReturnType<typeof makeProjectTypeRepo>;
};

export function makeLeadRepo(client: HttpClient = httpClient) {
  return new LeadRestRepository(client);
}

export function makeContactRepo(client: HttpClient = httpClient) {
  return new ContactRestRepository(client);
}

export function makeProjectTypeRepo(client: HttpClient = httpClient) {
  return new ProjectTypeRestRepository(client);
}

export const repos: Repositories = {
  leadRepo: makeLeadRepo(),
  contactRepo: makeContactRepo(),
  projectTypeRepo: makeProjectTypeRepo(),
};