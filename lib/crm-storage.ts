import { Contact, InteractionItem, WorkOrderItem, WorkOrderStatus } from '@/types/crm';
import { INITIAL_CONTACTS } from './initial-data';

const STORAGE_KEY = 'field_ops_crm_contacts_v2';

let memoryContacts: Contact[] = INITIAL_CONTACTS;
let memoryLoaded = false;

function loadMemoryIfNeeded(): void {
  if (typeof window !== 'undefined' && !memoryLoaded) {
    memoryLoaded = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryContacts = parsed;
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTACTS));
    } catch (e) {
      console.error('Error initializing memory contacts:', e);
    }
  }
}

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach(fn => fn());
}

export function subscribeContacts(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          memoryContacts = parsed;
          callback();
        }
      } catch {
        // ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

export function getContactsSnapshot(): Contact[] {
  loadMemoryIfNeeded();
  return memoryContacts;
}

export function getContactsServerSnapshot(): Contact[] {
  return INITIAL_CONTACTS;
}

export function getStoredContacts(): Contact[] {
  loadMemoryIfNeeded();
  return memoryContacts;
}

export function saveContactsToStorage(contacts: Contact[]): void {
  memoryContacts = contacts;
  memoryLoaded = true;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    notifyListeners();
  } catch (err) {
    console.error('Error saving contacts to storage:', err);
  }
}

export function generateNextCode(type: string): string {
  const prefixMap: Record<string, string> = {
    'Cliente': 'CLI',
    'Lead': 'LED',
    'Fornecedor': 'FOR',
    'Engenheiro de Campo': 'ENG',
    'Técnico Especialista': 'TEC',
    'Parceiro': 'PRC'
  };
  const prefix = prefixMap[type] || 'OPS';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function addContactToStorage(contactData: Omit<Contact, 'id' | 'createdAt' | 'lastContactAt' | 'interactions' | 'workOrders'>): Contact {
  const contacts = getStoredContacts();
  const id = `ct-${Date.now()}`;
  const now = new Date().toISOString();
  const newContact: Contact = {
    ...contactData,
    id,
    code: contactData.code || generateNextCode(contactData.type),
    createdAt: now,
    lastContactAt: now,
    interactions: [
      {
        id: `int-${Date.now()}`,
        type: 'nota',
        title: 'Contato cadastrado no sistema',
        description: `Registro inicial de ${contactData.name} (${contactData.company || 'Pessoa Física'}) cadastrado com sucesso.`,
        timestamp: now,
        author: 'Operador do Sistema'
      }
    ],
    workOrders: []
  };

  const updated = [newContact, ...contacts];
  saveContactsToStorage(updated);
  return newContact;
}

export function updateContactInStorage(contactId: string, updates: Partial<Contact>): Contact[] {
  const contacts = getStoredContacts();
  const updated = contacts.map(c => {
    if (c.id === contactId) {
      return {
        ...c,
        ...updates,
        lastContactAt: new Date().toISOString()
      };
    }
    return c;
  });
  saveContactsToStorage(updated);
  return updated;
}

export function deleteContactFromStorage(contactId: string): Contact[] {
  const contacts = getStoredContacts();
  const updated = contacts.filter(c => c.id !== contactId);
  saveContactsToStorage(updated);
  return updated;
}

export function addInteractionToContact(contactId: string, item: Omit<InteractionItem, 'id' | 'timestamp'>): Contact[] {
  const contacts = getStoredContacts();
  const now = new Date().toISOString();
  const newInteraction: InteractionItem = {
    ...item,
    id: `int-${Date.now()}`,
    timestamp: now
  };

  const updated = contacts.map(c => {
    if (c.id === contactId) {
      return {
        ...c,
        lastContactAt: now,
        interactions: [newInteraction, ...(c.interactions || [])]
      };
    }
    return c;
  });

  saveContactsToStorage(updated);
  return updated;
}

export function addWorkOrderToContact(contactId: string, item: Omit<WorkOrderItem, 'id'>): Contact[] {
  const contacts = getStoredContacts();
  const osId = `OS-${Math.floor(9000 + Math.random() * 999)}`;
  const newOS: WorkOrderItem = {
    ...item,
    id: osId
  };

  const updated = contacts.map(c => {
    if (c.id === contactId) {
      return {
        ...c,
        workOrders: [newOS, ...(c.workOrders || [])]
      };
    }
    return c;
  });

  saveContactsToStorage(updated);
  return updated;
}

export function updateWorkOrderStatusInStorage(contactId: string, osId: string, status: WorkOrderStatus): Contact[] {
  const contacts = getStoredContacts();
  const updated = contacts.map(c => {
    if (c.id === contactId) {
      const updatedOrders = (c.workOrders || []).map(os => {
        if (os.id === osId) {
          return { ...os, status };
        }
        return os;
      });
      return {
        ...c,
        workOrders: updatedOrders
      };
    }
    return c;
  });

  saveContactsToStorage(updated);
  return updated;
}

export function updateWorkOrderInStorage(contactId: string, osId: string, updatedData: Partial<WorkOrderItem>): Contact[] {
  const contacts = getStoredContacts();
  const updated = contacts.map(c => {
    if (c.id === contactId) {
      const updatedOrders = (c.workOrders || []).map(os => {
        if (os.id === osId) {
          return { ...os, ...updatedData };
        }
        return os;
      });
      return {
        ...c,
        workOrders: updatedOrders
      };
    }
    return c;
  });

  saveContactsToStorage(updated);
  return updated;
}

export function resetCrmStorageToDefault(): Contact[] {
  memoryContacts = INITIAL_CONTACTS;
  memoryLoaded = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTACTS));
    notifyListeners();
  }
  return INITIAL_CONTACTS;
}

export function exportContactsToCSV(contacts: Contact[]): string {
  const headers = [
    'Codigo',
    'Nome',
    'Empresa',
    'Cargo',
    'Email',
    'Telefone',
    'WhatsApp',
    'Tipo',
    'Status',
    'Prioridade',
    'Localizacao',
    'CNPJ_CPF',
    'Valor_Estimado_BRL',
    'Estagio_Pipeline',
    'Data_Retorno',
    'Lembrete',
    'Qtd_Ordens_Servico'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = contacts.map(c => [
    escapeCSV(c.code),
    escapeCSV(c.name),
    escapeCSV(c.company),
    escapeCSV(c.role),
    escapeCSV(c.email),
    escapeCSV(c.phone),
    escapeCSV(c.whatsapp),
    escapeCSV(c.type),
    escapeCSV(c.status),
    escapeCSV(c.priority),
    escapeCSV(c.location),
    escapeCSV(c.documentId || ''),
    escapeCSV(c.dealValue),
    escapeCSV(c.pipelineStage),
    escapeCSV(c.returnDate || ''),
    escapeCSV(c.reminderNotes || ''),
    escapeCSV(c.workOrders?.length || 0)
  ].join(';'));

  return [headers.join(';'), ...rows].join('\r\n');
}

export function exportContactsToJSON(contacts: Contact[]): string {
  return JSON.stringify(contacts, null, 2);
}

export function importContactsFromJSON(jsonString: string): { success: boolean; contacts?: Contact[]; message?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      return { success: false, message: 'O arquivo JSON deve conter uma lista (array) de contatos válida.' };
    }
    
    // Quick validation
    const valid = data.filter(item => item && item.name && typeof item.name === 'string');
    if (valid.length === 0) {
      return { success: false, message: 'Nenhum contato válido encontrado no arquivo fornecido.' };
    }

    const current = getStoredContacts();
    const existingIds = new Set(current.map(c => c.id));
    
    const formatted = valid.map((item, idx) => ({
      id: item.id && !existingIds.has(item.id) ? item.id : `ct-${Date.now()}-${idx}`,
      code: item.code || generateNextCode(item.type || 'Cliente'),
      name: item.name,
      company: item.company || 'Empresa não informada',
      role: item.role || 'Cargo não informado',
      email: item.email || '',
      phone: item.phone || '',
      whatsapp: item.whatsapp || '',
      type: item.type || 'Cliente',
      status: item.status || 'Ativo',
      priority: item.priority || 'Média',
      location: item.location || 'Localização não informada',
      documentId: item.documentId || '',
      tags: Array.isArray(item.tags) ? item.tags : ['Importado'],
      dealValue: typeof item.dealValue === 'number' ? item.dealValue : 0,
      pipelineStage: item.pipelineStage || 'Lead Inicial',
      notes: item.notes || '',
      lastContactAt: item.lastContactAt || new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
      interactions: Array.isArray(item.interactions) ? item.interactions : [],
      workOrders: Array.isArray(item.workOrders) ? item.workOrders : []
    })) as Contact[];

    const combined = [...formatted, ...current];
    saveContactsToStorage(combined);
    return { success: true, contacts: combined };
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Erro ao processar JSON';
    return { success: false, message: errMsg };
  }
}
