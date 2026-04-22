// providers ou context, são uma forma do componente pai e filho conversarem

import React from "react";

const ResourcesContext = React.createContext(null);

export function ResourcesProviders ({
  children,
}: {
  children: React.ReactNode;
}) {

  return(

    <ResourcesContext.Provider value={}>{children}</ResourcesContext.Provider>
  );
}