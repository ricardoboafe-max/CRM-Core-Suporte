import React, { useState } from 'react';
import Image from 'next/image';
import { Contact, WorkOrderStatus, WorkOrderItem, InteractionItem } from '@/types/crm';
import { StatusBadge } from './StatusBadge';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Plus, 
  Edit3, 
  Trash2, 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Wrench, 
  Sparkles, 
  FileText, 
  Clock, 
  Tag, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Send,
  Loader2,
  Printer,
  Receipt,
  Bell,
  Check
} from 'lucide-react';
import { getReminderInfo, getQuickDate } from '@/lib/reminder-utils';

interface ContactDetailProps {
  contact: Contact;
  onBackMobile: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onOpenNewWorkOrderModal: (contactId: string) => void;
  onOpenNewInteractionModal: (contactId: string) => void;
  onUpdateWorkOrderStatus: (contactId: string, osId: string, status: WorkOrderStatus) => void;
  onUpdateNotes: (contactId: string, notes: string) => void;
  onOpenAiModal: (contact: Contact, actionType?: 'briefing' | 'draft_email' | 'draft_whatsapp') => void;
  onPrintWorkOrder: (os: WorkOrderItem, contact: Contact) => void;
  onPrintReceipt: (os: WorkOrderItem | null, contact: Contact) => void;
  onOpenServiceCatalog: () => void;
  onUpdateReturnDate?: (contactId: string, returnDate?: string, reminderNotes?: string) => void;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({
  contact,
  onBackMobile,
  onEditContact,
  onDeleteContact,
  onOpenNewWorkOrderModal,
  onOpenNewInteractionModal,
  onUpdateWorkOrderStatus,
  onUpdateNotes,
  onOpenAiModal,
  onPrintWorkOrder,
  onPrintReceipt,
  onOpenServiceCatalog,
  onUpdateReturnDate
}) => {
  const [activeTab, setActiveTab] = useState<'work-orders' | 'interactions' | 'ai-briefing' | 'notes'>('work-orders');
  const [editingNotes, setEditingNotes] = useState(contact.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // State is reset automatically via key={contact.id} on the component
  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateNotes(contact.id, editingNotes);
    setTimeout(() => setIsSavingNotes(false), 500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(contact.code);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-white border border-[#D8E0E9] rounded-[4px] shadow-[0px_1px_3px_rgba(10,37,64,0.06)] flex flex-col h-full overflow-hidden">
      
      {/* Detail Top Sticky Header */}
      <div className="bg-[#FFFFFF] border-b border-[#BAC7D5] p-3 sm:p-5 sticky top-0 z-10 shadow-[0px_4px_0px_0px_rgba(10,37,64,0.04)]">
        
        {/* Mobile Back Button */}
        <div className="flex items-center justify-between md:hidden mb-2 pb-2 border-b border-[#E9EEFA]">
          <button
            onClick={onBackMobile}
            className="flex items-center gap-1 text-[13px] font-bold text-[#0A2540] hover:text-[#00A3BF] py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Lista</span>
          </button>
          <span className="font-mono text-[11px] font-bold text-[#00687A] bg-[#E0F2FE] px-2 py-0.5 rounded-[3px]">
            {contact.code}
          </span>
        </div>

        {/* Header Main Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="w-6 h-6 relative shrink-0" title="Core Suporte - Tecnologia em Boas Mãos">
                <Image
                  src="/assets/aistudio/coreSuporte_semFundo_10bdb136.png"
                  alt="Core Suporte"
                  width={151}
                  height={157}
                  className="w-6 h-6 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span 
                onClick={handleCopyCode}
                className="cursor-pointer font-mono text-[12px] font-bold text-[#00687A] bg-[#E0F2FE] hover:bg-[#b9e6f3] px-2 py-0.5 rounded-[3px] border border-[#BAC7D5] inline-flex items-center gap-1 transition-colors"
                title="Clique para copiar código"
              >
                {contact.code}
                <Copy className="w-3 h-3 opacity-60" />
                {copiedText && <span className="text-[10px] text-[#14532D]">Copiado!</span>}
              </span>

              <StatusBadge status={contact.status} />

              <span className={`px-2 py-0.5 rounded-[3px] font-mono text-[11px] font-bold border ${
                contact.priority === 'Crítica'
                  ? 'bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]'
                  : contact.priority === 'Alta'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#78350F]'
                  : 'bg-[#EFF4FF] border-[#BAC7D5] text-[#3E546B]'
              }`}>
                Prioridade: {contact.priority}
              </span>

              <span className="text-[11px] font-mono font-bold text-[#3E546B] uppercase bg-[#F4F6F9] px-2 py-0.5 rounded-[3px] border border-[#D8E0E9]">
                {contact.type}
              </span>
            </div>

            <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#0A2540] tracking-tight font-sans">
              {contact.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#43474D] mt-0.5">
              <div className="flex items-center gap-1 font-semibold text-[#161C24]">
                <Building className="w-3.5 h-3.5 text-[#3E546B]" />
                <span>{contact.company}</span>
              </div>
              <span className="text-[#A2B5CC]">•</span>
              <span className="text-[#43474D]">{contact.role}</span>
              {contact.location && (
                <>
                  <span className="text-[#A2B5CC]">•</span>
                  <div className="flex items-center gap-1 text-[#3E546B] font-mono text-[12px]">
                    <MapPin className="w-3 h-3" />
                    <span>{contact.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="h-9 px-3 bg-white hover:bg-[#EFF4FF] border border-[#BAC7D5] text-[#0A2540] rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Ligar Agora"
              >
                <Phone className="w-3.5 h-3.5 text-[#00A3BF]" />
                <span className="hidden sm:inline">Ligar</span>
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Conversar no WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="h-9 px-3 bg-white hover:bg-[#EFF4FF] border border-[#BAC7D5] text-[#0A2540] rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Enviar E-mail"
              >
                <Mail className="w-3.5 h-3.5 text-[#3E546B]" />
                <span className="hidden sm:inline">E-mail</span>
              </a>
            )}

            {/* Quick Receipt Generator */}
            <button
              onClick={() => onPrintReceipt(contact.workOrders?.[0] || null, contact)}
              className="h-9 px-3 bg-white hover:bg-[#EFF4FF] border border-[#BAC7D5] text-[#14532D] rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Emitir Recibo de Pagamento de Serviços"
            >
              <Receipt className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="hidden sm:inline">Recibo</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => onOpenAiModal(contact, 'briefing')}
              className="h-9 px-3 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Abrir Assistente de Inteligência Artificial"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6AE1FF]" />
              <span className="hidden lg:inline">IA Diagnóstico</span>
            </button>

            {/* Edit Contact */}
            <button
              onClick={() => onEditContact(contact)}
              className="h-9 px-2.5 bg-white hover:bg-[#F4F6F9] border border-[#BAC7D5] text-[#3E546B] hover:text-[#0A2540] rounded-[4px] text-[12px] font-medium flex items-center transition-colors"
              title="Editar dados cadastrais"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Contact */}
            <button
              onClick={() => onDeleteContact(contact.id)}
              className="h-9 px-2.5 bg-white hover:bg-[#FEE2E2] border border-[#BAC7D5] text-[#7F1D1D] rounded-[4px] text-[12px] font-medium flex items-center transition-colors"
              title="Excluir Contato"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dense Key-Value Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-[#E9EEFA] bg-[#F8F9FF] p-2.5 rounded-[4px] text-[12px] font-mono">
          <div>
            <span className="text-[10px] text-[#74777E] uppercase block">Telefone Comercial:</span>
            <span className="font-semibold text-[#161C24]">{contact.phone || 'Não informado'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#74777E] uppercase block">E-mail Corporativo:</span>
            <span className="font-semibold text-[#161C24] truncate block" title={contact.email}>{contact.email || 'Não informado'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#74777E] uppercase block">Documento (CNPJ/CPF):</span>
            <span className="font-semibold text-[#161C24]">{contact.documentId || 'Não registrado'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#74777E] uppercase block">Valor em Contrato:</span>
            <span className="font-bold text-[#14532D] tabular-nums">
              {contact.dealValue > 0 ? formatCurrency(contact.dealValue) : 'Sob Demanda'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <Tag className="w-3 h-3 text-[#74777E]" />
            {contact.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#EFF4FF] border border-[#BAC7D5] rounded-[3px] text-[11px] font-mono text-[#00687A] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Return Date & Reminder Panel */}
        {(() => {
          const reminder = getReminderInfo(contact.returnDate);
          return (
            <div className="mt-3">
              {reminder ? (
                <div className={`p-3 rounded-[4px] border ${reminder.badgeBg} ${reminder.borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {reminder.status === 'overdue' ? (
                        <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                      ) : reminder.status === 'today' ? (
                        <Bell className="w-5 h-5 text-[#D97706] animate-bounce" />
                      ) : (
                        <Calendar className="w-5 h-5 text-[#0284C7]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-[12px] font-bold ${reminder.badgeText} uppercase`}>
                          {reminder.label}
                        </span>
                        <span className="text-[#64748B] text-[11px] font-mono">•</span>
                        <span className="text-[12px] font-mono font-semibold text-[#1E293B]">
                          Agendado para: <strong>{reminder.formattedDate}</strong>
                        </span>
                      </div>
                      {contact.reminderNotes ? (
                        <p className="text-[12px] text-[#334155] mt-0.5 font-medium">
                          <span className="font-bold text-[#0F172A]">Lembrete:</span> {contact.reminderNotes}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#64748B] italic mt-0.5">
                          Sem instruções detalhadas de lembrete cadastradas.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons on the reminder */}
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, getQuickDate(7), contact.reminderNotes)}
                      className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] text-[11px] font-mono font-semibold text-[#0A2540] transition-colors shadow-2xs"
                      title="Reagendar contato para daqui a 7 dias"
                    >
                      +7 dias
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, getQuickDate(15), contact.reminderNotes)}
                      className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] text-[11px] font-mono font-semibold text-[#0A2540] transition-colors shadow-2xs"
                      title="Reagendar contato para daqui a 15 dias"
                    >
                      +15 dias
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditContact(contact)}
                      className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] text-[11px] font-mono font-semibold text-[#0A2540] transition-colors shadow-2xs"
                      title="Editar data ou nota do lembrete"
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, undefined, undefined)}
                      className="px-2.5 py-1 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] rounded-[3px] text-[11px] font-mono font-bold transition-colors shadow-2xs flex items-center gap-1"
                      title="Marcar retorno como concluído e remover lembrete"
                    >
                      <Check className="w-3 h-3" />
                      <span>Concluir</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                  <div className="flex items-center gap-2 text-[#64748B] font-mono text-[11px]">
                    <Calendar className="w-4 h-4 text-[#94A3B8]" />
                    <span>Nenhum retorno agendado para este cliente.</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-[#64748B] mr-0.5">Agendar rápido:</span>
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, getQuickDate(1), 'Retorno operacional agendado')}
                      className="px-2 py-0.5 bg-white hover:bg-[#EFF6FF] border border-[#BAC7D5] rounded-[3px] text-[10px] font-mono font-semibold text-[#0A2540] transition-colors"
                    >
                      Amanhã
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, getQuickDate(7), 'Acompanhamento pós-manutenção 7 dias')}
                      className="px-2 py-0.5 bg-white hover:bg-[#EFF6FF] border border-[#BAC7D5] rounded-[3px] text-[10px] font-mono font-semibold text-[#0A2540] transition-colors"
                    >
                      +7 dias
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateReturnDate?.(contact.id, getQuickDate(15), 'Acompanhamento pós-manutenção 15 dias')}
                      className="px-2 py-0.5 bg-white hover:bg-[#EFF6FF] border border-[#BAC7D5] rounded-[3px] text-[10px] font-mono font-semibold text-[#0A2540] transition-colors"
                    >
                      +15 dias
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditContact(contact)}
                      className="px-2 py-0.5 bg-[#00A3BF] hover:bg-[#00899f] text-[#000F22] rounded-[3px] text-[10px] font-mono font-bold transition-colors flex items-center gap-0.5"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Definir Lembrete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 px-4 sm:px-5 bg-[#EFF4FF] border-b border-[#D8E0E9] pt-2 overflow-x-auto no-scrollbar">
        
        <button
          onClick={() => setActiveTab('work-orders')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-t-[4px] border-t border-x transition-colors whitespace-nowrap ${
            activeTab === 'work-orders'
              ? 'bg-white border-[#BAC7D5] text-[#0A2540] border-b-transparent shadow-xs'
              : 'border-transparent text-[#3E546B] hover:text-[#0A2540]'
          }`}
        >
          <Wrench className="w-4 h-4 text-[#0284C7]" />
          <span>Ordens de Serviço ({contact.workOrders?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-t-[4px] border-t border-x transition-colors whitespace-nowrap ${
            activeTab === 'interactions'
              ? 'bg-white border-[#BAC7D5] text-[#0A2540] border-b-transparent shadow-xs'
              : 'border-transparent text-[#3E546B] hover:text-[#0A2540]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#00A3BF]" />
          <span>Histórico & Atividades ({contact.interactions?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-briefing')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-t-[4px] border-t border-x transition-colors whitespace-nowrap ${
            activeTab === 'ai-briefing'
              ? 'bg-white border-[#BAC7D5] text-[#0A2540] border-b-transparent shadow-xs'
              : 'border-transparent text-[#3E546B] hover:text-[#0A2540]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#00A3BF]" />
          <span>Inteligência IA</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-t-[4px] border-t border-x transition-colors whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-white border-[#BAC7D5] text-[#0A2540] border-b-transparent shadow-xs'
              : 'border-transparent text-[#3E546B] hover:text-[#0A2540]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#3E546B]" />
          <span>Notas Técnicas de Campo</span>
        </button>

      </div>

      {/* Tab Contents Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-[#F8F9FF]">
        
        {/* TAB 1: WORK ORDERS */}
        {activeTab === 'work-orders' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-extrabold text-[15px] text-[#0A2540] uppercase font-mono">
                  Ordens de Serviço // Manutenção de Computadores
                </h3>
                <p className="text-[12px] text-[#43474D]">
                  Diagnóstico, peças, laudo técnico e impressões oficiais
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenServiceCatalog}
                  className="px-3 py-1.5 bg-[#EFF4FF] hover:bg-[#DDE3EE] border border-[#BAC7D5] text-[#0A2540] rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Ver Tabela de Serviços e Preços da Core Suporte"
                >
                  <Tag className="w-3.5 h-3.5 text-[#00687A]" />
                  <span>Tabela de Preços</span>
                </button>

                <button
                  onClick={() => onOpenNewWorkOrderModal(contact.id)}
                  className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#00A3BF] stroke-[3]" />
                  <span>Nova OS</span>
                </button>
              </div>
            </div>

            {contact.workOrders && contact.workOrders.length > 0 ? (
              <div className="space-y-2.5">
                {contact.workOrders.map((os) => (
                  <div
                    key={os.id}
                    className="bg-white border border-[#D8E0E9] rounded-[4px] p-3.5 shadow-xs hover:border-[#BAC7D5] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#000F22] text-[#6AE1FF] font-mono text-[11px] font-bold rounded-[3px]">
                          {os.id}
                        </span>
                        <span className="font-mono text-[12px] font-bold text-[#00687A] bg-[#E0F2FE] px-2 py-0.5 rounded-[3px] border border-[#BAC7D5]">
                          EQUIP: {os.equipmentCode}
                        </span>
                      </div>

                      {/* Inline Status Changer */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#74777E] font-mono hidden sm:inline">Status OS:</span>
                        <select
                          value={os.status}
                          onChange={(e) => onUpdateWorkOrderStatus(contact.id, os.id, e.target.value as WorkOrderStatus)}
                          className="h-7 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[3px] text-[11px] font-mono font-bold text-[#0A2540] outline-none focus:border-[#00A3BF]"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em Execução">Em Execução</option>
                          <option value="Aguardando Peças">Aguardando Peças</option>
                          <option value="Concluída">Concluída</option>
                          <option value="Crítica / Atrasada">Crítica / Atrasada</option>
                        </select>
                      </div>
                    </div>

                    <h4 className="font-bold text-[14px] text-[#0A2540] mb-1">
                      {os.title}
                    </h4>

                    {os.description && (
                      <p className="text-[12px] text-[#43474D] mb-2 leading-relaxed">
                        {os.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E9EEFA] text-[11px] font-mono text-[#3E546B]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#74777E]" />
                          <span>Agendado: {os.scheduledDate}</span>
                        </span>
                        {os.technicianAssigned && (
                          <span className="text-[#00687A] font-bold">
                            Técnico: {os.technicianAssigned}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {os.value > 0 && (
                          <div className="text-[#14532D] font-bold tabular-nums mr-2">
                            {formatCurrency(os.value)}
                          </div>
                        )}

                        <button
                          onClick={() => onPrintWorkOrder(os, contact)}
                          className="px-2.5 py-1 bg-white hover:bg-[#EFF4FF] border border-[#BAC7D5] text-[#0A2540] rounded-[3px] text-[11px] font-mono font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Imprimir Ordem de Serviço em A4 ou salvar PDF"
                        >
                          <Printer className="w-3 h-3 text-[#00A3BF]" />
                          <span>Imprimir OS</span>
                        </button>

                        <button
                          onClick={() => onPrintReceipt(os, contact)}
                          className="px-2.5 py-1 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] rounded-[3px] text-[11px] font-mono font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Emitir Recibo de Pagamento assinado"
                        >
                          <Receipt className="w-3 h-3 text-[#16A34A]" />
                          <span>Recibo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#D8E0E9] rounded-[4px] p-8 text-center">
                <Wrench className="w-8 h-8 text-[#778EA7] mx-auto mb-2" />
                <p className="font-bold text-[14px] text-[#0A2540]">Nenhuma Ordem de Serviço aberta</p>
                <p className="text-[12px] text-[#43474D] mt-1 max-w-sm mx-auto">
                  Este contato ainda não possui chamados de campo ou ordens de serviço cadastradas.
                </p>
                <button
                  onClick={() => onOpenNewWorkOrderModal(contact.id)}
                  className="mt-3 px-3 py-1.5 bg-[#00A3BF] text-[#000F22] font-bold text-[12px] rounded-[4px] inline-flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Primeira OS</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIONS & TIMELINE */}
        {activeTab === 'interactions' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-[15px] text-[#0A2540] uppercase font-mono">
                  Histórico de Interações & Atividades
                </h3>
                <p className="text-[12px] text-[#43474D]">
                  Registros cronológicos de contatos, chamadas e visitas técnicas
                </p>
              </div>

              <button
                onClick={() => onOpenNewInteractionModal(contact.id)}
                className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#00A3BF] stroke-[3]" />
                <span>Nova Interação</span>
              </button>
            </div>

            {contact.interactions && contact.interactions.length > 0 ? (
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#BAC7D5]">
                {contact.interactions.map((item) => {
                  let Icon = Clock;
                  let colorClass = 'text-[#00A3BF] bg-[#E0F2FE] border-[#0284C7]';
                  let typeLabel = 'Interação';

                  if (item.type === 'ligacao') {
                    Icon = Phone;
                    typeLabel = 'Ligação Telefônica';
                  } else if (item.type === 'whatsapp') {
                    Icon = MessageSquare;
                    colorClass = 'text-[#16A34A] bg-[#DCFCE7] border-[#16A34A]';
                    typeLabel = 'Mensagem WhatsApp';
                  } else if (item.type === 'visita_campo') {
                    Icon = Wrench;
                    colorClass = 'text-[#034975] bg-[#E0F2FE] border-[#0284C7]';
                    typeLabel = 'Visita Técnica de Campo';
                  } else if (item.type === 'email') {
                    Icon = Mail;
                    colorClass = 'text-[#581C87] bg-[#F3E8FF] border-[#9333EA]';
                    typeLabel = 'E-mail Comercial/Técnico';
                  } else if (item.type === 'nota') {
                    Icon = FileText;
                    colorClass = 'text-[#78350F] bg-[#FEF3C7] border-[#F59E0B]';
                    typeLabel = 'Nota de Registro';
                  }

                  return (
                    <div key={item.id} className="relative group">
                      {/* Node Bullet */}
                      <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-[3px] border flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-3 h-3 stroke-[2.2]" />
                      </div>

                      <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E546B]">
                              {typeLabel}
                            </span>
                            <span className="text-[#A2B5CC]">•</span>
                            <span className="text-[11px] font-mono text-[#74777E]">
                              Autor: {item.author}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-[#74777E] tabular-nums" suppressHydrationWarning>
                            {formatDate(item.timestamp)}
                          </span>
                        </div>

                        <h4 className="font-bold text-[13px] text-[#0A2540] mb-1">
                          {item.title}
                        </h4>

                        <p className="text-[12px] text-[#43474D] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#D8E0E9] rounded-[4px] p-8 text-center">
                <Clock className="w-8 h-8 text-[#778EA7] mx-auto mb-2" />
                <p className="font-bold text-[14px] text-[#0A2540]">Nenhum histórico registrado</p>
                <p className="text-[12px] text-[#43474D] mt-1 max-w-sm mx-auto">
                  Registre ligações, mensagens de WhatsApp ou visitas técnicas realizadas com este contato.
                </p>
                <button
                  onClick={() => onOpenNewInteractionModal(contact.id)}
                  className="mt-3 px-3 py-1.5 bg-[#00A3BF] text-[#000F22] font-bold text-[12px] rounded-[4px] inline-flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Primeira Interação</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI INTELLIGENCE & BRIEFING */}
        {activeTab === 'ai-briefing' && (
          <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-4 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#E9EEFA]">
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
                <h3 className="font-extrabold text-[14px] text-[#0A2540] font-sans">
                  Assistente de Inteligência Artificial // Core Suporte
                </h3>
                <p className="text-[11px] text-[#43474D] font-mono">
                  Tecnologia em Boas Mãos • Suporte Técnico: (31) 9 9372-4609
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => onOpenAiModal(contact, 'briefing')}
                className="p-3 bg-[#F4F6F9] hover:bg-[#EFF4FF] border border-[#BAC7D5] hover:border-[#00A3BF] rounded-[4px] text-left transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#0A2540] font-bold text-[13px] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00A3BF]" />
                    <span>Briefing & Risco</span>
                  </div>
                  <p className="text-[11px] text-[#43474D]">
                    Análise completa do perfil, nível de urgência e equipamentos em campo.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#00687A] font-bold mt-2">Executar Análise →</span>
              </button>

              <button
                onClick={() => onOpenAiModal(contact, 'draft_email')}
                className="p-3 bg-[#F4F6F9] hover:bg-[#EFF4FF] border border-[#BAC7D5] hover:border-[#00A3BF] rounded-[4px] text-left transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#0A2540] font-bold text-[13px] mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Rascunhar E-mail</span>
                  </div>
                  <p className="text-[11px] text-[#43474D]">
                    Redação técnica formal para alinhamento de paradas ou proposta de OS.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#00687A] font-bold mt-2">Gerar E-mail →</span>
              </button>

              <button
                onClick={() => onOpenAiModal(contact, 'draft_whatsapp')}
                className="p-3 bg-[#F4F6F9] hover:bg-[#EFF4FF] border border-[#BAC7D5] hover:border-[#00A3BF] rounded-[4px] text-left transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#0A2540] font-bold text-[13px] mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Rascunhar WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-[#43474D]">
                    Mensagem objetiva com referência às OS ativas pronta para envio.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#14532D] font-bold mt-2">Gerar Mensagem →</span>
              </button>
            </div>

            <div className="p-3 bg-[#F8F9FF] border border-[#D8E0E9] rounded-[4px] text-[12px] text-[#3E546B]">
              <div className="font-bold text-[#0A2540] mb-1">Dica de Produtividade de Campo:</div>
              <p>
                O assistente analisa o histórico de intervenções, valores de contrato e chamados abertos para calcular a prioridade real do contato e produzir comunicações precisas sem perda de tempo.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: FIELD NOTES */}
        {activeTab === 'notes' && (
          <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-[14px] text-[#0A2540] uppercase font-mono">
                Observações e Diretrizes de Campo
              </h3>
              <span className="text-[11px] text-[#74777E] font-mono">
                Salvamento imediato
              </span>
            </div>

            <textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              placeholder="Digite notas técnicas sobre restrições de acesso na planta, contatos secundários, procedimentos de segurança NR-10/NR-35 ou particularidades das máquinas..."
              className="w-full h-44 p-3 bg-[#F8F9FF] border border-[#BAC7D5] rounded-[4px] text-[13px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white resize-y transition-colors"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-[#74777E] font-mono">
                {editingNotes.length} caracteres
              </span>

              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-4 py-2 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {isSavingNotes ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3BF]" />
                    <span>Salvar Notas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
