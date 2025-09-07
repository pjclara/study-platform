
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function EditVariable() {
    const { studyId, variable } = usePage().props as unknown as {
        studyId: number;
        variable: {
            id: number;
            name: string;
            type?: string;
            options?: string[];
        };
    };
    const [localOptions, setLocalOptions] = React.useState<string[]>(variable.options || []);
    const { data, setData, put, processing, errors } = useForm({
        name: variable.name,
        type: variable.type || 'text',
        options: variable.options || [],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Atualiza o estado do formulário antes de enviar
        if (data.type !== 'select') {
            setData('options', []);
        } else {
            setData('options', localOptions.filter(opt => opt.trim() !== ''));
        }
        setTimeout(() => {
            put(`/studies/${studyId}/variables/${variable.id}`);
        }, 0);
    }

    return (
        <AppLayout>
            <Head title={`Editar variável: ${variable.name}`} />
            <h1 className="mb-4 text-2xl font-bold">Editar variável</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
                <div>
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
                <div>
                    <label className="block mb-1 font-semibold">Tipo</label>
                    <select
                        className="select select-bordered w-full"
                        value={data.type}
                        onChange={e => setData('type', e.target.value)}
                        disabled={processing}
                    >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Booleano</option>
                        <option value="date">Data</option>
                        <option value="select">Seleção (lista de opções)</option>
                    </select>
                    {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
                </div>
                {data.type === 'select' && (
                    <div>
                        <label className="block mb-1 font-semibold">Opções (uma por linha)</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            value={localOptions.join('\n')}
                            onChange={e => {
                                const opts = e.target.value.split(/\r?\n/).map(opt => opt.trim()).filter(Boolean);
                                setLocalOptions(opts);
                            }}
                            disabled={processing}
                        />
                        {errors.options && <div className="text-red-500 text-sm mt-1">{errors.options}</div>}
                    </div>
                )}
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
