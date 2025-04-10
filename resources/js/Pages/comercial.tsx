// resources/js/Pages/NuevaVista.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function NuevaVista() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Módulo Comercial
                </h2>
            }
        >
            <Head title="Módulo Comercial" />

        </AuthenticatedLayout>
    );
}
