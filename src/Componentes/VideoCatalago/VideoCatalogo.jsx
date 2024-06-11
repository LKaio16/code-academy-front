import React, { useState, useCallback } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import "./VideoCatalogo.css";


const VideoCatalogo = ({ selectedAula, alunoId, aulasFinalizadas, setAulasFinalizadas }) => {

  const getYouTubeVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const handleVideoEnding = useCallback(async () => {
    try {
      await axios.post(`http://localhost:8080/aula/vista/${alunoId}/${selectedAula.id}`);
      setAulasFinalizadas((prev) => [...prev, selectedAula.id]);
    } catch (error) {
      console.error("Erro ao marcar aula como vista:", error);
    }
  }, [alunoId, selectedAula.id, setAulasFinalizadas]);

  if (!Object.keys(selectedAula).length) return <h2>Carregando vídeo...</h2>;

  return (
    <div className="ContainerVideo">
      <div className="Video">
        <h1>{selectedAula?.titulo}</h1>
        <YouTube
          videoId={getYouTubeVideoID(selectedAula?.url)}
          onEnd={handleVideoEnding}
        />
        <h3>{selectedAula?.descricao}</h3>
      </div>
    </div>
  );
};

export default VideoCatalogo;