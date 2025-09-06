// Função utilitária para formatar datas ISO para yyyy-MM-dd
function formatDate(dateString?: string) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { HiOutlineX, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface StudyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudyCreateModal({ isOpen, onClose }: StudyCreateModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    start_date: '',
    status: '',
    ethical_approval: false,
    study_type: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post('/studies', {
      onSuccess: () => {
        toast.success('Estudo criado com sucesso!');
        reset();
        onClose();
      },
      onError: () => {
        toast.error('Erro ao criar estudo.');
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          aria-label="Fechar"
        >
          <HiOutlineX className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Criar Novo Estudo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="input input-bordered w-full" />
            {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea value={data.description || ''} onChange={e => setData('description', e.target.value)} className="textarea textarea-bordered w-full" />
            {errors.description && <div className="mt-1 text-sm text-red-500">{errors.description}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input type="date" value={formatDate(data.start_date)} onChange={e => setData('start_date', e.target.value)} className="input input-bordered w-full" />
              {errors.start_date && <div className="mt-1 text-sm text-red-500">{errors.start_date}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Estudo</label>
              <input type="text" value={data.study_type || ''} onChange={e => setData('study_type', e.target.value)} className="input input-bordered w-full" />
              {errors.study_type && <div className="mt-1 text-sm text-red-500">{errors.study_type}</div>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={data.status || ''} onChange={e => setData('status', e.target.value)} className="select select-bordered w-full">
              <option value="">Selecione o Status</option>
              <option value="planned">Planejado</option>
              <option value="ongoing">Em andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
            {errors.status && <div className="mt-1 text-sm text-red-500">{errors.status}</div>}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!data.ethical_approval} onChange={e => setData('ethical_approval', e.target.checked)} className="checkbox checkbox-primary" id="ethical_approval" />
            <label htmlFor="ethical_approval" className="text-sm text-gray-700">Aprovação Ética</label>
            {errors.ethical_approval && <div className="mt-1 text-sm text-red-500">{errors.ethical_approval}</div>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">
              <HiOutlineCheckCircle className="w-5 h-5" /> Salvar
            </button>
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
