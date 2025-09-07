
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
                toast.success('Estudo criado com sucesso!');
                setData({
                    name: '',
                    description: '',
                    start_date: '',
                    status: '',
                    ethical_approval: false,
                    study_type: '',
                });
            },
            onError: () => {
                toast.error('Erro ao criar estudo.');
            }
        });
    }

    return (
        <AppLayout>
            <Head title="Criar Estudo" />
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/studies" className="text-gray-500 hover:text-gray-700 transition">
                        <HiOutlineArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Criar Estudo</h1>
                </div>
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
                            <option value="planned">Planejado</option>
                            <option value="ongoing">Em andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
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
                            className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            <HiOutlineCheckCircle className="w-5 h-5" /> Salvar
                        </button>
                        <Link href="/studies" className="inline-flex items-center gap-2 rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 disabled:opacity-50">
                            <HiOutlineArrowLeft className="w-5 h-5" /> Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
