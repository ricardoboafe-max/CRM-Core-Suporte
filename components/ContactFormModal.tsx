import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Contact, ContactType, ContactStatus, PriorityLevel } from '@/types/crm';
import { fetchAddressByCep } from '@/lib/viacep';
import { X, Save, AlertCircle, Search, MapPin, Loader2, CheckCircle2, Sparkles, Calendar, Bell, Clock } from 'lucide-react';
import { getQuickDate, getReminderInfo } from '@/lib/reminder-utils';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactData: Partial<Contact>) => void;
  contactToEdit?: Contact | null;
}

interface FormInnerProps {
  onClose: () => void;
  onSave: (contactData: Partial<Contact>) => void;
  contactToEdit?: Contact | null;
}

const ContactFormInner: React.FC<FormInnerProps> = ({ onClose, onSave, contactToEdit }) => {
  const numberInputRef = useRef<HTMLInputElement>(null);
  const lastSearchedCepRef = useRef<string>('');

  const [formData, setFormData] = useState({
    name: contactToEdit?.name || '',
    company: contactToEdit?.company || '',
    role: contactToEdit?.role || '',
    email: contactToEdit?.email || '',
    phone: contactToEdit?.phone || '',
    whatsapp: contactToEdit?.whatsapp || '',
    type: (contactToEdit?.type || 'Cliente') as ContactType,
    status: (contactToEdit?.status || 'Ativo') as ContactStatus,
    priority: (contactToEdit?.priority || 'Média') as PriorityLevel,
    pipelineStage: (contactToEdit?.pipelineStage || 'Lead Inicial') as Contact['pipelineStage'],
    // Structured Address
    cep: contactToEdit?.cep || '',
    street: contactToEdit?.street || '',
    number: contactToEdit?.number || '',
    complement: contactToEdit?.complement || '',
    neighborhood: contactToEdit?.neighborhood || '',
    city: contactToEdit?.city || 'Belo Horizonte',
    state: contactToEdit?.state || 'MG',
    location: contactToEdit?.location || '',
    documentId: contactToEdit?.documentId || '',
    dealValue: contactToEdit?.dealValue?.toString() || '0',
    tags: contactToEdit?.tags?.join(', ') || '',
    notes: contactToEdit?.notes || '',
    // Data de Retorno & Lembrete
    returnDate: contactToEdit?.returnDate || '',
    reminderNotes: contactToEdit?.reminderNotes || ''
  });

  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepStatusMessage, setCepStatusMessage] = useState<{ type: 'success' | 'error'; text: string; provider?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Função para buscar o endereço automaticamente a partir da API pública do ViaCEP
   * quando o usuário digita ou cola o CEP.
   */
  const buscarEnderecoPorCep = async (cepInput?: string) => {
    const rawTarget = cepInput !== undefined ? cepInput : formData.cep;
    const cleanCep = rawTarget.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setCepStatusMessage({ 
        type: 'error', 
        text: 'O CEP deve conter 8 dígitos numéricos (ex: 30130-010).' 
      });
      return;
    }

    // Evita chamadas duplicadas para o mesmo CEP já buscado com sucesso
    if (lastSearchedCepRef.current === cleanCep && cepStatusMessage?.type === 'success') {
      return;
    }

    setIsSearchingCep(true);
    setCepStatusMessage(null);

    try {
      const result = await fetchAddressByCep(cleanCep);
      setIsSearchingCep(false);

      if (result) {
        lastSearchedCepRef.current = cleanCep;

        const updatedStreet = result.logradouro || formData.street;
        const updatedNeighborhood = result.bairro || formData.neighborhood;
        const updatedCity = result.localidade || formData.city;
        const updatedState = result.uf || formData.state;
        const updatedCep = result.cep || `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;

        const formattedLocation = `${updatedStreet}, ${updatedNeighborhood} - ${updatedCity}/${updatedState} • CEP ${updatedCep}`;

        setFormData(prev => ({
          ...prev,
          cep: updatedCep,
          street: updatedStreet,
          neighborhood: updatedNeighborhood,
          city: updatedCity,
          state: updatedState,
          location: formattedLocation
        }));

        const providerLabel = result.provider === 'viacep' ? 'ViaCEP' : 'BrasilAPI';
        setCepStatusMessage({
          type: 'success',
          text: `Endereço localizado via ${providerLabel}: ${updatedStreet}, ${updatedNeighborhood} (${updatedCity}/${updatedState}). Agora preencha o número.`,
          provider: providerLabel
        });

        // Foca automaticamente no campo "Número" para agilizar a digitação
        setTimeout(() => {
          numberInputRef.current?.focus();
        }, 100);
      } else {
        setCepStatusMessage({
          type: 'error',
          text: 'CEP não encontrado na base do ViaCEP. Por favor, preencha o endereço manualmente.'
        });
      }
    } catch (err) {
      setIsSearchingCep(false);
      console.error('Falha ao consultar CEP:', err);
      setCepStatusMessage({
        type: 'error',
        text: 'Não foi possível consultar o CEP no momento. Preencha os campos manualmente.'
      });
    }
  };

  /**
   * Monitora a digitação do CEP:
   * - Aplica máscara XXXXX-XXX
   * - Quando atinge 8 dígitos numéricos, dispara busca automática instantaneamente
   */
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    
    // Máscara XXXXX-XXX
    let masked = raw;
    if (raw.length > 5) {
      masked = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }

    setFormData(prev => ({ ...prev, cep: masked }));

    // Disparo automático quando o usuário completa os 8 dígitos
    if (raw.length === 8) {
      buscarEnderecoPorCep(raw);
    } else {
      // Se apagar dígitos, limpa a mensagem de sucesso anterior
      if (cepStatusMessage?.type === 'success') {
        setCepStatusMessage(null);
      }
    }
  };

  const handleApplyQuickCep = (sampleCep: string) => {
    setFormData(prev => ({ ...prev, cep: sampleCep }));
    buscarEnderecoPorCep(sampleCep);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('O Nome Completo do cliente é obrigatório.');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const numericDealValue = parseFloat(formData.dealValue.replace(/[^\d.-]/g, '')) || 0;

    // Generate readable location string from structured fields
    let fullLocation = formData.location.trim();
    if (formData.street || formData.neighborhood || formData.city) {
      fullLocation = [
        formData.street ? `${formData.street}${formData.number ? `, nº ${formData.number}` : ''}` : '',
        formData.complement ? `(${formData.complement})` : '',
        formData.neighborhood ? `Bairro ${formData.neighborhood}` : '',
        formData.city ? `${formData.city}/${formData.state || 'MG'}` : '',
        formData.cep ? `CEP ${formData.cep}` : ''
      ].filter(Boolean).join(' - ');
    }

    onSave({
      name: formData.name.trim(),
      company: formData.company.trim() || 'Empresa Particular',
      role: formData.role.trim() || 'Cliente / Responsável',
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      pipelineStage: formData.pipelineStage,
      cep: formData.cep.trim(),
      street: formData.street.trim(),
      number: formData.number.trim(),
      complement: formData.complement.trim(),
      neighborhood: formData.neighborhood.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      location: fullLocation || 'Belo Horizonte - MG',
      documentId: formData.documentId.trim(),
      dealValue: numericDealValue,
      tags: tagsArray,
      notes: formData.notes.trim(),
      returnDate: formData.returnDate || undefined,
      reminderNotes: formData.reminderNotes.trim() || undefined
    });

    onClose();
  };

  return (
    <div 
      className="w-full max-w-2xl bg-white border border-[#0A2540]/20 rounded-[8px] shadow-[0px_8px_20px_-2px_rgba(10,37,64,0.25)] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
    >
      {/* Modal Header */}
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
            <h3 className="font-extrabold text-[16px] uppercase tracking-wide font-sans">
              {contactToEdit ? 'Editar Contato // Core Suporte' : 'Cadastrar Novo Cliente // Core Suporte'}
            </h3>
            <p className="text-[11px] text-[#A2B5CC] font-mono">
              Tecnologia em Boas Mãos • Manutenção de Computadores
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

      {/* Modal Body / Form */}
      <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px]">
        {errorMessage && (
          <div className="p-2.5 bg-[#FEE2E2] border border-[#DC2626] rounded-[4px] text-[#7F1D1D] font-mono text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Row 1: Name & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Nome Completo do Cliente *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Carlos Eduardo Mendes"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Cargo / Relação
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              placeholder="Ex: Proprietário / Gerente de TI"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
        </div>

        {/* Row 2: Company & Document (CNPJ/CPF) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Empresa / Razão Social (se houver)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              placeholder="Ex: Consultoria Contábil Silva Ltda"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              CPF / CNPJ do Cliente
            </label>
            <input
              type="text"
              value={formData.documentId}
              onChange={e => setFormData({ ...formData, documentId: e.target.value })}
              placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
        </div>

        {/* Row 3: Phone, WhatsApp, Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Telefone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(31) 98842-1049"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              WhatsApp (Direto)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="31988421049"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="cliente@email.com"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>
        </div>

        {/* SECTION: ENDEREÇO COM BUSCA AUTOMÁTICA POR CEP */}
        <div className="p-3.5 bg-[#EFF4FF] border border-[#BAC7D5] rounded-[6px] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[#0A2540] font-mono text-[11px] uppercase">
              <MapPin className="w-4 h-4 text-[#00A3BF]" />
              <span>Endereço do Cliente // Busca Automática por CEP (ViaCEP)</span>
            </div>
            {isSearchingCep && (
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#00687A] bg-white px-2 py-0.5 rounded-[3px] border border-[#BAC7D5]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A3BF]" />
                Consultando base pública ViaCEP...
              </span>
            )}
          </div>

          {/* CEP Input + Search Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-[#0A2540] font-mono text-[11px] uppercase">
                  CEP (8 dígitos) *
                </label>
                <span className="text-[10px] text-[#00687A] font-mono font-semibold">
                  Busca instantânea
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={9}
                  value={formData.cep}
                  onChange={handleCepChange}
                  onBlur={() => {
                    const clean = formData.cep.replace(/\D/g, '');
                    if (clean.length === 8 && !isSearchingCep) {
                      buscarEnderecoPorCep(clean);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      buscarEnderecoPorCep(formData.cep);
                    }
                  }}
                  placeholder="30130-010"
                  className="w-full h-10 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold text-[14px] outline-none focus:border-[#00A3BF] focus:ring-1 focus:ring-[#00A3BF]"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="button"
                onClick={() => buscarEnderecoPorCep(formData.cep)}
                disabled={isSearchingCep}
                className="h-10 px-3.5 bg-[#0A2540] hover:bg-[#123659] active:bg-[#000F22] text-white rounded-[4px] font-mono font-bold text-[12px] flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
                title="Buscar logradouro, bairro e cidade no ViaCEP"
              >
                {isSearchingCep ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A3BF]" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-[#00A3BF]" />
                )}
                <span>{isSearchingCep ? 'Buscando Endereço...' : 'Buscar Endereço no CEP'}</span>
              </button>
            </div>
          </div>

          {/* Quick-test CEP Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] font-mono text-[#3E546B] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00A3BF]" />
              Testar CEP rápido:
            </span>
            {[
              { label: '30130-010 (Savassi)', cep: '30130-010' },
              { label: '30140-071 (Lourdes)', cep: '30140-071' },
              { label: '31270-901 (Pampulha)', cep: '31270-901' },
              { label: '01310-100 (Av. Paulista)', cep: '01310-100' }
            ].map(sample => (
              <button
                key={sample.cep}
                type="button"
                onClick={() => handleApplyQuickCep(sample.cep)}
                className="px-2 py-0.5 bg-white hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#0A2540] rounded-[3px] font-mono text-[10px] font-semibold transition-colors"
                title={`Preencher e buscar automaticamente ${sample.cep}`}
              >
                {sample.label}
              </button>
            ))}
          </div>

          {cepStatusMessage && (
            <div className={`p-2.5 rounded-[4px] font-mono text-[11px] flex items-center gap-2 border ${
              cepStatusMessage.type === 'success'
                ? 'bg-[#DCFCE7] text-[#14532D] border-[#16A34A]'
                : 'bg-[#FEE2E2] text-[#7F1D1D] border-[#DC2626]'
            }`}>
              {cepStatusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
              )}
              <span className="leading-tight">{cepStatusMessage.text}</span>
            </div>
          )}

          {/* Street, Number & Complement */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-[#0A2540] font-mono text-[10px] uppercase">
                  Logradouro / Rua / Avenida
                </label>
                {formData.street && (
                  <span className="text-[9px] font-mono text-[#00687A] font-bold">
                    ✓ Preenchido
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
                placeholder="Ex: Av. Afonso Pena"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Número *
              </label>
              <input
                ref={numberInputRef}
                type="text"
                value={formData.number}
                onChange={e => setFormData({ ...formData, number: e.target.value })}
                placeholder="Ex: 1500"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono font-bold outline-none focus:border-[#00A3BF] focus:ring-1 focus:ring-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Complemento
              </label>
              <input
                type="text"
                value={formData.complement}
                onChange={e => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Ex: Sala 402"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>
          </div>

          {/* Neighborhood, City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Bairro
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Ex: Savassi"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Cidade
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="Belo Horizonte"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] outline-none focus:border-[#00A3BF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[10px] uppercase">
                Estado (UF)
              </label>
              <input
                type="text"
                maxLength={2}
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                placeholder="MG"
                className="w-full h-9 px-3 bg-white border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF]"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Classification dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Tipo de Contato
            </label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ContactType })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Cliente">Cliente Particular / Empresa</option>
              <option value="Lead">Lead / Orçamento Pendente</option>
              <option value="Engenheiro de Campo">Técnico Externo / Campo</option>
              <option value="Técnico Especialista">Técnico de Laboratório</option>
              <option value="Fornecedor">Fornecedor de Peças</option>
              <option value="Parceiro">Parceiro Comercial</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Status Operacional
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ContactStatus })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Ativo">Ativo</option>
              <option value="Em Execução">Em Manutenção / Execução</option>
              <option value="Pendente">Aguardando Aprovação</option>
              <option value="Aguardando Retorno">Aguardando Peças / Retorno</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Nível de Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Crítica">Crítica (Computador Parado / Urgente)</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>

        {/* Row 5: Deal Value & Pipeline Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Valor Total de Contratos / Serviços (R$)
            </label>
            <input
              type="number"
              value={formData.dealValue}
              onChange={e => setFormData({ ...formData, dealValue: e.target.value })}
              placeholder="0"
              className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
              Estágio do Pipeline
            </label>
            <select
              value={formData.pipelineStage}
              onChange={e => setFormData({ ...formData, pipelineStage: e.target.value as Contact['pipelineStage'] })}
              className="w-full h-10 px-2 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#00A3BF]"
            >
              <option value="Lead Inicial">Lead Inicial</option>
              <option value="Proposta Técnica">Orçamento Técnico Aberto</option>
              <option value="Em Negociação">Aguardando Aprovação de Orçamento</option>
              <option value="Contrato Ativo">Em Manutenção / Serviço Aprovado</option>
              <option value="Em Operação">Serviço Concluído / Equipamento Entregue</option>
            </select>
          </div>
        </div>

        {/* SECTION: DATA DE RETORNO & LEMBRETE / PRÓXIMA AÇÃO */}
        <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-[6px] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[#92400E] font-mono text-[11px] uppercase">
              <Calendar className="w-4 h-4 text-[#D97706]" />
              <span>Agendamento de Retorno & Lembrete de Contato</span>
            </div>
            {formData.returnDate && (
              (() => {
                const info = getReminderInfo(formData.returnDate);
                if (!info) return null;
                return (
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-[3px] border ${info.badgeBg} ${info.badgeText} ${info.borderColor} flex items-center gap-1`}>
                    <Clock className="w-3 h-3" />
                    <span>{info.label} • {info.formattedDate}</span>
                  </span>
                );
              })()
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#78350F] mb-1 font-mono text-[11px] uppercase">
                Data Prevista de Retorno
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={e => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-[4px] text-[#161C24] font-mono font-semibold outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#78350F] mb-1 font-mono text-[11px] uppercase">
                Atalhos Rápidos de Agendamento
              </label>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {[
                  { label: 'Hoje', days: 0 },
                  { label: 'Amanhã', days: 1 },
                  { label: '+3 dias', days: 3 },
                  { label: '+7 dias', days: 7 },
                  { label: '+15 dias', days: 15 },
                  { label: '+30 dias', days: 30 }
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, returnDate: getQuickDate(preset.days) })}
                    className="px-2 py-1 bg-white hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-[3px] font-mono text-[10px] font-bold transition-colors shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
                {formData.returnDate && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, returnDate: '', reminderNotes: '' })}
                    className="px-2 py-1 bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-[#991B1B] rounded-[3px] font-mono text-[10px] font-bold transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#78350F] mb-1 font-mono text-[11px] uppercase flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Descrição do Lembrete / Próxima Ação</span>
            </label>
            <input
              type="text"
              value={formData.reminderNotes}
              onChange={e => setFormData({ ...formData, reminderNotes: e.target.value })}
              placeholder="Ex: Ligar para verificar se a formatação e restauração atenderam às expectativas."
              className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-[4px] text-[#161C24] font-medium outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
            Tags de Atendimento (separadas por vírgula)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Ex: Formatação, Notebook Dell, PC Gamer, Troca de Tela, Backup"
            className="w-full h-10 px-3 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
            Observações Técnicas / Histórico do Cliente
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Equipamentos anteriores, restrições de backup, preferência de horário para entrega..."
            className="w-full p-2.5 bg-[#F4F6F9] border border-[#BAC7D5] rounded-[4px] text-[#161C24] font-mono outline-none focus:border-[#00A3BF] focus:bg-white resize-none"
          />
        </div>

        {/* Form Actions Footer */}
        <div className="pt-3 border-t border-[#BAC7D5] flex items-center justify-end gap-2.5">
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
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{contactToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contactToEdit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/65 backdrop-blur-[2px]">
      <ContactFormInner
        key={contactToEdit?.id || 'new-contact'}
        onClose={onClose}
        onSave={onSave}
        contactToEdit={contactToEdit}
      />
    </div>
  );
};
