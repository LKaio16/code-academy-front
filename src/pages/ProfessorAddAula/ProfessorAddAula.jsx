import React, { useState, useEffect } from "react";
import useFormulary from "../../Hooks/useFormulary";
import Input from "../../Componentes/Input/Input";
import useQuery from "../../Hooks/useQuery"; 
import "../ProfessorAddAula/professorAddAula.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessorAddAula() {
  const query = useQuery();
  const cursoId = query.get("cursoId");
  const [aulas, setAulas] = useState([]);
  const [addedAula, setAddedAula] = useState(null);
  const [failedToAdd, setFailedToAdd] = useState(null);
  const navigate = useNavigate();

  const initialFormData = {
    titulo: "",
    url: "",
    descricao: "",
  };

  const { register, formData, resetForm } = useFormulary(initialFormData);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/aula/curso/${cursoId}`
      );
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setAulas(response.data);
      } else {
        setAulas([]);
        console.error("Dados recebidos não são um array:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
      setAulas([]); 
    }
  };

  
  const handleVoltar = async () => {
    navigate(`/professors`);

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/aula/adicionar",
        {
          ...formData,
          cursoId,
        }
      );
      setAddedAula(response.data);
      resetForm();
      setFailedToAdd(false);
      fetchAulas();
    } catch (error) {
      console.error("Erro ao enviar solicitação POST:", error);
      setFailedToAdd(true);
    }
  };

  const handleRemoveAula = async (aulaId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/aula/${aulaId}`
      );
      if (response.status === 204) {
        fetchAulas();
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação DELETE:", error);
    }
  };

  return (
    <div className="professor-add-aula">
      <h1>Bem Vindo Ao seu curso</h1>
      <div className="container-prefessorsPainel">
        <div className="container-addCursos">
          <h3>Adicionar Aulas</h3>
          <form onSubmit={handleSubmit}>
            <Input
              label="Título da Aula"
              placeholder="Digite aqui o título da aula"
              name="titulo"
              {...register()}
            />
            <Input
              label="URL do Vídeo"
              placeholder="Cole aqui o link do vídeo"
              name="url"
              {...register()}
            />
            <Input
              label="Descrição da Aula"
              placeholder="Descrição breve da aula"
              name="descricao"
              {...register()}
            />
            <button type="submit" className="addCurso-btn">
              Adicionar
            </button>
        
            <button className="addCurso-btn" onClick={handleVoltar}>Cancelar</button>
          
          </form>
          {failedToAdd !== null && (
            <p>
              {failedToAdd
                ? "Erro ao adicionar sua aula"
                : "Aula adicionada com sucesso!"}
            </p>
          )}
        </div>
        <div className="container-listAulas">
          <h3>Aulas do Curso</h3>
          <ul>
            {aulas.map((aula) => (
              <li key={aula.id}>
                {`${aula.titulo} - ${aula.descricao}`}
                <button onClick={() => handleRemoveAula(aula.id)}>
                  Deletar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
