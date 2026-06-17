import React from 'react';

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

/**
 * ============================================================================
 * RESOURCE CONTEXT - O que é e como funciona?
 * ============================================================================
 * 
 * Este arquivo define o Context API que distribui os Recursos (URLs dos
 * endpoints) para toda a aplicação React, sem necessidade de prop drilling.
 * 
 * ONDE ESTÁ SENDO USADO:
 * 1. ResourcesProviders (ResourcesProviders.tsx):
 *    - Faz fetch dos recursos do backend: GET /rest/resources
 *    - Armazena em state local (resources)
 *    - Disponibiliza via <ResourceContext.Provider>
 * 
 * 2. Componentes React (qualquer arquivo):
 *    - Importa e chama: const { resources, getEndpoint } = useResources()
 *    - Sem prop drilling: não precisa passar props por 10 níveis de componentes
 * 
 * 3. Exemplo de uso em um componente:
 *    const { getEndpoint } = useResources();
 *    const urlBuscar = getEndpoint('hospede', 123);
 *    // Resultado: '/rest/hospede/buscar/123'
 *    fetch(urlBuscar).then(...);
 */
export interface Resource {
  name: string;
  endpoint: string;
  method: VERBO_HTTP[];
}

/**
 * ============================================================================
 * ResourcesContextType - Tipagem do Context
 * ============================================================================
 * 
 * Define quais dados estão disponíveis no Context:
 * - resources: Array de Resource com todos os endpoints do backend
 * - getEndpoint: Função que retorna a URL sem :id ou com :id substituído
 * - loading: Booleano indicando se os recursos estão sendo carregados
 * 
 * VANTAGEM:
 * Qualquer componente pode chamar useResources() e ter acesso a isso
 * sem passar props em cadeia (evita prop drilling)
 */
interface ResourcesContextType {
  resources: Resource[];
  getEndpoint: (name: string, id?: string | number) => string | undefined;
  loading: boolean;
}

export const ResourceContext = React.createContext<ResourcesContextType | undefined>(
  undefined,
);

/**
 * ============================================================================
 * useResources() - Hook customizado para acessar Resources
 * ============================================================================
 * 
 * Este é um hook que qualquer componente pode chamar para obter os recursos.
 * 
 * COMO USAR:
 * 1. Em qualquer componente que estiver dentro de <ResourcesProviders>:
 *    const { resources, getEndpoint, loading } = useResources();
 * 
 * 2. Exemplos práticos:
 *    // Listar todos os hospedes
 *    const url = getEndpoint('hospede');
 *    // Resultado: '/rest/hospede/listar'
 *    
 *    // Buscar hospede com ID 42
 *    const url = getEndpoint('hospede', 42);
 *    // Resultado: '/rest/hospede/buscar/42'
 *    
 *    // Alterar funcionario 5
 *    const url = getEndpoint('funcionario', 5);
 *    // Resultado: '/rest/funcionario/alterar/5'
 * 
 * VANTAGEM:
 * - Não há hardcoding de URLs no código (ex: não precisa digitar '/rest/hospede/listar')
 * - Se a rota mudar no backend, atualiza automaticamente via Resources
 * - TypeScript garante que você chamou corretamente
 * 
 * ERRO COMUM:
 * Se chamar useResources() fora de <ResourcesProviders>, vai lançar erro:
 * "useResources deve ser usado dentro do ResourcesProviders"
 */
export const useResources = () => {
  const context = React.useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources deve ser usado dentro do ResourcesProviders');
  }
  return context;
};
