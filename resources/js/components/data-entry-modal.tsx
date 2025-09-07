import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import React from 'react';
import toast from 'react-hot-toast';

interface Variable {
    id: number;
    name: string;
    type: string;
    options?: string[];
}

interface DataEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    studyId: number;
    variables: Variable[];
    initialValues?: Record<number, string>;
    onSuccess?: () => void;
}

export default function DataEntryModal({ isOpen, onClose, studyId, variables, initialValues = {}, onSuccess }: DataEntryModalProps) {
    const isEdit = Object.keys(initialValues).length > 0;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        values: variables.reduce((acc, v) => ({ ...acc, [v.id]: initialValues[v.id] || '' }), {} as Record<number, string>),
    });

    React.useEffect(() => {
        setData(
            'values',
            variables.reduce((acc, v) => ({ ...acc, [v.id]: initialValues[v.id] || '' }), {} as Record<number, string>),
        );
        // eslint-disable-next-line
    }, [isOpen, variables, initialValues]);

    function handleValueChange(variableId: number, value: string) {
        setData('values', { ...data.values, [variableId]: value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const action = isEdit
            ? put(`/studies/${studyId}/data-entry/${initialValues['id']}`, {
                  onSuccess: () => {
                      toast.success('Entrada atualizada com sucesso!');
                      reset();
                      onSuccess && onSuccess();
                      onClose();
                  },
                  onError: () => toast.error('Erro ao atualizar entrada.'),
              })
            : post(`/studies/${studyId}/data-entry`, {
                  onSuccess: () => {
                      toast.success('Entrada criada com sucesso!');
                      reset();
                      onSuccess && onSuccess();
                      onClose();
                  },
                  onError: () => toast.error('Erro ao criar entrada.'),
              });
        return action;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg rounded-2xl shadow-xl">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-semibold text-gray-900">{isEdit ? 'Editar Entrada' : 'Adicionar Entrada'}</DialogTitle>
                    <p className="text-sm text-gray-500">Preencha os campos abaixo para continuar</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                    {variables.map((v) => (
                        <div key={v.id} className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">{v.name}</label>
                            {v.type === 'select' && v.options ? (
                                <select
                                    value={data.values[v.id] || ''}
                                    onChange={(e) => handleValueChange(v.id, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/30 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    <option value="">Selecione...</option>
                                    {v.options.map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : v.type === 'boolean' ? (
                                <select
                                    value={data.values[v.id] || ''}
                                    onChange={(e) => handleValueChange(v.id, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/30 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="1">Sim</option>
                                    <option value="0">Não</option>
                                </select>
                            ) : v.type === 'number' ? (
                                <input
                                    type="number"
                                    value={data.values[v.id] || ''}
                                    onChange={(e) => handleValueChange(v.id, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/30 disabled:opacity-50"
                                    disabled={processing}
                                />
                            ) : v.type === 'date' ? (
                                <input
                                    type="date"
                                    value={data.values[v.id] || ''}
                                    onChange={(e) => handleValueChange(v.id, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/30 disabled:opacity-50"
                                    disabled={processing}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={data.values[v.id] || ''}
                                    onChange={(e) => handleValueChange(v.id, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/30 disabled:opacity-50"
                                    disabled={processing}
                                />
                            )}
                            {(errors as Record<string, string>)[`values.${v.id}`] && (
                                <p className="text-xs text-red-500">{(errors as Record<string, string>)[`values.${v.id}`]}</p>
                            )}
                        </div>
                    ))}

                    <DialogFooter className="flex justify-end space-x-3 pt-4">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                        </DialogClose>
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
                            disabled={processing}
                        >
                            {isEdit ? 'Salvar' : 'Adicionar'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
