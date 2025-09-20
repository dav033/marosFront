export interface ContactsServicePort {
  /** Elimina un contacto por id. Devuelve true si el backend confirma borrado. */
  delete(id: number): Promise<boolean>;

  /** (Opcional) actualizar contacto */
  // update(id: number, data: Partial<Contact>): Promise<Contact>;

  /** (Opcional) crear contacto */
  // create(data: NewContact): Promise<Contact>;
}
