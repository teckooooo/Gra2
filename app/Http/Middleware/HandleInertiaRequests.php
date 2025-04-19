<?php

namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => Auth::check() ? [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->getRoleNames()->first(),

                    // 🔑 Usa permisos reales, heredados desde el rol
                    'permissions' => Auth::user()->getAllPermissions()->pluck('name'), 
                ] : null,
            ],
        ]);
    }
}

