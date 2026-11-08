'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Contact, WorkOrderStatus, WorkOrderItem, InteractionItem } from '@/types/crm';
import { INITIAL_CONTACTS } from '@/lib/initial-data';
import { 
  subscribeContacts,
  getContactsSnapshot,
  getContactsServerSnapshot,
  saveContactsToStorage,
  addContactToStorage, 
  updateContactInStorage, 
  deleteContactFromStorage, 
  addInteractionToContact, 
  addWorkOrderToContact, 
  updateWorkOrderStatusInStorage, 
  resetCrmStorageToDefault 
} from '@/lib/crm-storage';

import { CrmTopBar } from '@/components/CrmTopBar';
import { CrmMetrics } from '@/components/CrmMetrics';
import { CrmFilters } from '@/components/CrmFilters';
import { ContactListItem } from '@/components/ContactListItem';
import { ContactDetail } from '@/components/ContactDetail';
import { PipelineView } from '@/components/PipelineView';
import { ContactFormModal } from '@/components/ContactFormModal';
import { WorkOrderModal } from '@/components/WorkOrderModal';
import { InteractionModal } from '@/components/InteractionModal';
import { AiInsightModal } from '@/components/AiInsightModal';
import { ExportImportModal } from '@/components/ExportImportModal';
import { WorkOrderPrintModal } from '@/components/WorkOrderPrintModal';
import { ReceiptPrintModal } from '@/components/ReceiptPrintModal';
import { ServiceCatalogModal } from '@/components/ServiceCatalogModal';
import { FinancialSummaryPanel } from '@/components/FinancialSummaryPanel';
import { CoreSuporteFooter } from '@/components/CoreSuporteFooter';
import { ServiceCatalogItem } from '@/types/crm';
import { getReminderInfo } from '@/lib/reminder-utils';
import Image from 'next/image';
import { Users, Plus, PhoneCall, MessageSquare } from 'lucide-react';

export default function CrmPage() {
  // Sincronização externa reativa compatível com SSR (previne hydration mismatch e cascading renders)
  const contacts = useSyncExternalStore(
    subscribeContacts,
    getContactsSnapshot,
    getContactsServerSnapshot
  );

  const [selectedContactId, setSelectedContactId] = useState<string | null>(INITIAL_CONTACTS[0]?.id || null);

  const [viewMode, setViewMode] = useState<'master-detail' | 'pipeline'>('master-detail');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [reminderFilter, setReminderFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');

  // Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [initialServiceIdForOS, setInitialServiceIdForOS] = useState<string | undefined>(undefined);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialAction, setAiInitialAction] = useState<'briefing' | 'draft_email' | 'draft_whatsapp'>('briefing');
  const [isExportImportModalOpen, setIsExportImportModalOpen] = useState(false);
  const [isServiceCatalogOpen, setIsServiceCatalogOpen] = useState(false);
  const [printingWorkOrder, setPrintingWorkOrder] = useState<{ workOrder: WorkOrderItem; contact: Contact } | null>(null);
  const [printingReceipt, setPrintingReceipt] = useState<{ workOrder: WorkOrderItem | null; contact: Contact } | null>(null);

  // Filtered & Sorted Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = contact.name.toLowerCase().includes(q);
        const matchesCompany = contact.company.toLowerCase().includes(q);
        const matchesCode = contact.code.toLowerCase().includes(q);
        const matchesRole = contact.role.toLowerCase().includes(q);
        const matchesEmail = contact.email.toLowerCase().includes(q);
        const matchesPhone = contact.phone.toLowerCase().includes(q);
        const matchesLocation = contact.location.toLowerCase().includes(q);
        const matchesTags = contact.tags?.some(t => t.toLowerCase().includes(q));

        if (!matchesName && !matchesCompany && !matchesCode && !matchesRole && !matchesEmail && !matchesPhone && !matchesLocation && !matchesTags) {
          return false;
        }
      }

      // Type Filter
      if (typeFilter !== 'Todos' && contact.type !== typeFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'Todos' && contact.status !== statusFilter) {
        return false;
      }

      // Priority Filter
      if (priorityFilter !== 'Todas' && contact.priority !== priorityFilter) {
        return false;
      }

      // Reminder / Agenda Filter
      if (reminderFilter !== 'Todos') {
        const info = getReminderInfo(contact.returnDate);
        if (reminderFilter === 'com-retorno' && !info) return false;
        if (reminderFilter === 'hoje' && info?.status !== 'today') return false;
        if (reminderFilter === 'atrasado' && info?.status !== 'overdue') return false;
        if (reminderFilter === 'sem-retorno' && !!info) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'value-desc') {
        return (b.dealValue || 0) - (a.dealValue || 0);
      }
      if (sortBy === 'priority-desc') {
        const priorityOrder: Record<string, number> = { 'Crítica': 4, 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      // default: recent
      return new Date(b.lastContactAt).getTime() - new Date(a.lastContactAt).getTime();
    });
  }, [contacts, searchQuery, typeFilter, statusFilter, priorityFilter, reminderFilter, sortBy]);

  // Selected Contact
  const selectedContact = useMemo(() => {
    if (!selectedContactId) return filteredContacts[0] || null;
    const found = contacts.find(c => c.id === selectedContactId);
    return found || filteredContacts[0] || null;
  }, [contacts, selectedContactId, filteredContacts]);

  // Handlers
  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setMobileDetailOpen(true);
  };

  const handleOpenNewContact = () => {
    setContactToEdit(null);
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (data: Partial<Contact>) => {
    if (contactToEdit) {
      updateContactInStorage(contactToEdit.id, data);
    } else {
      const newContact = addContactToStorage(data as Omit<Contact, 'id' | 'createdAt' | 'lastContactAt' | 'interactions' | 'workOrders'>);
      setSelectedContactId(newContact.id);
      setMobileDetailOpen(true);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    const target = contacts.find(c => c.id === contactId);
    const confirmName = target ? target.name : 'este contato';
    if (window.confirm(`Tem certeza que deseja remover ${confirmName}? Esta ação não pode ser desfeita.`)) {
      const updated = deleteContactFromStorage(contactId);
      if (selectedContactId === contactId) {
        setSelectedContactId(updated[0]?.id || null);
        setMobileDetailOpen(false);
      }
    }
  };

  const handleAddWorkOrder = (osData: Omit<WorkOrderItem, 'id'>) => {
    if (!selectedContact) return;
    addWorkOrderToContact(selectedContact.id, osData);
  };

  const handleAddInteraction = (item: Omit<InteractionItem, 'id' | 'timestamp'>) => {
    if (!selectedContact) return;
    addInteractionToContact(selectedContact.id, item);
  };

  const handleUpdateWorkOrderStatus = (contactId: string, osId: string, status: WorkOrderStatus) => {
    updateWorkOrderStatusInStorage(contactId, osId, status);
  };

  const handleUpdateNotes = (contactId: string, notes: string) => {
    updateContactInStorage(contactId, { notes });
  };

  const handleUpdateReturnDate = (contactId: string, returnDate?: string, reminderNotes?: string) => {
    updateContactInStorage(contactId, { returnDate, reminderNotes });
  };

  const handleUpdatePipelineStage = (contactId: string, stage: Contact['pipelineStage']) => {
    updateContactInStorage(contactId, { pipelineStage: stage });
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar a base de contatos original de demonstração da Field Operations?')) {
      const defaults = resetCrmStorageToDefault();
      setSelectedContactId(defaults[0]?.id || null);
    }
  };

  const handleOpenAi = (contact: Contact, action: 'briefing' | 'draft_email' | 'draft_whatsapp' = 'briefing') => {
    setSelectedContactId(contact.id);
    setAiInitialAction(action);
    setIsAiModalOpen(true);
  };

  const handleClearFilters = () => {
    setTypeFilter('Todos');
    setStatusFilter('Todos');
    setPriorityFilter('Todas');
    setReminderFilter('Todos');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      
      {/* Top Application Bar */}
      <CrmTopBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewContactModal={handleOpenNewContact}
        onOpenExportImport={() => setIsExportImportModalOpen(true)}
        onResetData={handleResetData}
        totalContacts={contacts.length}
        onOpenServiceCatalog={() => setIsServiceCatalogOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-6 py-2">
        
        {/* Painel de Resumo Financeiro - Faturamento Realizado de OS Finalizadas */}
        <FinancialSummaryPanel
          contacts={contacts}
          onSelectContact={(c) => {
            setSelectedContactId(c.id);
            setViewMode('master-detail');
            setMobileDetailOpen(true);
          }}
        />

        {/* KPI Metrics Strip */}
        <CrmMetrics
          contacts={contacts}
          onFilterByStatus={(st) => {
            setStatusFilter(st);
            setViewMode('master-detail');
          }}
          onFilterByPriority={(pr) => {
            setPriorityFilter(pr);
            setViewMode('master-detail');
          }}
          onFilterByReminder={(rf) => {
            setReminderFilter(rf === 'overdue' ? 'atrasado' : rf === 'today' ? 'hoje' : 'com-retorno');
            setViewMode('master-detail');
          }}
        />

        {/* Filters and Search Bar */}
        <CrmFilters
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          reminderFilter={reminderFilter}
          onReminderFilterChange={setReminderFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          filteredCount={filteredContacts.length}
          totalCount={contacts.length}
          onClearFilters={handleClearFilters}
        />

        {/* View Mode 1: Master-Detail Layout */}
        {viewMode === 'master-detail' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-8">
            
            {/* Master List Column (40% width on tablet/desktop) */}
            <div className={`md:col-span-5 lg:col-span-5 ${mobileDetailOpen ? 'hidden md:block' : 'block'}`}>
              
              <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-2.5 mb-2 flex items-center justify-between text-[11px] font-mono text-[#3E546B]">
                <span className="font-bold uppercase tracking-wider text-[#0A2540]">
                  Diretório de Contatos ({filteredContacts.length})
                </span>
                <span>Clique para gerenciar</span>
              </div>

              {filteredContacts.length > 0 ? (
                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  {filteredContacts.map(contact => (
                    <ContactListItem
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContact?.id === contact.id}
                      onSelect={handleSelectContact}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-[#D8E0E9] rounded-[4px] p-8 text-center">
                  <Users className="w-10 h-10 text-[#778EA7] mx-auto mb-2" />
                  <p className="font-bold text-[14px] text-[#0A2540]">Nenhum contato encontrado</p>
                  <p className="text-[12px] text-[#43474D] mt-1">
                    Nenhum resultado corresponde aos filtros selecionados.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-3 px-3 py-1.5 bg-[#EFF4FF] hover:bg-[#DDE3EE] border border-[#BAC7D5] rounded-[4px] text-[12px] font-mono font-bold text-[#0A2540]"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>

            {/* Detail Work Area Column (60% width on tablet/desktop) */}
            <div className={`md:col-span-7 lg:col-span-7 ${!mobileDetailOpen ? 'hidden md:block' : 'block'}`}>
              {selectedContact ? (
                <ContactDetail
                  key={selectedContact.id}
                  contact={selectedContact}
                  onBackMobile={() => setMobileDetailOpen(false)}
                  onEditContact={handleOpenEditContact}
                  onDeleteContact={handleDeleteContact}
                  onOpenNewWorkOrderModal={() => {
                    setInitialServiceIdForOS(undefined);
                    setIsWorkOrderModalOpen(true);
                  }}
                  onOpenNewInteractionModal={() => setIsInteractionModalOpen(true)}
                  onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
                  onUpdateNotes={handleUpdateNotes}
                  onOpenAiModal={handleOpenAi}
                  onPrintWorkOrder={(workOrder) => setPrintingWorkOrder({ workOrder, contact: selectedContact })}
                  onPrintReceipt={(workOrder) => setPrintingReceipt({ workOrder: workOrder || null, contact: selectedContact })}
                  onOpenServiceCatalog={() => setIsServiceCatalogOpen(true)}
                  onUpdateReturnDate={handleUpdateReturnDate}
                />
              ) : (
                <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-8 sm:p-12 text-center shadow-xs">
                  <div className="max-w-[280px] mx-auto mb-4 relative">
                    <Image
                      src="/assets/aistudio/coreSuporte_tel_879e29c3.png"
                      alt="Core Suporte - Tecnologia em Boas Mãos - (31) 9 9372-4609"
                      width={494}
                      height={351}
                      className="w-full h-auto object-contain mx-auto"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  </div>
                  <h3 className="font-extrabold text-[18px] text-[#0A2540] font-sans">
                    Core Suporte // Tecnologia em Boas Mãos
                  </h3>
                  <p className="text-[13px] text-[#43474D] mt-1.5 max-w-md mx-auto leading-relaxed">
                    Selecione um cliente, fornecedor ou técnico na lista ao lado para ver o histórico operacional, ordens de serviço e comandos de ação rápida.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                    <button
                      onClick={handleOpenNewContact}
                      className="px-4 py-2 bg-[#00A3BF] hover:bg-[#008ea6] text-[#000F22] font-bold text-[13px] rounded-[4px] inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Cadastrar Novo Contato</span>
                    </button>

                    <a
                      href="tel:5531993724609"
                      className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#123659] text-white font-mono font-bold text-[12px] rounded-[4px] inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#00A3BF]" />
                      <span>Ligar: (31) 9 9372-4609</span>
                    </a>

                    <a
                      href="https://wa.me/5531993724609"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] font-mono font-bold text-[12px] rounded-[4px] inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>WhatsApp Suporte</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* View Mode 2: Pipeline Kanban Layout */}
        {viewMode === 'pipeline' && (
          <div className="pb-8">
            <div className="bg-white border border-[#D8E0E9] rounded-[4px] p-3 mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[14px] text-[#0A2540] uppercase font-mono">
                  Pipeline Operacional & Ciclo de Vida do Cliente
                </h3>
                <p className="text-[12px] text-[#43474D]">
                  Gerencie a evolução dos contatos desde o Lead Inicial até Contratos Ativos e Operação de Campo
                </p>
              </div>

              <button
                onClick={handleOpenNewContact}
                className="px-3.5 py-1.5 bg-[#00A3BF] hover:bg-[#008ea6] text-[#000F22] font-bold text-[12px] font-mono rounded-[4px] flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Contato</span>
              </button>
            </div>

            <PipelineView
              contacts={filteredContacts}
              onSelectContact={(c) => {
                setSelectedContactId(c.id);
                setViewMode('master-detail');
                setMobileDetailOpen(true);
              }}
              onUpdateStage={handleUpdatePipelineStage}
            />
          </div>
        )}

      </main>

      {/* MODALS */}
      
      {/* 1. Contact Form Modal (Create / Edit) */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
      />

      {/* 2. Work Order Modal */}
      {selectedContact && (
        <WorkOrderModal
          key={initialServiceIdForOS || 'new-os'}
          isOpen={isWorkOrderModalOpen}
          onClose={() => {
            setIsWorkOrderModalOpen(false);
            setInitialServiceIdForOS(undefined);
          }}
          contactName={selectedContact.name}
          onSave={handleAddWorkOrder}
          initialServiceId={initialServiceIdForOS}
        />
      )}

      {/* 3. Interaction Modal */}
      {selectedContact && (
        <InteractionModal
          isOpen={isInteractionModalOpen}
          onClose={() => setIsInteractionModalOpen(false)}
          contactName={selectedContact.name}
          onSave={handleAddInteraction}
        />
      )}

      {/* 4. AI Insight Modal */}
      <AiInsightModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        contact={selectedContact}
        initialAction={aiInitialAction}
      />

      {/* 5. Export / Import Modal */}
      {isExportImportModalOpen && (
        <ExportImportModal
          isOpen={isExportImportModalOpen}
          onClose={() => setIsExportImportModalOpen(false)}
          contacts={contacts}
          onImportSuccess={(newContacts) => {
            saveContactsToStorage(newContacts);
            if (newContacts.length > 0) {
              setSelectedContactId(newContacts[0].id);
            }
          }}
        />
      )}

      {/* 6. Service Catalog Modal */}
      {isServiceCatalogOpen && (
        <ServiceCatalogModal
          isOpen={isServiceCatalogOpen}
          onClose={() => setIsServiceCatalogOpen(false)}
          onSelectServiceToCreateOS={(service: ServiceCatalogItem) => {
            setIsServiceCatalogOpen(false);
            setInitialServiceIdForOS(service.id);
            if (!selectedContact && contacts.length > 0) {
              setSelectedContactId(contacts[0].id);
            }
            setIsWorkOrderModalOpen(true);
          }}
        />
      )}

      {/* 7. Work Order Print Modal */}
      {printingWorkOrder && (
        <WorkOrderPrintModal
          isOpen={!!printingWorkOrder}
          onClose={() => setPrintingWorkOrder(null)}
          workOrder={printingWorkOrder.workOrder}
          contact={printingWorkOrder.contact}
        />
      )}

      {/* 8. Receipt Print Modal */}
      {printingReceipt && (
        <ReceiptPrintModal
          isOpen={!!printingReceipt}
          onClose={() => setPrintingReceipt(null)}
          workOrder={printingReceipt.workOrder}
          contact={printingReceipt.contact}
        />
      )}

      {/* Core Suporte Official Support & Brand Footer */}
      <CoreSuporteFooter />

    </div>
  );
}
