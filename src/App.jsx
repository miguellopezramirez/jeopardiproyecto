import React, { useContext } from 'react';
import TeamSetup from './backend/TeamSetup';
import QuestionTable from './backend/QuestionTable';
import QuestionView from './backend/QuestionView';
import TeamsScore from './backend/TeamsScore';
import Leaderboard from './backend/Leaderboard';
import { GameContext } from './backend/GameContext';
import './App.css';

const App = () => {
  const {
    teams,
    currentTeamIndex,
    categories,
    finish,
    selectedQuestion,
    handleTeamsConfigured,
    handleQuestionSelected,
    handleAnswerSelected,
  } = useContext(GameContext);
  

  return (
    <div className="centered-container">
      {!teams ? ( //miestras no esten configurados los equipos
        <TeamSetup onTeamsConfigured={handleTeamsConfigured} />
      ) : (
        //Equipos configurados
        <div>
        { ! finish ?(<div>
            <h1>Game Ready!</h1>
             <h2>{teams[currentTeamIndex].name} </h2>
              { ! selectedQuestion ?
  
              (<QuestionTable categories={categories} onQuestionSelected={handleQuestionSelected} />) : (<QuestionView question={selectedQuestion} onAnswerSelected={handleAnswerSelected} />)
              }
            <TeamsScore/>
          </div>
          ): (<Leaderboard ></Leaderboard>)
        }
        </div>
        
      )}
    </div>
  );
};

export default App;
