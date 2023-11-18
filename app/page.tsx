"use client";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

type AudioState = HTMLAudioElement | null;

const GRID_SIZE = 8;
//crear array de 8 filas y 8 columnas que tengan valor 0

const MATRIX = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: 8 }, () => 0 as string | number)
);

const Matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

// array de posiciones de coincidencias
const MATCHES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

//aparecer Bombas 'B' en posiciones random
for (let count = GRID_SIZE; count > 0; count--) {
  const rowRandom = Math.floor(Math.random() * GRID_SIZE); //row = fila
  const celRandom = Math.floor(Math.random() * GRID_SIZE); // cell = columna

  MATRIX[rowRandom][celRandom] = "B";
}

//recorremos los indices de row y de cell
for (let rowIndex = 0; rowIndex < MATRIX.length; rowIndex++) {
  for (let cellIndex = 0; cellIndex < MATRIX[rowIndex].length; cellIndex++) {
    if (MATRIX[rowIndex][cellIndex] === "B") continue;
    let bombCount = 0;

    //si hay indices en la matriz que aumente en el contador
    for (const match of MATCHES) {
      if (MATRIX[rowIndex + match[0]]?.[cellIndex + match[1]] === "B") {
        bombCount++;
      }
    }

    //seteamos como valor el bombCount predeterminado
    MATRIX[rowIndex][cellIndex] = bombCount;
  }
}

export default function Home() {
  const [audio, setAudio] = useState<AudioState>(null);

  useEffect(() => {
    const newAudio = new Audio("boo.mp3");
    setAudio(newAudio);
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.src = "";
        newAudio.load();
      }
    };
  }, []);

  const [clicked, setClicked] = useState<String[]>([]); //para saber en donde estoy pulsando el click
  const [status, setStatus] = useState<"playing" | "win" | "lost">("playing"); //estados para saber si estoy jugando, gané o perdí

  //función para encontrar el id del clicked
  function handleClick(rowIndex: number, cellIndex: number) {
    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
    //Si gané
    if (clicked.length + 1 === GRID_SIZE ** 2 - GRID_SIZE) {
      setStatus("win");
    }
    //Si perdí
    else if (MATRIX[rowIndex][cellIndex] === "B") {
      setStatus("lost");

      if (audio instanceof HTMLAudioElement) {
        audio.play();
      }
    }
  }

  return (
    <>
      <main className="container">
        <header className="header">booscaminas</header>
        <section className="centrar-completo">
          <section className="section">
            {MATRIX.map((row, rowIndex) => (
              <article key={String(rowIndex)} className="all-article">
                {row.map((cell, cellIndex) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`all-div ${
                      clicked.includes(`${rowIndex}-${cellIndex}`)
                        ? "bg"
                        : "transparent"
                    }`}
                  >
                    {clicked.includes(`${rowIndex}-${cellIndex}`) ? (
                      <span>
                        {cell === "B" ? "🎃" : cell === 0 ? null : cell}
                      </span>
                    ) : (
                      <button
                        className="button"
                        type="button"
                        onClick={() =>
                          status === "playing" &&
                          handleClick(rowIndex, cellIndex)
                        }
                      ></button>
                    )}
                  </div>
                ))}
              </article>
            ))}
          </section>
          {status === "lost" && (
            <div className="center">
              <p className="block">You lost😥</p>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                {/*para comenzar a jugar de nuevo*/}
                Play again
              </Button>
            </div>
          )}
          {status === "win" && (
            <div className="center">
              <p>You win</p>
              <Button onClick={() => window.location.reload()}>
                {/*para comenzar a jugar de nuevo*/}
                Play again
              </Button>
            </div>
          )}

          <footer className="finally">
            {new Date().getFullYear()}@ booscaminas
          </footer>
        </section>
      </main>
    </>
  );
}
