import React, { useEffect, useState } from "react";
import Sidebar from "../../Componentes/SideBar/Sidebar";
import VideoCatalogo from "../../Componentes/VideoCatalago/VideoCatalogo";
import "../Cursos/cursos.css";
import useQuery from "../../Hooks/useQuery";
import useAppCookies from "../../Hooks/useAppCookies";
import axios from "axios";

export default function Cursos() {
  const [curso, setCurso] = useState({});
  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState({});
  const [aulasFinalizadas, setAulasFinalizadas] = useState([]);

  const query = useQuery();
  const { cookies, setCookie } = useAppCookies(["aulas-finalizadas"]);
  const cursoId = query.get("cursoId");

  useEffect(() => {
    const fetchCursoEAulas = async () => {
      try {
        const responseCurso = await axios.get(
          `http://localhost:8080/curso/${cursoId}`
        );
        if (responseCurso.status === 200) {
          setCurso(responseCurso.data);

          const responseAulas = await axios.get(
            `http://localhost:8080/aula/curso/${cursoId}`
          );
          if (responseAulas.status === 200) {
            setAulas(responseAulas.data);
            if (responseAulas.data.length > 0) {
              setSelectedAula(responseAulas.data[0]);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar curso ou aulas:", error);
      }
    };

    fetchCursoEAulas();
  }, [query]);

  return (
    <div className="containerPageCursos">
      <div className="pageCursos">
        {aulas.length > 0 && (
          <Sidebar
            cursoId={cursoId}
            aulas={aulas}
            selectedAula={selectedAula}
            aulasFinalizadas={aulasFinalizadas}
            setAulasFinalizadas={setAulasFinalizadas} // Certifique-se de passar essa prop
            onChangeAula={setSelectedAula}
            alunoId={cookies["user-info"]?.id}
          />
        )}

        <div className="contentRelated">
          <VideoCatalogo
            alunoId={cookies["user-info"]?.id}
            selectedAula={selectedAula}
            aulasFinalizadas={aulasFinalizadas}
            setAulasFinalizadas={setAulasFinalizadas}
          />
        </div>
      </div>
    </div>
  );
}
