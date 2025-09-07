import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  studyId: number;
  user?: {
    id: number;
    name: string;
    role: string;
  };
  users: { id: number; name: string }[];
}

export default function UserModal({ isOpen, onClose, onSuccess, studyId, user, users }: UserModalProps) {
  const isEdit = !!user;
  const { data, setData, post, put, processing, errors, reset } = useForm({
    user_id: user?.id || '',
    role: user?.role || '',
  });

  useEffect(() => {
    if (isEdit) {
      setData('user_id', user?.id || '');
      setData('role', user?.role || '');
    } else {
      reset();
    }
    // eslint-disable-next-line
  }, [isOpen, user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.user_id || !data.role) return;
    if (isEdit && user) {
      put(`/studies/${studyId}/edit-user/${user.id}`, {
        onSuccess: () => {
          toast.success('Usuário atualizado com sucesso!');
          onSuccess && onSuccess();
          onClose();
        },
        onError: () => {
          toast.error('Erro ao atualizar usuário.');
        }
      });
    } else {
      post(`/studies/${studyId}/add-user`, {
        onSuccess: () => {
          toast.success('Usuário adicionado com sucesso!');
          onSuccess && onSuccess();
          onClose();
        },
        onError: () => {
          toast.error('Erro ao adicionar usuário.');
        }
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent aria-describedby="user-modal-desc">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
          <DialogDescription id="user-modal-desc">
            {isEdit
              ? 'Altere a função do usuário no estudo.'
              : 'Selecione um usuário e atribua uma função ao estudo.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-semibold">Usuário</label>
            <select
              className="input input-bordered w-full"
              value={data.user_id}
              onChange={e => setData('user_id', e.target.value)}
              disabled={processing || isEdit}
            >
              <option value="">Selecione</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Função</label>
            <select
              className="input input-bordered w-full"
              value={data.role}
              onChange={e => setData('role', e.target.value)}
              disabled={processing}
            >
              <option value="">Selecione</option>
              <option value="admin">Admin</option>
              <option value="coordinator">Coordenador</option>
              <option value="viewer">Visualizador</option>
            </select>
            {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
          </div>
          <DialogFooter>
            <button type="submit" className="btn btn-primary" disabled={processing}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </button>
            <DialogClose asChild>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
