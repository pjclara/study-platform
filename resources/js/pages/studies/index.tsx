import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineDocumentText,
    HiPlus,
} from 'react-icons/hi';
import React, { useState } from 'react';
import StudyCreateModal from '@/components/study-create-modal';
import StudyEditModal from '@/components/study-edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Estudo = {
    id: number;
    name: string;
    status: string;
    study_type: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    ethical_approval?: boolean;
};

type PageProps = {
    studies: Estudo[];
};

export default function EstudoIndex() {
    const { studies } = usePage<PageProps>().props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [studyToEdit, setStudyToEdit] = useState<Estudo | null>(null);

    console.log(studies);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
                            Estudos
                        </h1>
                        <p className="text-gray-500 text-base">
                            Gerencie e visualize todos os estudos cadastrados.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                    >
                        <HiPlus className="w-5 h-5" /> Criar Novo Estudo
                    </button>
                </div>

                {/* Modal de Criação */}
                <StudyCreateModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />

                {/* Tabela */}
                {studies && studies.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {studies.map((estudo: Estudo) => (
                                    <tr
                                        key={estudo.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {estudo.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                    estudo.status === 'ativo'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {estudo.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center flex flex-row gap-2 justify-center items-center">
                                            {/* Ver */}
                                            <Link
                                                href={`/studies/${estudo.id}`}
                                                className="p-2 rounded hover:bg-blue-50 text-blue-600"
                                                title="Ver"
                                            >
                                                <HiOutlineEye className="w-5 h-5" />
                                            </Link>

                                            {/* Editar */}
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-yellow-50 text-yellow-600"
                                                title="Editar"
                                                onClick={() => {
                                                    setStudyToEdit(estudo);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>

                                            {/* Modal de Edição */}
                                            <StudyEditModal
                                                isOpen={showEditModal}
                                                onClose={() => setShowEditModal(false)}
                                                study={studyToEdit}
                                            />

                                            {/* Ver Dados */}
                                            <Link
                                                href={`/studies/${estudo.id}/data-list`}
                                                className="p-2 rounded hover:bg-green-50 text-green-600"
                                                title="Ver Dados"
                                            >
                                                <HiOutlineDocumentText className="w-5 h-5" />
                                            </Link>

                                            {/* Excluir */}
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                        confirm(
                                                            'Tem certeza que deseja excluir este estudo?'
                                                        )
                                                    ) {
                                                        // @ts-ignore
                                                        window.Inertia.delete(
                                                            `/studies/${estudo.id}`
                                                        );
                                                    }
                                                }}
                                                style={{ display: 'inline' }}
                                            >
                                                <button
                                                    type="submit"
                                                    className="p-2 rounded hover:bg-red-50 text-red-600"
                                                    title="Excluir"
                                                >
                                                    <HiOutlineTrash className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Estado vazio
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z"
                            />
                        </svg>
                        <span className="text-lg">Nenhum estudo encontrado.</span>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
