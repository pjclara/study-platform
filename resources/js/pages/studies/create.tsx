import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function StudyCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        start_date: '',
        status: '',
        ethical_approval: false,
        study_type: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/studies', {
            onSuccess: () => {
                setData({
                    name: '',
                    description: '',
                    start_date: '',
                    status: '',
                    ethical_approval: false,
                    study_type: '',
                });
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Create Study" />
            <h1 className="mb-4 text-2xl font-bold">Create Study</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-1 block font-medium text-gray-700">Nome</label>
                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input input-bordered w-full" />
                    {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
                </div>
                <div>
                    <label className="mb-1 block font-medium text-gray-700">Descrição</label>
                    <textarea
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        className="textarea textarea-bordered w-full"
                        placeholder="Digite a descrição do estudo"
                    />
                    {errors.description && <div className="mt-1 text-sm text-red-500">{errors.description}</div>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">Data de Início</label>
                        <input
                            type="date"
                            value={data.start_date || ''}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="input input-bordered w-full"
                        />
                        {errors.start_date && <div className="mt-1 text-sm text-red-500">{errors.start_date}</div>}
                    </div>

                   
                </div>
                <div>
                    <label className="mb-1 block font-medium text-gray-700">Status</label>
                    <select value={data.status || ''} onChange={(e) => setData('status', e.target.value)} className="select select-bordered w-full">
                        <option value="">Selecione o Status</option>
                        <option value="planned">planned</option>
                        <option value="ongoing">ongoing</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                    {errors.status && <div className="mt-1 text-sm text-red-500">{errors.status}</div>}
                </div>
                <div>
                    <label className="mb-1 block font-medium text-gray-700">Tipo de Estudo</label>
                    <input
                        type="text"
                        value={data.study_type || ''}
                        onChange={(e) => setData('study_type', e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.study_type && <div className="mt-1 text-sm text-red-500">{errors.study_type}</div>}
                </div>
                <div>
                    <label className="mb-1 block font-medium text-gray-700">Aprovação Ética</label>
                    <input
                        type="checkbox"
                        checked={!!data.ethical_approval}
                        onChange={e => setData('ethical_approval', e.target.checked)}
                        className="checkbox checkbox-primary"
                    />
                    {errors.ethical_approval && <div className="mt-1 text-sm text-red-500">{errors.ethical_approval}</div>}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        Salvar
                    </button>
                    <Link href="/studies" className="rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 disabled:opacity-50">
                        Cancelar
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
