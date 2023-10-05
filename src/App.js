import React from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [maxScore, setMaxScore] = React.useState(
    () => JSON.parse(localStorage.getItem("maxScore")) || 0
  );

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    
    if (allHeld && allSameValue) {
      setTenzies(true);
      setMaxScore(Math.max(score, maxScore));
      console.log("You Won!!!");
    }

    localStorage.setItem("maxScore", JSON.stringify(maxScore));
  }, [dice, maxScore, score]);

  function generateNewDie() {
    return ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    });
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        setScore(score - 1);
        return die.isHeld ?
          die :
          generateNewDie()
      }));
    }
    else {
      setTenzies(false);
      setDice(allNewDice());
      setScore(0);
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      if(die.id === id) {
        if(!die.isHeld) {
          setScore(score + 5);
        }
        else {
          setScore(score - 5);
        }
        return { ...die, isHeld: !die.isHeld };
      }
      else {
        return die;
      }
    }));
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function handleReset() {
    localStorage.setItem("maxScore", JSON.stringify(0));
    setMaxScore(0);
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
        {diceElements}
      </div>
      <div className='btns'>
        <div className='score'>
          <h3>Your Score : {score}</h3>
        </div>
        <button
          className="roll-dice"
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className='highscore'>
          <h3 className='highscore-heading'>High Score : {maxScore}</h3>
          <button className='reset' onClick={handleReset}>R</button>
        </div>
      </div>
    </main >
  );
}