import React from 'react';
import { ContactType } from '@/types/crm';
import { ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface CrmFiltersProps {
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  reminderFilter: string;
  onReminderFilterChange: (reminder: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Clientes', value: 'Cliente' },
  { label: 'Leads', value: 'Lead' },
  { label: 'Engenheiros de Campo', value: 'Engenheiro de Campo' },
  { label: 'Técnicos', value: 'Técnico Especialista' },
  { label: 'Fornecedores', value: 'Fornecedor' },
  { label: 'Parceiros', value: 'Parceiro' },
];

export const CrmFilters: React.FC<CrmFiltersProps> = ({
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  reminderFilter,
  onReminderFilterChange,
  sortBy,
  onSortByChange,
  filteredCount,
  totalCount,
  onClearFilters,
}) => {
  const hasActiveFilters = 
    typeFilter !== 'Todos' || 
    statusFilter !== 'Todos' || 
    priorityFilter !== 'Todas' ||
    reminderFilter !== 'Todos';

  return (
    <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-2.5 sm:p-3 mb-3 shadow-[0px_1px_2px_rgba(10,37,64,0.04)]">
      
      {/* Top row: Type Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E9EEFA] no-scrollbar">
        <span className="text-[11px] font-bold uppercase text-[#3E546B] font-mono mr-1 hidden sm:inline whitespace-nowrap">
          Tipo:
        </span>
        {TYPE_OPTIONS.map((item) => {
          const isActive = typeFilter === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onTypeFilterChange(item.value)}
              className={`px-2.5 py-1 text-[12px] font-bold rounded-[3px] whitespace-nowrap transition-colors select-none font-sans ${
                isActive
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'bg-[#EFF4FF] text-[#161C24] hover:bg-[#DDE3EE] border border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Bottom row: Status, Priority, Sort dropdowns & item counter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 text-[12px]">
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-[#3E546B]">
            <Filter className="w-3.5 h-3.5 text-[#00A3BF]" />
            <span className="text-[11px] font-bold uppercase font-mono hidden md:inline">Filtros:</span>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-8 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[12px] focus:border-[#00A3BF] outline-none"
          >
            <option value="Todos">Status: Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Em Execução">Em Execução</option>
            <option value="Pendente">Pendente</option>
            <option value="Aguardando Retorno">Aguardando Retorno</option>
            <option value="Inativo">Inativo</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="h-8 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[12px] focus:border-[#00A3BF] outline-none"
          >
            <option value="Todas">Prioridade: Todas</option>
            <option value="Crítica">Crítica (Urgente)</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          {/* Reminder / Agenda Filter Dropdown */}
          <select
            value={reminderFilter}
            onChange={(e) => onReminderFilterChange(e.target.value)}
            className={`h-8 px-2 border rounded-[4px] font-medium text-[12px] outline-none transition-colors ${
              reminderFilter !== 'Todos'
                ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0369A1] font-bold'
                : 'bg-[#F4F6F9] border-[#BAC7D5] text-[#161C24] focus:border-[#00A3BF]'
            }`}
          >
            <option value="Todos">Agenda: Todas</option>
            <option value="com-retorno">📅 Com Retorno Agendado</option>
            <option value="hoje">🔔 Retorno Hoje!</option>
            <option value="atrasado">⚠️ Retornos Atrasados</option>
            <option value="sem-retorno">Sem Retorno Agendado</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="h-8 px-2 text-[#7F1D1D] hover:bg-[#FEE2E2] rounded-[4px] flex items-center gap-1 text-[11px] font-mono font-bold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Right side: Sorting & Count */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#3E546B]" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="h-8 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium text-[12px] focus:border-[#00A3BF] outline-none font-mono"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name-asc">Nome (A - Z)</option>
              <option value="value-desc">Maior Valor (R$)</option>
              <option value="priority-desc">Maior Prioridade</option>
            </select>
          </div>

          <span className="text-[11px] text-[#3E546B] font-mono tabular-nums bg-[#F4F6F9] px-2 py-1 rounded-[3px] border border-[#D8E0E9]">
            Exibindo <strong className="text-[#0A2540]">{filteredCount}</strong> de {totalCount}
          </span>
        </div>

      </div>
    </div>
  );
};
