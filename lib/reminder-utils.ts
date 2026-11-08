export type ReminderStatus = 'overdue' | 'today' | 'upcoming';

export interface ReminderInfo {
  status: ReminderStatus;
  label: string;
  formattedDate: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  daysDiff: number;
}

/**
 * Retorna o status de agendamento/retorno de um contato comparando com a data atual.
 * A comparação é feita no formato de data pura (YYYY-MM-DD) para evitar problemas de fuso horário.
 */
export function getReminderInfo(returnDate?: string): ReminderInfo | null {
  if (!returnDate || !returnDate.trim()) return null;

  const cleanDate = returnDate.trim().split('T')[0];
  const match = cleanDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

  // Formato brasileiro DD/MM/AAAA
  const formattedDate = `${match[3]}/${match[2]}/${match[1]}`;

  // Cálculo da diferença em dias
  const targetDateObj = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
  const todayDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = targetDateObj.getTime() - todayDateObj.getTime();
  const daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (cleanDate < todayStr) {
    const overdueDays = Math.abs(daysDiff);
    return {
      status: 'overdue',
      label: overdueDays === 1 ? 'Atrasado 1 dia' : `Atrasado ${overdueDays} dias`,
      formattedDate,
      badgeBg: 'bg-[#FEE2E2]',
      badgeText: 'text-[#991B1B]',
      borderColor: 'border-[#DC2626]',
      daysDiff
    };
  }

  if (cleanDate === todayStr) {
    return {
      status: 'today',
      label: 'Retorno Hoje!',
      formattedDate,
      badgeBg: 'bg-[#FEF3C7]',
      badgeText: 'text-[#92400E]',
      borderColor: 'border-[#D97706]',
      daysDiff: 0
    };
  }

  return {
    status: 'upcoming',
    label: daysDiff === 1 ? 'Amanhã' : `Em ${daysDiff} dias`,
    formattedDate,
    badgeBg: 'bg-[#E0F2FE]',
    badgeText: 'text-[#0369A1]',
    borderColor: 'border-[#0284C7]',
    daysDiff
  };
}

/**
 * Gera datas rápidas em formato YYYY-MM-DD
 */
export function getQuickDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
