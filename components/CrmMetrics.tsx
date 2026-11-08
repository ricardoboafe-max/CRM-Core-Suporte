import React from 'react';
import { Contact } from '@/types/crm';
import { 
  Users, 
  Wrench, 
  DollarSign, 
  AlertTriangle,
  Briefcase,
  Calendar,
  Bell
} from 'lucide-react';
import { getReminderInfo } from '@/lib/reminder-utils';

interface CrmMetricsProps {
  contacts: Contact[];
  onFilterByStatus?: (status: string) => void;
  onFilterByPriority?: (priority: string) => void;
  onFilterByReminder?: (reminderFilter: string) => void;
}

export const CrmMetrics: React.FC<CrmMetricsProps> = ({ 
  contacts, 
  onFilterByStatus, 
  onFilterByPriority,
  onFilterByReminder
}) => {
  const totalContacts = contacts.length;
  
  const activeContacts = contacts.filter(
    c => c.status === 'Ativo' || c.status === 'Em Execução'
  ).length;

  const totalWorkOrders = contacts.reduce(
    (acc, c) => acc + (c.workOrders ? c.workOrders.length : 0), 0
  );

  const activeWorkOrders = contacts.reduce(
    (acc, c) => acc + (c.workOrders ? c.workOrders.filter(w => w.status !== 'Concluída').length : 0), 0
  );

  const totalPipelineValue = contacts.reduce(
    (acc, c) => acc + (c.dealValue || 0), 0
  );

  const criticalIssuesCount = contacts.filter(
    c => c.priority === 'Crítica' || c.workOrders?.some(w => w.status === 'Crítica / Atrasada' || w.priority === 'Crítica')
  ).length;

  // Reminders / Return Dates Metrics
  const contactsWithReminders = contacts.filter(c => !!c.returnDate);
  const overdueCount = contactsWithReminders.filter(c => getReminderInfo(c.returnDate)?.status === 'overdue').length;
  const todayCount = contactsWithReminders.filter(c => getReminderInfo(c.returnDate)?.status === 'today').length;
  const upcomingCount = contactsWithReminders.filter(c => getReminderInfo(c.returnDate)?.status === 'upcoming').length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 my-3 sm:my-4">
      
      {/* Metric 1: Total Contatos */}
      <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)]">
        <div className="flex items-center justify-between text-[#3E546B]">
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Contatos Base</span>
          <Users className="w-4 h-4 text-[#00A3BF]" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[22px] sm:text-[26px] font-extrabold text-[#0A2540] font-mono tabular-nums leading-none">
            {totalContacts}
          </span>
          <span className="text-[11px] text-[#3E546B] font-mono font-medium">
            {activeContacts} ativos
          </span>
        </div>
      </div>

      {/* Metric 2: Clientes & Contratos */}
      <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)]">
        <div className="flex items-center justify-between text-[#3E546B]">
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Clientes / Contratos</span>
          <Briefcase className="w-4 h-4 text-[#0A2540]" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[22px] sm:text-[26px] font-extrabold text-[#0A2540] font-mono tabular-nums leading-none">
            {contacts.filter(c => c.type === 'Cliente').length}
          </span>
          <span className="text-[11px] text-[#00687A] font-mono font-medium">
            {contacts.filter(c => c.type === 'Lead').length} leads
          </span>
        </div>
      </div>

      {/* Metric 3: Ordens de Serviço */}
      <div 
        onClick={() => onFilterByStatus && onFilterByStatus('Em Execução')}
        className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)] hover:border-[#0284C7] cursor-pointer transition-colors"
      >
        <div className="flex items-center justify-between text-[#3E546B]">
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">OS em Campo</span>
          <Wrench className="w-4 h-4 text-[#0284C7]" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[22px] sm:text-[26px] font-extrabold text-[#0284C7] font-mono tabular-nums leading-none">
            {activeWorkOrders}
          </span>
          <span className="text-[11px] text-[#3E546B] font-mono font-medium">
            de {totalWorkOrders} total
          </span>
        </div>
      </div>

      {/* Metric 4: Volume Contratual / Pipeline */}
      <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)] col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-[#3E546B]">
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Valor Total Base</span>
          <DollarSign className="w-4 h-4 text-[#16A34A]" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[18px] sm:text-[20px] font-extrabold text-[#14532D] font-mono tabular-nums leading-none truncate" title={formatCurrency(totalPipelineValue)} suppressHydrationWarning>
            {formatCurrency(totalPipelineValue)}
          </span>
        </div>
      </div>

      {/* Metric 5: Alertas Críticos */}
      <div 
        onClick={() => onFilterByPriority && onFilterByPriority('Crítica')}
        className={`bg-white border rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)] cursor-pointer transition-colors ${
          criticalIssuesCount > 0 
            ? 'border-[#DC2626] bg-[#FEE2E2]/30 hover:bg-[#FEE2E2]/50' 
            : 'border-[#D8E0E9] hover:border-[#DC2626]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${criticalIssuesCount > 0 ? 'text-[#7F1D1D]' : 'text-[#3E546B]'}`}>
            Atenção Crítica
          </span>
          <AlertTriangle className={`w-4 h-4 ${criticalIssuesCount > 0 ? 'text-[#DC2626]' : 'text-[#3E546B]'}`} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className={`text-[22px] sm:text-[26px] font-extrabold font-mono tabular-nums leading-none ${criticalIssuesCount > 0 ? 'text-[#DC2626]' : 'text-[#0A2540]'}`}>
            {criticalIssuesCount}
          </span>
          <span className={`text-[11px] font-mono font-medium ${criticalIssuesCount > 0 ? 'text-[#7F1D1D]' : 'text-[#3E546B]'}`}>
            {criticalIssuesCount > 0 ? 'Requer Ação' : 'Operação Normal'}
          </span>
        </div>
      </div>

      {/* Metric 6: Agenda / Retornos */}
      <div 
        onClick={() => onFilterByReminder && onFilterByReminder(overdueCount > 0 ? 'overdue' : todayCount > 0 ? 'today' : 'pending')}
        className={`bg-white border rounded-[4px] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0px_1px_2px_rgba(10,37,64,0.04)] cursor-pointer transition-colors ${
          overdueCount > 0
            ? 'border-[#DC2626] bg-[#FEE2E2]/25 hover:bg-[#FEE2E2]/40'
            : todayCount > 0
            ? 'border-[#D97706] bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]/50'
            : 'border-[#D8E0E9] hover:border-[#00A3BF]'
        }`}
        title="Clique para filtrar clientes com agendamentos de retorno"
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
            overdueCount > 0 ? 'text-[#7F1D1D]' : todayCount > 0 ? 'text-[#92400E]' : 'text-[#3E546B]'
          }`}>
            Agenda / Retornos
          </span>
          {overdueCount > 0 ? (
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          ) : todayCount > 0 ? (
            <Bell className="w-4 h-4 text-[#D97706] animate-bounce" />
          ) : (
            <Calendar className="w-4 h-4 text-[#00A3BF]" />
          )}
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className={`text-[22px] sm:text-[26px] font-extrabold font-mono tabular-nums leading-none ${
            overdueCount > 0 ? 'text-[#DC2626]' : todayCount > 0 ? 'text-[#D97706]' : 'text-[#0A2540]'
          }`}>
            {contactsWithReminders.length}
          </span>
          <span className="text-[10px] font-mono font-medium text-[#3E546B]">
            {overdueCount > 0 ? (
              <span className="text-[#DC2626] font-bold">{overdueCount} atrasado{overdueCount > 1 ? 's' : ''}</span>
            ) : todayCount > 0 ? (
              <span className="text-[#D97706] font-bold">{todayCount} para hoje</span>
            ) : (
              <span>{upcomingCount} agendado{upcomingCount > 1 ? 's' : ''}</span>
            )}
          </span>
        </div>
      </div>

    </div>
  );
};
