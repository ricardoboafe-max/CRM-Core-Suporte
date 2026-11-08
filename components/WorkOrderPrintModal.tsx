import React, { useRef } from 'react';
import Image from 'next/image';
import { WorkOrderItem, Contact } from '@/types/crm';
import { X, Printer, CheckCircle2, Shield, Wrench, PhoneCall } from 'lucide-react';

interface WorkOrderPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrderItem;
  contact: Contact;
}

export const WorkOrderPrintModal: React.FC<WorkOrderPrintModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  contact
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2
    }).format(val);
  };

  const entryDate = workOrder.scheduledDate || new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A2540]/75 backdrop-blur-[2px] overflow-y-auto">
      
      {/* Container modal */}
      <div 
        className="w-full max-w-4xl bg-white rounded-[8px] shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden border border-[#BAC7D5]"
        role="dialog"
      >
        
        {/* Modal Top Bar (Hidden on print) */}
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
                Impressão da Ordem de Serviço // {workOrder.id}
              </h3>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Core Suporte • Tecnologia em Boas Mãos • (31) 9 9372-4609
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#00A3BF] hover:bg-[#008ea6] active:bg-[#00687A] text-[#000F22] rounded-[4px] font-bold font-mono text-[13px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Imprimir OS (A4 / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[#A2B5CC] hover:text-white hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-[#F4F6F9] print:bg-white print:p-0">
          
          <div 
            ref={printAreaRef}
            className="max-w-[800px] mx-auto bg-white border border-[#D8E0E9] print:border-none p-6 sm:p-10 shadow-sm print:shadow-none text-[#161C24] font-sans leading-normal"
            id="printable-os-sheet"
          >
            
            {/* Header: Logo, Company Info & OS Number */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b-2 border-[#0A2540] pb-4 gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-[170px] h-[75px] relative shrink-0">
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
                  <h1 className="font-extrabold text-[16px] text-[#0A2540] tracking-tight uppercase">
                    CORE SUPORTE INFORMÁTICA
                  </h1>
                  <p className="text-[12px] font-semibold text-[#00687A]">
                    Manutenção Especializada de Computadores, Notebooks e Redes
                  </p>
                  <p className="text-[11px] text-[#43474D] font-mono mt-0.5">
                    Plantão Técnico: <strong>(31) 9 9372-4609</strong> • Belo Horizonte - MG
                  </p>
                  <p className="text-[10px] text-[#74777E] font-mono">
                    CNPJ: 45.192.830/0001-92 • atendimento@coresuporte.com.br
                  </p>
                </div>
              </div>

              {/* OS Identification Box */}
              <div className="bg-[#F8F9FF] border border-[#BAC7D5] rounded-[4px] p-3 text-center sm:text-right min-w-[190px]">
                <span className="text-[10px] font-mono font-bold text-[#74777E] uppercase block">
                  ORDEM DE SERVIÇO Nº
                </span>
                <span className="text-[20px] font-extrabold text-[#0A2540] font-mono block tracking-wider">
                  {workOrder.id}
                </span>
                <div className="mt-1 pt-1 border-t border-[#BAC7D5] text-[11px] font-mono text-[#3E546B]">
                  <div>Emissão: <strong>{entryDate}</strong></div>
                  <div>Status: <strong className="text-[#00687A]">{workOrder.status}</strong></div>
                </div>
              </div>
            </div>

            {/* Section 1: Customer Data */}
            <div className="mt-4 border border-[#BAC7D5] rounded-[4px] overflow-hidden">
              <div className="bg-[#0A2540] text-white px-3 py-1 font-mono font-bold text-[11px] uppercase flex items-center justify-between">
                <span>1. Dados do Cliente</span>
                <span className="font-mono text-[#6AE1FF]">Código: {contact.code}</span>
              </div>
              
              <div className="p-3 text-[12px] grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono bg-[#FAFCFF]">
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Cliente / Razão Social:</span>
                  <span className="font-bold text-[#0A2540] text-[13px]">{contact.name}</span>
                  {contact.company && contact.company !== 'Empresa Particular' && (
                    <span className="text-[#43474D] block text-[11px]">Empresa: {contact.company}</span>
                  )}
                </div>

                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">CPF / CNPJ:</span>
                  <span className="font-bold text-[#161C24]">{contact.documentId || 'Não informado'}</span>
                </div>

                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Telefone / WhatsApp:</span>
                  <span className="font-bold text-[#161C24]">{contact.phone || contact.whatsapp || 'Não informado'}</span>
                </div>

                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">E-mail:</span>
                  <span className="font-medium text-[#161C24]">{contact.email || 'Não informado'}</span>
                </div>

                <div className="sm:col-span-2 pt-1 border-t border-[#E9EEFA]">
                  <span className="text-[#74777E] text-[10px] uppercase block">Endereço de Atendimento / Entrega:</span>
                  <span className="font-medium text-[#161C24]">
                    {contact.street ? (
                      <>
                        {contact.street}{contact.number ? `, nº ${contact.number}` : ''}
                        {contact.complement ? ` - ${contact.complement}` : ''}
                        {contact.neighborhood ? ` - Bairro ${contact.neighborhood}` : ''}
                        {contact.city ? ` - ${contact.city}/${contact.state || 'MG'}` : ''}
                        {contact.cep ? ` • CEP: ${contact.cep}` : ''}
                      </>
                    ) : (
                      contact.location || 'Localidade em Belo Horizonte e Região Metropolitana'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Equipment Data */}
            <div className="mt-4 border border-[#BAC7D5] rounded-[4px] overflow-hidden">
              <div className="bg-[#0A2540] text-white px-3 py-1 font-mono font-bold text-[11px] uppercase flex items-center justify-between">
                <span>2. Identificação do Equipamento</span>
                <span className="font-mono text-[#6AE1FF]">TAG: {workOrder.equipmentCode}</span>
              </div>

              <div className="p-3 text-[12px] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono bg-[#FAFCFF]">
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Tipo:</span>
                  <span className="font-bold text-[#161C24]">{workOrder.equipmentType || 'Computador / PC'}</span>
                </div>
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Marca / Modelo:</span>
                  <span className="font-bold text-[#161C24]">{workOrder.brandModel || 'Gabinete Custom / Sob Medida'}</span>
                </div>
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Número de Série / TAG:</span>
                  <span className="font-bold text-[#00687A]">{workOrder.serialNumber || workOrder.equipmentCode}</span>
                </div>
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase block">Senha Fornecida:</span>
                  <span className="font-bold text-[#161C24]">{workOrder.userPassword || 'Livre / Sem Senha'}</span>
                </div>

                <div className="col-span-2 sm:col-span-4 pt-1 border-t border-[#E9EEFA]">
                  <span className="text-[#74777E] text-[10px] uppercase block">Acessórios Deixados com o Equipamento:</span>
                  <span className="font-medium text-[#161C24]">
                    {workOrder.accessories || 'Gabinete/Notebook isolado (sem fontes ou cabos adicionais)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Technical Scope & Diagnosis */}
            <div className="mt-4 border border-[#BAC7D5] rounded-[4px] overflow-hidden">
              <div className="bg-[#0A2540] text-white px-3 py-1 font-mono font-bold text-[11px] uppercase">
                <span>3. Serviços Realizados & Laudo Técnico</span>
              </div>

              <div className="p-3 text-[12px] space-y-2 bg-[#FAFCFF]">
                <div>
                  <span className="text-[#74777E] text-[10px] uppercase font-mono block">Defeito Reclamado pelo Cliente:</span>
                  <p className="font-medium text-[#161C24] bg-white p-2 border border-[#D8E0E9] rounded-[3px]">
                    {workOrder.reportedIssue || workOrder.description || 'Lentidão, aquecimento ou solicitação de manutenção preventiva e formatação.'}
                  </p>
                </div>

                <div>
                  <span className="text-[#74777E] text-[10px] uppercase font-mono block">Serviços Executados & Parecer Técnico:</span>
                  <p className="font-bold text-[#0A2540] text-[13px] mb-1">
                    {workOrder.title}
                  </p>
                  <p className="font-medium text-[#161C24] bg-white p-2 border border-[#D8E0E9] rounded-[3px]">
                    {workOrder.technicalDiagnosis || 'Diagnóstico de bancada realizado com sucesso. Teste de estresse de memória RAM, medição térmica de CPU/GPU e verificação de integridade S.M.A.R.T. de disco aprovados.'}
                  </p>
                </div>

                {workOrder.partsReplaced && (
                  <div>
                    <span className="text-[#74777E] text-[10px] uppercase font-mono block">Peças e Sobressalentes Substituídos:</span>
                    <p className="font-medium text-[#00687A] bg-white p-2 border border-[#D8E0E9] rounded-[3px] font-mono">
                      {workOrder.partsReplaced}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Values & Warranty */}
            <div className="mt-4 border border-[#BAC7D5] rounded-[4px] overflow-hidden">
              <div className="bg-[#0A2540] text-white px-3 py-1 font-mono font-bold text-[11px] uppercase flex items-center justify-between">
                <span>4. Resumo Financeiro & Garantia</span>
                <span>Técnico: {workOrder.technicianAssigned || 'Téc. Core Suporte'}</span>
              </div>

              <div className="p-3 bg-[#FAFCFF] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                <div className="text-[11px] text-[#43474D] space-y-1">
                  <div>Garantia dos Serviços: <strong className="text-[#14532D]">{workOrder.warrantyDays || 90} dias (CDC Art. 26)</strong></div>
                  <div>Forma de Pagamento: <strong>{workOrder.paymentMethod || 'Pix / Cartão à vista'}</strong></div>
                  <div>Status do Pagamento: <strong>{workOrder.paymentStatus || 'Aguardando Aprovação / Conclusão'}</strong></div>
                </div>

                <div className="text-right bg-white p-3 border border-[#BAC7D5] rounded-[4px] min-w-[200px]">
                  <span className="text-[10px] text-[#74777E] uppercase block">VALOR TOTAL DA OS:</span>
                  <span className="text-[22px] font-extrabold text-[#14532D] tabular-nums block">
                    {formatCurrency(workOrder.value)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms of Service & Legal Notice */}
            <div className="mt-3 p-2.5 bg-[#F8F9FF] border border-[#D8E0E9] rounded-[3px] text-[10px] text-[#43474D] leading-tight font-mono">
              <p className="font-bold text-[#0A2540] mb-0.5">TERMOS E CONDIÇÕES DE ATENDIMENTO:</p>
              <p>
                1. A garantia cobre exclusivamente os serviços e peças discriminados nesta OS por 90 dias, cessando em caso de violação de lacres, quedas, contato com líquidos ou descargas atmosféricas.
              </p>
              <p className="mt-0.5">
                2. Equipamentos prontos não retirados em até 90 dias após aviso de conclusão serão considerados abandonados na forma do Art. 1.275 do Código Civil.
              </p>
            </div>

            {/* Signature Fields */}
            <div className="mt-10 grid grid-cols-2 gap-8 text-center font-mono text-[11px]">
              <div>
                <div className="border-t border-[#161C24] pt-1">
                  <p className="font-bold text-[#0A2540]">CORE SUPORTE INFORMÁTICA</p>
                  <p className="text-[10px] text-[#74777E]">Técnico Especialista Responsável</p>
                </div>
              </div>

              <div>
                <div className="border-t border-[#161C24] pt-1">
                  <p className="font-bold text-[#0A2540]">{contact.name}</p>
                  <p className="text-[10px] text-[#74777E]">Assinatura do Cliente / Aceite</p>
                </div>
              </div>
            </div>

            {/* Print Footer */}
            <div className="mt-8 pt-2 border-t border-[#D8E0E9] flex items-center justify-between text-[10px] font-mono text-[#74777E]">
              <span>Core Suporte • Tecnologia em Boas Mãos • (31) 9 9372-4609</span>
              <span>Impresso em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
