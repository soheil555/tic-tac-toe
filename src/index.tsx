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

interface BoardProps {}

interface BoardState {
  squares: (string | null)[];
}

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i: number) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i: number) {
    const squares = this.state.squares.slice();
    squares[i] = "X";
    this.setState({ squares: squares });
  }

  render() {
    const status = "Next player: X";

    return (
      <div>
        <div className="status">{status}</div>

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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>

        <div className="game-info">
          <div></div>
          <ol></ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.querySelector("#root"));
