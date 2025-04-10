import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen auth-bg px-4">
    {/* Logo centrado con separación */}
    
    <div className="auth-logo">
        <Link href="/">
        <ApplicationLogo style={{ width: '300px' }} />

        </Link>
    </div>

    {/* Tarjeta */}
    <div >
        {children}
    </div>
</div>
    );
}
