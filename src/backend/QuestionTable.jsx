import React, {useContext} from 'react';
import { GameContext } from './GameContext';
import './QuestionTable.css'; // Asegúrate de importar el archivo CSS

const QuestionTable = ({ categories, onQuestionSelected }) => {
  const {
      handlefinishGame
        } = useContext(GameContext);
  return (
    <div className="question-table-container">
      <h2>Question Board</h2>
      <table className="question-table">
        <thead>
          <tr>
            {categories.map((category, index) => (
              <th key={index} className="table-header">
                {category.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {categories.map((category, colIndex) => {
                const question = category.questions[rowIndex];
                return (
                  <td
                    key={colIndex}
                    className={`table-cell ${question.answered ? 'answered' : ''}`}
                    onClick={() => {
                      if (!question.answered) {
                        onQuestionSelected(question);
                      } else {
                        console.log(`La pregunta "${question.text}" ya ha sido respondida.`);
                      }
                    }}
                  >
                    ${100 * (rowIndex + 1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div
      className="custom-button-alternative"
      onClick={() => handlefinishGame()}
      >
      Terminar ronda
      </div>
    </div>
  );
};

export default QuestionTable;
