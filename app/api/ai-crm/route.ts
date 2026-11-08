import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { contact, actionType } = await req.json();

    if (!contact) {
      return NextResponse.json({ error: 'Dados do contato são obrigatórios' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback deterministic response if API key is not configured
      return NextResponse.json({
        summary: `Briefing Técnico Core Suporte - ${contact.name} (${contact.company}):\n- Contato com status [${contact.status}] e prioridade [${contact.priority}].\n- ${contact.workOrders?.length || 0} ordem(ns) de serviço vinculada(s).\n- Último contato registrado em: ${new Date(contact.lastContactAt).toLocaleDateString('pt-BR')}.\n- Plantão de Atendimento Técnico: (31) 9 9372-4609.\n- Recomendação: Realizar alinhamento preventivo de suporte técnico sobre equipamentos em campo.`,
        suggestedNextStep: `Contatar ${contact.name} via WhatsApp/Telefone para confirmar agenda de campo e validar liberação dos equipamentos sob a OS ativa.`,
        draftMessage: `Olá ${contact.name}, tudo bem? Aqui é da Core Suporte - Tecnologia em Boas Mãos. Estamos acompanhando as demandas da ${contact.company} e gostaríamos de confirmar os alinhamentos da nossa equipe técnica. Nosso plantão está disponível no (31) 9 9372-4609!`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contactContext = JSON.stringify({
      code: contact.code,
      name: contact.name,
      company: contact.company,
      role: contact.role,
      type: contact.type,
      status: contact.status,
      priority: contact.priority,
      location: contact.location,
      dealValue: contact.dealValue,
      notes: contact.notes,
      interactionsSummary: contact.interactions?.slice(0, 5).map((i: { type: string; title: string; description: string; timestamp: string }) => 
        `[${i.type} em ${new Date(i.timestamp).toLocaleDateString('pt-BR')}]: ${i.title} - ${i.description}`
      ),
      workOrdersSummary: contact.workOrders?.map((w: { id: string; title: string; equipmentCode: string; status: string; priority: string; value: number }) => 
        `[${w.id} - ${w.equipmentCode}]: ${w.title} (Status: ${w.status}, Prioridade: ${w.priority}, R$ ${w.value})`
      )
    }, null, 2);

    let prompt = '';
    if (actionType === 'draft_email') {
      prompt = `Você é um engenheiro de coordenação e especialista de CRM técnico da empresa "Core Suporte - Tecnologia em Boas Mãos" (Contato: (31) 9 9372-4609).
Com base no histórico e perfil deste contato:
${contactContext}

Escreva uma proposta/e-mail formal de alinhamento técnico para ${contact.name} (${contact.company}).
Inclua:
- Assunto técnico claro com código do cliente e número de OS relevante (se houver)
- Tom profissional, objetivo, direto, sem jargões genéricos vazios
- Menção explícita aos equipamentos e status das ordens de serviço em andamento
- Próximos passos e chamada para ação com data/horário sugeridos
- Assinatura com "Core Suporte • Tecnologia em Boas Mãos • Central: (31) 9 9372-4609".`;
    } else if (actionType === 'draft_whatsapp') {
      prompt = `Você é um coordenador de operações técnicas da "Core Suporte - Tecnologia em Boas Mãos" (Plantão: (31) 9 9372-4609).
Com base no histórico deste contato:
${contactContext}

Escreva uma mensagem objetiva para WhatsApp direta para ${contact.name}.
A mensagem deve ser clara, profissional, citar o código de OS ou equipamento se aplicável, e solicitar a confirmação necessária para a equipe de campo avançar. Máximo de 3 parágrafos curtos.`;
    } else {
      // Default: Comprehensive operational briefing and risk diagnosis
      prompt = `Você é o consultor sênior de inteligência operacional do CRM da "Core Suporte - Tecnologia em Boas Mãos" (Plantão Técnico: (31) 9 9372-4609).
Analise minuciosamente os dados do seguinte contato e suas ordens de serviço / histórico:
${contactContext}

Forneça uma resposta estruturada em 3 seções claras:
1. DIAGNÓSTICO OPERACIONAL: Resumo conciso da relação com este contato/empresa, nível de risco técnico e saúde do relacionamento.
2. AÇÃO RECOMENDADA IMEDIATA: Qual deve ser o próximo passo tático da equipe de campo ou comercial nas próximas 24-48h.
3. SUGESTÃO DE MENSAGEM / FOLLOW-UP: Um texto pronto e personalizado para envio imediato ao contato.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const outputText = response.text || 'Sem resposta do modelo.';
    return NextResponse.json({
      content: outputText,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Error generating AI CRM insight:', error);
    const errMessage = error instanceof Error ? error.message : 'Erro ao processar requisição de inteligência artificial';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
