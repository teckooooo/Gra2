export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
  }
  
  export interface Rol {
    id: number;
    name: string;
  }
  
  export interface Permiso {
    id: number;
    name: string;
  }
  
  export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
  > = T & {
    auth: {
      user: User;
    };
  };
  