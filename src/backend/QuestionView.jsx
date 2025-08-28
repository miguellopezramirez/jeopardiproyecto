import React, { useState, useContext } from 'react';
import { GameContext } from './GameContext';
import './QuestionView.css'; // Asegúrate de importar el archivo CSS

const QuestionView = ({ question, onAnswerSelected }) => {
    const { options } = useContext(GameContext);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        onAnswerSelected(answer);
    };

    return (
        <div className="question-view-container">
            <h2>{question.text}</h2>
            {question.options.map((option, index) => (
                <h3 key={index} className="question-option-text">
                    ({options[index]}) {option}
                </h3>
            ))}

            <div className="question-button-container">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`question-button ${
                            selectedAnswer === index ? 'selected' : ''
                        }`}
                        onClick={() => handleAnswerClick(index)}
                    >
                        {options[index]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionView;
