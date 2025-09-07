
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';


// Types
type VariableOption = { id: number; value: string };
type Variable = {
  id: number;
  name: string;
  type: string;
  options?: string[] | VariableOption[];
};




interface VariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  studyId: number;
  variable?: Variable;
}

export const VariableModal: React.FC<VariableModalProps> = ({ isOpen, onClose, onSuccess, studyId, variable }) => {


  const isEdit = !!variable;

  // Always convert options to string[]
  function extractOptions(opts: string[] | VariableOption[] | undefined): string[] {
    if (Array.isArray(opts)) {
      if (opts.length > 0 && typeof opts[0] === 'object' && opts[0] !== null) {
        return (opts as VariableOption[]).map((o) => o.value ?? '');
      } else {
        return opts as string[];
      }
    }
    return [''];
  }

  const initialOptions = extractOptions(variable?.options);
  const [localOptions, setLocalOptions] = useState<string[]>(initialOptions.length > 0 ? initialOptions : ['']);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: variable?.name || '',
    type: variable?.type || '',
    options: initialOptions,
  });

  useEffect(() => {
    if (isEdit) {
      setData('name', variable?.name || '');
      setData('type', variable?.type || '');
      const opts = extractOptions(variable?.options);
      setLocalOptions(opts.length > 0 ? opts : ['']);
      setData('options', opts);
    } else {
      reset();
      setLocalOptions(['']);
      setData('options', ['']);
    }
    // eslint-disable-next-line
  }, [isOpen, variable]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validTypes = ['text', 'number', 'date', 'boolean', 'select'];
    if (!validTypes.includes(data.type)) {
      alert('Selecione um tipo válido para a variável.');
      return;
    }
    let optionsToSend: string[] = [];
    if (data.type === 'select') {
      optionsToSend = localOptions.map(opt => opt.trim()).filter(opt => opt !== '');
      setData('options', optionsToSend);
    } else {
      setData('options', []);
    }
    setTimeout(() => {
      if (isEdit && variable) {
        put(`/studies/${studyId}/variables/${variable.id}`, {
          onSuccess: () => {
            onSuccess && onSuccess();
            onClose();
          },
        });
      } else {
        post(`/studies/${studyId}/variables`, {
          onSuccess: () => {
            onSuccess && onSuccess();
            onClose();
          },
        });
      }
    }, 0);
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent aria-describedby="variable-modal-desc">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Variável' : 'Adicionar Variável'}</DialogTitle>
          <DialogDescription id="variable-modal-desc">
            {isEdit
              ? 'Altere os dados da variável do estudo. Campos obrigatórios.'
              : 'Preencha os dados para adicionar uma nova variável ao estudo. Campos obrigatórios.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              disabled={processing}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Tipo</label>
            <select
              className="select select-bordered w-full"
              value={data.type}
              onChange={e => setData('type', e.target.value)}
              disabled={processing}
            >
              <option value="">Selecione o tipo</option>
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="boolean">Booleano</option>
              <option value="date">Data</option>
              <option value="select">Seleção (lista de opções)</option>
            </select>
            {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
          </div>
          {data.type === 'select' && (
            <div>
              <label className="block mb-1 font-semibold">Opções</label>
              <div className="flex flex-col gap-2">
                {localOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={opt}
                      onChange={e => {
                        const newOptions = [...localOptions];
                        newOptions[idx] = e.target.value;
                        setLocalOptions(newOptions);
                        setData('options', newOptions.map(o => o.trim()));
                      }}
                      disabled={processing}
                    />
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        const newOptions = localOptions.filter((_, i) => i !== idx);
                        setLocalOptions(newOptions.length > 0 ? newOptions : ['']);
                        setData('options', (newOptions.length > 0 ? newOptions : ['']).map(o => o.trim()));
                      }}
                      disabled={processing || localOptions.length <= 1}
                    >Remover</button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-2 self-start"
                  onClick={() => {
                    const newOptions = [...localOptions, ''];
                    setLocalOptions(newOptions);
                    setData('options', newOptions);
                  }}
                  disabled={processing}
                >Adicionar opção</button>
              </div>
              {errors.options && <div className="text-red-500 text-sm mt-1">{errors.options}</div>}
            </div>
          )}
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
};
// If you want default export, uncomment below:
// export default VariableModal;
