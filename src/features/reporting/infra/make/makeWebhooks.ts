import axios from "axios";

export const MAKE_HOOKS = {
  uploadImage: "https://hook.us1.make.com/gzmqvlipalsjxohvjncgtoe7xb8yxmx5",
  restorationVisit: "https://hook.us1.make.com/m8aizswomvuyttlq4mepsbbs6g1fr5ya",
  finalRestoration: "https://hook.us1.make.com/ryrmjj7he35wjc1w7xu9ckpjyyfxv6x6",
} as const;

/**
 * Sube una imagen a Make (misma firma que el proyecto original).
 * Retorna el JSON que Make responde (usado como imageId en arrays imageIds).
 */
export async function uploadImageToMake(file: File, imageIndex?: string | number) {
  const form = new FormData();
  form.append("imageFile", file);
  if (imageIndex !== undefined) form.append("imageIndex", String(imageIndex));

  const { data } = await axios.post(MAKE_HOOKS.uploadImage, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Envío final de Restoration Visit: { formData } → redirige con response.data */
export async function sendRestorationVisit(formData: unknown) {
  const { data } = await axios.post(MAKE_HOOKS.restorationVisit, { formData });
  return data as string; // URL a redirigir
}

/** Envío final de Restoration Final: { formData } → redirige con response.data */
export async function sendFinalRestoration(formData: unknown) {
  const { data } = await axios.post(MAKE_HOOKS.finalRestoration, { formData });
  return data as string; // URL a redirigir
}
