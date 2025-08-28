import React, { useState } from 'react';
import './TeamSetup.css'; // Importa el archivo CSS

const TeamSetup = ({ onTeamsConfigured }) => {
  const [teamCount, setTeamCount] = useState(2); // Default to 2 teams
  const [teamNames, setTeamNames] = useState(['', '']);

  const handleTeamCountChange = (event) => {
    const count = Math.max(2, Math.min(10, Number(event.target.value))); // Limit between 2 and 10 teams
    setTeamCount(count);
    setTeamNames((prevNames) => {
      const newNames = [...prevNames];
      if (count > prevNames.length) {
        for (let i = prevNames.length; i < count; i++) {
          newNames.push(`Equipo ${i + 1}`);
        }
      } else {
        newNames.length = count;
      }
      return newNames;
    });
  };

  const handleNameChange = (index, event) => {
    const newNames = [...teamNames];
    newNames[index] = event.target.value;
    setTeamNames(newNames);
  };

  const handleSubmit = () => {
    if (teamNames.some((name) => name.trim() === '')) {
      alert('All teams must have a name.');
      return;
    }
    onTeamsConfigured(teamNames);
  };

  return (
    <div className="team-setup-container">
      <h1 className="team-setup-title">Configuración de Equipos</h1>

      <div className="team-count-container">
        <label htmlFor="team-count" className="team-label">Número de equipos:</label>
        <input
          id="team-count"
          type="number"
          value={teamCount}
          onChange={handleTeamCountChange}
          min={2}
          max={10}
          className="team-input"
        />
      </div>

      <div className="team-names-container">
        {teamNames.map((name, index) => (
          <div key={index} className="team-name-row">
            <label htmlFor={`team-name-${index}`} className="team-label">
              Equipo {index + 1} Nombre:
            </label>
            <input
              id={`team-name-${index}`}
              type="text"
              value={name}
              onChange={(event) => handleNameChange(index, event)}
              className="team-input"
            />
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="team-setup-button">
        Iniciar Juegos
      </button>
    </div>
  );
};

export default TeamSetup;
