export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string; // estado
  erro?: boolean;
  provider?: 'viacep' | 'brasilapi';
}

/**
 * Busca endereço completo a partir do CEP utilizando a API pública do ViaCEP
 * com fallback transparente para a BrasilAPI.
 *
 * @param cep String contendo o CEP com ou sem formatação (ex: '30130-010' ou '30130010')
 * @returns Dados do endereço formatados ou null se não encontrado
 */
export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return null;
  }

  // 1. Tentar ViaCEP (primário)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (!data.erro && (data.logradouro || data.localidade || data.bairro)) {
        return {
          cep: data.cep || `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`,
          logradouro: data.logradouro || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || '',
          provider: 'viacep'
        };
      }
    }
  } catch (err) {
    console.warn('ViaCEP lookup failed, trying backup API:', err);
  }

  // 2. Fallback: BrasilAPI
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const bData = await res.json();
      if (bData && (bData.street || bData.city || bData.neighborhood)) {
        const formattedCep = bData.cep?.includes('-')
          ? bData.cep
          : `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;

        return {
          cep: formattedCep,
          logradouro: bData.street || '',
          complemento: '',
          bairro: bData.neighborhood || '',
          localidade: bData.city || '',
          uf: bData.state || '',
          provider: 'brasilapi'
        };
      }
    }
  } catch (err) {
    console.error('All CEP providers failed:', err);
  }

  return null;
}
