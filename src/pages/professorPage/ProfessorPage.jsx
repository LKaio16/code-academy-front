import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppCookies from "../../Hooks/useAppCookies";
import axios from "axios";
import Modal from "react-modal";
import "./professorPage.css";
import Loading from "../../Componentes/loading/loading";

export default function ProfessorPage() {
  const [nome, setNome] = useState("");
  const [linkImg, setLinkImg] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cursos, setCursos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [editingCursoId, setEditingCursoId] = useState(null);
  const [editingCursoIdAula, setEditingCursoIdAula] = useState(null);
  const [editingAulaId, setEditingAulaId] = useState(null);
  const [aulaTitulo, setAulaTitulo] = useState("");
  const [aulaUrl, setAulaUrl] = useState("");
  const [aulaDescricao, setAulaDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cookies } = useAppCookies();

  useEffect(() => {
    if (cookies["user-info"]) {
      const userTag = cookies["user-info"]?.tag;
      if (userTag !== "professor") {
        navigate("/");
      } else {
        fetchCursos();
      }
    } else {
      navigate("/login");
    }
  }, [navigate, cookies]);

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/curso/professor/${cookies["user-info"].id}`
      );
      setCursos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setLoading(false);
    }
  };

  const fetchAulas = async (cursoId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/aula/curso/${cursoId}`
      );
      setAulas(response.data);
      setIsModalOpen(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao buscar aulas:", error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingCursoId) {
      const updatedCurso = {
        nome,
        descricao,
        linkImg,
        professor: {
          id: cookies["user-info"].id
        }
      };
      console.log(updatedCurso)
      try {
        await axios.put(
          `http://localhost:8080/curso/${editingCursoId}`,
          updatedCurso
        );
        handleCancelEdit();
        fetchCursos();
      } catch (error) {
        console.error("Erro ao enviar solicitação PUT:", error);
        alert("Ocorreu um erro ao atualizar seu curso.");
      }
    } else {
      const newCurso = {
        nome,
        professor: {
          id: cookies["user-info"].id
        },
        descricao,
        linkImg,
      };
      try {
        const response = await axios.post(
          "http://localhost:8080/curso/salvar",
          newCurso
        );
        navigate(`/professorAddAula?cursoId=${response.data.id}`);
        fetchCursos();
      } catch (error) {
        console.error("Erro ao enviar solicitação POST:", error);
        alert("Ocorreu um erro ao cadastrar seu curso.");
      }
    }
  };
  const handleDeleteCurso = async (cursoId) => {
    try {
      await axios.delete(`http://localhost:8080/curso/${cursoId}`);
      fetchCursos();
    } catch (error) {
      console.error("Erro ao enviar solicitação DELETE:", error);
      alert("Erro ao tentar deletar o curso.");
    }
  };

  const handleEditCurso = (cursoId) => {
    setEditingCursoId(cursoId);
    const cursoToEdit = cursos.find((curso) => curso.id === cursoId);
    setNome(cursoToEdit.nome);
    setLinkImg(cursoToEdit.linkImg);
    setDescricao(cursoToEdit.descricao);
  };


  const handleListarAulas = (cursoId) => {
    fetchAulas(cursoId);
    setEditingCursoIdAula(cursoId)
  };

  const handleAddAulaCurso = (cursoId) => {
    navigate(`/professorAddAula?cursoId=${editingCursoId}`);
  };


  const handleDeleteAula = async (aulaId) => {
    try {
      await axios.delete(`http://localhost:8080/aula/${aulaId}`);
      fetchAulas(editingCursoIdAula);
    } catch (error) {
      console.error("Erro ao enviar solicitação DELETE:", error);
      alert("Erro ao tentar deletar a aula.");
    }
  };

  const handleEditAula = (aulaId, titulo, url, descricao) => {
    setEditingAulaId(aulaId);
    setAulaTitulo(titulo);
    setAulaUrl(url);
    setAulaDescricao(descricao);
  };

  const handleCancelEdit = () => {
    setEditingCursoId(null);
    setNome("");
    setLinkImg("");
    setDescricao("");
    setAulas([]);
    setIsModalOpen(false);
    setEditingCursoIdAula(null)
  };

  const handleCancelEditAula = () => {
    setEditingAulaId(null);
    setAulaTitulo("");
    setAulaUrl("");
    setAulaDescricao("");
  };

  const handleUpdateAula = async () => {
    const updatedAula = {
      titulo: aulaTitulo,
      url: aulaUrl,
      descricao: aulaDescricao,
      cursoId: editingCursoId,
    };

    try {
      await axios.put(
        `http://localhost:8080/aula/editar/${editingAulaId}`,
        updatedAula
      );
      setEditingAulaId(null);
      fetchAulas(editingCursoIdAula);
    } catch (error) {
      console.error("Erro ao enviar solicitação PUT:", error);
      alert("Erro ao tentar atualizar a aula.");
    }
  };

  return (
    <div className="professor-page">
      {loading && <Loading />}

      <h1>Professor CodeAcademy</h1>
      <p>
        Bem-vindo ao Code Academy, Usuário Professor! <br />
        Para começar a utilizar nossos serviços, adicione um curso ao nosso
        site. <br />
        Nosso sistema é bastante intuitivo, mas se houver dúvidas, nos envie um
        e-mail na página <a href="/FaleConosco">fale conosco</a>.
      </p>
      <div className="container-add-cursos form-container">
        <h3>{editingCursoId ? "Editar Curso" : "Adicionar Cursos"}</h3>
        <form onSubmit={editingCursoId ? handleSubmit : handleSubmit}>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome do curso a ser inserido"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            id="linkImg"
            name="linkImg"
            placeholder="Cole aqui o link da imagem da capa do seu curso"
            value={linkImg}
            onChange={(e) => setLinkImg(e.target.value)}
          />
          <input
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Descreva seu curso aqui"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="submit"
            value={editingCursoId ? "Atualizar" : "Adicionar"}
            className="add-curso-btn"
          />
          {editingCursoId !== null && (
            <button style={{ background: '#007bff' }} className="add-curso-btn" onClick={handleAddAulaCurso}>Adicionar aula</button>
          )}
          {editingCursoId && (
            <button onClick={handleCancelEdit}>Cancelar</button>
          )}
        </form>
      </div>
      <div className="container-list-cursos">
        <h3>Seus Cursos Cadastrados</h3>
        <div className="cursos-grid">
          {cursos.map((curso) => (
            <div key={curso.id} className="curso-card">
              <h4>{curso.nome}</h4>
              <p>{curso.descricao}</p>
              <button style={{ marginRight: '5px' }} onClick={() => handleEditCurso(curso.id)}>Editar</button>
              <button style={{ marginRight: '5px' }} onClick={() => handleListarAulas(curso.id)}>Listar Aulas</button>
              <button style={{ marginRight: '5px' }} onClick={() => handleDeleteCurso(curso.id)}>Deletar</button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancelEdit}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div>
          {aulas.length > 0 ? (
            <>
              <h5>Aulas</h5>
              <ul>
                {aulas.map((aula) => (
                  <li key={aula.id}>
                    {editingAulaId === aula.id ? (
                      <div className="form-edit-aula">
                        <h4>Editar Aula</h4>
                        <input
                          type="text"
                          value={aulaTitulo}
                          onChange={(e) => setAulaTitulo(e.target.value)}
                          placeholder="Título"
                        />
                        <input
                          type="text"
                          value={aulaUrl}
                          onChange={(e) => setAulaUrl(e.target.value)}
                          placeholder="URL"
                        />
                        <textarea
                          value={aulaDescricao}
                          onChange={(e) => setAulaDescricao(e.target.value)}
                          placeholder="Descrição"
                        />
                        <button onClick={() => handleUpdateAula()}>Atualizar</button>
                        <button onClick={() => handleCancelEditAula()}>Cancelar</button>
                      </div>
                    ) : (
                      <div>
                        <table className="aulas-table">
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Editar</th>
                              <th>Deletar</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr key={aula.id}>
                              <td>{aula.titulo}</td>
                              <td>
                                <button className="edit-button" onClick={() => handleEditAula(aula.id, aula.titulo, aula.url, aula.descricao)}>Editar</button>
                              </td>
                              <td>
                                <button className="delete-button" onClick={() => handleDeleteAula(aula.id)}>Deletar</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <><h5>Este curso ainda não possui aulas</h5></>
          )}

        </div>
        <button className="delete-button" onClick={() => handleCancelEdit()}>Fechar</button>

      </Modal>

    </div>
  );
}

