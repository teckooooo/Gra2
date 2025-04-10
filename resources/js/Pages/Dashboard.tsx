import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Grilla Canales
                </h2>
                
            }
        >
            <Head title="Grilla Canales" />
            
        </AuthenticatedLayout>
    );
}
