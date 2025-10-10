import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./services/router/router";

const router = createBrowserRouter(routes);

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
