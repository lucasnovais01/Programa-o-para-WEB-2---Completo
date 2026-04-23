// providers ou context, são uma forma do componente pai e filho conversarem

import React from "react";
import { apiGetResources } from "../resources/api/api.resources";

type VERBO_HTTP = 'PUT' | 'POST' | 'GET' | 'DELETE';

export interface Resource {
  name: string,
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


export const useResources = () => {
  const context = React.useContext(ResourceContext);

  if (context === undefined) {
    throw new Error('useResources deve ser usado dentro do ResourcesProviders')
  }
  return context;
};


const ResourcesContext = React.createContext(null);

export function ResourcesProviders ({
  children,
}: {
  children: React.ReactNode;
}) {

  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {

    async function getResources(){
        setLoading(true);

      const academico_resource = sessionStorage.getItem('academico_resource');

      if (academico_resource){
        setResources(JSON.parse(academico_resource))
        setLoading(false)
        return;
      }



      try {
        const response = await apiGetResources();
        //console.log(response);
        if (response.data) {
          // assíncrono
          // Então forçamos o sessionStorage, para atualizar o estado

          setResources(response.data);
          sessionStorage.setItem('academico_resources', JSON.stringify(response.data),
          );
        }
      }
      catch(error: any){
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    }
    getResources();
  }, []);

  // O Callback é um hook que faz um cópia da função na memória
  // Ex: Foi e executou uma vez, e guarda na memória
  // Monitora o recurso [resources], havendo modificação
  // do conteúdo - faz novo processamento.
  // E com isto vai diminuir o acesso a banco de dados, otimiza
  const getEndpoint = React.useCallback ((
    name: string, 
    id?: string | number,
  ): string | undefined => {

    const resource = resources.find((r) => {

      const hasId = r.endpoint.includes(':id');
      return r.name === name && (id ? hasId : !hasId);
    });


    if(resource){
      return id ? resource.endpoint.replace('/:id', '') : resource.endpoint
    }

    return undefined;
  },
  [resources],
  );

  return(
    <ResourceContext.Provider value = {
      {resources, getEndpoint, loading}}
    > {children}

    </ResourceContext.Provider>
  );
}
