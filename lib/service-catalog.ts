import { ServiceCatalogItem } from '@/types/crm';

export const CORE_SUPORTE_SERVICES: ServiceCatalogItem[] = [
  // Computadores e PCs
  {
    id: 'srv-001',
    category: 'Computadores e PCs',
    name: 'Formatação + Instalação de Windows 10/11 com Drivers e Otimização',
    description: 'Instalação limpa do sistema operacional, ativação de drivers originais, navegadores, antivírus e pacote utilitário essencial.',
    price: 150,
    estimatedTime: '2h - 4h'
  },
  {
    id: 'srv-002',
    category: 'Computadores e PCs',
    name: 'Formatação com Backup Completo de Arquivos (Fotos, Docs, Dados)',
    description: 'Cópia de segurança integral dos arquivos do usuário antes da formatação e restauração com estrutura original.',
    price: 200,
    estimatedTime: '4h - 6h'
  },
  {
    id: 'srv-003',
    category: 'Computadores e PCs',
    name: 'Limpeza Preventiva Completa + Troca de Pasta Térmica de Alta Condutividade',
    description: 'Desmontagem, eliminação de poeira e resíduos com pincel antiestático, lubrificação de coolers e aplicação de pasta térmica Arctic / Silver.',
    price: 130,
    estimatedTime: '2h - 3h'
  },
  {
    id: 'srv-004',
    category: 'Computadores e PCs',
    name: 'Montagem Completa de Computador Gamer / Workstation com Cable Management',
    description: 'Montagem minuciosa de todos os componentes, organização profissional de cabos, testes de estabilidade e configuração de BIOS/XMP.',
    price: 220,
    estimatedTime: '3h - 5h'
  },
  {
    id: 'srv-005',
    category: 'Computadores e PCs',
    name: 'Upgrade de SSD (NVMe / SATA) com Clonagem do Sistema Operacional',
    description: 'Instalação do novo SSD de alta velocidade e migração bit-a-bit do Windows e programas sem perder nenhuma configuração.',
    price: 140,
    estimatedTime: '2h - 4h'
  },
  {
    id: 'srv-006',
    category: 'Computadores e PCs',
    name: 'Troca de Fonte de Alimentação ATX / Placa de Vídeo / Memória RAM',
    description: 'Substituição do componente em bancada, medição de tensões e teste de stress de estabilidade elétrica.',
    price: 90,
    estimatedTime: '1h - 2h'
  },

  // Notebooks
  {
    id: 'srv-007',
    category: 'Notebooks',
    name: 'Limpeza Preventiva de Notebook + Troca de Pasta Térmica e Thermal Pads',
    description: 'Abertura do gabinete, desobstrução de dutos de cobre, troca da pasta do processador e placa gráfica dedicada.',
    price: 160,
    estimatedTime: '2h - 4h'
  },
  {
    id: 'srv-008',
    category: 'Notebooks',
    name: 'Troca de Tela de Notebook / Ultrabook (Mão de Obra)',
    description: 'Desmontagem segura da moldura frontal e flats, instalação de display LED/IPS novo e calibração de imagem.',
    price: 150,
    estimatedTime: '2h - 3h'
  },
  {
    id: 'srv-009',
    category: 'Notebooks',
    name: 'Troca de Teclado de Notebook (Mão de Obra)',
    description: 'Substituição de teclado padrão ou soldado com rebites plásticos térmicos de fixação na carcaça.',
    price: 130,
    estimatedTime: '3h - 5h'
  },
  {
    id: 'srv-010',
    category: 'Notebooks',
    name: 'Reparo / Reconstrução de Dobradiça e Carcaça de Notebook',
    description: 'Fixação estrutural com resina de alta resistência em pontos de ancoragem rompidos por fadiga mecânica.',
    price: 190,
    estimatedTime: '24h (tempo de cura)'
  },
  {
    id: 'srv-011',
    category: 'Notebooks',
    name: 'Reparo ou Troca de Conector Jack DC de Carga (Solda em Placa)',
    description: 'Ressolda ou substituição de conector de energia danificado com estação de ar quente e liga de estanho industrial.',
    price: 190,
    estimatedTime: '4h - 8h'
  },
  {
    id: 'srv-012',
    category: 'Notebooks',
    name: 'Troca de Bateria Interna de Notebook',
    description: 'Abertura do equipamento, desconexão do BMS, fixação da nova bateria e ciclo de calibragem inicial.',
    price: 80,
    estimatedTime: '1h - 2h'
  },

  // Servidores e Redes
  {
    id: 'srv-013',
    category: 'Servidores e Redes',
    name: 'Configuração de Roteadores Wi-Fi Mesh, Switches e Acessos Remotos',
    description: 'Configuração de topologia de rede, balanceamento de canais sem fio, DHCP, DNS seguro e regras de firewall.',
    price: 180,
    estimatedTime: '2h - 4h'
  },
  {
    id: 'srv-014',
    category: 'Servidores e Redes',
    name: 'Instalação e Configuração de Servidor Local de Arquivos (NAS / Samba)',
    description: 'Criação de pastas compartilhadas por setores, controle de permissões por usuário e backup espelhado.',
    price: 450,
    estimatedTime: '4h - 8h'
  },
  {
    id: 'srv-015',
    category: 'Servidores e Redes',
    name: 'Crimpagem de Pontos de Rede Cat6 e Passagem de Cabos Estruturados',
    description: 'Instalação de tomadas RJ-45 fêmea, conectores blindados e certificação de continuidade com testador de cabo.',
    price: 70,
    estimatedTime: 'Por ponto'
  },

  // Segurança e Otimização
  {
    id: 'srv-016',
    category: 'Segurança e Otimização',
    name: 'Remoção Profunda de Vírus, Ransomware, Adwares e Spywares',
    description: 'Varredura em ambiente de boot seguro, limpeza de registros corrompidos e restabelecimento das defesas do sistema.',
    price: 140,
    estimatedTime: '2h - 4h'
  },
  {
    id: 'srv-017',
    category: 'Segurança e Otimização',
    name: 'Recuperação de Dados em HD / SSD / Pendrive Danificado ou Formatado',
    description: 'Extração lógica e reconstrução de partições RAW, fotos e documentos com ferramentas forenses de laboratório.',
    price: 280,
    estimatedTime: '24h - 48h'
  },

  // Suporte Corporativo
  {
    id: 'srv-018',
    category: 'Suporte Corporativo',
    name: 'Contrato Mensal de Suporte Técnico em Informática (Até 5 Máquinas)',
    description: 'Atendimento prioritário remoto e presencial, manutenção preventiva periódica, gestão de backups e help desk direto.',
    price: 650,
    estimatedTime: 'Mensal'
  },
  {
    id: 'srv-019',
    category: 'Suporte Corporativo',
    name: 'Contrato Mensal de Suporte Técnico em Informática (Até 10 Máquinas)',
    description: 'Suporte corporativo completo para empresas, monitoramento de servidores, inventário de hardware e SLA rápido.',
    price: 1100,
    estimatedTime: 'Mensal'
  },
  {
    id: 'srv-020',
    category: 'Suporte Corporativo',
    name: 'Visita Técnica e Atendimento Emergencial Presencial',
    description: 'Deslocamento de técnico especialista da Core Suporte ao local para diagnóstico e resolução emergencial no cliente.',
    price: 180,
    estimatedTime: 'Até 2h no local'
  }
];

// Helper to spell out monetary amounts in Portuguese
export function numberToWordsBRL(valor: number): string {
  if (valor === 0) return 'zero reais';
  
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const converterGrupo = (n: number): string => {
    if (n === 100) return 'cem';
    let res = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) res += centenas[c];

    if (d === 1) {
      if (res) res += ' e ';
      res += especiais[u];
      return res;
    }

    if (d > 1) {
      if (res) res += ' e ';
      res += dezenas[d];
    }

    if (u > 0) {
      if (res) res += ' e ';
      res += unidades[u];
    }

    return res;
  };

  const parteInteira = Math.floor(valor);
  const centavos = Math.round((valor - parteInteira) * 100);

  let resultado = '';
  if (parteInteira >= 1000) {
    const milhares = Math.floor(parteInteira / 1000);
    const resto = parteInteira % 1000;
    resultado += (milhares === 1 ? 'mil' : converterGrupo(milhares) + ' mil');
    if (resto > 0) {
      resultado += (resto <= 100 || resto % 100 === 0 ? ' e ' : ', ') + converterGrupo(resto);
    }
  } else if (parteInteira > 0) {
    resultado += converterGrupo(parteInteira);
  }

  if (parteInteira === 1) {
    resultado += ' real';
  } else if (parteInteira > 1) {
    resultado += ' reais';
  }

  if (centavos > 0) {
    if (resultado) resultado += ' e ';
    resultado += converterGrupo(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  }

  return resultado.trim();
}

const CATALOG_STORAGE_KEY = 'coresuporte_service_catalog_v1';

/**
 * Obtém a lista atual de serviços de manutenção de computadores
 * (carregada do localStorage ou com fallback para CORE_SUPORTE_SERVICES).
 */
export function getStoredServices(): ServiceCatalogItem[] {
  if (typeof window === 'undefined') {
    return CORE_SUPORTE_SERVICES;
  }

  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(CORE_SUPORTE_SERVICES));
      return CORE_SUPORTE_SERVICES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return CORE_SUPORTE_SERVICES;
  } catch (err) {
    console.error('Erro ao ler tabela de serviços do armazenamento local:', err);
    return CORE_SUPORTE_SERVICES;
  }
}

/**
 * Salva ou atualiza um serviço no catálogo (adiciona novo ou edita existente).
 */
export function saveServiceToCatalog(item: ServiceCatalogItem): ServiceCatalogItem[] {
  const current = getStoredServices();
  const existingIndex = current.findIndex(s => s.id === item.id);
  
  let updated: ServiceCatalogItem[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = item;
  } else {
    updated = [item, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coresuporte_service_catalog_updated'));
    } catch (err) {
      console.error('Erro ao persistir serviço na tabela:', err);
    }
  }

  return updated;
}

/**
 * Remove um serviço do catálogo de informática.
 */
export function deleteServiceFromCatalog(serviceId: string): ServiceCatalogItem[] {
  const current = getStoredServices();
  const updated = current.filter(s => s.id !== serviceId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coresuporte_service_catalog_updated'));
    } catch (err) {
      console.error('Erro ao remover serviço:', err);
    }
  }

  return updated;
}

/**
 * Restaura o catálogo de serviços para a lista original da Core Suporte.
 */
export function resetServiceCatalogToDefault(): ServiceCatalogItem[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(CORE_SUPORTE_SERVICES));
      window.dispatchEvent(new CustomEvent('coresuporte_service_catalog_updated'));
    } catch (err) {
      console.error('Erro ao resetar catálogo de serviços:', err);
    }
  }
  return CORE_SUPORTE_SERVICES;
}
