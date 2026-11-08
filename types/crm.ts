export type ContactType = 
  | 'Cliente'
  | 'Lead'
  | 'Fornecedor'
  | 'Engenheiro de Campo'
  | 'Técnico Especialista'
  | 'Parceiro';

export type ContactStatus = 
  | 'Ativo'
  | 'Pendente'
  | 'Em Execução'
  | 'Aguardando Retorno'
  | 'Inativo';

export type PriorityLevel = 'Crítica' | 'Alta' | 'Média' | 'Baixa';

export type InteractionType = 
  | 'ligacao'
  | 'whatsapp'
  | 'email'
  | 'visita_campo'
  | 'ordem_servico'
  | 'nota';

export interface InteractionItem {
  id: string;
  type: InteractionType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  author: string;
}

export type WorkOrderStatus = 
  | 'Pendente'
  | 'Em Execução'
  | 'Aguardando Peças'
  | 'Concluída'
  | 'Crítica / Atrasada';

export interface WorkOrderItem {
  id: string; // e.g. OS-8491
  title: string;
  equipmentCode: string; // e.g. PC-CORE-104 or NOTE-DELL-5590
  equipmentType?: string; // Notebook, Desktop Gamer, Servidor, MacBook, All-in-One
  brandModel?: string; // ex: Dell Inspiron 15 3000, Lenovo ThinkPad E14
  serialNumber?: string;
  accessories?: string; // ex: Fonte original, cabo de força, mouse
  userPassword?: string; // para testes pós-formatação
  status: WorkOrderStatus;
  priority: PriorityLevel;
  scheduledDate: string;
  value: number; // in BRL
  description?: string;
  reportedIssue?: string; // defeito relatado pelo cliente
  technicalDiagnosis?: string; // laudo técnico de bancada
  partsReplaced?: string; // ex: SSD NVMe 512GB Kingston, Pasta Térmica Arctic MX-4
  warrantyDays?: number; // padrão 90 dias
  paymentStatus?: 'Pendente' | 'Pago' | 'Parcial';
  paymentMethod?: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Boleto' | 'Faturado';
  technicianAssigned?: string;
}

export interface Contact {
  id: string; // e.g. CT-1092
  code: string; // JetBrains Mono reference code e.g. CLI-2049
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  type: ContactType;
  status: ContactStatus;
  priority: PriorityLevel;
  location: string;
  // Structured address with CEP
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  documentId?: string; // CNPJ or CPF
  tags: string[];
  dealValue: number; // in BRL
  pipelineStage: 'Lead Inicial' | 'Proposta Técnica' | 'Em Negociação' | 'Contrato Ativo' | 'Em Operação';
  notes: string;
  // Agendamento e Lembrete de Retorno
  returnDate?: string; // Formato YYYY-MM-DD
  reminderNotes?: string; // Texto do lembrete / motivo do retorno
  lastContactAt: string;
  createdAt: string;
  interactions: InteractionItem[];
  workOrders: WorkOrderItem[];
}

export interface ServiceCatalogItem {
  id: string;
  category: 'Computadores e PCs' | 'Notebooks' | 'Servidores e Redes' | 'Segurança e Otimização' | 'Suporte Corporativo';
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
}

export interface ReceiptData {
  receiptNumber: string;
  clientName: string;
  clientDocument?: string;
  clientAddress?: string;
  clientPhone?: string;
  amount: number;
  amountInWords?: string;
  description: string;
  workOrderId?: string;
  equipment?: string;
  paymentMethod: string;
  issueDate: string;
  receivedBy: string;
}

export interface CrmFilterState {
  searchQuery: string;
  typeFilter: string; // 'Todos' | ContactType
  statusFilter: string; // 'Todos' | ContactStatus
  priorityFilter: string; // 'Todas' | PriorityLevel
  pipelineFilter: string; // 'Todos' | Stage
  sortBy: 'recent' | 'name-asc' | 'name-desc' | 'value-desc' | 'priority-desc';
}
