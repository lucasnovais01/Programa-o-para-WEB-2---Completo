import React from 'react';
import { apiGetResources } from '../resources/api/api.resources';

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

export interface Resource {
  name: string;
  endpoint: string;
  method: VERBO_HTTP[];
}

interface ResourcesContextType {
  resources: Resource[];
  getEndpoint: (name: string, id?: string | number) => string | undefined;
  loading: boolean;
}

const ResourceContext = React.createContext<ResourcesContextType | undefined>(
  undefined,
);

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
      const academico_resource = sessionStorage.getItem('academico_resource');

      if (academico_resource) {
        setResources(JSON.parse(academico_resource));
        setLoading(false);
        return;
      }

      try {
        const response = await apiGetResources();
        //console.log(response.data);
        if (response.data) {
          // assíncrono
          setResources(response.data);
          sessionStorage.setItem(
            'academico_resources',
            JSON.stringify(response.data),
          );
        }
      } catch (error: any) {
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
  const getEndpoint = React.useCallback(
    (name: string, id?: string | number): string | undefined => {
      const resource = resources.find((r) => {
        const hasId = r.endpoint.includes(':id');
        return r.name === name && (id ? hasId : !hasId);
      });

      if (resource) {
        return id ? resource.endpoint.replace('/:id', '') : resource.endpoint;
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

export const useResources = () => {
  const context = React.useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources deve ser usado dentro do ResourcesProviders');
    //chamou a função fora do contexto.
  }
  return context;
};
