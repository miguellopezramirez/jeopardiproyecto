import React, { useContext, useEffect } from 'react';
import { GameContext } from './GameContext';
import './Leaderboard.css'; // Importa el archivo CSS

const Leaderboard = () => {
  const { teams, playCongratulationsSound } = useContext(GameContext);

  // Asegurarse de que los equipos están ordenados por su puntuación (de mayor a menor)
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  useEffect( () => {
    playCongratulationsSound()
  })
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Resultados</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="leaderboard-header">Puesto</th>
            <th className="leaderboard-header">Equipo</th>
            <th className="leaderboard-header">Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => (
            <tr key={team.name} className="leaderboard-row">
              <td className="leaderboard-cell">{index + 1}</td>
              <td className="leaderboard-cell">{team.name}</td>
              <td className="leaderboard-cell">{team.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
