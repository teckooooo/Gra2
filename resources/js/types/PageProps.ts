export interface Canal {
    id: number;
    canal: string;
    canales_con_decodificador: string;
}
export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string; // opcional
            permissions: string[];
        };
    };
    datos: Canal[];
    [key: string]: any;
}