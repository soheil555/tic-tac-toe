import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import _ from "lodash";

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinner: boolean | undefined;
}

function Square(props: SquareProps) {
  return (
    <button
      onClick={() => props.onClick()}
      className={`square ${props.isWinner ? "winner" : undefined}`}
    >
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: squares;
  onClick: (i: number) => void;
}

interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  renderSquare(i: number) {
    return (
      <Square
        key={i}
        value={this.props.squares.squares[i]}
        isWinner={
          this.props.squares.winners && this.props.squares.winners.includes(i)
        }
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = _.range(0, 9, 3).map((i) => {
      return (
        <div className="board-row">
          {_.range(i, i + 3).map((j) => {
            {
              return this.renderSquare(j);
            }
          })}
        </div>
      );
    });

    return <div>{rows}</div>;
  }
}

interface GameProps {}

interface squares {
  squares: (string | null)[];
  lastMove?: number[];
  winners?: number[];
}

interface GameState {
  isXNext: boolean;
  history: squares[];
  step: number;
  movesToggle: boolean;
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);

    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      isXNext: true,
      step: 0,
      movesToggle: false,
    };
  }

  handleClick(i: number) {
    let locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];

    let history = this.state.history.slice(0, this.state.step + 1);
    const current = history[this.state.step];
    const squares = current.squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const isXNext = this.state.isXNext;
    squares[i] = isXNext ? "X" : "O";

    this.setState({
      isXNext: !isXNext,
      history: history.concat({ squares, lastMove: locations[i] }),
      step: history.length,
    });
  }

  jumpTo(index: number) {
    this.setState({
      step: index,
      isXNext: index % 2 == 0,
    });
  }

  handleMovesToggle() {
    this.setState({
      movesToggle: !this.state.movesToggle,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.step];
    const winner = calculateWinner(current.squares);

    let status: string;
    if (winner) {
      status = "Winner: " + winner[0];
      current.winners = winner[1];
    } else if (history.length === 10) {
      status = "Draw";
    } else {
      status = `Next player: ${this.state.isXNext ? "X" : "O"}`;
    }

    const moves = history.map((step, index) => {
      const lastMove = step.lastMove;

      const desc = "Go to " + (index ? `move #${index}` : "game start");

      return (
        <li>
          <button
            className={this.state.step == index ? "active" : undefined}
            key={index}
            onClick={() => this.jumpTo(index)}
          >
            {desc}
            {lastMove ? ` ${lastMove[0]},${lastMove[1]}` : null}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current} onClick={(i) => this.handleClick(i)} />
        </div>

        <div className="game-info">
          <div>
            {status}
            {"  "}
            <button onClick={() => this.handleMovesToggle()}>
              {this.state.movesToggle ? "asc" : "desc"}
            </button>
          </div>
          <ol className={this.state.movesToggle ? "reversed" : undefined}>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(
  squares: (string | null)[]
): [string | null, number[]] | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.querySelector("#root"));
