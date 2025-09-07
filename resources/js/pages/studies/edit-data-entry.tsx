import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

// Tipos
interface Variable {
    id: number;
    name: string;
    type?: string; // Adicionando tipo opcional
    options?: string[]; // Adicionando opções opcionais
}
interface StudyEntry {
    id: number;
    values: Record<number, string>;
    created_at: string;
}
interface EditEntryProps extends Record<string, any> {
    studyId: number;
    entry: StudyEntry;
    variables: Variable[];
}

export default function EditEntry() {
    const { studyId, entry, variables } = usePage<EditEntryProps>().props;
    const { data, setData, put, processing, errors } = useForm({ ...entry.values });

    function handleChange(variableId: number, value: string) {
        setData(variableId, value);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/studies/${studyId}/data-entry/${entry.id}`, {
            onSuccess: () => toast.success('Entrada atualizada com sucesso!'),
            onError: () => toast.error('Erro ao atualizar entrada.'),
        });
    }

    console.log(variables);

    return (
        <AppLayout>
            <Head title={`Editar Entrada #${entry.id}`} />
            <h1 className="mb-4 text-2xl font-bold">Editar Entrada</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
                {variables.map((v) => (
                    <div key={v.id} className="mb-4">
                        <label className="block mb-1 font-semibold">{v.name}</label>
                        {v.type === 'select' && v.options ? (
                            <select
                                className="select select-bordered w-full"
                                value={data[v.id] || ''}
                                onChange={e => handleChange(v.id, e.target.value)}
                                disabled={processing}
                            >
                                <option value="">Selecione...</option>
                                {v.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : v.type === 'boolean' ? (
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                                checked={data[v.id] === '1' || data[v.id] === 1}
                                onChange={e => handleChange(v.id, e.target.checked ? '1' : '0')}
                                disabled={processing}
                            />
                        ) : (
                            <input
                                type={v.type}
                                className="input input-bordered w-full"
                                value={data[v.id] || ''}
                                onChange={e => handleChange(v.id, e.target.value)}
                                disabled={processing}
                            />
                        )}
                        {errors[v.id] && <div className="text-red-500 text-sm mt-1">{errors[v.id]}</div>}
                    </div>
                ))}
                <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                        Salvar
                    </button>
                    <Link href={`/studies/${studyId}/data-list`} className="btn btn-secondary">
                        Cancelar
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
