// Função utilitária para formatar datas ISO para yyyy-MM-dd
function formatDate(dateString?: string) {
    if (!dateString) return '';
    return dateString.split('T')[0];
}
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import React from 'react';
import { HiOutlineCheckCircle, HiOutlineX } from 'react-icons/hi';

interface StudyEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    study: {
        id: number;
        name: string;
        description?: string;
        start_date?: string;
        end_date?: string;
        status?: string;
        ethical_approval?: boolean;
        study_type?: string;
    } | null;
}

export default function StudyEditModal({ isOpen, onClose, study }: StudyEditModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: study?.name || '',
        description: study?.description || '',
        start_date: study?.start_date || '',
        end_date: study?.end_date || '',
        status: study?.status || '',
        ethical_approval: study?.ethical_approval || false,
        study_type: study?.study_type || '',
    });

    React.useEffect(() => {
        if (study) {
            setData({
                name: study.name || '',
                description: study.description || '',
                start_date: study.start_date || '',
                end_date: study.end_date || '',
                status: study.status || '',
                ethical_approval: study.ethical_approval || false,
                study_type: study.study_type || '',
            });
        }
    }, [study]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!study) return;
        put(`/studies/${study.id}`, {
            onSuccess: () => {
                toast.success('Estudo atualizado com sucesso!');
                reset();
                onClose();
            },
            onError: () => {
                toast.error('Erro ao atualizar estudo.');
            }
        });
    }

    if (!isOpen || !study) return null;

    return (
        <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="animate-fade-in relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" aria-label="Fechar">
                    <HiOutlineX className="h-6 w-6" />
                </button>
                <h2 className="mb-4 text-xl font-bold">Editar Estudo</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input input-bordered w-full"
                        />
                        {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className="textarea textarea-bordered w-full"
                        />
                        {errors.description && <div className="mt-1 text-sm text-red-500">{errors.description}</div>}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Data de Início</label>
                            <input
                                type="date"
                                value={formatDate(data.start_date)}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="input input-bordered w-full"
                            />
                            {errors.start_date && <div className="mt-1 text-sm text-red-500">{errors.start_date}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Data de Fim</label>
                            <input
                                type="date"
                                value={formatDate(data.end_date)}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="input input-bordered w-full"
                            />
                            {errors.end_date && <div className="mt-1 text-sm text-red-500">{errors.end_date}</div>}
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={data.status || ''}
                            onChange={(e) => setData('status', e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Selecione o Status</option>
                            <option value="planned">Planejado</option>
                            <option value="ongoing">Em andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        {errors.status && <div className="mt-1 text-sm text-red-500">{errors.status}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Estudo</label>
                        <input
                            type="text"
                            value={data.study_type || ''}
                            onChange={(e) => setData('study_type', e.target.value)}
                            className="input input-bordered w-full"
                        />
                        {errors.study_type && <div className="mt-1 text-sm text-red-500">{errors.study_type}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!data.ethical_approval}
                            onChange={(e) => setData('ethical_approval', e.target.checked)}
                            className="checkbox checkbox-primary"
                            id="ethical_approval_edit"
                        />
                        <label htmlFor="ethical_approval_edit" className="text-sm text-gray-700">
                            Aprovação Ética
                        </label>
                        {errors.ethical_approval && <div className="mt-1 text-sm text-red-500">{errors.ethical_approval}</div>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            <HiOutlineCheckCircle className="h-5 w-5" /> Salvar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
