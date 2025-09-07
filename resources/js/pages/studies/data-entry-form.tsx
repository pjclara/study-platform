
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import toast from 'react-hot-toast';

type Variable = {
    id: number;
    name: string;
    type: string;
    options?: string[]; // novas opções vindas do backend
};

type PageProps = {
    studyId: number;
    variables: Variable[];
};

export default function DataEntryForm() {
    const { studyId, variables } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        values: variables.reduce((acc, v) => ({ ...acc, [v.id]: '' }), {} as Record<number, string>),
    });

    function handleValueChange(variableId: number, value: string) {
        setData('values', { ...data.values, [variableId]: value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/studies/${studyId}/data-entry`, {
            onSuccess: () => {
                toast.success('Entrada criada com sucesso!');
                reset();
            },
            onError: () => toast.error('Erro ao criar entrada.'),
        });
    }
    return (
        <AppLayout>
            <Head title="Adicionar Entrada de Dados" />
            <h1 className="mb-4 text-2xl font-bold">Adicionar Entrada de Dados</h1>
            <Link href={`/studies/${studyId}/data-list`} className="btn btn-secondary mb-4">
                Voltar para Lista de Dados
            </Link>

            <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-md">
                {variables.map((v) => (
                    <div key={v.id}>
                        <label className="mb-1 block font-medium text-gray-700">{v.name}</label>
                        {(() => {
                            if (v.type === 'select' && v.options) {
                                return (
                                    <select
                                        value={data.values[v.id] || ''}
                                        onChange={e => handleValueChange(v.id, e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Selecione...</option>
                                        {v.options.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                );
                            }
                            if (v.type === 'boolean') {
                                return (
                                    <select
                                        value={data.values[v.id] || ''}
                                        onChange={e => handleValueChange(v.id, e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                );
                            }
                            if (v.type === 'number') {
                                return (
                                    <input
                                        type="number"
                                        value={data.values[v.id] || ''}
                                        onChange={e => handleValueChange(v.id, e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                );
                            }
                            if (v.type === 'date') {
                                return (
                                    <input
                                        type="date"
                                        value={data.values[v.id] || ''}
                                        onChange={e => handleValueChange(v.id, e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                );
                            }
                            // fallback para texto
                            return (
                                <input
                                    type="text"
                                    value={data.values[v.id] || ''}
                                    onChange={e => handleValueChange(v.id, e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            );
                        })()}
                        {(errors as Record<string, string>)[`values.${v.id}`] && (
                            <div className="text-sm text-red-500">{(errors as Record<string, string>)[`values.${v.id}`]}</div>
                        )}
                    </div>
                ))}

                <div className="flex justify-end">
                    <button type="submit" className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600" disabled={processing}>
                        Adicionar Entrada
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
