import React, { createContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [teams, setTeams] = useState(null);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [tempTeamIndex, setTempTeamIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const options = ["A", "B", "C", "D"]; //Opciones de juego
  const [finish, setFinish] = useState(false);
  const [showPopup_1, setShowPopup_1] = useState(false); // Nuevo estado para controlar el popup
  const [showPopup_2, setShowPopup_2] = useState(false); // Nuevo estado para controlar el popup

  const handleTeamsConfigured = (teamNames) => {
    // Convertimos la lista de nombres en un arreglo de objetos con nombre y puntaje inicial
    const tempTeams = teamNames.map(names => ({ name: names, score: 0 }));
  
    setTeams(tempTeams); // Actualizamos el estado con el nuevo arreglo de objetos
  };
  

  const handleQuestionSelected = (question) => {
    setSelectedQuestion(question)
    setTempTeamIndex(currentTeamIndex)
  };

  const updateScore = () => {
    const updatedTeams = [...teams]; // Creamos una copia del arreglo original
    updatedTeams[currentTeamIndex].score = teams[currentTeamIndex].score + selectedQuestion.value ; // Cambiamos el puntaje del equipo en el índice 1
    setTeams(updatedTeams);
  };

  const blockQuestion = () =>{
    const updatedCategories =[...categories];
    for (const category of updatedCategories) {
      const question = category.questions.find(q => q.text === selectedQuestion.text); // Busca la pregunta por texto
      if (question) {
        question.answered = true; // Modifica el valor de la pregunta
        return;
      }
    }
    setCategories(updatedCategories);
  };

  const checkQuestions = () =>{
    for (const category of categories) {
      const question = category.questions.find(q => q.answered === false); // Busca la pregunta por texto
      if (question) {
        return;
      }
    }
    setFinish(true);
  };

  const handlefinishGame = () =>{
    setFinish(true);
  };

  const handleAnswerSelected =  async  (answer) => {
    if (answered == false ){
      if(answer === selectedQuestion.correct){
        await popupCorrect();
        //Agrega puntos
        updateScore();
        setSelectedQuestion(null);
        
        blockQuestion();
        checkQuestions();
        await handleAnswerSubmit_1();
        setShowPopup_2(true);
      }else {
          ejecutarTareas();
      }
      
    }else{
      if(answer === selectedQuestion.correct){
        await popupCorrect();
        //Agrega puntos
        updateScore();
        
      }else {
        await popupIncorrect_2();

      }
      //Compara si estan todas contestadas
      blockQuestion();
      checkQuestions();
      setSelectedQuestion(null);
      setAnswered(false);
      popupNextTeam();
    }
  };

  const ejecutarTareas = async () => {
    await handleAnswerSubmit_1(); // Actualiza el índice del equipo
    setAnswered(true); // Actualiza el estado de la respuesta
    setShowPopup_1(true); // Activa la bandera para mostrar el popup
  };

  // Monitorea el cambio en el índice del equipo y muestra el popup
  useEffect(() => {
    if (showPopup_1) {
      popupIncorrect_1(); // Llama al popup con el índice actualizado
      setShowPopup_1(false); // Reinicia la bandera para evitar múltiples llamadas
    }
  }, [showPopup_1]); // Solo se ejecuta cuando `showPopup` cambia

  // Monitorea el cambio en el índice del equipo y muestra el popup
  useEffect(() => {
    if (showPopup_2) {
      popupNextTeam();
      setShowPopup_2(false); // Reinicia la bandera para evitar múltiples llamadas
    }
  }, [showPopup_2]); // Solo se ejecuta cuando `showPopup` cambia

  const handleAnswerSubmit_1 = async () => {
    console.log(`Respuesta para ${teams[currentTeamIndex].name}:`);
    await new Promise((resolve) => {
      setCurrentTeamIndex((prevIndex) => {
        const nextIndex = prevIndex < teams.length - 1 ? prevIndex + 1 : 0;
        resolve(); // Resolver después de actualizar el índice
        return nextIndex;
      });
    });
  };

  const handleAnswerSubmit_2 = () => {
    console.log(`Respuesta para ${teams[tempTeamIndex].name}:`);
    setTempTeamIndex((prevIndex) =>
      prevIndex < teams.length - 1 ? prevIndex + 1 : 0
    );
  };
  //Popups
  const popupCorrect = async () => {
    playCongratulationsSound();
    const result = await Swal.fire({
      title: '¡Correcto!',
      text: `Has respondido correctamente ganas ${selectedQuestion.value} puntos.`,
      icon: 'success',
      confirmButtonText: '¡Genial!',
    });
  };
  const popupIncorrect_1 = async () => {
    playFailSound();
    const result = await Swal.fire({
      title: '¡Incorrecto!',
      text: `La respuesta es incorrecta. Puede intentar el equipo: ${teams[currentTeamIndex].name} .`,
      icon: 'error',
      confirmButtonText: 'Entendido',
    });
  };
  const popupIncorrect_2 = async () => {
    playFailSound();
    const result = await Swal.fire({
      title: '¡Incorrecto!',
      text: 'La respuesta es incorrecta. Sigue con la siguiente pregunta.',
      icon: 'error',
      confirmButtonText: 'Entendido',
    });
  };
  const popupNextTeam = () => {
    Swal.fire({
      title: '¡Siguiente Equipo!',
      text: `Sigue el Equipo: ${teams[currentTeamIndex].name}`,
      icon: 'success',
      confirmButtonText: 'Entendido',
    });
  }
  //Sonidos
  const playCongratulationsSound = () => {
    const audio = new Audio('/crowd-cheer-ii-6263.mp3'); // Ruta del archivo de sonido
    audio.play();
  };
  const playFailSound = () => {
    const audio = new Audio('/cartoon-fail-trumpet-278822.mp3'); // Ruta del archivo de sonido
    audio.play();
  };
  const [categories, setCategories] = useState([
    {
      name: 'Familia Politica',
      questions: [
        { text: '¿Qué carrera estudio Roberto en el TEC?', options: ['Ing. Civil', 'Ing. Sitemas', 'Arquitectura', 'Ing. Empresarial'], correct: 0, value: 100, answered: false },
        { text: '¿Cuantos años tiene Anselmo?', options: ['32', '15', '30', '29'], correct: 2, value: 200, answered: false },
        { text: '¿Cúal es el nombre del negocio del sonido del Tío Sergio?', options: ['Garibay\'s Sounds', 'El sonidote', 'Sergio\'s Sounds', 'El chechos'], correct: 0, value: 300, answered: false },
        { text: '¿A qué se dedica el Tío Ismael?', options: ['Mecanico', 'Pintor', 'Cocinero', 'Agricultor'], correct: 3, value: 400, answered: false },
        { text: '¿Cuál es el nombre completo del tío Rafael?', options: ['Rafael Fermando Matínez Becerra', 'Rafael Matínez Bustamante', 'Rafael Marquez Bustamante', 'Rafael Matínez Becerra'], correct: 1, value: 500, answered: false },
      ],
    },
    {
      name: 'Vida de Papichis',
      questions: [
        { text: '¿Cuál es la edad actual de "Papichis"?', options: ['77 Años', '82 Años', '79 Años', '99 Años'], correct: 2, value: 100, answered: false },
        { text: '¿A qué edad mi Papichis se junto con Mamichis?', options: ['20 Años', '18 Años', '16 Años', '14 Años'], correct: 3, value: 200, answered: false },
        { text: '¿En dondé nacio Papichis?', options: ['Tepic','Tuxpan', 'Xalisco', 'Ruiz'], correct: 0, value: 300, answered: false },
        { text: '¿Cuál es el nombre completo de Mamá María?', options: ['MARIA DE LOS ANGELES VILLALOBOS ULLOA', 'MARIA DE JESÚS VILLA ULLOA', 'MARIA DE LOS ANGELES VILLALOBOS URIAS', 'MARIA DE JESÚS VILLALOBOS URIAS'], correct: 0, value: 400, answered: false },
        { text: '¿Cuantos hermanos tiene Papichis?', options: ['11 Hermanos', '12 Hermanos', '13 Hermanos', '14 Hermanos'], correct: 2, value: 500, answered: false },
      ],
    },
    {
      name: 'Mascotas Ramirez',
      questions: [
        { text: '¿Cómo se llama el ave encandalosa que vive en casa de tía Lupe?', options: ['Periquito', 'Periquita', 'Chichrito', 'Chichirita'], correct: 3, value: 100, answered: false },
        { text: '¿Cómo se llamo el primer conejo de Ana?', options: ['Copito', 'Blanco', 'Cacahuate', 'Meme'], correct: 3, value: 200, answered: false },
        { text: '¿Cuantas mascotas viven en cada de tía Alba Actualmente?', options: ['1', '2', '3', '4'], correct: 3, value: 300, answered: false },
        { text: '¿Cual fue la ultima mascota que tuvieron en casa de tía Mary?', options: ['Gallo', 'Pez', 'Conejo', 'Perro'], correct: 2, value: 400, answered: false },
        { text: '¿Cuantos años tiene Malefica?', options: ['8', '9', '10', '11'], correct: 1, value: 500, answered: false },
      ],
    },
    {
      name: 'Comida Familiar',
      questions: [
        { text: 'ENTRE TANTOS POSTRES QUE PREPARABA MAMICHIS, ¿CUÁL ES EL FAVORITO DE LUPITA?', options: ['Buñuelos', 'Jericaya', 'Tamales Dulces', 'Gelatina'], correct: 1, value: 100, answered: false },
        { text: 'AMARANTA SE COME 10, MIGUEL UNOS 5, Y ROBERTO LOS QUE LE ALCANZA A LLEVAR, ¿DE QUE COMIDA QUE PREPARA TIO RAFA HABLAMOS?', options: ['Ceviche', 'Tacos', 'Enchiladas', 'Chuncunes'], correct: 3, value: 200, answered: false },
        { text: 'FUE UN INVENTO DE TIA LUPE PERO A TODOS LES GUSTO ESTE POSTRE CON CREMITA AMARILLA DULCE', options: ['Super Gelatina', 'Piñagel', 'Gelatina de piña', 'Piñalim'], correct: 2, value: 300, answered: false },
        { text: 'HAY DE POLLO, DE PUERCO Y DULCES… Y EN CUERNAVACA HAY DE ROJO Y DE VERDE. PERO SABEMOS QUE COMO LOS DE MI MAMICHIS NO HAY SASON IGUAL', options: ['Enchiladas', 'Tamales', 'Tacos', 'Pollo'], correct: 1, value: 400, answered: false },
        { text: 'A TODOS NOS GUSTA EL PASTEL DE AMELIA, PERO NO LO PREPARA MI TIA AMELIA, ¿CUÁL ES EL SABOR FAVORITO DE TODOS?', options: ['Piña', 'Zanahoria', 'Chocolate', 'Vainilla'], correct: 0, value: 500, answered: false },
      ],
    },
    {
      name: 'Misterios de Nayar',
      questions: [
        { text: '¿Cuál es el equipo favorito de de futbol de Nayar?', options: ['Chivas', 'Barcelona', 'Tigres', 'America'], correct: 3, value: 100, answered: false },
        { text: '¿Cuál es la caricatura favorita de Nayar?', options: ['South Park', 'Padre de familia', 'Los Simpson', 'Tom y Jerry'], correct: 2, value: 200, answered: false },
        { text: 'Si tienes un problema de este tipo Nayar facilmente te puede ayudar', options: ['Cocina', 'Religión', 'Programación', 'Matematicas'], correct: 3, value: 300, answered: false },
        { text: '¿Donde trabaja Nayar actalmente?', options: ['ATR', 'Alpera', 'Dräxlmaier', 'TAB'], correct: 2, value: 400, answered: false },
        { text: '¿Cuantos años tiene Nayar?', options: ['35', '36', '37', '38'], correct: 1, value: 500, answered: false },
      ],
    },
    {
      name: 'Ramirez en Mineatura',
      questions: [
        { text: '¿CUANTOS NIETOS DE PAPICHIS TIENEN MENOS DE 25 AÑOS?', options: ['4', '5', '6', '7'], correct: 2, value: 100, answered: false },
        { text: '¿CUANTOS BISNIETOS HAY EN LA FAMILIA RAMIREZ?', options: ['5', '6', '7', '8'], correct: 1, value: 200, answered: false },
        { text: 'NOMBRE DE LA PRIMERA BISNIETA DE PAPICHIS', options: ['Miryet', 'Mireyet', 'Mirla', 'Mirlan'], correct: 0, value: 300, answered: false },
        { text: 'CUANDO CUMPLE SU PRIMER AÑO FERNANDO', options: ['6 de febrero del 2024', '5 de febrero del 2024', '6 de febrero del 2025', '5 de febrero del 2024'], correct: 3, value: 400, answered: false },
        { text: '¿CUANDO ES EL CUMPLE DE SAMUEL?', options: ['8 de junio', '8 de julio', '8 de mayo', '8 de marzo'], correct: 0, value: 500, answered: false },
      ],
    },
    {
      name: 'Cultura General',
      questions: [
        { text: '¿Qué fiesta tradicional mexicana fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2008?', options: ['El 20 de Noviembre','El día de muertos', 'El día de las madres', 'El día de las flores'], correct: 1, value: 100, answered: false },
        { text: '¿Quién es el autor de la saga "Harry Potter"?', options: ['Harry Potter', 'J.K. Roiwling.', 'J.K. Rowling.', 'J.J. Roiwling.'], correct: 2, value: 200, answered: false },
        { text: '¿Cuál es la montaña más alta de México?', options: ['El cerro de San Juan', 'El Popocatépetl', 'El Iztaccíhuatl', 'El pico de Orizaba'], correct: 3, value: 300, answered: false },
        { text: '¿En qué año llegó Cristóbal Colón a América?', options: ['1493 A.C.', '1492', '1493', '1494'], correct: 1, value: 400, answered: false },
        { text: '¿Cuál es el elemento químico con símbolo "AU"?', options: ['Oro', 'Plata', 'Aluminio', 'Sodio'], correct: 0, value: 500, answered: false },
      ],
    },
    {
      name: 'Cultura Tepicense',
      questions: [
        { text: '¿Qué héroe de la independencia nació en Nayarit?', options: ['Miguel Hidalgo', 'José María Mercado', 'Ignacio Allende', 'Vicente Guerrero'], correct: 1, value: 100, answered: false },
        { text: '¿En qué año fue fundada la ciudad de Tepic?', options: ['1531', '1530', '1529', '1528'], correct: 0, value: 200, answered: false },
        { text: '¿Cómo se llama la bebida fermentada de maíz que es popular en Nayarit?', options: ['Tepache', 'Bota', 'Cuba', 'Tejuino'], correct: 3, value: 300, answered: false },
        { text: '¿Qué presidente mexicano decretó la creación del estado de Nayarit, con Tepic como capital?', options: ['Vicente Guerrero', 'Antonio López de Santa Anna', 'Venustiano Carranza', 'Anastasio Bustamante'], correct: 2, value: 400, answered: false },
        { text: '¿Qué significa Tepic?', options: ['Lugar  sobre la arena', 'Lugar de piedras macizas', 'Lugar en el centro de la luna', 'Más alla del agua'], correct: 1, value: 500, answered: false },
      ],
    },
  ]);
  

  return (
    <GameContext.Provider
      value={{
        teams,
        currentTeamIndex,
        categories,
        selectedQuestion,
        options,
        finish,
        playCongratulationsSound,
        handleTeamsConfigured,
        handleQuestionSelected,
        handleAnswerSelected,
        handleAnswerSubmit_1,
        handleAnswerSubmit_2,
        handlefinishGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
