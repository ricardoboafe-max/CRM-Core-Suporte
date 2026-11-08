export interface CompanyConfig {
  name: string; // Razão Social: "CORE SUPORTE TECNOLOGIA LTDA"
  tradeName: string; // Nome Fantasia: "Core Suporte"
  slogan: string; // "Tecnologia em Boas Mãos"
  cnpj: string; // "38.942.185/0001-44"
  stateRegistration: string; // "Isento"
  phone: string; // "(31) 9 9372-4609"
  whatsapp: string; // "31993724609"
  email: string; // "contato@coresuporte.com.br"
  website: string; // "https://coresuporte.com.br"
  // Endereço da Sede
  cep: string; // "30130-010"
  street: string; // "Av. Afonso Pena"
  number: string; // "1500"
  complement: string; // "Sala 402"
  neighborhood: string; // "Savassi"
  city: string; // "Belo Horizonte"
  state: string; // "MG"
  // Operação & Documentação
  businessHours: string; // "Segunda a Sexta: 08:00 às 18:00 • Plantão Sábados: 08:00 às 13:00"
  technicalLead: string; // "Coordenação Técnica Core Suporte"
  pixKey: string; // "(31) 9 9372-4609"
  serviceTerms: string; // "Garantia de 90 dias para mão de obra e peças substituídas conforme CDC."
}

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  name: 'CORE SUPORTE INFORMÁTICA LTDA',
  tradeName: 'Core Suporte',
  slogan: 'Tecnologia em Boas Mãos',
  cnpj: '38.942.185/0001-44',
  stateRegistration: 'Isento',
  phone: '(31) 9 9372-4609',
  whatsapp: '31993724609',
  email: 'contato@coresuporte.com.br',
  website: 'https://coresuporte.com.br',
  cep: '30130-010',
  street: 'Av. Afonso Pena',
  number: '1500',
  complement: 'Sala 402',
  neighborhood: 'Savassi',
  city: 'Belo Horizonte',
  state: 'MG',
  businessHours: 'Segunda a Sexta: 08:00 às 18:00 • Sábados: 08:00 às 13:00',
  technicalLead: 'Coordenação Técnica Core Suporte',
  pixKey: '(31) 9 9372-4609',
  serviceTerms: 'Garantia legal de 90 dias para peças e serviços conforme Lei 8.078/90 (Código de Defesa do Consumidor).'
};

const COMPANY_STORAGE_KEY = 'core_suporte_company_config';

// Memory cache & listeners for useSyncExternalStore reactivity
let memoryCompanyConfig: CompanyConfig = DEFAULT_COMPANY_CONFIG;
let memoryLoaded = false;
let listeners: Array<() => void> = [];

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeCompanyConfig(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function getCompanyConfigSnapshot(): CompanyConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_COMPANY_CONFIG;
  }
  if (!memoryLoaded) {
    try {
      const stored = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (stored) {
        memoryCompanyConfig = { ...DEFAULT_COMPANY_CONFIG, ...JSON.parse(stored) };
      } else {
        memoryCompanyConfig = DEFAULT_COMPANY_CONFIG;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados da Core Suporte do localStorage:', e);
      memoryCompanyConfig = DEFAULT_COMPANY_CONFIG;
    }
    memoryLoaded = true;
  }
  return memoryCompanyConfig;
}

export function getCompanyConfigServerSnapshot(): CompanyConfig {
  return DEFAULT_COMPANY_CONFIG;
}

export function getStoredCompanyConfig(): CompanyConfig {
  return getCompanyConfigSnapshot();
}

export function saveCompanyConfig(updatedConfig: CompanyConfig): CompanyConfig {
  memoryCompanyConfig = updatedConfig;
  memoryLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(updatedConfig));
    } catch (e) {
      console.warn('Erro ao salvar dados da Core Suporte no localStorage:', e);
    }
  }
  notifyListeners();
  return updatedConfig;
}

export function resetCompanyConfigToDefault(): CompanyConfig {
  return saveCompanyConfig(DEFAULT_COMPANY_CONFIG);
}

export function formatCompanyAddress(config: CompanyConfig): string {
  const parts = [
    config.street ? `${config.street}${config.number ? `, nº ${config.number}` : ''}` : '',
    config.complement ? `(${config.complement})` : '',
    config.neighborhood ? `Bairro ${config.neighborhood}` : '',
    config.city ? `${config.city}/${config.state}` : '',
    config.cep ? `CEP ${config.cep}` : ''
  ].filter(Boolean);

  return parts.join(' - ') || 'Savassi - Belo Horizonte/MG';
}
