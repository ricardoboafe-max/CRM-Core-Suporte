import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  CORE_SUPORTE_SERVICES,
  getStoredServices, 
  saveServiceToCatalog, 
  deleteServiceFromCatalog, 
  resetServiceCatalogToDefault 
} from '@/lib/service-catalog';
import { ServiceCatalogItem } from '@/types/crm';
import { 
  X, 
  Search, 
  Plus, 
  Clock, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ServiceCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceToCreateOS?: (service: ServiceCatalogItem) => void;
}

const CATEGORIES: Array<ServiceCatalogItem['category']> = [
  'Computadores e PCs',
  'Notebooks',
  'Servidores e Redes',
  'Segurança e Otimização',
  'Suporte Corporativo'
];

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceToCreateOS
}) => {
  const [services, setServices] = useState<ServiceCatalogItem[]>(() => getStoredServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create / Edit Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: ServiceCatalogItem['category'];
    price: string;
    estimatedTime: string;
    description: string;
  }>({
    name: '',
    category: 'Computadores e PCs',
    price: '',
    estimatedTime: '2h - 4h',
    description: ''
  });

  const [formError, setFormError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const categoriesTabList = ['Todas', ...CATEGORIES];

  const filteredServices = services.filter(srv => {
    if (selectedCategory !== 'Todas' && srv.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        srv.name.toLowerCase().includes(q) || 
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Computadores e PCs',
      price: '',
      estimatedTime: '2h - 4h',
      description: ''
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (srv: ServiceCatalogItem) => {
    setEditingId(srv.id);
    setFormData({
      name: srv.name,
      category: srv.category,
      price: srv.price.toString(),
      estimatedTime: srv.estimatedTime,
      description: srv.description
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormError('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('O nome do serviço é obrigatório.');
      return;
    }

    const numericPrice = parseFloat(formData.price.replace(/[^\d.-]/g, ''));
    if (isNaN(numericPrice) || numericPrice < 0) {
      setFormError('Informe um valor monetário válido em Reais.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('A descrição técnica do serviço é obrigatória.');
      return;
    }

    const itemToSave: ServiceCatalogItem = {
      id: editingId || `srv-custom-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: numericPrice,
      estimatedTime: formData.estimatedTime.trim() || 'Sob consulta',
      description: formData.description.trim()
    };

    const updated = saveServiceToCatalog(itemToSave);
    setServices(updated);
    setIsFormOpen(false);
    setFeedbackMessage({
      type: 'success',
      text: editingId ? 'Serviço atualizado com sucesso no catálogo!' : 'Novo serviço adicionado ao catálogo com sucesso!'
    });

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const handleDeleteService = (srv: ServiceCatalogItem) => {
    if (window.confirm(`Deseja realmente remover o serviço "${srv.name}" da tabela de preços?`)) {
      const updated = deleteServiceFromCatalog(srv.id);
      setServices(updated);
      setFeedbackMessage({
        type: 'success',
        text: `O serviço "${srv.name}" foi removido do catálogo.`
      });
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 4000);
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('Deseja restaurar a tabela de serviços para os 20 serviços padrão originais da Core Suporte?')) {
      const defaults = resetServiceCatalogToDefault();
      setServices(defaults);
      setFeedbackMessage({
        type: 'success',
        text: 'Catálogo de serviços restaurado com os 20 serviços oficiais da Core Suporte.'
      });
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 4000);
    }
  };

  const handleSelectService = (srv: ServiceCatalogItem) => {
    if (onSelectServiceToCreateOS) {
      onSelectServiceToCreateOS(srv);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A2540]/70 backdrop-blur-[2px] overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white border border-[#0A2540]/20 rounded-[8px] shadow-2xl flex flex-col my-auto max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#BAC7D5] shrink-0">
          <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[16px] uppercase tracking-wide font-sans">
                  Catálogo de Serviços de Informática
                </h3>
                <span className="px-2 py-0.2 bg-[#00A3BF] text-[#000F22] text-[10px] font-mono font-bold rounded-[2px]">
                  {services.length} Tabelados
                </span>
              </div>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Valores fixos de mão de obra • Core Suporte: (31) 9 9372-4609
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="h-8 px-3 bg-[#00A3BF] hover:bg-[#00899f] active:bg-[#00687A] text-[#000F22] rounded-[4px] font-bold text-[12px] flex items-center gap-1.5 transition-colors shadow-xs"
                title="Cadastrar novo serviço na tabela"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Novo Serviço</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-[4px] text-[#A2B5CC] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div className={`px-5 py-2 font-mono text-[12px] flex items-center justify-between border-b ${
            feedbackMessage.type === 'success' 
              ? 'bg-[#DCFCE7] text-[#14532D] border-[#16A34A]/30' 
              : 'bg-[#FEE2E2] text-[#7F1D1D] border-[#DC2626]/30'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
              <span>{feedbackMessage.text}</span>
            </div>
            <button 
              onClick={() => setFeedbackMessage(null)}
              className="text-[#14532D] hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INLINE FORM: Adicionar ou Editar Serviço */}
        {isFormOpen && (
          <div className="p-4 bg-[#EFF4FF] border-b border-[#BAC7D5] animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#BAC7D5]/60">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#00A3BF]" />
                <h4 className="font-extrabold text-[14px] text-[#0A2540] uppercase font-mono">
                  {editingId ? 'Editar Serviço Tabelado' : 'Cadastrar Novo Serviço de Manutenção'}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="text-[#3E546B] hover:text-[#0A2540] text-[12px] font-mono flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2 bg-[#FEE2E2] border border-[#DC2626] rounded-[4px] text-[#7F1D1D] font-mono text-[12px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Troca de Pasta Térmica com Metal Líquido"
                    className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[13px] outline-none focus:border-[#00A3BF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ServiceCatalogItem['category'] })}
                    className="w-full h-9 px-2 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[12px] outline-none focus:border-[#00A3BF]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Valor Fixo / Tabelado (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 180"
                    className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold text-[14px] outline-none focus:border-[#00A3BF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Tempo Médio Estimado
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={e => setFormData({ ...formData, estimatedTime: e.target.value })}
                    placeholder="Ex: 2h - 4h ou 24h"
                    className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono text-[12px] outline-none focus:border-[#00A3BF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Descrição Técnica do Escopo *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o que está incluso: desmontagem, peças, testes de bancada, garantia..."
                  className="w-full p-2.5 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] text-[12px] outline-none focus:border-[#00A3BF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#F4F6F9] border border-[#BAC7D5] text-[#3E546B] rounded-[4px] font-bold text-[12px] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] font-extrabold text-[12px] font-mono flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#00A3BF]" />
                  <span>{editingId ? 'Salvar Alterações' : 'Adicionar ao Catálogo'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-3.5 bg-[#F4F6F9] border-b border-[#BAC7D5] space-y-2.5 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#778EA7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serviço por nome, palavras-chave ou escopo (ex: formatação, tela, limpeza, pasta térmica, ssd)..."
              className="w-full h-10 pl-9 pr-3 bg-white border border-[#BAC7D5] focus:border-[#00A3BF] text-[#161C24] text-[13px] font-mono rounded-[4px] outline-none transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categoriesTabList.map(cat => {
              const count = cat === 'Todas' 
                ? services.length 
                : services.filter(s => s.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[12px] font-bold rounded-[4px] whitespace-nowrap transition-colors font-mono flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'bg-white text-[#3E546B] border border-[#BAC7D5] hover:bg-[#EFF4FF]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-bold ${
                    selectedCategory === cat ? 'bg-[#00A3BF] text-[#000F22]' : 'bg-[#E2E8F0] text-[#3E546B]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-[#F8F9FF] space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#3E546B] pb-1">
            <span>
              Exibindo <strong>{filteredServices.length}</strong> de <strong>{services.length}</strong> serviços de informática cadastrados
            </span>
            <span className="hidden sm:inline">Valores de referência em Reais (BRL)</span>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredServices.map(srv => (
                <div
                  key={srv.id}
                  className="bg-white border border-[#D8E0E9] hover:border-[#00A3BF] rounded-[6px] p-3.5 shadow-xs flex flex-col justify-between transition-all group hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 bg-[#EFF4FF] border border-[#BAC7D5] rounded-[3px] text-[10px] font-mono font-bold text-[#00687A] uppercase">
                        {srv.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#74777E]">
                        <Clock className="w-3 h-3 text-[#00A3BF]" />
                        {srv.estimatedTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-[14px] text-[#0A2540] group-hover:text-[#00687A] transition-colors leading-snug">
                      {srv.name}
                    </h4>

                    <p className="text-[12px] text-[#43474D] mt-1.5 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E9EEFA] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#74777E] uppercase block">Valor Fixo:</span>
                      <span className="text-[18px] font-extrabold text-[#14532D] font-mono tabular-nums">
                        {formatCurrency(srv.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(srv)}
                        className="p-1.5 bg-[#F4F6F9] hover:bg-[#E2E8F0] border border-[#BAC7D5] text-[#3E546B] hover:text-[#0A2540] rounded-[3px] transition-colors"
                        title="Editar nome, valor ou descrição deste serviço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button (if custom or user created) */}
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv)}
                        className="p-1.5 bg-[#FEE2E2]/50 hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-[3px] transition-colors"
                        title="Remover serviço do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Start Work Order Action Button */}
                      {onSelectServiceToCreateOS && (
                        <button
                          type="button"
                          onClick={() => handleSelectService(srv)}
                          className="px-3 py-1.5 bg-[#00A3BF] hover:bg-[#008ea6] active:bg-[#00687A] text-[#000F22] font-bold font-mono text-[11px] rounded-[3px] flex items-center gap-1 transition-colors shadow-xs"
                          title="Iniciar o preenchimento de uma nova Ordem de Serviço com este item"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Iniciar Nova OS</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#BAC7D5] rounded-[6px] p-8 text-center">
              <Search className="w-8 h-8 text-[#778EA7] mx-auto mb-2" />
              <p className="font-bold text-[14px] text-[#0A2540]">Nenhum serviço encontrado</p>
              <p className="text-[12px] text-[#43474D] mt-1">
                Tente ajustar a busca ou filtre por outra categoria.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="mt-3 px-3.5 py-1.5 bg-[#00A3BF] hover:bg-[#008ea6] text-[#000F22] font-mono font-bold text-[12px] rounded-[4px] inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Adicionar Este Serviço ao Catálogo</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#BAC7D5] p-3 px-5 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#74777E]">
              Core Suporte • Garantia padrão de 90 dias (CDC Art. 26)
            </span>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="text-[11px] font-mono text-[#00687A] hover:underline flex items-center gap-1 transition-colors"
              title="Restaurar tabela original com 20 serviços"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Tabela Padrão</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white font-mono font-bold text-[12px] rounded-[4px] transition-colors"
          >
            Fechar Catálogo
          </button>
        </div>

      </div>
    </div>
  );
};
