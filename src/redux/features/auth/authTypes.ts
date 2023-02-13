export type authenticationState =
  | "Authenticated"
  | "Unauthenticated"
  | "Transient";

export interface userDB {
  Nombre: string;
  Apellido: string;
  Email: string;
}
