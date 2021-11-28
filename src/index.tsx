import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

function Square(props: SquareProps) {
  return (
    <button onClick={() => props.onClick()} className="square">
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
}

interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {/* <div className="status">{status}</div> */}

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface GameProps {}

interface squares {
  squares: (string | null)[];
}

interface GameState {
  isXNext: boolean;
  history: squares[];
  step: number;
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);

    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      isXNext: true,
      step: 0,
    };
  }

  handleClick(i: number) {
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
      history: history.concat({ squares }),
      step: history.length,
    });
  }

  jumpTo(index: number) {
    this.setState({
      step: index,
      isXNext: index % 2 == 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.step].squares;
    const winner = calculateWinner(current);

    let status: string;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${this.state.isXNext ? "X" : "O"}`;
    }

    const moves = history.map((step, index) => {
      const desc = "Go to " + (index ? `move #${index}` : "game start");

      return (
        <li>
          <button key={index} onClick={() => this.jumpTo(index)}>
            {desc}
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
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: (string | null)[]) {
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
    if (squares[a] == squares[b] && squares[b] == squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.querySelector("#root"));
