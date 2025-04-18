// resources/js/Pages/NuevaVista.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function reportesComercial() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Reportes Comercial
                </h2>
            }
        >
            <Head title="Reportes Comercial" />

        </AuthenticatedLayout>
    );
}
