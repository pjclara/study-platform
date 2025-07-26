import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function EditVariable() {
    const { studyId, variable } = usePage().props as { studyId: number; variable: { id: number; name: string } };
    const { data, setData, put, processing, errors } = useForm({ name: variable.name });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/studies/${studyId}/variables/${variable.id}`);
    }

    return (
        <AppLayout>
            <Head title={`Editar variável: ${variable.name}`} />
            <h1 className="mb-4 text-2xl font-bold">Editar variável</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Nome</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        disabled={processing}
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                        Salvar
                    </button>
                    <Link href={`/studies/${studyId}`} className="btn btn-secondary">
                        Cancelar
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
