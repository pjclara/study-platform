import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/core';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

type Study = {
    id: number;
    name: string;
    // add other fields as needed
};

type Variable = {
    id: number;
    name: string;
    type: string;
    // add other fields as needed
};

type PageProps = {
    study: Study;
    variables: Variable[];
    users: { id: number; name: string }[]; // Assuming users are passed in props
    studyUser: { id: number; name: string; role: string }[]; // Assuming study users are passed in props
};

export default function StudyShow() {
    const { study, variables } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: '',
        user_id: '',
        role: '',
    });
    const users: { id: number; name: string }[] = usePage<PageProps>().props.users || [];
    const studyUser: { id: number; name: string; role: string }[] = usePage<PageProps>().props.studyUser || [];

    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ name: string; type: string }>({ name: '', type: '' });
    const [editErrors, setEditErrors] = useState<{ name?: string; type?: string }>({});
    // State for editing user role
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editUserRole, setEditUserRole] = useState<string>('');
    const [editUserError, setEditUserError] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/studies/${study.id}/variables`, {
            onSuccess: () => reset(),
        });
    }

    function handleEdit(variable: Variable) {
        setEditId(variable.id);
        setEditData({ name: variable.name, type: variable.type });
        setEditErrors({});
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    }

    function handleEditSubmit(e: React.FormEvent, variableId: number) {
        e.preventDefault();
        router.put(`/studies/${study.id}/variables/${variableId}`, editData, {
            onSuccess: () => {
                setEditId(null);
            },
            onError: (errors: any) => {
                setEditErrors(errors);
            },
        });
    }

    function handleEditCancel() {
        setEditId(null);
        setEditErrors({});
    }

    function handleDelete(variableId: number) {
        if (confirm('Are you sure you want to delete this variable?')) {
            router.delete(`/studies/${study.id}/variables/${variableId}`);
        }
    }

    return (
        <>
            <AppLayout>
                <Head title={`Study: ${study.name}`} />
                <h1 className="mb-4 text-2xl font-bold">Study Details</h1>
                <div className="mb-4">
                    <strong>ID:</strong> {study.id}
                </div>
                <div className="mb-4">
                    <strong>Name:</strong> {study.name}
                </div>

                {/* Tabela de usuários do estudo */}
                <div className="mb-8">
                    <h2 className="mb-2 text-lg font-semibold">Usuários do Estudo</h2>
                    <table className="min-w-full border mb-4">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2">Nome</th>
                                <th className="border-b px-4 py-2">Função</th>
                                <th className="border-b px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studyUser && studyUser.length > 0 ? (
                                studyUser.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border-b px-4 py-2">{user.name}</td>
                                        <td className="border-b px-4 py-2">
                                            {editUserId === user.id ? (
                                                <select
                                                    value={editUserRole}
                                                    onChange={e => setEditUserRole(e.target.value)}
                                                    className="input input-bordered"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="coordinator">Coordenador</option>
                                                    <option value="viewer">Visualizador</option>
                                                </select>
                                            ) : (
                                                user.role
                                            )}
                                        </td>
                                        <td className="border-b px-4 py-2">
                                            {editUserId === user.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-primary btn-xs mr-2"
                                                        onClick={() => {
                                                            router.put(`/studies/${study.id}/edit-user/${user.id}`, { role: editUserRole }, {
                                                                onSuccess: () => {
                                                                    setEditUserId(null);
                                                                    setEditUserError('');
                                                                },
                                                                onError: (errors: any) => {
                                                                    setEditUserError(errors.role || 'Erro ao atualizar função');
                                                                },
                                                            });
                                                        }}
                                                    >Salvar</button>
                                                    <button
                                                        className="btn btn-secondary btn-xs"
                                                        onClick={() => {
                                                            setEditUserId(null);
                                                            setEditUserError('');
                                                        }}
                                                    >Cancelar</button>
                                                    {editUserError && <div className="text-sm text-red-500 mt-1">{editUserError}</div>}
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-outline btn-xs mr-2"
                                                        onClick={() => {
                                                            setEditUserId(user.id);
                                                            setEditUserRole(user.role);
                                                        }}
                                                    >Editar</button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => {
                                                            if (confirm('Deseja remover este usuário do estudo?')) {
                                                                router.delete(`/studies/${study.id}/remove-user/${user.id}`);
                                                            }
                                                        }}
                                                    >Excluir</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">Nenhum usuário vinculado ao estudo.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Formulário para adicionar usuários ao estudo */}
                <div className="mb-8 rounded bg-gray-100 p-4">
                    <h2 className="mb-2 text-lg font-semibold">Adicionar Usuário ao Estudo</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(`/studies/${study.id}/add-user`, {
                                preserveScroll: true,
                            });
                        }}
                        className="flex items-end gap-4"
                    >
                        <div>
                            <label className="mb-1 block">Usuário</label>
                            <select value={data.user_id || ''} onChange={(e) => setData('user_id', e.target.value)} className="input input-bordered">
                                <option value="">Selecione o usuário</option>
                                { users.map(u => <option value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block">Função</label>
                            <select value={data.role || ''} onChange={(e) => setData('role', e.target.value)} className="input input-bordered">
                                <option value="">Selecione a função</option>
                                <option value="admin">Admin</option>
                                <option value="coordinator">Coordenador</option>
                                <option value="viewer">Visualizador</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            Adicionar Usuário
                        </button>
                    </form>
                    {/* Exiba erros se houver */}
                    {errors.user_id && <div className="mt-1 text-sm text-red-500">{errors.user_id}</div>}
                    {errors.role && <div className="mt-1 text-sm text-red-500">{errors.role}</div>}
                </div>
                <h2 className="mb-2 text-xl font-semibold">Variables</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-success btn-sm mb-4">
                    {showAddForm ? 'Close' : 'Add Variable'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleSubmit} className="mt-2 mb-6 space-y-4">
                        <h3 className="text-lg font-semibold">Add Variable</h3>
                        <div>
                            <label className="mb-1 block">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="input input-bordered w-full"
                            />
                            {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block">Type</label>
                            <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="input input-bordered w-full">
                                <option value="">Select type</option>
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="boolean">Boolean</option>
                            </select>
                            {errors.type && <div className="text-sm text-red-500">{errors.type}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            Add Variable
                        </button>
                    </form>
                )}
                {variables && variables.length > 0 ? (
                    <table className="mb-4 min-w-full border bg-white">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2">Name</th>
                                <th className="border-b px-4 py-2">Type</th>
                                <th className="border-b px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variables.map((variable) => (
                                <tr key={variable.id}>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <form onSubmit={(e) => handleEditSubmit(e, variable.id)} className="flex items-center gap-2">
                                                <input
                                                    name="name"
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={handleEditChange}
                                                    className="input input-bordered w-full"
                                                />
                                                {editErrors.name && <div className="text-sm text-red-500">{editErrors.name}</div>}
                                            </form>
                                        ) : (
                                            variable.name
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <form onSubmit={(e) => handleEditSubmit(e, variable.id)} className="flex items-center gap-2">
                                                <select
                                                    name="type"
                                                    value={editData.type}
                                                    onChange={handleEditChange}
                                                    className="input input-bordered w-full"
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="text">Text</option>
                                                    <option value="number">Number</option>
                                                    <option value="date">Date</option>
                                                    <option value="boolean">Boolean</option>
                                                </select>
                                                {editErrors.type && <div className="text-sm text-red-500">{editErrors.type}</div>}
                                            </form>
                                        ) : (
                                            variable.type
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <>
                                                <button
                                                    onClick={(e) => handleEditSubmit(e as any, variable.id)}
                                                    className="btn btn-primary btn-xs mr-2"
                                                >
                                                    Save
                                                </button>
                                                <button onClick={handleEditCancel} className="btn btn-secondary btn-xs ml-4">
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(variable)} className="btn btn-outline btn-xs mr-2">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(variable.id)} className="btn btn-error btn-xs">
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No variables found for this study.</div>
                )}
                <Link href="/studies" className="btn btn-secondary">
                    Back to list
                </Link>
            </AppLayout>
        </>
    );
}
