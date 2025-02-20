import {useState} from "react";
function Square({value, onSquareClick,id, isWinning}) {
   //console.log(id);
    // return(<button className="square" onClick={onSquareClick}>{value}</button>);
    return(
        <button className={
             isWinning?.includes(id) ? "square-win" : "square"
        } onClick={onSquareClick}>{value}</button>
    )
}




function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    // const result = calculateWinner(squares);
    const winner=calculateWinner(squares)?.winner;
    const lines=calculateWinner(squares)?.lines;
  //  console.log(lines)
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const boardLength = 3;
    const boardRows = [...Array(boardLength).keys()].map((row) => {
        const boardSquares = [...Array(boardLength).keys()].map((col) => {
            const i = boardLength * row + col;
            return (
                <Square
                    value={squares[i]}
                    onSquareClick={() => handleClick(i)}
                    isWinning={lines}
                    id={i}
                />
            );
        });

        return (
            <div key={row} className="board-row">{boardSquares}</div>
        );
    });

    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </> );
}

export default function Game(){
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];



    function handlePlay(nextSquares){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);

    }
    function jumpTo(nextMove){
        setCurrentMove(nextMove);
        setXIsNext(nextMove%2===0);
    }

    const [ascending, setAscending] = useState(true);
    const moves=history.map((squares,move)=>{
        const col=move%3;
        const row=Math.floor(move/3);
        let description;
        if(move>0){
            description="Go to move #"+move + " ("+row+","+col+")" ;
        }else{
            description="Go to game start";
        }
        return(
            <li key={move}>
                <button onClick={()=>jumpTo(move)}>{description}</button>
            </li>
        )
    });

    return(
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
                <p className={"info-more-task1"}>You are at move : #{currentMove}</p>
            </div>
        <div className="game-info">
             <button class="toggle-btn" onClick={()=>setAscending(!ascending)}>Reverse</button>
            <ol>{!ascending ? moves : moves.reverse()}</ol>
          </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return  {
             winner: squares[a],
             lines :[a,b,c]
         }
        }
    }
    return null;
}



//For the current move only, show “You are at move #…” instead of a button. =>done
//Rewrite Board to use two loops to make the squares instead of hardcoding them.=>done
//Add a toggle button that lets you sort the moves in either ascending or descending order.  =>done
//When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
//Display the location for each move in the format (row, col) in the move history list.=> done
