import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import type { User } from '@/types/User';

interface LayoutProps extends PropsWithChildren {
    header?: ReactNode;
    auth?: {
        user: User;
    };
}

export default function Authenticated({ auth, header, children }: LayoutProps) {
    const page = usePage().props;
    const user = auth?.user || (page.auth?.user as User);
    const permisos: string[] = user?.permissions ?? [];

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        if (user?.role) {
            console.log('%c👤 Rol del usuario:', 'color: #93c5fd; font-weight: bold', user.role);
        }
    }, [user?.role]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo y enlaces */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center logo-wrapper">
                                <Link href="/">
                                    <ApplicationLogo className="h-8 w-auto" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {permisos.includes('Acceso a Grilla Canal') && (
                                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                        Grilla Canal
                                    </NavLink>
                                )}
                                {permisos.includes('Acceso a Módulo Comercial') && (
                                    <NavLink href={route('comercial')} active={route().current('comercial')}>
                                    Módulo Comercial
                                </NavLink>
                                )}
                                {permisos.includes('Acceso a Reportes Canal') && (
                                    <NavLink href={route('reportesCanal')} active={route().current('reportesCanal')}>
                                        Reportes Canal
                                    </NavLink>
                                )}
                                {permisos.includes('Acceso a Reportes Comercial') && (
                                    <NavLink href={route('reportesComercial')} active={route().current('reportesComercial')}>
                                        Reportes Comercial
                                    </NavLink>
                                )}
                                {permisos.includes('Acceso a Canales') && (
                                    <NavLink href={route('canales')} active={route().current('canales')}>
                                        Canales
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Usuario y menú */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                            >
                                                {user.name}
                                                <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        {permisos.includes('Acceso a Configuraciones') && (
                                            <Dropdown.Link href={route('configuracion')}>Configuraciones</Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Salir
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Botón hamburguesa mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={!showingNavigationDropdown ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'}
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">
                        {permisos.includes('Acceso a Grilla Canal') && (
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Grilla Canal
                            </ResponsiveNavLink>
                        )}
                        {permisos.includes('Acceso a Módulo Comercial') && (
                            <NavLink href={route('comercial')} active={route().current('comercial')}>
                            Módulo Comercial
                        </NavLink>
                        )}
                        {permisos.includes('Acceso a Reportes Canal') && (
                            <ResponsiveNavLink href={route('reportesCanal')} active={route().current('reportesCanal')}>
                                Reportes Canal
                            </ResponsiveNavLink>
                        )}
                        {permisos.includes('Acceso a Reportes Comercial') && (
                            <ResponsiveNavLink href={route('reportesComercial')} active={route().current('reportesComercial')}>
                                Reportes Comercial
                            </ResponsiveNavLink>
                        )}
                        {permisos.includes('Acceso a Canales') && (
                            <ResponsiveNavLink href={route('canales')} active={route().current('canales')}>
                                Canales
                            </ResponsiveNavLink>
                        )}
                        {permisos.includes('Acceso a Configuraciones') && (
                            <ResponsiveNavLink href={route('configuracion')} active={route().current('configuracion')}>
                                Configuraciones
                            </ResponsiveNavLink>
                        )}
                    </div>
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Salir
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
