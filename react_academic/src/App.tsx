import Layout from "./components/layout/Layout";

function App() {
  return 
  <div>
    <Layout/>
  </div>
}

export default App;


/*
//import { Fragment } from "react/jsx-runtime" // está errado, o correto é o que está abaixo:

import { useEffect, useRef, useState, type FormEvent } from "react";

function App() {

  const [nome, setNome] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");

  const[email, setEmail] = useState<string>("");
//
  const inputRef = useRef<HTMLInputElement>(null);
//

  useEffect(()=>{
    inputRef.current?.focus();
  },[])

  useEffect(()=>{
    console.log("O campo email foi alterado");
  }, [email])


  const handleSubmit = (e:FormEvent) => {

    
    e.preventDefault();

    console.log("Nome" +nome);
    console.log("Cidade "+cidade);
    console.log("E-mail "+email);
    console.log("idade "+inputRef.current?.value);

    console.log("Registro gravado com sucesso");
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nome: </label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value) }/>

        <label> Cidade: </label>
        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value) }/>

        <label> Idade: </label>
        <input type="text" ref={inputRef}/>


        <label> Email: </label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value) }/>

        <label> Enviar </label>
        <input type="button"></input>

      </form>
    </div>
  )
}

export default App
*/