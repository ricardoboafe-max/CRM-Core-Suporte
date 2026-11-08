import React, { useState } from 'react';
import Image from 'next/image';
import { Contact } from '@/types/crm';
import { exportContactsToCSV, exportContactsToJSON, importContactsFromJSON } from '@/lib/crm-storage';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onImportSuccess: (imported: Contact[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onImportSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = exportContactsToCSV(contacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `core-suporte-contatos-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: `Arquivo CSV exportado com sucesso (${contacts.length} contatos).` });
  };

  const handleDownloadJSON = () => {
    const jsonContent = exportContactsToJSON(contacts);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `core-suporte-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: `Backup JSON exportado com sucesso (${contacts.length} contatos).` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!importJsonText.trim()) {
      setStatusMessage({ type: 'error', text: 'Cole ou faça upload de um arquivo JSON válido.' });
      return;
    }

    const result = importContactsFromJSON(importJsonText);
    if (result.success && result.contacts) {
      onImportSuccess(result.contacts);
      setStatusMessage({ type: 'success', text: `Importação concluída com sucesso! Total na base: ${result.contacts.length}` });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: result.message || 'Falha ao importar contatos.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A2540]/65 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-lg bg-white border border-[#0A2540]/20 rounded-[8px] shadow-[0px_8px_20px_-2px_rgba(10,37,64,0.25)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#BAC7D5]">
          <div className="flex items-center gap-2.5">
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
              <h3 className="font-extrabold text-[15px] uppercase tracking-wide font-sans">
                Exportação & Importação de Dados
              </h3>
              <p className="text-[11px] text-[#A2B5CC] font-mono">
                Core Suporte // Tecnologia em Boas Mãos
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

        {/* Tab switch */}
        <div className="flex border-b border-[#BAC7D5] bg-[#EFF4FF]">
          <button
            onClick={() => {
              setActiveTab('export');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 text-[13px] font-bold font-mono transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'bg-white text-[#0A2540] border-[#0A2540]'
                : 'text-[#3E546B] border-transparent hover:text-[#0A2540]'
            }`}
          >
            <Download className="w-4 h-4 text-[#00A3BF]" />
            <span>Exportar Dados</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('import');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 text-[13px] font-bold font-mono transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'bg-white text-[#0A2540] border-[#0A2540]'
                : 'text-[#3E546B] border-transparent hover:text-[#0A2540]'
            }`}
          >
            <Upload className="w-4 h-4 text-[#0284C7]" />
            <span>Importar JSON</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {statusMessage && (
            <div
              className={`p-3 rounded-[4px] border font-mono text-[12px] flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#DCFCE7] border-[#16A34A] text-[#14532D]'
                  : 'bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-[13px] text-[#43474D] leading-relaxed">
                Exporte todos os {contacts.length} contatos operacionais da sua base para análise em planilhas ou preservação em arquivo estruturado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadCSV}
                  className="p-4 bg-[#F8F9FF] hover:bg-[#EFF4FF] border border-[#BAC7D5] hover:border-[#00A3BF] rounded-[4px] text-left transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[14px] text-[#0A2540] mb-1">
                      <FileText className="w-4 h-4 text-[#00A3BF]" />
                      <span>Exportar CSV</span>
                    </div>
                    <p className="text-[11px] text-[#43474D]">
                      Compatível com Microsoft Excel, Google Planilhas e sistemas ERP.
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-mono font-bold text-[#00687A] group-hover:underline">
                    Baixar .csv ({contacts.length} linhas) ↓
                  </span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="p-4 bg-[#F8F9FF] hover:bg-[#EFF4FF] border border-[#BAC7D5] hover:border-[#0A2540] rounded-[4px] text-left transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[14px] text-[#0A2540] mb-1">
                      <Download className="w-4 h-4 text-[#0A2540]" />
                      <span>Backup JSON Completo</span>
                    </div>
                    <p className="text-[11px] text-[#43474D]">
                      Inclui todo o histórico de interações e ordens de serviço ativas.
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-mono font-bold text-[#0A2540] group-hover:underline">
                    Baixar .json estruturado ↓
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[13px] text-[#43474D] leading-relaxed">
                Importe contatos a partir de um backup em JSON. Novos contatos serão adicionados à base existente sem sobrescrever dados não conflitantes.
              </p>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Fazer upload de arquivo .json:
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full text-[12px] font-mono text-[#3E546B] file:mr-3 file:py-1.5 file:px-3 file:rounded-[3px] file:border file:border-[#BAC7D5] file:bg-[#F4F6F9] file:text-[12px] file:font-mono file:font-bold hover:file:bg-[#E9EEFA]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0A2540] mb-1 font-mono text-[11px] uppercase">
                  Ou cole o texto JSON aqui:
                </label>
                <textarea
                  rows={5}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='[ { "name": "Exemplo", "company": "Empresa X", "phone": "+55 11 99999-9999" } ]'
                  className="w-full p-2.5 bg-[#F8F9FF] border border-[#BAC7D5] rounded-[4px] text-[11px] font-mono outline-none focus:border-[#00A3BF] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExecuteImport}
                  className="px-4 py-2 bg-[#0A2540] hover:bg-[#123659] text-white rounded-[4px] font-mono font-bold text-[12px] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#00A3BF]" />
                  <span>Confirmar e Importar</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#F8F9FF] border-t border-[#BAC7D5] p-3 px-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-[#F4F6F9] border border-[#BAC7D5] text-[#3E546B] font-mono font-bold text-[12px] rounded-[4px] transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
