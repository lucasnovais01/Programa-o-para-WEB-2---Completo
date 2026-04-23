import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./services/router/Router";
import { ResourcesProviders } from "./services/providers/ResourcesProviders";

const router = createBrowserRouter(routes);

function App() {
  return (
    <div>
      <ResourcesProviders>
        <RouterProvider router={router} />
      </ResourcesProviders>
    </div>
  );
}
export default App;

/*
  com o </ResourcesProviders> agora todos que estiverem linkados com o router,
  agora consegue compartilhar informação entre eles.
*/
