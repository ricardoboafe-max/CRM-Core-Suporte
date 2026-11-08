import React from 'react';
import { Contact } from '@/types/crm';
import { StatusBadge } from './StatusBadge';
import { 
  Building, 
  MapPin, 
  Wrench, 
  DollarSign, 
  Phone, 
  MessageSquare,
  Calendar,
  Clock,
  Bell,
  AlertCircle
} from 'lucide-react';
import { getReminderInfo } from '@/lib/reminder-utils';

interface ContactListItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (contact: Contact) => void;
}

export const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  isSelected,
  onSelect
}) => {
  const activeOsCount = contact.workOrders?.filter(w => w.status !== 'Concluída').length || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const reminder = getReminderInfo(contact.returnDate);
  const borderHighlight = reminder?.status === 'overdue'
    ? 'border-l-4 border-l-[#DC2626]'
    : reminder?.status === 'today'
    ? 'border-l-4 border-l-[#D97706]'
    : '';

  return (
    <div
      onClick={() => onSelect(contact)}
      role="button"
      tabIndex={0}
      className={`group w-full text-left p-3.5 rounded-[4px] border transition-all cursor-pointer select-none mb-2 ${borderHighlight} ${
        isSelected
          ? 'bg-[#EFF4FF] border-[#00A3BF] shadow-[0px_2px_4px_rgba(0,163,191,0.12)] ring-1 ring-[#00A3BF]'
          : 'bg-white border-[#D8E0E9] hover:border-[#BAC7D5] hover:bg-[#F8F9FF]'
      }`}
    >
      {/* Top Header: Code, Type & Status */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-bold text-[#00687A] bg-[#E0F2FE] px-1.5 py-0.5 rounded-[3px] border border-[#BAC7D5]">
            {contact.code}
          </span>
          <span className="text-[11px] font-bold text-[#3E546B] uppercase font-mono">
            {contact.type}
          </span>
        </div>

        <StatusBadge status={contact.status} size="sm" />
      </div>

      {/* Main Info: Name & Role */}
      <div className="mb-1.5">
        <div className="flex items-baseline justify-between gap-1">
          <h3 className="font-bold text-[15px] text-[#0A2540] group-hover:text-[#00687A] transition-colors leading-snug">
            {contact.name}
          </h3>
          {contact.priority === 'Crítica' && (
            <span className="shrink-0 px-1.5 py-0.2 rounded-[2px] bg-[#FEE2E2] border border-[#DC2626] text-[#7F1D1D] font-mono font-bold text-[10px] uppercase">
              Urgente
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-[#43474D] mt-0.5">
          <Building className="w-3.5 h-3.5 text-[#74777E] shrink-0" />
          <span className="font-semibold text-[#161C24] truncate">{contact.company}</span>
          <span className="text-[#A2B5CC]">•</span>
          <span className="text-[12px] text-[#43474D] truncate">{contact.role}</span>
        </div>
      </div>

      {/* Return Date / Reminder Alert Banner if set */}
      {reminder && (
        <div className={`my-1.5 p-1.5 rounded-[3px] border ${reminder.badgeBg} ${reminder.borderColor} text-[11px] font-mono flex flex-col gap-0.5`}>
          <div className="flex items-center justify-between gap-1 font-bold">
            <span className={`flex items-center gap-1 ${reminder.badgeText}`}>
              {reminder.status === 'overdue' ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
              ) : reminder.status === 'today' ? (
                <Bell className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              )}
              <span>{reminder.label}</span>
            </span>
            <span className={`${reminder.badgeText} text-[10px]`}>
              {reminder.formattedDate}
            </span>
          </div>
          {contact.reminderNotes && (
            <div className="flex items-start gap-1 text-[10px] text-[#4B5563] pt-0.5 leading-tight">
              <Clock className="w-3 h-3 text-[#6B7280] shrink-0 mt-0.5" />
              <span className="line-clamp-1 italic">{contact.reminderNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1 text-[11px] text-[#43474D] mb-2 font-mono truncate">
        <MapPin className="w-3 h-3 text-[#3E546B] shrink-0" />
        <span className="truncate">{contact.location}</span>
      </div>

      {/* Key-Value Footer Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E9EEFA] text-[11px] font-mono text-[#3E546B]">
        {/* Work Orders */}
        <div className="flex items-center gap-1">
          <Wrench className={`w-3.5 h-3.5 ${activeOsCount > 0 ? 'text-[#0284C7]' : 'text-[#74777E]'}`} />
          <span className={activeOsCount > 0 ? 'font-bold text-[#034975]' : ''}>
            {activeOsCount} OS {activeOsCount === 1 ? 'ativa' : 'ativas'}
          </span>
        </div>

        {/* Contract Value */}
        {contact.dealValue > 0 ? (
          <div className="flex items-center gap-1 text-[#14532D] font-bold tabular-nums">
            <DollarSign className="w-3 h-3 text-[#16A34A]" />
            <span>{formatCurrency(contact.dealValue)}</span>
          </div>
        ) : (
          <span className="text-[#74777E] italic">Sem contrato financeiro</span>
        )}
      </div>

      {/* Quick Action Ribbon on Hover (Desktop) */}
      <div className="mt-2 pt-2 border-t border-dashed border-[#D8E0E9] flex items-center justify-end gap-2 opacity-90">
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 bg-white hover:bg-[#EFF4FF] border border-[#D8E0E9] rounded-[3px] text-[11px] font-mono font-medium text-[#0A2540] flex items-center gap-1 transition-colors"
            title={`Ligar para ${contact.phone}`}
          >
            <Phone className="w-3 h-3 text-[#00A3BF]" />
            <span>Ligar</span>
          </a>
        )}
        {contact.whatsapp && (
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] rounded-[3px] text-[11px] font-mono font-bold text-[#14532D] flex items-center gap-1 transition-colors"
            title="Abrir WhatsApp"
          >
            <MessageSquare className="w-3 h-3 text-[#16A34A]" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
};
