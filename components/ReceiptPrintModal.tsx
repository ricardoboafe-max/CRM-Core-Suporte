import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { WorkOrderItem, Contact } from '@/types/crm';
import { numberToWordsBRL } from '@/lib/service-catalog';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';

interface ReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrderItem | null;
  contact: Contact;
  customAmount?: number;
  customDescription?: string;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  contact,
  customAmount,
  customDescription
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [randomId] = useState(() => Math.floor(1000 + Math.random() * 9000));

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = customAmount !== undefined 
    ? customAmount 
    : (workOrder?.value || contact.dealValue || 150);

  const amountInWords = numberToWordsBRL(amount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2
    }).format(val);
  };

  const receiptNumber = workOrder 
    ? `REC-${workOrder.id.replace(/\D/g, '') || '010'}`
    : `REC-${randomId}`;

  const serviceDescription = customDescription 
    || (workOrder ? `${workOrder.title} (OS: ${workOrder.id} - Equipamento: ${workOrder.equipmentCode})` : 'Serviços especializados de suporte e manutenção de informática');

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A2540]/75 backdrop-blur-[2px] overflow-y-auto">
      
      <div 
        className="w-full max-w-3xl bg-white rounded-[8px] shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden border border-[#BAC7D5]"
        role="dialog"
      >
        
        {/* Top bar (hidden in print) */}
        <div className="print:hidden bg-[#0A2540] text-white px-5 py-3 flex items-center justify-between border-b border-[#BAC7D5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 relative shrink-0">
              <Image
                src="/assets/aistudio/coreSuporte_semFundo_10bdb136.png"
                alt="Core Suporte"
                width={151}
                height={157}
                className="w-7 h-7 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] font-sans uppercase">
                Recibo de Pagamento de Serviços // {receiptNumber}
              </h3>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Core Suporte • Tecnologia em Boas Mãos • (31) 9 9372-4609
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#00A3BF] hover:bg-[#008ea6] text-[#000F22] rounded-[4px] font-bold font-mono text-[13px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Imprimir Recibo (A4 / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[#A2B5CC] hover:text-white hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-[#F4F6F9] print:bg-white print:p-0">
          <div 
            ref={printAreaRef}
            className="max-w-[720px] mx-auto bg-white border border-[#D8E0E9] print:border-none p-6 sm:p-10 shadow-sm print:shadow-none text-[#161C24] font-sans"
            id="printable-receipt-sheet"
          >
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b-2 border-[#0A2540] pb-4 gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-[160px] h-[70px] relative shrink-0">
                  <Image
                    src="/assets/aistudio/coreSuporte_logo_fundo_36ae5b97.png"
                    alt="Core Suporte"
                    width={494}
                    height={274}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </div>
                <div>
                  <h1 className="font-extrabold text-[16px] text-[#0A2540] uppercase">
                    CORE SUPORTE INFORMÁTICA
                  </h1>
                  <p className="text-[12px] font-semibold text-[#00687A]">
                    Tecnologia em Boas Mãos
                  </p>
                  <p className="text-[11px] text-[#43474D] font-mono">
                    Plantão Técnico: <strong>(31) 9 9372-4609</strong>
                  </p>
                  <p className="text-[10px] text-[#74777E] font-mono">
                    CNPJ: 45.192.830/0001-92 • Belo Horizonte - MG
                  </p>
                </div>
              </div>

              {/* Number and Value Badge */}
              <div className="bg-[#F8F9FF] border border-[#BAC7D5] rounded-[4px] p-3 text-center sm:text-right min-w-[200px]">
                <span className="text-[10px] font-mono font-bold text-[#74777E] uppercase block">
                  RECIBO DE PAGAMENTO Nº
                </span>
                <span className="text-[16px] font-bold text-[#0A2540] font-mono block">
                  {receiptNumber}
                </span>
                <div className="mt-1.5 pt-1.5 border-t border-[#BAC7D5]">
                  <span className="text-[10px] font-mono font-bold text-[#74777E] uppercase block">
                    VALOR TOTAL:
                  </span>
                  <span className="text-[22px] font-extrabold text-[#14532D] font-mono tabular-nums block">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Main Declaration Body */}
            <div className="mt-6 space-y-4 text-[13px] leading-relaxed text-[#161C24]">
              
              <div className="bg-[#FAFCFF] border border-[#BAC7D5] p-4 rounded-[4px] font-mono text-[13px] leading-loose">
                <p>
                  Recebemos de <strong>{contact.name.toUpperCase()}</strong>
                  {contact.documentId ? <>, inscrito(a) no CPF/CNPJ nº <strong>{contact.documentId}</strong></> : ''},
                  {contact.company && contact.company !== 'Empresa Particular' ? <>, da empresa <strong>{contact.company}</strong></> : ''}
                </p>

                <p className="mt-2">
                  A quantia de <strong>{formatCurrency(amount)}</strong> ({amountInWords}),
                </p>

                <p className="mt-2">
                  Referente a: <strong>{serviceDescription}</strong>.
                </p>

                {workOrder?.paymentMethod && (
                  <p className="mt-2 text-[12px] text-[#00687A]">
                    Forma de Pagamento: <strong>{workOrder.paymentMethod}</strong> (Quitado integralmente).
                  </p>
                )}
              </div>

              <p className="text-[12px] text-[#43474D] font-mono text-center sm:text-right pt-4">
                Belo Horizonte - MG, {todayStr}.
              </p>

            </div>

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center font-mono text-[11px]">
              <div>
                <div className="border-t border-[#161C24] pt-2">
                  <p className="font-bold text-[#0A2540]">CORE SUPORTE INFORMÁTICA</p>
                  <p className="text-[10px] text-[#74777E]">CNPJ: 45.192.830/0001-92</p>
                  <p className="text-[10px] text-[#00687A]">Emitente / Responsável Técnico</p>
                </div>
              </div>

              <div>
                <div className="border-t border-[#161C24] pt-2">
                  <p className="font-bold text-[#0A2540]">{contact.name}</p>
                  <p className="text-[10px] text-[#74777E]">
                    {contact.documentId ? `Documento: ${contact.documentId}` : 'Assinatura do Pagador'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-3 border-t border-[#D8E0E9] flex items-center justify-between text-[10px] font-mono text-[#74777E]">
              <span>Core Suporte • Tecnologia em Boas Mãos • (31) 9 9372-4609</span>
              <span>Documento de comprovação de quitação de serviços</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
