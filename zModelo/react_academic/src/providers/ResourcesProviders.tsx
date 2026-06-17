import React from 'react';
import { apiGetResources } from '../resources/api/api.resources';
import type { Resource } from './ResourcesContext';
import { ResourceContext } from './ResourcesContext';

/**
 * ============================================================================
 * ResourcesProviders - O "Provider" que distribui os Recursos
 * ============================================================================
 * 
 * Um Provider é um componente React que encapsula lógica e disponibiliza
 * dados para todos os filhos via Context API.
 * 
 * FLUXO COMPLETO (Backend → Providers → Componentes):
 * 
 * 1. BACKEND (NestJS):
 *    - resources.ts gera um array de Resource (URLs de endpoints)
 *    - ResourceController.getAll() retorna esse array via GET /rest/resources
 * 
 * 2. FRONTEND - ResourcesProviders (este arquivo):
 *    - useEffect(): Na primeira renderização, faz fetch de GET /rest/resources
 *    - Armazena em sessionStorage (chave: 'academico_resources')
 *    - Se já existe em sessionStorage, usa o cache (evita requisição desnecessária)
 *    - Disponibiliza via <ResourceContext.Provider>
 * 
 * 3. FRONTEND - Componentes:
 *    - Importam useResources() de ResourcesContext
 *    - Chamam getEndpoint('hospede', id) para obter URLs
 *    - Não precisam conhecer as URLs reais, só o nome da entidade
 * 
 * VANTAGEM DA ARQUITETURA:
 * - Centralizamos as URLs em um único lugar (Backend)
 * - Frontend acessa dinamicamente (sem hardcode)
 * - sessionStorage reduz requisições desnecessárias
 * - Se mudarmos /rest/hospede/listar para /v2/hospedes, não precisamos
 *   alterar nenhum componente React, só atualizar no backend
 */
export function ResourcesProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    async function getResources() {
      setLoading(true);
      const resourceStorageKey = 'academico_resources';
      const academico_resource = sessionStorage.getItem(resourceStorageKey);

      if (academico_resource) {
        setResources(JSON.parse(academico_resource));
        setLoading(false);
        return;
      }

      try {
        const response = await apiGetResources();
        //console.log(response.data);
        if (response.data) {
          setResources(response.data);
          sessionStorage.setItem(resourceStorageKey, JSON.stringify(response.data));
        }
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getResources();
  }, []);

  // hook useCallback => faz uma cópia da função na memória.
  // monitora o recurso [resources], havendo modificação
  // do conteúdo - faz novo processamento.
  /**
   * ============================================================================
   * getEndpoint() - Função que retorna a URL real do endpoint
   * ============================================================================
   * 
   * Recebe o nome da entidade e opcionalmente um ID
   * Busca no array de Resources e retorna a URL correspondente
   * 
   * EXEMPLOS:
   * getEndpoint('hospede')       → '/rest/hospede/listar'
   * getEndpoint('hospede', 42)   → '/rest/hospede/buscar/42'
   * getEndpoint('funcionario', 5) → '/rest/funcionario/alterar/5'
   *                                 (retorna URL para PUT, precisa verificar context)
   * 
   * LÓGICA INTERNA:
   * 1. Procura por um resource onde:
   *    - r.name === name (ex: 'hospede')
   *    - Se passou ID, procura resource que tem :id no endpoint
   *    - Se não passou ID, procura resource sem :id (ex: listar)
   * 
   * 2. Se encontrou e ID foi passado:
   *    - Substitui ':id' pela string do ID
   *    - Exemplo: '/rest/hospede/buscar/:id' → '/rest/hospede/buscar/42'
   * 
   * 3. Retorna undefined se não encontrou (erro de tipagem)
   * 
   * ONDE É USADO:
   * - Em componentes para montar URLs de requisições HTTP
   * - Exemplo: fetch(getEndpoint('hospede', id)).then(...)
   * - Exemplo: axios.post(getEndpoint('hospede'), data)
   */
  const getEndpoint = React.useCallback(
    (name: string, id?: string | number): string | undefined => {
      const resource = resources.find((r) => {
        const hasId = r.endpoint.includes(':id');
        return r.name === name && (id ? hasId : !hasId);
      });

      if (resource) {
        if (id && resource.endpoint.includes(':id')) {
          return resource.endpoint.replace(':id', String(id));
        }
        return resource.endpoint;
      }

      return undefined;
    },
    [resources],
  );

  return (
    <ResourceContext.Provider value={{ resources, getEndpoint, loading }}>
      {children}
    </ResourceContext.Provider>
  );
}

