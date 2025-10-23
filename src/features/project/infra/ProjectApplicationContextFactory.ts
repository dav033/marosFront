import { HttpProjectRepository } from "./http";

export type ProjectAppContext = ReturnType<
  typeof ProjectApplicationContextFactory.createHttpContext
>;

export class ProjectApplicationContextFactory {
  static createHttpContext() {
    const repo = new HttpProjectRepository();

    const ctx = {
      repos: { project: repo },
    } as const;

    return ctx;
  }
}
