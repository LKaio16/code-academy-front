import React, { useEffect } from "react";
import "./Sidebar.css";
import logo from "../../Assets/Imagens/CodeAcademyLogoSemFundo.png";
import axios from 'axios';

const Sidebar = ({ curso, aulas, onChangeAula, selectedAula, aulasFinalizadas, setAulasFinalizadas, alunoId, cursoId }) => {
  
  useEffect(() => {
    const fetchAulasFinalizadas = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/aula/vista/${alunoId}/${cursoId}`);
        if (response.status === 200) {
          // Extrair os IDs das aulas finalizadas do response
          const aulasFinalizadasIDs = response.data.map(aula => aula.id);
          // Definir aulasFinalizadas com os IDs das aulas finalizadas
          setAulasFinalizadas(aulasFinalizadasIDs);
        }
      } catch (error) {
        console.error("Erro ao buscar aulas finalizadas:", error);
      }
    };

    if (alunoId) {
      fetchAulasFinalizadas();
    }
  }, [alunoId]);

  return (
    <div className="sidebar">
      <nav className="sidebar__navigation">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
      <div>
        <span className="text title">Cursos</span>
        <ul className="course-list">
          <li className="course-item">
            <span className="course-title">{curso?.title}</span>
            <ul className="aula-list">
              {aulas?.map((aula) => {
                const aulaVista = aulasFinalizadas.includes(aula.id);
                return (
                  <li
                    key={aula?.id}
                    className={`aula-item${aulaVista ? " viewed" : ""}`}
                  >
                    <button
                      className="video-button"
                      onClick={() => onChangeAula(aula)}
                    >
                      <span>{aula?.titulo}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
