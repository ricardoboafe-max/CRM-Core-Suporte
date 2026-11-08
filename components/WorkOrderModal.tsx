import React, { useState } from 'react';
import Image from 'next/image';
import { WorkOrderStatus, PriorityLevel, WorkOrderItem } from '@/types/crm';
import { getStoredServices } from '@/lib/service-catalog';
import { getStoredCompanyConfig } from '@/lib/company-config';
import { X, Wrench, Plus, Save, AlertCircle, Laptop, Cpu, ShieldCheck, Edit3 } from 'lucide-react';

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  onSave: (osData: Omit<WorkOrderItem, 'id'>, osId?: string) => void;
  initialServiceId?: string;
  workOrderToEdit?: WorkOrderItem | null;
}

interface ModalInnerProps {
  onClose: () => void;
  contactName: string;
  onSave: (osData: Omit<WorkOrderItem, 'id'>, osId?: string) => void;
  initialServiceId?: string;
  workOrderToEdit?: WorkOrderItem | null;
}

const WorkOrderModalInner: React.FC<ModalInnerProps> = ({
  onClose,
  contactName,
  onSave,
  initialServiceId,
  workOrderToEdit
}) => {
  const [availableServices] = useState(() => getStoredServices());
  const companyConfig = getStoredCompanyConfig();

  const initialSrv = initialServiceId 
    ? availableServices.find(s => s.id === initialServiceId) 
    : undefined;

  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '');
  const [formData, setFormData] = useState({
    title: workOrderToEdit?.title || initialSrv?.name || '',
    equipmentCode: workOrderToEdit?.equipmentCode || 'PC-CORE-101',
    equipmentType: workOrderToEdit?.equipmentType || 'Notebook',
    brandModel: workOrderToEdit?.brandModel || '',
    serialNumber: workOrderToEdit?.serialNumber || '',
    accessories: workOrderToEdit?.accessories || 'Fonte / Carregador original',
    userPassword: workOrderToEdit?.userPassword || '',
    status: (workOrderToEdit?.status || 'Em Execução') as WorkOrderStatus,
    priority: (workOrderToEdit?.priority || 'Alta') as PriorityLevel,
    scheduledDate: workOrderToEdit?.scheduledDate || new Date().toISOString().split('T')[0],
    value: workOrderToEdit ? workOrderToEdit.value.toString() : initialSrv ? initialSrv.price.toString() : '150',
    description: workOrderToEdit?.description || initialSrv?.description || '',
    reportedIssue: workOrderToEdit?.reportedIssue || '',
    technicalDiagnosis: workOrderToEdit?.technicalDiagnosis || '',
    partsReplaced: workOrderToEdit?.partsReplaced || '',
    warrantyDays: workOrderToEdit?.warrantyDays ?? 90,
    paymentStatus: (workOrderToEdit?.paymentStatus || 'Pendente') as 'Pendente' | 'Pago' | 'Parcial',
    paymentMethod: (workOrderToEdit?.paymentMethod || 'Pix') as 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Boleto' | 'Faturado',
    technicianAssigned: workOrderToEdit?.technicianAssigned || companyConfig.technicalLead || 'Téc. Core Suporte'
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const srv = availableServices.find(s => s.id === serviceId);
    if (srv) {
      setFormData(prev => ({
        ...prev,
        title: srv.name,
        value: srv.price.toString(),
        description: srv.description,
        equipmentType: srv.category === 'Notebooks' ? 'Notebook' : srv.category === 'Servidores e Redes' ? 'Servidor' : prev.equipmentType
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('O título ou escopo do serviço é obrigatório.');
      return;
    }
    if (!formData.equipmentCode.trim()) {
      setErrorMessage('O código/TAG do equipamento é obrigatório.');
      return;
    }

    const numericVal = parseFloat(formData.value.replace(/[^\d.-]/g, '')) || 0;

    onSave({
      title: formData.title.trim(),
      equipmentCode: formData.equipmentCode.trim().toUpperCase(),
      equipmentType: formData.equipmentType,
      brandModel: formData.brandModel.trim(),
      serialNumber: formData.serialNumber.trim(),
      accessories: formData.accessories.trim(),
      userPassword: formData.userPassword.trim(),
      status: formData.status,
      priority: formData.priority,
      scheduledDate: formData.scheduledDate,
      value: numericVal,
      description: formData.description.trim(),
      reportedIssue: formData.reportedIssue.trim(),
      technicalDiagnosis: formData.technicalDiagnosis.trim(),
      partsReplaced: formData.partsReplaced.trim(),
      warrantyDays: formData.warrantyDays,
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod,
      technicianAssigned: formData.technicianAssigned.trim() || 'Equipe Core Suporte'
    }, workOrderToEdit?.id);

    onClose();
  };

  return (
    <div 
      className="w-full max-w-2xl bg-white border border-[#0A2540]/20 rounded-[8px] shadow-[0px_8px_20px_-2px_rgba(10,37,64,0.25)] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
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
            <h3 className="font-extrabold text-[15px] uppercase tracking-wide font-sans flex items-center gap-2">
              <span>{workOrderToEdit ? `Editar Ordem de Serviço // ${workOrderToEdit.id}` : 'Abertura de Ordem de Serviço (OS) // Core Suporte'}</span>
            </h3>
            <p className="text-[11px] text-[#A2B5CC] font-mono">
              Cliente: {contactName} • Plantão: {companyConfig.phone}
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
      <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px]">
        {errorMessage && (
          <div className="p-2.5 bg-[#FEE2E2] border border-[#DC2626] rounded-[4px] text-[#7F1D1D] font-mono text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Preset Service Selector from Catalog (Only shown or highlighted if adding or changing) */}
        {!workOrderToEdit && availableServices.length > 0 && (
          <div className="p-3 bg-[#EFF4FF] border border-[#BAC7D5] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-[#0A2540] font-mono text-[11px] uppercase flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-[#00A3BF]" />
                <span>Iniciar a partir da Tabela de Serviços Pré-Definida (Opcional):</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-[#00687A]">Preço Fixo</span>
            </div>
            <select
              value={selectedServiceId}
              onChange={e => handleServiceSelect(e.target.value)}
              className="w-full h-9 px-2 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[12px] outline-none focus:border-[#00A3BF]"
            >
              <option value="">Selecione um serviço do catálogo para preencher valores...</option>
              {availableServices.map(srv => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} — R$ {srv.price.toFixed(2)} ({srv.category} • {srv.estimatedHours}h)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scope Title */}
        <div>
          <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
            Título / Escopo do Serviço *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Formatação com Backup de Dados + Troca de Pasta Térmica"
            className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-bold outline-none focus:border-[#00A3BF] focus:bg-white"
          />
        </div>

        {/* Equipment Identification Block */}
        <div className="p-3 bg-[#F8F9FF] border border-[#BAC7D5] rounded-[6px] space-y-3">
          <div className="font-bold text-[#0A2540] font-mono text-[11px] uppercase flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#00A3BF]" />
            <span>Dados Técnicos do Equipamento Recebido</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Código / TAG da OS *
              </label>
              <input
                type="text"
                required
                value={formData.equipmentCode}
                onChange={e => setFormData({ ...formData, equipmentCode: e.target.value })}
                placeholder="PC-CORE-101"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Tipo de Dispositivo
              </label>
              <select
                value={formData.equipmentType}
                onChange={e => setFormData({ ...formData, equipmentType: e.target.value })}
                className="w-full h-9 px-2 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              >
                <option value="Notebook">Notebook</option>
                <option value="Desktop / PC">Desktop / PC Gamer</option>
                <option value="All-in-One">All-in-One</option>
                <option value="Servidor">Servidor</option>
                <option value="Monitor">Monitor</option>
                <option value="Periférico">Periférico / Outro</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Marca / Modelo
              </label>
              <input
                type="text"
                value={formData.brandModel}
                onChange={e => setFormData({ ...formData, brandModel: e.target.value })}
                placeholder="Dell Inspiron 15"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Número de Série / Service Tag
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Ex: 8F2G9X1"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Acessórios Deixados
              </label>
              <input
                type="text"
                value={formData.accessories}
                onChange={e => setFormData({ ...formData, accessories: e.target.value })}
                placeholder="Fonte + Cabo de Força"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Senha do Usuário / PIN (Opcional)
              </label>
              <input
                type="text"
                value={formData.userPassword}
                onChange={e => setFormData({ ...formData, userPassword: e.target.value })}
                placeholder="1234 ou sem senha"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF]"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Status, Priority, Date, Value */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Status da OS
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as WorkOrderStatus })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-bold outline-none focus:border-[#00A3BF]"
            >
              <option value="Pendente">Pendente</option>
              <option value="Em Execução">Em Manutenção / Execução</option>
              <option value="Aguardando Peças">Aguardando Peças</option>
              <option value="Concluída">Concluída / Testado</option>
              <option value="Crítica / Atrasada">Crítica / Urgente</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Crítica">Crítica (Urgência)</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Previsão de Entrega
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Valor Total (R$)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: e.target.value })}
              placeholder="150"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold text-[#14532D] outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
        </div>

        {/* Technical Fields: Defect, Diagnosis & Parts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Defeito Reclamado pelo Cliente
            </label>
            <textarea
              rows={2}
              value={formData.reportedIssue}
              onChange={e => setFormData({ ...formData, reportedIssue: e.target.value })}
              placeholder="Ex: Computador desliga sozinho após 10 minutos de uso. Lentidão intensa ao abrir navegador..."
              className="w-full p-2.5 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Laudo Técnico / Diagnóstico
            </label>
            <textarea
              rows={2}
              value={formData.technicalDiagnosis}
              onChange={e => setFormData({ ...formData, technicalDiagnosis: e.target.value })}
              placeholder="Ex: Pasta térmica ressecada. Cooler com obstrução de poeira. SSD operando com 98% de integridade."
              className="w-full p-2.5 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Parts and Warranty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Peças / Componentes Trocados ou Instalados
            </label>
            <input
              type="text"
              value={formData.partsReplaced}
              onChange={e => setFormData({ ...formData, partsReplaced: e.target.value })}
              placeholder="Ex: SSD NVMe 500GB Kingston, 1x Memória DDR4 8GB Kingston"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Garantia (Dias)
            </label>
            <input
              type="number"
              value={formData.warrantyDays}
              onChange={e => setFormData({ ...formData, warrantyDays: parseInt(e.target.value, 10) || 90 })}
              placeholder="90"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
        </div>

        {/* Financial & Technician row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Status do Pagamento
            </label>
            <select
              value={formData.paymentStatus}
              onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as 'Pendente' | 'Pago' | 'Parcial' })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Pendente">Pagamento Pendente</option>
              <option value="Pago">Pago / Liquidado</option>
              <option value="Parcial">Sinal / Pago Parcial</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Forma de Pagamento
            </label>
            <select
              value={formData.paymentMethod}
              onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as typeof formData.paymentMethod })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Pix">Pix Instantâneo</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro em Espécie</option>
              <option value="Boleto">Boleto Bancário</option>
              <option value="Faturado">Faturado para Empresa</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Técnico Responsável
            </label>
            <input
              type="text"
              value={formData.technicianAssigned}
              onChange={e => setFormData({ ...formData, technicianAssigned: e.target.value })}
              placeholder="Téc. Core Suporte"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
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
            {workOrderToEdit ? (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Salvar Alterações na OS</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Gerar Ordem de Serviço</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  isOpen,
  onClose,
  contactName,
  onSave,
  initialServiceId,
  workOrderToEdit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/65 backdrop-blur-[2px]">
      <WorkOrderModalInner
        key={workOrderToEdit?.id || 'new-work-order'}
        onClose={onClose}
        contactName={contactName}
        onSave={onSave}
        initialServiceId={initialServiceId}
        workOrderToEdit={workOrderToEdit}
      />
    </div>
  );
};
