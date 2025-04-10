import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
    <Head title="Iniciar sesión" />

    <div className=" flex items-center justify-center">
        {/* 🎯 Esta es la tarjeta blanca */}
        <div className="auth-form-card">
            <form onSubmit={submit} className="space-y-6">
                <h1 className="text-3xl font-bold text-center">Iniciar sesión</h1>

                {status && (
                    <div className="text-sm text-green-600 text-center">{status}</div>
                )}

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                        autoComplete="username"
                        isFocused
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', Boolean(e.target.checked))
                            }
                        />
                        <span className="ml-2">Recordarme</span>
                    </label>
                </div>

                <PrimaryButton
                    className="auth-button w-full justify-center text-lg"
                    disabled={processing}
                    >
                    Iniciar sesión
                </PrimaryButton>
            </form>
        </div>
    </div>
</GuestLayout>

    );
}
