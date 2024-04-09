import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import NextButton from "./NextButton";
import Question from "./Question";
import Footer from "./Footer";
import Timer from "./Timer";
import StartScreen from "./StartScreen";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import { useQuestions } from "../context/QuestionsContext";

export default function App() {
  const { status } = useQuestions();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}
