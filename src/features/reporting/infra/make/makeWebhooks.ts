import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
export const MAKE_HOOKS = {
  uploadImage: "/api/make/upload-image",
  restorationVisit: "/api/make/restoration-visit",
  finalRestoration: "/api/make/final-restoration",
} as const;

export async function uploadImageToMake(
  file: File,
  imageIndex?: string | number
) {
  const form = new FormData();
  form.append("imageFile", file);
  if (imageIndex !== undefined) form.append("imageIndex", String(imageIndex));

  const res = await optimizedApiClient.post(MAKE_HOOKS.uploadImage, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function sendRestorationVisit(formData: unknown) {
  const res = await optimizedApiClient.post(MAKE_HOOKS.restorationVisit, {
    formData,
  });
  return res.data as string;
}

export async function sendFinalRestoration(formData: unknown) {
  const res = await optimizedApiClient.post(MAKE_HOOKS.finalRestoration, {
    formData,
  });
  return res.data as string;
}
