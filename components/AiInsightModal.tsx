import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Contact } from '@/types/crm';
import { 
  X, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  RotateCcw, 
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface AiInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  initialAction?: 'briefing' | 'draft_email' | 'draft_whatsapp';
}

interface InnerProps {
  onClose: () => void;
  contact: Contact;
  initialAction: 'briefing' | 'draft_email' | 'draft_whatsapp';
}

const AiInsightModalInner: React.FC<InnerProps> = ({ onClose, contact, initialAction }) => {
  const [actionType, setActionType] = useState<'briefing' | 'draft_email' | 'draft_whatsapp'>(initialAction);
  const [loading, setLoading] = useState(true);
  const [responseContent, setResponseContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        const res = await fetch('/api/ai-crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact,
            actionType
          })
        });

        const data = await res.json();
        if (isCancelled) return;

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao comunicar com a inteligência artificial');
        }

        setResponseContent(data.content || data.summary || 'Nenhum resultado retornado.');
      } catch (err: unknown) {
        if (isCancelled) return;
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : 'Falha ao processar solicitação de IA.');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [contact, actionType, reloadCounter]);

  const handleActionChange = (action: 'briefing' | 'draft_email' | 'draft_whatsapp') => {
    setLoading(true);
    setResponseContent('');
    setErrorMsg('');
    setActionType(action);
  };

  const handleRefresh = () => {
    setLoading(true);
    setResponseContent('');
    setErrorMsg('');
    setReloadCounter(prev => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsAppWithDraft = () => {
    if (!contact.whatsapp) return;
    const cleanNumber = contact.whatsapp.replace(/\D/g, '');
    const encoded = encodeURIComponent(responseContent);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  const handleOpenEmailWithDraft = () => {
    if (!contact.email) return;
    const subject = encodeURIComponent(`[${contact.code}] Alinhamento Operacional - ${contact.company}`);
    const body = encodeURIComponent(responseContent);
    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, '_blank');
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
            <h3 className="font-extrabold text-[15px] uppercase tracking-wide font-sans">
              Assistente de IA // Core Suporte
            </h3>
            <p className="text-[11px] text-[#A2B5CC] font-mono">
              Tecnologia em Boas Mãos • Análise: {contact.name} ({contact.code})
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

      {/* Action Selection Tabs */}
      <div className="flex items-center gap-1.5 p-3 bg-[#EFF4FF] border-b border-[#BAC7D5]">
        <button
          onClick={() => handleActionChange('briefing')}
          className={`px-3 py-1.5 rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors ${
            actionType === 'briefing'
              ? 'bg-[#0A2540] text-white shadow-xs'
              : 'bg-white border border-[#BAC7D5] text-[#3E546B] hover:bg-[#F4F6F9]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00A3BF]" />
          <span>Briefing & Risco</span>
        </button>

        <button
          onClick={() => handleActionChange('draft_email')}
          className={`px-3 py-1.5 rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors ${
            actionType === 'draft_email'
              ? 'bg-[#0A2540] text-white shadow-xs'
              : 'bg-white border border-[#BAC7D5] text-[#3E546B] hover:bg-[#F4F6F9]'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Proposta / E-mail Formal</span>
        </button>

        <button
          onClick={() => handleActionChange('draft_whatsapp')}
          className={`px-3 py-1.5 rounded-[4px] text-[12px] font-bold font-mono flex items-center gap-1.5 transition-colors ${
            actionType === 'draft_whatsapp'
              ? 'bg-[#0A2540] text-white shadow-xs'
              : 'bg-white border border-[#BAC7D5] text-[#3E546B] hover:bg-[#F4F6F9]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Mensagem WhatsApp</span>
        </button>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="ml-auto p-1.5 text-[#3E546B] hover:text-[#0A2540] hover:bg-white rounded-[4px] transition-colors"
          title="Regenerar análise com IA"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 overflow-y-auto flex-1 bg-[#F8F9FF]">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#00A3BF] animate-spin mx-auto mb-3" />
            <p className="font-bold text-[14px] text-[#0A2540] font-sans">
              Processando histórico e telemetria do contato...
            </p>
            <p className="text-[12px] text-[#43474D] font-mono mt-1">
              Consultando dados operacionais e ordens de serviço ativas.
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-[#FEE2E2] border border-[#DC2626] rounded-[4px] text-[#7F1D1D] text-[13px]">
            <p className="font-bold mb-1">Não foi possível completar a geração:</p>
            <p className="font-mono text-[12px]">{errorMsg}</p>
            <button
              onClick={handleRefresh}
              className="mt-3 px-3 py-1 bg-[#DC2626] text-white font-bold text-[11px] font-mono rounded-[3px]"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-4 text-[13px] leading-relaxed text-[#161C24] whitespace-pre-wrap font-sans shadow-xs">
              {responseContent}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-[#BAC7D5] p-3 sm:px-5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={loading || !responseContent}
            className="px-3.5 py-1.5 bg-[#F4F6F9] hover:bg-[#E9EEFA] border border-[#BAC7D5] text-[#0A2540] font-mono font-bold text-[12px] rounded-[4px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Texto Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#3E546B]" />
                <span>Copiar Conteúdo</span>
              </>
            )}
          </button>

          {actionType === 'draft_whatsapp' && contact.whatsapp && (
            <button
              onClick={handleOpenWhatsAppWithDraft}
              disabled={loading || !responseContent}
              className="px-3.5 py-1.5 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] font-mono font-bold text-[12px] rounded-[4px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Abrir no WhatsApp</span>
            </button>
          )}

          {actionType === 'draft_email' && contact.email && (
            <button
              onClick={handleOpenEmailWithDraft}
              disabled={loading || !responseContent}
              className="px-3.5 py-1.5 bg-[#E0F2FE] hover:bg-[#b9e6f3] border border-[#0284C7] text-[#034975] font-mono font-bold text-[12px] rounded-[4px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Abrir no Cliente de E-mail</span>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white font-mono font-bold text-[12px] rounded-[4px] transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export const AiInsightModal: React.FC<AiInsightModalProps> = ({
  isOpen,
  onClose,
  contact,
  initialAction = 'briefing'
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/65 backdrop-blur-[2px]">
      <AiInsightModalInner
        key={`${contact.id}-${initialAction}`}
        onClose={onClose}
        contact={contact}
        initialAction={initialAction}
      />
    </div>
  );
};
