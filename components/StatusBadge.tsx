import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.trim();

  let styles = 'bg-[#E9EEFA] border-[#D8E0E9] text-[#161C24]'; // default

  if (norm === 'Pendente' || norm === 'Aguardando Retorno' || norm === 'Lead Inicial') {
    // Amber Warning
    styles = 'bg-[#FEF3C7] border-[#F59E0B] text-[#78350F]';
  } else if (norm === 'Em Execução' || norm === 'Em Negociação' || norm === 'Proposta Técnica') {
    // Tech Blue Progress
    styles = 'bg-[#E0F2FE] border-[#0284C7] text-[#034975]';
  } else if (norm === 'Aguardando Peças') {
    // Deep Violet Handoff
    styles = 'bg-[#F3E8FF] border-[#9333EA] text-[#581C87]';
  } else if (norm === 'Concluída' || norm === 'Ativo' || norm === 'Contrato Ativo' || norm === 'Em Operação') {
    // High-Visibility Emerald
    styles = 'bg-[#DCFCE7] border-[#16A34A] text-[#14532D]';
  } else if (norm === 'Crítica / Atrasada' || norm === 'Crítica' || norm === 'Inativo' || norm === 'Urgente') {
    // Urgent Crimson
    styles = 'bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]';
  }

  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-[12px]';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider border rounded-[4px] font-mono tabular-nums select-none ${padding} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-[1px] bg-current opacity-80" />
      {norm}
    </span>
  );
};
