import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/core';

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
};

export default function StudyShow() {
    const { study, variables } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: '',
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ name: string; type: string }>({ name: '', type: '' });
    const [editErrors, setEditErrors] = useState<{ name?: string; type?: string }>({});
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
        <AppLayout>
            <Head title={`Study: ${study.name}`} />
            <h1 className="text-2xl font-bold mb-4">Study Details</h1>
            <div className="mb-4">
                <strong>ID:</strong> {study.id}
            </div>
            <div className="mb-4">
                <strong>Name:</strong> {study.name}
            </div>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Variables</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-success btn-sm mb-4">
                    {showAddForm ? 'Close' : 'Add Variable'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2 mb-6">
                        <h3 className="text-lg font-semibold">Add Variable</h3>
                        <div>
                            <label className="block mb-1">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="input input-bordered w-full"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="block mb-1">Type</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="input input-bordered w-full"
                            >
                                <option value="">Select type</option>
                                <option value="string">String</option>
                                <option value="integer">Integer</option>
                                <option value="float">Float</option>
                                <option value="boolean">Boolean</option>
                            </select>
                            {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            Add Variable
                        </button>
                    </form>
                )}
                {variables && variables.length > 0 ? (
                    <table className="min-w-full border bg-white mb-4">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2">ID</th>
                                <th className="border-b px-4 py-2">Name</th>
                                <th className="border-b px-4 py-2">Type</th>
                                <th className="border-b px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variables.map(variable => (
                                <tr key={variable.id}>
                                    <td className="border-b px-4 py-2">{variable.id}</td>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <form onSubmit={e => handleEditSubmit(e, variable.id)} className="flex items-center gap-2">
                                                <input
                                                    name="name"
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={handleEditChange}
                                                    className="input input-bordered w-full"
                                                />
                                                {editErrors.name && <div className="text-red-500 text-sm">{editErrors.name}</div>}
                                            </form>
                                        ) : (
                                            variable.name
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <form onSubmit={e => handleEditSubmit(e, variable.id)} className="flex items-center gap-2">
                                                <select
                                                    name="type"
                                                    value={editData.type}
                                                    onChange={handleEditChange}
                                                    className="input input-bordered w-full"
                                                >
                                                    <option value="string">String</option>
                                                    <option value="integer">Integer</option>
                                                    <option value="float">Float</option>
                                                    <option value="boolean">Boolean</option>
                                                </select>
                                                {editErrors.type && <div className="text-red-500 text-sm">{editErrors.type}</div>}
                                            </form>
                                        ) : (
                                            variable.type
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        {editId === variable.id ? (
                                            <>
                                                <button onClick={e => handleEditSubmit(e as any, variable.id)} className="btn btn-primary btn-xs mr-2">Save</button>
                                                <button onClick={handleEditCancel} className="btn btn-secondary btn-xs ml-4">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(variable)} className="btn btn-outline btn-xs mr-2">Edit</button>
                                                <button onClick={() => handleDelete(variable.id)} className="btn btn-error btn-xs">Delete</button>
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
            </div>
            <Link href="/studies" className="btn btn-secondary">Back to list</Link>
        </AppLayout>
    );
}
