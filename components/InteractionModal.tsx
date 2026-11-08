import React, { useState } from 'react';
import Image from 'next/image';
import { InteractionType, InteractionItem } from '@/types/crm';
import { X, Clock, Plus, Phone, MessageSquare, Wrench, Mail, FileText, AlertCircle } from 'lucide-react';

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  onSave: (item: Omit<InteractionItem, 'id' | 'timestamp'>) => void;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  isOpen,
  onClose,
  contactName,
  onSave
}) => {
  const [formData, setFormData] = useState({
    type: 'ligacao' as InteractionType,
    title: '',
    description: '',
    author: 'Equipe Core Suporte'
  });

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('O título da interação é obrigatório.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('A descrição ou resumo do contato é obrigatório.');
      return;
    }

    onSave({
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim(),
      author: formData.author.trim() || 'Central Core Suporte'
    });

    onClose();
    setFormData({
      type: 'ligacao',
      title: '',
      description: '',
      author: 'Equipe Core Suporte'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/65 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-lg bg-white border border-[#0A2540]/20 rounded-[8px] shadow-[0px_8px_20px_-2px_rgba(10,37,64,0.25)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#BAC7D5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 relative shrink-0">
              <Image
                src="/assets/aistudio/coreSuporte_semFundo_10bdb136.png"
                alt="Core Suporte"
                width={151}
                height={157}
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] uppercase tracking-wide font-sans">
                Registrar Atividade / Interação
              </h3>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Core Suporte • Contato: {contactName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#A2B5CC] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-[13px]">
          
          {errorMessage && (
            <div className="p-2.5 bg-[#FEE2E2] border border-[#DC2626] rounded-[4px] text-[#7F1D1D] font-mono text-[12px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Tipo de Atividade
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'ligacao', label: 'Ligação Telefônica', icon: Phone },
                { type: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { type: 'visita_campo', label: 'Visita de Campo', icon: Wrench },
                { type: 'email', label: 'E-mail Comercial', icon: Mail },
                { type: 'nota', label: 'Nota / Registro', icon: FileText }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = formData.type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.type as InteractionType })}
                    className={`p-2 rounded-[4px] border text-left flex items-center gap-1.5 transition-colors text-[11px] font-bold ${
                      isSelected
                        ? 'bg-[#0A2540] text-white border-[#0A2540]'
                        : 'bg-[#F4F6F9] text-[#161C24] border-[#BAC7D5] hover:bg-[#E9EEFA]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Assunto / Título do Contato *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Alinhamento de data de parada da unidade 04"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Responsável pelo Registro
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
              placeholder="Ex: Coordenador Operacional"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Relatório da Interação / Detalhamento *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resumo do que foi conversado, compromissos assumidos, prazos combinados..."
              className="w-full p-2.5 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#BAC7D5] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#F4F6F9] border border-[#BAC7D5] text-[#3E546B] rounded-[4px] font-bold text-[12px] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#00A3BF] hover:bg-[#00899f] active:bg-[#00687A] text-[#000F22] rounded-[4px] font-extrabold text-[13px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar Interação</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
