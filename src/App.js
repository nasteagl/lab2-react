import {useState} from "react";
function Square({value, onSquareClick,id, isWinning}) {
    //value(O/X/null) squareClick care-i apelat cand se face clock daca patratul
    //id-patratele de la 0-8
    //isWinning - array cy indexii patratelor cistigatoare
    return(
        <button className={
             isWinning?.includes(id) ? "square-win" : "square"
        } onClick={onSquareClick}>{value}</button>
    )
}




function Board({ xIsNext, squares, onPlay }) {
    //xIsNext- true sau false cinei urmatorul True-X /False-O
    //squares-array 9 el ,care arata tabla de joc[X,0,...NULL]
    //onPlay-f-tie care actualizeaza starea jocului in comp Board
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        //slice pentru a nu modifica stare direct
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
        //onPlay este apelată cu noul array nextSquares, ceea ce va declanșa o re-redare a componentei.
    }


    const winner=calculateWinner(squares)?.winner;
    //Return obj { winner: "X", lines: [0, 1, 2] } dacă e un winner daca nu null
    const lines=calculateWinner(squares)?.lines;
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const boardLength = 3;
    const boardRows = [...Array(boardLength).keys()].map((row) => {
        //Array(boardLength) creează un array de lungime 3, dar conține doar undefined
        //keys()-obține un iterator pentru indici (chei) ale array
    //map() iterează prin fiecare valoare a array[0, 1, 2]. Acesta va crea un rând pentru fiecare valoare (row)
        // operatorul spread (...) pentru a transforma acest iterator într-un array real de valori: [0, 1, 2]

        const boardSquares = [...Array(boardLength).keys()].map((col) => {
            const i = boardLength * row + col;
            return (
                <Square
                    value={squares[i]}//print current val for each square
                    onSquareClick={() => handleClick(i)}//when square click call func
                    isWinning={lines}//for check win in board
                    id={i}//each sqaure have unique id
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
    //arr cu game history
    const [currentMove, setCurrentMove] = useState(0);
    //indica mutarea curenta pe care o vede userul (index in array history)
    const currentSquares = history[currentMove];
    // starea actuală a tablei de joc care provine din istoricul mutărilor



    function handlePlay(nextSquares){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
       // Actualizează istoricul mutărilor cu noul array nextHistor
        setCurrentMove(nextHistory.length - 1);
       // Setează mutarea curentă la ultima mutare din istoric.
        setXIsNext(!xIsNext);
        //valoarea lui xIsNext, trecând de la "X" la "O" și invers
    }
    function jumpTo(nextMove){
        setCurrentMove(nextMove);
        setXIsNext(nextMove%2===0);
        //for view previe step ,daca e para a jucat X setam xIsNext la true daca imoara invers
    }

    const [ascending, setAscending] = useState(true);
    const moves=history.map((squares,move)=>{
        //Iterează prin istoricul mutărilor, pentru fiecare mutare
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
                {/*Aici se transmite starea curentă a tablei de joc (currentSquares),
                indicatorul pentru cine este la următoarea mutare (xIsNext), și funcția de actualizare
                 a stării jocului (onPlay).*/}
                <p className={"info-more-task1"}>You are at move : #{currentMove}</p>
            </div>
        <div className="game-info">
             <button class="toggle-btn" onClick={()=>setAscending(!ascending)}>Reverse</button>
            {/* toggle button for sort moves in ascending or descending order*/}
            <ol>{ascending ? moves : moves.reverse()}</ol>
            {/*Dacă ascending este true, mutările sunt afișate în ordine normală, altfel sunt inversate.*/}

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
        // Destructurează liniile pentru a obține indicii celor trei pătrățele
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
