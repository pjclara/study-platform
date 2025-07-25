import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function StudyCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        start_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/studies', {
            onSuccess: () => {
                // Optionally redirect or show a success message
                // For example, redirect to the studies index page
                // window.location.href = '/studies';
                // or you can use Inertia's redirect
                // Inertia.visit('/studies');
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Create Study" />
            <h1 className="mb-4 text-2xl font-bold">Create Study</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block">Name</label>
                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input input-bordered w-full" />
                    {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                </div>
                <div>
                    <label className="mb-1 block">Description</label>
                    <textarea
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        className="textarea textarea-bordered w-full"
                        placeholder="Enter study description"
                    />
                    {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
                </div>
                <div>
                    <label className="mb-1 block">Start Date</label>
                    <input
                        type="date"
                        value={data.start_date || ''}
                        onChange={(e) => setData('start_date', e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.start_date && <div className="text-sm text-red-500">{errors.start_date}</div>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                    Create
                </button>
                <Link href="/studies" className="btn btn-secondary ml-2">
                    Cancel
                </Link>
            </form>
        </AppLayout>
    );
}
