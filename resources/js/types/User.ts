export interface User {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    role?: string;
}
