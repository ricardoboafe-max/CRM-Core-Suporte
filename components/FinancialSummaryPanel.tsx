import React, { useState, useMemo } from 'react';
import { Contact, WorkOrderItem } from '@/types/crm';
import { 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

interface FinancialSummaryPanelProps {
  contacts: Contact[];
  onSelectContact?: (contact: Contact) => void;
}

export const FinancialSummaryPanel: React.FC<FinancialSummaryPanelProps> = ({ contacts, onSelectContact }) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Extrai todas as Ordens de Serviço associadas aos contatos do sistema
  const allWorkOrders = useMemo(() => {
    const list: Array<{ order: WorkOrderItem; contact: Contact }> = [];
    contacts.forEach(c => {
      (c.workOrders || []).forEach(w => {
        list.push({ order: w, contact: c });
      });
    });
    return list;
  }, [contacts]);

  // Filtra apenas as Ordens de Serviço com status 'Concluída'
  const finalizedWorkOrders = useMemo(() => {
    return allWorkOrders.filter(item => item.order.status === 'Concluída');
  }, [allWorkOrders]);

  // Total acumulado em Reais das Ordens de Serviço finalizadas
  const totalFinalizedValue = useMemo(() => {
    return finalizedWorkOrders.reduce((sum, item) => sum + (item.order.value || 0), 0);
  }, [finalizedWorkOrders]);

  // Ordens de Serviço ainda em andamento / pendentes
  const inProgressWorkOrders = useMemo(() => {
    return allWorkOrders.filter(item => item.order.status !== 'Concluída');
  }, [allWorkOrders]);

  const totalInProgressValue = useMemo(() => {
    return inProgressWorkOrders.reduce((sum, item) => sum + (item.order.value || 0), 0);
  }, [inProgressWorkOrders]);

  // Ticket Médio por OS Concluída
  const averageFinalizedTicket = useMemo(() => {
    return finalizedWorkOrders.length > 0 
      ? totalFinalizedValue / finalizedWorkOrders.length 
      : 0;
  }, [finalizedWorkOrders, totalFinalizedValue]);

  // Métodos de Pagamento das OS Concluídas
  const paymentBreakdown = useMemo(() => {
    const counts: Record<string, { count: number; total: number }> = {};
    finalizedWorkOrders.forEach(item => {
      const method = item.order.paymentMethod || 'Pix';
      if (!counts[method]) {
        counts[method] = { count: 0, total: 0 };
      }
      counts[method].count += 1;
      counts[method].total += item.order.value || 0;
    });
    return Object.entries(counts);
  }, [finalizedWorkOrders]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="bg-white border border-[#D8E0E9] rounded-[6px] shadow-[0px_2px_4px_rgba(10,37,64,0.04)] my-3 overflow-hidden">
      
      {/* Banner Principal de Faturamento / Resumo Financeiro */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#0A2540] via-[#0F3254] to-[#123E68] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Card de Destaque Principal: Total Acumulado */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-[6px] bg-[#16A34A]/20 border border-[#16A34A]/50 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-[#4ade80]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#93C5FD]">
                  Faturamento Realizado // Ordens de Serviço Finalizadas
                </span>
                <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded-[3px] text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  {finalizedWorkOrders.length} {finalizedWorkOrders.length === 1 ? 'OS Finalizada' : 'OSs Finalizadas'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h2 className="text-[26px] sm:text-[32px] font-extrabold text-white font-mono tabular-nums tracking-tight" suppressHydrationWarning>
                  {formatCurrency(totalFinalizedValue)}
                </h2>
                <span className="text-[12px] text-[#A2B5CC] font-mono hidden sm:inline">
                  total acumulado no sistema
                </span>
              </div>
            </div>
          </div>

          {/* Sub-KPIs de Apoio Financeiro */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap border-t md:border-t-0 md:border-l border-[#3E546B]/60 pt-3 md:pt-0 md:pl-5">
            
            {/* Ticket Médio */}
            <div className="bg-[#000F22]/40 border border-[#3E546B]/40 px-3 py-1.5 rounded-[4px] min-w-[130px]">
              <div className="text-[10px] font-mono uppercase text-[#A2B5CC] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#00A3BF]" />
                <span>Ticket Médio</span>
              </div>
              <div className="text-[15px] font-mono font-bold text-[#38BDF8] tabular-nums mt-0.5" suppressHydrationWarning>
                {formatCurrency(averageFinalizedTicket)}
              </div>
            </div>

            {/* Em Execução / A Faturar */}
            <div className="bg-[#000F22]/40 border border-[#3E546B]/40 px-3 py-1.5 rounded-[4px] min-w-[130px]">
              <div className="text-[10px] font-mono uppercase text-[#A2B5CC] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FBBF24]" />
                <span>A Faturar ({inProgressWorkOrders.length} OS)</span>
              </div>
              <div className="text-[15px] font-mono font-bold text-[#FCD34D] tabular-nums mt-0.5" suppressHydrationWarning>
                {formatCurrency(totalInProgressValue)}
              </div>
            </div>

            {/* Toggle de Detalhamento */}
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="h-9 px-3 bg-[#00A3BF]/15 hover:bg-[#00A3BF]/25 border border-[#00A3BF]/40 text-[#67E8F9] hover:text-white rounded-[4px] font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors self-end md:self-auto ml-auto md:ml-0"
              title="Ver detalhes de cada Ordem de Serviço finalizada"
            >
              <span>{isDetailsExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes das OSs'}</span>
              {isDetailsExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Painel Expansível: Detalhamento das OSs Finalizadas */}
      {isDetailsExpanded && (
        <div className="p-4 bg-[#F8FAFC] border-t border-[#BAC7D5] animate-in fade-in duration-150">
          
          {/* Formas de Pagamento Recebidas */}
          {paymentBreakdown.length > 0 && (
            <div className="mb-3.5 pb-3 border-b border-[#E2E8F0] flex items-center gap-2 flex-wrap text-[11px] font-mono">
              <span className="font-bold text-[#0A2540] flex items-center gap-1 uppercase">
                <CreditCard className="w-3.5 h-3.5 text-[#00687A]" />
                Distribuição de Pagamentos:
              </span>
              {paymentBreakdown.map(([method, data]) => (
                <span 
                  key={method}
                  className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded-[4px] text-[#334155] font-semibold flex items-center gap-1.5"
                >
                  <span className="text-[#0A2540]">{method}:</span>
                  <strong className="text-[#15803D]">{formatCurrency(data.total)}</strong>
                  <span className="text-[10px] text-[#64748B]">({data.count})</span>
                </span>
              ))}
            </div>
          )}

          {/* Tabela / Lista de OSs Finalizadas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#475569] font-bold uppercase">
              <span>Relação de Ordens de Serviço Concluídas ({finalizedWorkOrders.length})</span>
              <span>Total: {formatCurrency(totalFinalizedValue)}</span>
            </div>

            {finalizedWorkOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {finalizedWorkOrders.map(({ order, contact }) => (
                  <div
                    key={order.id}
                    onClick={() => onSelectContact && onSelectContact(contact)}
                    className="p-3 bg-white border border-[#CBD5E1] hover:border-[#00A3BF] rounded-[4px] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-[12px] text-[#0A2540] group-hover:text-[#00687A]">
                          {order.id}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#DCFCE7] text-[#14532D] text-[10px] font-mono font-bold rounded-[2px]">
                          Concluída
                        </span>
                        {order.paymentMethod && (
                          <span className="text-[10px] font-mono text-[#64748B]">
                            • {order.paymentMethod}
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] font-bold text-[#1E293B] truncate leading-tight">
                        {order.title}
                      </div>

                      <div className="text-[11px] text-[#64748B] font-mono truncate mt-0.5">
                        Cliente: <strong className="text-[#334155]">{contact.name}</strong> • {order.equipmentCode}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[15px] font-extrabold text-[#15803D] font-mono tabular-nums">
                        {formatCurrency(order.value)}
                      </div>
                      <div className="text-[10px] text-[#64748B] font-mono">
                        {order.scheduledDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white border border-dashed border-[#CBD5E1] rounded-[4px] text-center text-[#64748B] font-mono text-[12px]">
                Nenhuma Ordem de Serviço concluída até o momento.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
