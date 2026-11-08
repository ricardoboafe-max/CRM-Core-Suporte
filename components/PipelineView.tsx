import React from 'react';
import { Contact } from '@/types/crm';
import { StatusBadge } from './StatusBadge';
import { 
  Building, 
  DollarSign, 
  Wrench, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Calendar,
  Bell,
  AlertCircle
} from 'lucide-react';
import { getReminderInfo } from '@/lib/reminder-utils';

interface PipelineViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onUpdateStage: (contactId: string, stage: Contact['pipelineStage']) => void;
}

const STAGES: Contact['pipelineStage'][] = [
  'Lead Inicial',
  'Proposta Técnica',
  'Em Negociação',
  'Contrato Ativo',
  'Em Operação'
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  contacts,
  onSelectContact,
  onUpdateStage
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pb-6 overflow-x-auto min-h-[600px]">
      {STAGES.map((stage, stageIdx) => {
        const stageContacts = contacts.filter(c => c.pipelineStage === stage);
        const stageTotalValue = stageContacts.reduce((acc, c) => acc + (c.dealValue || 0), 0);

        return (
          <div
            key={stage}
            className="bg-[#EFF4FF] border border-[#D8E0E9] rounded-[4px] p-2.5 flex flex-col min-w-[260px] shadow-xs"
          >
            {/* Column Header */}
            <div className="bg-[#0A2540] text-white p-2.5 rounded-[3px] mb-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[12px] font-mono tracking-wide uppercase truncate">
                  {stage}
                </h4>
                <span className="px-1.5 py-0.2 bg-[#00A3BF] text-[#000F22] font-mono text-[11px] font-extrabold rounded-[2px]">
                  {stageContacts.length}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-[11px] font-mono text-[#A2B5CC]">
                <span>Total:</span>
                <span className="font-bold text-white tabular-nums">
                  {formatCurrency(stageTotalValue)}
                </span>
              </div>
            </div>

            {/* Contacts Stack in this stage */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[75vh] pr-0.5">
              {stageContacts.length > 0 ? (
                stageContacts.map(contact => {
                  const reminder = getReminderInfo(contact.returnDate);
                  const borderHighlight = reminder?.status === 'overdue'
                    ? 'border-l-4 border-l-[#DC2626]'
                    : reminder?.status === 'today'
                    ? 'border-l-4 border-l-[#D97706]'
                    : '';

                  return (
                    <div
                      key={contact.id}
                      onClick={() => onSelectContact(contact)}
                      className={`bg-white border border-[#D8E0E9] hover:border-[#00A3BF] rounded-[4px] p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group ${borderHighlight}`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#00687A] bg-[#E0F2FE] px-1.5 py-0.5 rounded-[2px] border border-[#BAC7D5]">
                          {contact.code}
                        </span>
                        <StatusBadge status={contact.status} size="sm" />
                      </div>

                      <h5 className="font-bold text-[13px] text-[#0A2540] group-hover:text-[#00687A] transition-colors leading-snug">
                        {contact.name}
                      </h5>

                      <div className="flex items-center gap-1 text-[11px] text-[#43474D] mt-0.5 truncate">
                        <Building className="w-3 h-3 text-[#74777E] shrink-0" />
                        <span className="truncate">{contact.company}</span>
                      </div>

                      {/* Return Date / Reminder Badge in Pipeline */}
                      {reminder && (
                        <div className={`mt-1.5 px-1.5 py-0.5 rounded-[3px] border ${reminder.badgeBg} ${reminder.borderColor} text-[10px] font-mono flex items-center justify-between gap-1`}>
                          <span className={`flex items-center gap-1 font-bold ${reminder.badgeText}`}>
                            {reminder.status === 'overdue' ? (
                              <AlertCircle className="w-3 h-3 text-[#DC2626] shrink-0" />
                            ) : reminder.status === 'today' ? (
                              <Bell className="w-3 h-3 text-[#D97706] shrink-0" />
                            ) : (
                              <Calendar className="w-3 h-3 text-[#0284C7] shrink-0" />
                            )}
                            <span>{reminder.label}</span>
                          </span>
                          <span className={`${reminder.badgeText} text-[9px]`}>{reminder.formattedDate}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E9EEFA] text-[11px] font-mono">
                        <span className="text-[#3E546B] flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-[#0284C7]" />
                          <span>{contact.workOrders?.length || 0} OS</span>
                        </span>

                        {contact.dealValue > 0 ? (
                          <span className="font-bold text-[#14532D] tabular-nums">
                            {formatCurrency(contact.dealValue)}
                          </span>
                        ) : (
                          <span className="text-[#74777E] text-[10px] italic">Sem valor</span>
                        )}
                      </div>

                    {/* Quick Move Pipeline buttons */}
                    <div 
                      className="mt-2 pt-1.5 border-t border-dashed border-[#BAC7D5] flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        disabled={stageIdx === 0}
                        onClick={() => onUpdateStage(contact.id, STAGES[stageIdx - 1])}
                        className={`p-1 rounded-[2px] border text-[10px] flex items-center ${
                          stageIdx === 0 
                            ? 'opacity-20 cursor-not-allowed border-transparent' 
                            : 'bg-[#F4F6F9] hover:bg-[#DDE3EE] border-[#BAC7D5] text-[#3E546B]'
                        }`}
                        title="Mover para estágio anterior"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>

                      <span className="text-[10px] font-mono text-[#74777E]">Mover Fase</span>

                      <button
                        disabled={stageIdx === STAGES.length - 1}
                        onClick={() => onUpdateStage(contact.id, STAGES[stageIdx + 1])}
                        className={`p-1 rounded-[2px] border text-[10px] flex items-center ${
                          stageIdx === STAGES.length - 1 
                            ? 'opacity-20 cursor-not-allowed border-transparent' 
                            : 'bg-[#00A3BF] hover:bg-[#008ea6] border-[#00A3BF] text-[#000F22]'
                        }`}
                        title="Avançar para próximo estágio"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })
              ) : (
                <div className="border border-dashed border-[#BAC7D5] rounded-[4px] p-6 text-center text-[#74777E] font-mono text-[11px]">
                  Nenhum contato nesta fase
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
