import React, { useContext } from "react";
import { GameContext } from "./GameContext";
import './TeamsScore.css';

const TeamsScore = () => {
  const { teams } = useContext(GameContext);

  return (
    <div className="teams-score-container">
      {teams.map((team, index) => (
        <div key={index} className="team-card">
          <div className="team-name">{team.name}</div>
          <div className="team-score">{team.score}</div>
        </div>
      ))}
    </div>
  );
};

export default TeamsScore;