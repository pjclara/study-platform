import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function EditDataEntry() {
    const { dataEntry, variable } = usePage().props as {
        dataEntry: { id: number; value: string; variable_id: number };
        variable: { id: number; name: string };
    };
    const { data, setData, put, processing, errors } = useForm({ value: dataEntry.value });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/data-entries/${dataEntry.id}`);
    }

    return (
        <AppLayout>
            <Head title={`Editar valor de ${variable.name}`} />
            <h1 className="mb-4 text-2xl font-bold">Editar valor da variável: {variable.name}</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Valor</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={data.value}
                        onChange={e => setData('value', e.target.value)}
                        disabled={processing}
                    />
                    {errors.value && <div className="text-red-500 text-sm mt-1">{errors.value}</div>}
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                        Salvar
                    </button>
                    <Link href="/studies" className="btn btn-secondary">
                        Cancelar
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
