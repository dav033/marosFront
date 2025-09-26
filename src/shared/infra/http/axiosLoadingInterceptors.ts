import type { AxiosInstance } from "axios";
import { loadingBus } from "@/presentation/context/loading/loadingBus";

const matchForSkeleton = (url?: string) =>
  !!url && (/\/api\/contacts/i.test(url) || /\/api\/leads/i.test(url));

let pendingTracked = 0;

export function attachLoadingInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    if (matchForSkeleton(config.url)) {
      if (pendingTracked === 0) {
        const isContacts = /contacts/i.test(config.url || "");
        const type = isContacts ? "contactsTable" : "leadsTable";
        loadingBus.set(type, {
          overlay: true,
          rows: isContacts ? 15 : 12,
          showSections: !isContacts,
        });
        loadingBus.show(type);
      }
      pendingTracked += 1;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      if (matchForSkeleton(res.config?.url)) {
        pendingTracked = Math.max(0, pendingTracked - 1);
        if (pendingTracked === 0) loadingBus.hide();
      }
      return res;
    },
    (err) => {
      if (matchForSkeleton(err.config?.url)) {
        pendingTracked = Math.max(0, pendingTracked - 1);
        if (pendingTracked === 0) loadingBus.hide();
      }
      return Promise.reject(err);
    }
  );
}
