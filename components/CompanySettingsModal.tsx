import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CompanyConfig, getStoredCompanyConfig, saveCompanyConfig, resetCompanyConfigToDefault } from '@/lib/company-config';
import { fetchAddressByCep } from '@/lib/viacep';
import { 
  X, 
  Save, 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  RotateCcw, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Printer
} from 'lucide-react';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (config: CompanyConfig) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [currentConfig, setCurrentConfig] = useState<CompanyConfig>(() => getStoredCompanyConfig());
  const [activeTab, setActiveTab] = useState<'id' | 'contact' | 'address' | 'operations'>('id');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepStatusMessage, setCepStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBuscarCep = async (cepInput: string) => {
    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepStatusMessage({
        type: 'error',
        text: 'O CEP deve conter 8 dígitos numéricos (ex: 30130-010).'
      });
      return;
    }

    setIsSearchingCep(true);
    setCepStatusMessage(null);

    try {
      const result = await fetchAddressByCep(cleanCep);
      setIsSearchingCep(false);

      if (result) {
        const updatedStreet = result.logradouro || currentConfig.street;
        const updatedNeighborhood = result.bairro || currentConfig.neighborhood;
        const updatedCity = result.localidade || currentConfig.city;
        const updatedState = result.uf || currentConfig.state;
        const formattedCep = result.cep || `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;

        setCurrentConfig(prev => ({
          ...prev,
          cep: formattedCep,
          street: updatedStreet,
          neighborhood: updatedNeighborhood,
          city: updatedCity,
          state: updatedState
        }));

        setCepStatusMessage({
          type: 'success',
          text: `Endereço localizado: ${updatedStreet}, ${updatedNeighborhood} (${updatedCity}/${updatedState}).`
        });

        setTimeout(() => {
          numberInputRef.current?.focus();
        }, 100);
      } else {
        setCepStatusMessage({
          type: 'error',
          text: 'CEP não localizado na base pública. Preencha manualmente.'
        });
      }
    } catch {
      setIsSearchingCep(false);
      setCepStatusMessage({
        type: 'error',
        text: 'Erro ao consultar CEP. Preencha os campos manualmente.'
      });
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    let masked = raw;
    if (raw.length > 5) {
      masked = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    setCurrentConfig(prev => ({ ...prev, cep: masked }));
    if (raw.length === 8) {
      handleBuscarCep(raw);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCompanyConfig(currentConfig);
    setSaveSuccess(true);
    if (onSaved) onSaved(updated);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações originais padrão da Core Suporte?')) {
      const def = resetCompanyConfigToDefault();
      setCurrentConfig(def);
      if (onSaved) onSaved(def);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/70 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-3xl bg-white border border-[#0A2540]/20 rounded-[8px] shadow-[0px_8px_24px_-2px_rgba(10,37,64,0.3)] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#BAC7D5]">
          <div className="flex items-center gap-3">
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
              <h3 className="font-extrabold text-[16px] uppercase tracking-wide font-sans flex items-center gap-2">
                <span>Dados da Empresa // Core Suporte</span>
              </h3>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Identificação, canais de contato, endereço da sede e cabeçalho de documentos
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

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 px-4 bg-[#EFF4FF] border-b border-[#D8E0E9] pt-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'id', label: 'Identificação & Marca', icon: Building2 },
            { id: 'contact', label: 'Contatos & Pix', icon: Phone },
            { id: 'address', label: 'Endereço da Sede', icon: MapPin },
            { id: 'operations', label: 'Operação & Garantia', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-t-[4px] border-t border-x transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-white border-[#BAC7D5] text-[#0A2540] border-b-transparent shadow-xs'
                    : 'border-transparent text-[#3E546B] hover:text-[#0A2540]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A3BF]' : 'text-[#74777E]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-[13px] flex-1">
          
          {/* TAB 1: IDENTIFICAÇÃO */}
          {activeTab === 'id' && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentConfig.tradeName}
                    onChange={e => setCurrentConfig({ ...currentConfig, tradeName: e.target.value })}
                    placeholder="Core Suporte"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-bold outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Slogan / Subtítulo Oficial
                  </label>
                  <input
                    type="text"
                    value={currentConfig.slogan}
                    onChange={e => setCurrentConfig({ ...currentConfig, slogan: e.target.value })}
                    placeholder="Tecnologia em Boas Mãos"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Razão Social Completa (Para Recibos e Contratos) *
                </label>
                <input
                  type="text"
                  required
                  value={currentConfig.name}
                  onChange={e => setCurrentConfig({ ...currentConfig, name: e.target.value })}
                  placeholder="CORE SUPORTE INFORMÁTICA LTDA"
                  className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-semibold outline-none focus:border-[#00A3BF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    CNPJ da Empresa *
                  </label>
                  <input
                    type="text"
                    value={currentConfig.cnpj}
                    onChange={e => setCurrentConfig({ ...currentConfig, cnpj: e.target.value })}
                    placeholder="38.942.185/0001-44"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Inscrição Estadual / Municipal
                  </label>
                  <input
                    type="text"
                    value={currentConfig.stateRegistration}
                    onChange={e => setCurrentConfig({ ...currentConfig, stateRegistration: e.target.value })}
                    placeholder="Isento ou Nº"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTATOS & PIX */}
          {activeTab === 'contact' && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Telefone Principal / Plantão Técnico *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentConfig.phone}
                    onChange={e => setCurrentConfig({ ...currentConfig, phone: e.target.value })}
                    placeholder="(31) 9 9372-4609"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                  <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                    Exibido no topo, rodapé e cabeçalho de impressões de OS.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    WhatsApp Comercial (Somente números)
                  </label>
                  <input
                    type="text"
                    value={currentConfig.whatsapp}
                    onChange={e => setCurrentConfig({ ...currentConfig, whatsapp: e.target.value })}
                    placeholder="31993724609"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    E-mail Corporativo de Suporte
                  </label>
                  <input
                    type="email"
                    value={currentConfig.email}
                    onChange={e => setCurrentConfig({ ...currentConfig, email: e.target.value })}
                    placeholder="contato@coresuporte.com.br"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                    Website / Portal da Empresa
                  </label>
                  <input
                    type="text"
                    value={currentConfig.website}
                    onChange={e => setCurrentConfig({ ...currentConfig, website: e.target.value })}
                    placeholder="https://coresuporte.com.br"
                    className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Chave Pix para Pagamento de Serviços (Exibida nos Recibos)
                </label>
                <input
                  type="text"
                  value={currentConfig.pixKey}
                  onChange={e => setCurrentConfig({ ...currentConfig, pixKey: e.target.value })}
                  placeholder="(31) 9 9372-4609 ou CNPJ"
                  className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold text-[#14532D] outline-none focus:border-[#16A34A] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ENDEREÇO DA SEDE */}
          {activeTab === 'address' && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              {/* CEP Lookup */}
              <div className="p-3 bg-[#EFF4FF] border border-[#BAC7D5] rounded-[6px] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A2540] font-mono text-[11px] uppercase">
                    <MapPin className="w-4 h-4 text-[#00A3BF]" />
                    <span>Localização da Sede // Busca Rápida por CEP (ViaCEP)</span>
                  </div>
                  {isSearchingCep && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#00687A]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A3BF]" />
                      Consultando ViaCEP...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      maxLength={9}
                      value={currentConfig.cep}
                      onChange={handleCepChange}
                      placeholder="30130-010"
                      className="w-full h-10 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold text-[14px] outline-none focus:border-[#00A3BF]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBuscarCep(currentConfig.cep)}
                      disabled={isSearchingCep}
                      className="h-10 px-3 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Search className="w-3.5 h-3.5 text-[#00A3BF]" />
                      <span>Buscar CEP</span>
                    </button>
                    <span className="text-[11px] text-[#475569] font-mono">
                      Preenche rua, bairro e cidade automaticamente.
                    </span>
                  </div>
                </div>

                {cepStatusMessage && (
                  <div className={`p-2 rounded-[4px] font-mono text-[11px] flex items-center gap-2 border ${
                    cepStatusMessage.type === 'success'
                      ? 'bg-[#DCFCE7] text-[#14532D] border-[#16A34A]'
                      : 'bg-[#FEE2E2] text-[#7F1D1D] border-[#DC2626]'
                  }`}>
                    {cepStatusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                    )}
                    <span>{cepStatusMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Street, Number, Complement */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Logradouro / Avenida / Rua
                  </label>
                  <input
                    type="text"
                    value={currentConfig.street}
                    onChange={e => setCurrentConfig({ ...currentConfig, street: e.target.value })}
                    placeholder="Av. Afonso Pena"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Número
                  </label>
                  <input
                    ref={numberInputRef}
                    type="text"
                    value={currentConfig.number}
                    onChange={e => setCurrentConfig({ ...currentConfig, number: e.target.value })}
                    placeholder="1500"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={currentConfig.complement}
                    onChange={e => setCurrentConfig({ ...currentConfig, complement: e.target.value })}
                    placeholder="Sala 402"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>

              {/* Neighborhood, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={currentConfig.neighborhood}
                    onChange={e => setCurrentConfig({ ...currentConfig, neighborhood: e.target.value })}
                    placeholder="Savassi"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={currentConfig.city}
                    onChange={e => setCurrentConfig({ ...currentConfig, city: e.target.value })}
                    placeholder="Belo Horizonte"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={currentConfig.state}
                    onChange={e => setCurrentConfig({ ...currentConfig, state: e.target.value.toUpperCase() })}
                    placeholder="MG"
                    className="w-full h-9 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERAÇÃO & GARANTIA */}
          {activeTab === 'operations' && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Horário de Funcionamento / Atendimento
                </label>
                <input
                  type="text"
                  value={currentConfig.businessHours}
                  onChange={e => setCurrentConfig({ ...currentConfig, businessHours: e.target.value })}
                  placeholder="Segunda a Sexta: 08:00 às 18:00 • Sábados: 08:00 às 13:00"
                  className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Responsável Técnico Padrão (Para Assinatura de OS)
                </label>
                <input
                  type="text"
                  value={currentConfig.technicalLead}
                  onChange={e => setCurrentConfig({ ...currentConfig, technicalLead: e.target.value })}
                  placeholder="Coordenação Técnica Core Suporte"
                  className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Cláusula Padrão de Garantia e Condições (CDC)
                </label>
                <textarea
                  rows={3}
                  value={currentConfig.serviceTerms}
                  onChange={e => setCurrentConfig({ ...currentConfig, serviceTerms: e.target.value })}
                  placeholder="Garantia legal de 90 dias para peças e serviços conforme Lei 8.078/90 (Código de Defesa do Consumidor)."
                  className="w-full p-2.5 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono text-[12px] outline-none focus:border-[#00A3BF] focus:bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* Document Preview Box */}
          <div className="p-3 bg-[#F8F9FF] border border-[#D8E0E9] rounded-[6px] space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#0A2540]">
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#00A3BF]" />
                Pré-visualização do Cabeçalho de Impressão (OS & Recibos):
              </span>
              <span className="text-[10px] text-[#00687A]">Atualização em tempo real</span>
            </div>
            <div className="bg-white p-2.5 rounded-[4px] border border-[#BAC7D5] text-[11px] font-mono space-y-0.5">
              <div className="font-bold text-[#0A2540] text-[13px]">{currentConfig.name}</div>
              <div className="text-[#00687A] font-semibold">{currentConfig.tradeName} • {currentConfig.slogan}</div>
              <div className="text-[#3E546B]">
                Plantão Técnico: <strong>{currentConfig.phone}</strong> • {currentConfig.city}/{currentConfig.state}
              </div>
              <div className="text-[#74777E] text-[10px]">
                CNPJ: {currentConfig.cnpj} • {currentConfig.email} • {currentConfig.street}, {currentConfig.number || 'S/N'} ({currentConfig.neighborhood})
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#BAC7D5] flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 bg-white hover:bg-[#FEE2E2] border border-[#BAC7D5] text-[#7F1D1D] rounded-[4px] text-[12px] font-mono font-bold flex items-center gap-1.5 transition-colors"
              title="Restaurar dados originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-[#F4F6F9] border border-[#BAC7D5] text-[#3E546B] rounded-[4px] font-bold text-[12px] transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#00A3BF] hover:bg-[#00899f] active:bg-[#00687A] text-[#000F22] rounded-[4px] font-extrabold text-[13px] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#000F22]" />
                    <span>Dados Salvos!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>Salvar Dados da Core Suporte</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
