import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

type Variable = {
    id: number;
    name: string;
    type: string;
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
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout>
            <Head title="Add Data Entry" />
            <h1 className="mb-4 text-2xl font-bold">Add Data Entry</h1>
            <Link href={`/studies/${studyId}/data-list`} className="btn btn-secondary mb-4">
                Back to Data List
            </Link>
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-md">
                

                {variables.map((v) => (
                    <div key={v.id}>
                        <label className="mb-1 block font-medium text-gray-700">{v.name}</label>
                        <input
                            type={v.type}
                            value={data.values[v.id] || ''}
                            onChange={(e) => handleValueChange(v.id, e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>
                ))}

                <div className="flex justify-end">
                    <button type="submit" className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" disabled={processing}>
                        Adicionar Entrada
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
