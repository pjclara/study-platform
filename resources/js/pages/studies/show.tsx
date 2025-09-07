import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/core';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import VariableModal from '@/components/variable-modal';
import UserModal from '@/components/user-modal';

type Estudo = {
    id: number;
    name: string;
};

type Variavel = {
    id: number;
    name: string;
    type: string;
    order_index?: number;
};

type Usuario = {
    id: number;
    name: string;
};

type UsuarioEstudo = {
    id: number;
    name: string;
    role: string;
};

type PageProps = {
    study: Estudo;
    variables: Variavel[];
    users: Usuario[];
    studyUser: UsuarioEstudo[];
};

export default function EstudoDetalhes() {
    const { study, variables: initialVariables, users = [], studyUser = [] } = usePage<PageProps>().props;
    const [variables, setVariables] = useState<Variavel[]>([...initialVariables].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)));
    // Drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = variables.findIndex(v => v.id === active.id);
            const newIndex = variables.findIndex(v => v.id === over?.id);
            const newVars = arrayMove(variables, oldIndex, newIndex).map((v, idx) => ({ ...v, order_index: idx }));
            setVariables(newVars);
            // Salvar ordem no backend usando axios (CSRF incluso automaticamente)
            axios.post(`/studies/${study.id}/variables/order`, {
                order: newVars.map(v => ({ id: v.id, order_index: v.order_index }))
            });
        }
    }

    function SortableItem({ variable, children }: { variable: Variavel, children: React.ReactNode }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: variable.id });
        return (
            <tr
                ref={setNodeRef}
                style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
                {...attributes}
                {...listeners}
                className="cursor-move"
            >
                {children}
            </tr>
        );
    }

    const [localOptions, setLocalOptions] = useState<string[]>([]);
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        type: string;
        options: string[];
        user_id: string;
        role: string;
    }>({
        name: '',
        type: '',
        options: [],
        user_id: '',
        role: '',
    });

    // Estado para edição de variáveis
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ name: string; type: string }>({ name: '', type: '' });
    const [editErrors, setEditErrors] = useState<{ name?: string; type?: string }>({});

    // Modal usuário
    const [showUserModal, setShowUserModal] = useState(false);
    const [editUser, setEditUser] = useState<UsuarioEstudo | null>(null);

    // Mostrar ou esconder modal de adicionar/editar variável
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [editVariable, setEditVariable] = useState<Variavel | null>(null);

    // Adicionar variável
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (data.type !== 'select') {
            setData('options', []);
        } else {
            setData(
                'options',
                localOptions.filter((opt) => opt.trim() !== ''),
            );
        }

        post(`/studies/${study.id}/variables`, {
            onSuccess: () => {
                reset();
                setLocalOptions([]);
            },
        });
    }

    // Editar variável
    function handleEdit(variable: Variavel) {
        setEditVariable(variable);
        setShowVariableModal(true);
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    }

    function handleEditSubmit(e: React.FormEvent, variableId: number) {
        e.preventDefault();
        router.put(`/studies/${study.id}/variables/${variableId}`, editData, {
            onSuccess: () => setEditId(null),
            onError: (errors: any) => setEditErrors(errors),
        });
    }

    function handleEditCancel() {
        setEditVariable(null);
        setShowVariableModal(false);
    }

    function handleDelete(variableId: number) {
        if (confirm('Tem certeza que deseja excluir esta variável?')) {
            router.delete(`/studies/${study.id}/variables/${variableId}`);
        }
    }

    return (
        <AppLayout>
            <Head title={`Estudo: ${study.name}`} />

            <h1 className="mb-4 text-2xl font-bold">Detalhes do Estudo</h1>
            <div className="mb-4">
                <strong>ID:</strong> {study.id}
            </div>
            <div className="mb-8">
                <strong>Nome:</strong> {study.name}
            </div>

            {/* Usuários do Estudo */}
            <div className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Usuários do Estudo</h2>
                <button className="px-3 py-1.5 rounded text-white bg-green-600 hover:bg-green-700 transition mb-2 text-sm font-semibold shadow" onClick={() => { setEditUser(null); setShowUserModal(true); }}>
                    Adicionar Usuário
                </button>
                <table className="mb-4 min-w-full border">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">Nome</th>
                            <th className="border-b px-4 py-2">Função</th>
                            <th className="border-b px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studyUser.length > 0 ? (
                            studyUser.map((user) => (
                                <tr key={user.id}>
                                    <td className="border-b px-4 py-2">{user.name}</td>
                                    <td className="border-b px-4 py-2">{user.role}</td>
                                    <td className="border-b px-4 py-2">
                                        <button
                                            className="px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700 transition mr-2 text-xs font-semibold shadow"
                                            onClick={() => {
                                                setEditUser(user);
                                                setShowUserModal(true);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="px-3 py-1.5 rounded text-white bg-red-600 hover:bg-red-700 transition text-xs font-semibold shadow"
                                            onClick={() => {
                                                if (confirm('Deseja remover este usuário do estudo?')) {
                                                    router.delete(`/studies/${study.id}/remove-user/${user.id}`);
                                                }
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">
                                    Nenhum usuário vinculado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <UserModal
                    isOpen={showUserModal}
                    onClose={() => { setShowUserModal(false); setEditUser(null); }}
                    onSuccess={() => {}}
                    studyId={study.id}
                    user={editUser || undefined}
                    users={users}
                />
            </div>


            {/* Variáveis */}
            <h2 className="mb-2 text-xl font-semibold">Variáveis</h2>
            <button onClick={() => { setEditVariable(null); setShowVariableModal(true); }} className="px-3 py-1.5 rounded text-white bg-green-600 hover:bg-green-700 transition mb-4 text-sm font-semibold shadow">
                Adicionar Variável
            </button>
            <VariableModal
                isOpen={showVariableModal}
                onClose={() => { setShowVariableModal(false); setEditVariable(null); }}
                onSuccess={() => {}}
                studyId={study.id}
                variable={editVariable || undefined}
            />

            {variables.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="mb-4 min-w-full border bg-white">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2">Nome</th>
                                <th className="border-b px-4 py-2">Tipo</th>
                                <th className="border-b px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <SortableContext items={variables.map(v => v.id)} strategy={verticalListSortingStrategy}>
                            <tbody>
                                {variables.map((variavel) => (
                                    <SortableItem key={variavel.id} variable={variavel}>
                                        <td className="border-b px-4 py-2">{variavel.name}</td>
                                        <td className="border-b px-4 py-2">{variavel.type}</td>
                                        <td className="border-b px-4 py-2">
                                            <button onClick={() => handleEdit(variavel)} className="px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700 transition mr-2 text-xs font-semibold shadow">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(variavel.id)} className="px-3 py-1.5 rounded text-white bg-red-600 hover:bg-red-700 transition text-xs font-semibold shadow">
                                                Excluir
                                            </button>
                                        </td>
                                    </SortableItem>
                                ))}
                            </tbody>
                        </SortableContext>
                    </table>
                </DndContext>
            ) : (
                <div>Nenhuma variável cadastrada.</div>
            )}

            <Link href="/studies" className="px-3 py-1.5 rounded text-white bg-gray-500 hover:bg-gray-600 transition font-semibold shadow">
                Voltar à lista
            </Link>
        </AppLayout>
    );
}
