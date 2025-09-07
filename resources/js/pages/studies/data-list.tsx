import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import DataEntryModal from '@/components/data-entry-modal';

import { router } from '@inertiajs/core';
import toast from 'react-hot-toast';
import React, { useState } from 'react';

// Tipos

type VariableOptions = {
    id: number;
    value: string;
};

type Variable = {
    id: number;
    name: string;
    type?: string;
    options?: VariableOptions[];
    order_index?: number;
};

type StudyEntry = {
    id: number;
    values: Record<number, string>;
    created_at: string;
};

type StudyDataListProps = {
    studyId: number;
    studyEntries: StudyEntry[];
    variables: Variable[];
};


const handleDelete = (e: React.FormEvent, id: number, studyId:number) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
        router.delete(`/studies/${studyId}/data-entry/${id}`, {
            onSuccess: () => toast.success('Entrada excluída com sucesso!'),
            onError: () => toast.error('Erro ao excluir entrada.'),
        });
    }
};

export default function StudyDataList() {
    const [showEntryModal, setShowEntryModal] = React.useState(false);
    const [editEntry, setEditEntry] = React.useState<any | null>(null);
    const { studyId, studyEntries, variables } = usePage<StudyDataListProps>().props;

    const safeEntries = Array.isArray(studyEntries) ? studyEntries : [];
    const safeVariables = Array.isArray(variables) ? [...variables].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)) : [];
console.log(variables);

    return (
        <AppLayout>
            <Head title={`Entradas do Estudo #${studyId}`} />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Entradas de Dados - Estudo #{studyId}</h1>

                {/* Botão para adicionar nova entrada */}
                <div className="mb-4">
                    <button
                        onClick={() => { setEditEntry(null); setShowEntryModal(true); }}
                        className="inline-block rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        + Adicionar Entrada
                    </button>
                </div>

                {/* Modal de criar/editar entrada */}
                <DataEntryModal
                    isOpen={showEntryModal}
                    onClose={() => { setShowEntryModal(false); setEditEntry(null); }}
                    studyId={studyId}
                    variables={safeVariables.map(v => ({
                        ...v,
                        type: v.type || 'text',
                        options: v.options ? v.options.map(opt => typeof opt === 'string' ? opt : opt.value) : undefined
                    }))}
                    initialValues={editEntry ? { ...editEntry.values, id: editEntry.id } : {}}
                    onSuccess={() => { setShowEntryModal(false); setEditEntry(null); }}
                />

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-700 text-white">
                            <tr>
                                {safeVariables.map((v) => (
                                    <th key={v.id} className="border px-4 py-2 text-left">
                                        {v.name}
                                    </th>
                                ))}
                                <th className="border px-4 py-2 text-left">Inserido em</th>
                                <th className="border px-4 py-2 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeEntries.length > 0 ? (
                                safeEntries.map((entry) => (
                                    <tr key={entry.id} className="odd:bg-white even:bg-gray-50">
                                        {safeVariables.map((v) => (
                                            <td key={`${entry.id}-${v.id}`} className="border px-4 py-2">
                                                {entry.values?.[v.id] ?? ''}
                                            </td>
                                        ))}
                                        <td className="border px-4 py-2">{new Date(entry.created_at).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => { setEditEntry(entry); setShowEntryModal(true); }}
                                                className="text-blue-600 hover:underline mr-2"
                                            >
                                                Editar
                                            </button>
                                            <form onSubmit={(e) => handleDelete(e, entry.id, studyId)} className="ml-2 inline">
                                                <button type="submit" className="text-red-600 hover:underline">
                                                    Excluir
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={safeVariables.length + 2} className="py-4 text-center">
                                        Nenhuma entrada encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tabela de opções das variáveis select */}
                {safeVariables.some(v => v.type === 'select' && v.options && v.options.length > 0) && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-2">Opções das Variáveis (Select)</h2>
                        <table className="min-w-fit border text-sm bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2">Variável</th>
                                    <th className="border px-4 py-2">Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeVariables.filter(v => v.type === 'select' && v.options && v.options.length > 0).map(v => (
                                    <tr key={v.id}>
                                        <td className="border px-4 py-2 font-medium">{v.name}</td>
                                        <td className="border px-4 py-2">{v.options?.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Botão de voltar */}
                <div className="float-end mt-6 flex">
                    <Link href={`/studies/${studyId}`} className="inline-block rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700">
                        Voltar para o Estudo
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
