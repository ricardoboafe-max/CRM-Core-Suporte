import React from 'react';
import Image from 'next/image';
import { PhoneCall, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';

export const CoreSuporteFooter: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-[#BAC7D5] bg-[#0A2540] text-white py-6 px-4">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-auto shrink-0">
            <Image
              src="/assets/aistudio/coreSuporte_logo_Black_88b2d103.png"
              alt="Core Suporte - Tecnologia em Boas Mãos"
              width={376}
              height={100}
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="border-l border-[#3E546B] pl-4 hidden sm:block">
            <p className="text-[12px] font-bold text-white tracking-wide uppercase font-sans">
              Tecnologia em Boas Mãos
            </p>
            <p className="text-[11px] text-[#A2B5CC] font-mono">
              CRM Operacional • Atendimento Técnico de Alta Precisão
            </p>
          </div>
        </div>

        {/* Center / Right: Central de Atendimento */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#000F22] border border-[#3E546B] text-[12px] font-mono text-[#D2E4FF]">
            <Cpu className="w-4 h-4 text-[#00A3BF]" />
            <span>SISTEMA ATIVO</span>
            <span className="text-[#3E546B]">•</span>
            <span className="text-[#6AE1FF]">MG & BRASIL</span>
          </div>

          <a
            href="tel:5531993724609"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#00A3BF] hover:bg-[#008ea6] text-[#000F22] font-bold font-mono text-[12px] transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>(31) 9 9372-4609</span>
          </a>

          <a
            href="https://wa.me/5531993724609"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#DCFCE7] hover:bg-[#bbf7d0] border border-[#16A34A] text-[#14532D] font-bold font-mono text-[12px] transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#16A34A] stroke-[2.5]" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>

        {/* Right: Security & SLA */}
        <div className="text-center md:text-right text-[11px] font-mono text-[#A2B5CC]">
          <div className="flex items-center justify-center md:justify-end gap-1 text-[#00A3BF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">Contrato SLA & NR-10/NR-35</span>
          </div>
          <p className="mt-0.5 text-[#778EA7]">
            Core Suporte © {new Date().getFullYear()} • Todos os direitos reservados
          </p>
        </div>

      </div>
    </footer>
  );
};
