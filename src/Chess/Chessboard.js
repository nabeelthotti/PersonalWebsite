import React from 'react';
import pieces from './pieces';
import initialBoardSetup from './initialBoardSetup';
import './Chessboard.css';

const Chessboard = () => {
    const board = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const isDark = (i + j) % 2 === 1;
            const piece = initialBoardSetup[i][j];
            board.push(
                <div key={`${i}-${j}`} className={`square ${isDark ? 'dark' : 'light'}`}>
                    {pieces[piece]}
                </div>
            );
        }
    }

    return (
        <div className="chessboard">
            {board}
        </div>
    );
};

export default Chessboard;
