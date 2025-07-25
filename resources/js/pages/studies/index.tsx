import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Study = {
    id: number;
    name: string;
    status: string; // Assuming status is a string, adjust as necessary};
}

type PageProps = {
    studies: Study[];
    // add other props as needed
};

export default function StudyIndex() {
    const { studies } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Head title="Studies" />
                <h1 className="mb-4 text-2xl font-bold">Studies</h1>
                <Link href="/studies/create" className="btn btn-primary mb-4">
                    Create New Study
                </Link>
                <table className="min-w-full border bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">Name</th>
                            <th className="border-b px-4 py-2">Status</th>
                            <th className="border-b px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studies && studies.length > 0 ? (
                            studies.map((study) => (
                                <tr key={study.id}>
                                    <td className="border-b px-4 py-2">{study.id}</td>
                                    <td className="border-b px-4 py-2">{study.name}</td>
                                    <td className="border-b px-4 py-2">{study.status}</td>
                                    <td className="border-b px-4 py-2">
                                        <Link href={`/studies/${study.id}`} className="text-blue-600 hover:underline mr-2">
                                            View
                                        </Link>
                                        <Link href={`/studies/${study.id}/edit`} className="text-yellow-600 hover:underline mr-2">
                                            Edit
                                        </Link>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (confirm('Are you sure you want to delete this study?')) {
                                                    // @ts-ignore
                                                    window.Inertia.delete(`/studies/${study.id}`);
                                                }
                                            }}
                                            style={{ display: 'inline' }}
                                        >
                                            <button type="submit" className="text-red-600 hover:underline ml-2">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">
                                    No studies found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
