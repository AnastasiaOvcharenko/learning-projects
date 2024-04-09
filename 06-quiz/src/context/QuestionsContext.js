import { createContext, useContext, useReducer, useEffect } from "react";

const QuestionsContext = createContext();
const SECS_PER_QUESTION = 20;

function QuestionsProvider({ children }) {
  function calcMaxPossiblePoints(questions) {
    return questions.reduce((prev, cur) => prev + cur.points, 0);
  }

  const initialState = {
    questions: [],

    // loading, error, ready, active, finished
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    maxPossiblePoints: 0,
    secondsRemaining: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return {
          ...state,
          questions: action.payload,
          maxPossiblePoints: calcMaxPossiblePoints(action.payload),
          status: "ready",
        };
      case "dataFailed":
        return {
          ...state,
          status: "error",
        };
      case "start":
        return {
          ...state,
          status: "active",
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        };
      case "newAnswer":
        const question = state.questions[state.index];

        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };
      case "nextQuestion":
        return { ...state, index: state.index + 1, answer: null };
      case "finish":
        return {
          ...state,
          status: "finished",
          highscore:
            state.points > state.highscore ? state.points : state.highscore,
        };
      case "restart":
        return {
          ...initialState,
          questions: state.questions,
          highscore: state.highscore,
          status: "ready",
        };
      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
        };
      default:
        throw new Error("Action unknown");
    }
  }

  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      maxPossiblePoints,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        maxPossiblePoints,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

function useQuestions() {
  const context = useContext(QuestionsContext);
  if (context === undefined)
    throw new Error("Context used outside the provider");
  return context;
}

export { QuestionsProvider, useQuestions };
