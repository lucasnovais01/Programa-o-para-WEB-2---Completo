import Layout from "./components/layout/Layout";
import Lista from "./views/cidade/Lista";

function App() { 
  return (
    <div>
      <Layout> {/* Quer que o layout(componente pai) renderiza componente filho, que é o LISTA 
                */}
        <Lista /> 
      </Layout>
    </div>
  );
}

export default App;