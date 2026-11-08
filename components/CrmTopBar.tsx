import React from 'react';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  LayoutList, 
  Kanban, 
  Download, 
  RotateCcw,
  PhoneCall,
  MessageSquare,
  X,
  Tag
} from 'lucide-react';

interface CrmTopBarProps {
  viewMode: 'master-detail' | 'pipeline';
  onViewModeChange: (mode: 'master-detail' | 'pipeline') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewContactModal: () => void;
  onOpenExportImport: () => void;
  onResetData: () => void;
  totalContacts: number;
  onOpenServiceCatalog?: () => void;
}

export const CrmTopBar: React.FC<CrmTopBarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onOpenNewContactModal,
  onOpenExportImport,
  onResetData,
  totalContacts,
  onOpenServiceCatalog
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A2540] text-white border-b border-[#BAC7D5] shadow-[0px_4px_0px_0px_rgba(10,37,64,0.06)]">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo / Brand & Central de Atendimento */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-[150px] sm:w-[170px] shrink-0">
                <Image
                  src="/assets/aistudio/coreSuporte_logo_Black_88b2d103.png"
                  alt="Core Suporte - Tecnologia em Boas Mãos"
                  width={376}
                  height={100}
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>

              {/* Hotline Plantão Técnico */}
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#3E546B]">
                <a
                  href="tel:5531993724609"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#000F22] hover:bg-[#123659] border border-[#3E546B] hover:border-[#00A3BF] rounded-[4px] text-[11px] font-mono transition-colors"
                  title="Ligar para o Plantão Técnico da Core Suporte"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#00A3BF]" />
                  <span className="text-[#A2B5CC]">Plantão:</span>
                  <span className="font-bold text-white tabular-nums">(31) 9 9372-4609</span>
                </a>

                <a
                  href="https://wa.me/5531993724609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-[#DCFCE7]/15 hover:bg-[#DCFCE7]/25 border border-[#16A34A]/50 rounded-[4px] text-[#4ade80] transition-colors"
                  title="WhatsApp Core Suporte"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#4ade80]" />
                </a>
              </div>
            </div>

            {/* Mobile New Contact Button */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenNewContactModal}
                className="h-9 px-3 bg-[#00A3BF] hover:bg-[#00899f] active:bg-[#00687A] text-[#000F22] font-bold text-[13px] rounded-[4px] flex items-center gap-1 transition-colors"
                title="Novo Contato"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Novo</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-[#778EA7] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por cliente, empresa, código (ex: CLI-8492), OS ou cidade..."
                className="w-full h-10 pl-9 pr-8 bg-[#000F22]/70 border border-[#3E546B] focus:border-[#00A3BF] focus:bg-[#000F22] text-white placeholder-[#778EA7] text-[13px] font-mono rounded-[4px] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#778EA7] hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#000F22] p-0.5 rounded-[4px] border border-[#3E546B]">
              <button
                onClick={() => onViewModeChange('master-detail')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-bold rounded-[3px] transition-colors ${
                  viewMode === 'master-detail'
                    ? 'bg-[#00A3BF] text-[#000F22]'
                    : 'text-[#A2B5CC] hover:text-white'
                }`}
                title="Visualização em Lista e Detalhes"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
              <button
                onClick={() => onViewModeChange('pipeline')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-bold rounded-[3px] transition-colors ${
                  viewMode === 'pipeline'
                    ? 'bg-[#00A3BF] text-[#000F22]'
                    : 'text-[#A2B5CC] hover:text-white'
                }`}
                title="Visualização em Pipeline Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
            </div>

            {/* Service Catalog Button */}
            {onOpenServiceCatalog && (
              <button
                onClick={onOpenServiceCatalog}
                className="h-9 px-2.5 bg-[#00A3BF]/15 hover:bg-[#00A3BF]/25 border border-[#00A3BF]/40 text-[#5eead4] hover:text-white rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
                title="Tabela de Preços e Serviços de Informática da Core Suporte"
              >
                <Tag className="w-3.5 h-3.5 text-[#00A3BF]" />
                <span className="hidden sm:inline">Tabela de Preços</span>
              </button>
            )}

            {/* Backup / Export Import */}
            <button
              onClick={onOpenExportImport}
              className="h-9 px-2.5 bg-[#0A2540] hover:bg-[#123659] border border-[#3E546B] text-[#D2E4FF] hover:text-white rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
              title="Exportar contatos em CSV ou JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Exportar / Importar</span>
            </button>

            {/* Reset to Default */}
            <button
              onClick={onResetData}
              className="h-9 px-2 bg-[#0A2540] hover:bg-[#123659] border border-[#3E546B] text-[#A2B5CC] hover:text-white rounded-[4px] text-[12px] flex items-center justify-center transition-colors"
              title="Restaurar dados de demonstração originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Desktop Add Contact Button */}
            <button
              onClick={onOpenNewContactModal}
              className="hidden md:flex h-9 px-3.5 bg-[#00A3BF] hover:bg-[#008ea6] active:bg-[#00687A] text-[#000F22] font-bold text-[13px] rounded-[4px] items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Contato</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#000F22]/20 rounded-[2px] font-mono text-[11px] font-bold">
                {totalContacts}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
