import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ArrowsDownUp, ArrowUUpLeft, ArrowClockwise } from '@phosphor-icons/react';
import { PIECE_NAMES, boardSquares, describeGame, movePairs, playSelectedMove } from '../lib/chess.js';
import './chess.css';

const pieceSource = piece => `/assets/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
const sideName = color => color === 'w' ? 'White' : 'Black';

export default function ChessGame() {
  const gameRef = useRef(null);
  if (!gameRef.current) gameRef.current = new Chess();
  const game = gameRef.current;
  const [, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [focusedSquare, setFocusedSquare] = useState('e2');
  const [promotion, setPromotion] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const squaresRef = useRef({});
  const promotionDialog = useRef(null);
  const moveListRef = useRef(null);
  const ordered = boardSquares(flipped);
  const history = game.history({ verbose: true });
  const lastMove = history.at(-1);
  const status = describeGame(game);
  const possibleMoves = selected ? game.moves({ square: selected, verbose: true }) : [];
  const destinations = new Set(possibleMoves.map(move => move.to));
  const pairs = movePairs(history.map(move => move.san));

  useEffect(() => {
    const dialog = promotionDialog.current;
    if (promotion && !dialog.open) dialog.showModal();
    if (!promotion && dialog.open) dialog.close();
  }, [promotion]);

  useEffect(() => {
    const list = moveListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [history.length]);

  function refresh() {
    setSelected(null);
    setPromotion(null);
    setResetConfirm(false);
    setRevision(value => value + 1);
  }

  function move(from, to, promotedPiece) {
    const result = playSelectedMove(game, from, to, promotedPiece);
    if (result.kind === 'promotion') {
      setPromotion(result);
      return;
    }
    if (result.kind !== 'moved') return;
    setAnnouncement(`${sideName(result.move.color)} ${PIECE_NAMES[result.move.piece]} moved from ${from} to ${to}${result.move.captured ? `, capturing a ${PIECE_NAMES[result.move.captured]}` : ''}${promotedPiece ? `, promoting to ${PIECE_NAMES[promotedPiece]}` : ''}. ${describeGame(game).title}`);
    setFocusedSquare(to);
    refresh();
    requestAnimationFrame(() => squaresRef.current[to]?.focus({ preventScroll: true }));
  }

  function chooseSquare(square) {
    setFocusedSquare(square);
    if (status.over || promotion) return;
    if (selected === square) {
      setSelected(null);
      setAnnouncement('Piece deselected.');
      return;
    }
    if (selected && destinations.has(square)) {
      move(selected, square);
      return;
    }
    const piece = game.get(square);
    if (piece?.color === game.turn()) {
      setSelected(square);
      const count = new Set(game.moves({ square, verbose: true }).map(option => option.to)).size;
      setAnnouncement(`${sideName(piece.color)} ${PIECE_NAMES[piece.type]} on ${square} selected. ${count ? `${count} legal destinations highlighted.` : 'This piece has no legal moves.'}`);
    } else {
      setSelected(null);
      setAnnouncement(`Choose a ${sideName(game.turn()).toLowerCase()} piece.`);
    }
  }

  function boardKeyDown(event, square) {
    if (event.key === 'Escape') {
      setSelected(null);
      setAnnouncement('Selection cleared.');
      return;
    }
    const index = ordered.indexOf(square);
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 };
    let next = index;
    if (event.key in offsets) {
      event.preventDefault();
      if (event.key === 'ArrowLeft' && index % 8 === 0) return;
      if (event.key === 'ArrowRight' && index % 8 === 7) return;
      next = Math.max(0, Math.min(63, index + offsets[event.key]));
    } else if (event.key === 'Home') {
      event.preventDefault();
      next = event.ctrlKey ? 0 : index - index % 8;
    } else if (event.key === 'End') {
      event.preventDefault();
      next = event.ctrlKey ? 63 : index - index % 8 + 7;
    } else return;
    const destination = ordered[next];
    setFocusedSquare(destination);
    squaresRef.current[destination]?.focus();
  }

  function undo() {
    const undone = game.undo();
    if (!undone) return;
    setAnnouncement(`Move undone. ${describeGame(game).title}`);
    refresh();
  }

  function reset() {
    game.reset();
    setFocusedSquare(flipped ? 'e7' : 'e2');
    setAnnouncement('New game. White to move.');
    refresh();
  }

  function closePromotion() {
    const from = promotion?.from;
    setPromotion(null);
    if (from) requestAnimationFrame(() => squaresRef.current[from]?.focus({ preventScroll: true }));
  }

  return (
    <div className="chess-experience">
      <p className="chess-two-player">Two players, one board. Take turns on the same device.</p>
      <div className="chess-layout">
        <div className="chess-playing-area">
          <div className={`chess-player ${game.turn() === (flipped ? 'w' : 'b') && !status.over ? 'chess-player-active' : ''}`}><img src={pieceSource({ color: flipped ? 'w' : 'b', type: 'k' })} alt="" /><span>{flipped ? 'White' : 'Black'}</span><span className="chess-player-turn">{game.turn() === (flipped ? 'w' : 'b') && !status.over ? 'Your move' : ''}</span></div>
          <div className="chess-board" role="grid" aria-label={`Chess board. ${flipped ? 'Black' : 'White'} at the bottom.`} aria-describedby="chess-keyboard-help">
            {Array.from({ length: 8 }, (_, row) => (
              <div className="chess-rank" role="row" key={row}>
                {ordered.slice(row * 8, row * 8 + 8).map((square, column) => {
                  const piece = game.get(square);
                  const dark = (square.charCodeAt(0) - 97 + Number(square[1])) % 2 === 1;
                  const legal = destinations.has(square);
                  const inCheck = piece?.type === 'k' && piece.color === game.turn() && game.isCheck();
                  const last = lastMove?.from === square || lastMove?.to === square;
                  return <button
                    key={square}
                    type="button"
                    role="gridcell"
                    className={`chess-square ${dark ? 'is-dark' : 'is-light'}${selected === square ? ' is-selected' : ''}${legal ? ' is-legal' : ''}${last ? ' is-last-move' : ''}${inCheck ? ' is-in-check' : ''}`}
                    aria-label={`${square}${piece ? `, ${sideName(piece.color)} ${PIECE_NAMES[piece.type]}` : ', empty'}${legal ? ', legal destination' : ''}${inCheck ? ', in check' : ''}`}
                    aria-selected={selected === square}
                    tabIndex={focusedSquare === square ? 0 : -1}
                    ref={element => { squaresRef.current[square] = element; }}
                    onClick={() => chooseSquare(square)}
                    onKeyDown={event => boardKeyDown(event, square)}
                    onFocus={() => setFocusedSquare(square)}
                  >
                    {column === 0 && <span className="chess-coordinate chess-rank-coordinate" aria-hidden="true">{square[1]}</span>}
                    {row === 7 && <span className="chess-coordinate chess-file-coordinate" aria-hidden="true">{square[0]}</span>}
                    {piece && <img src={pieceSource(piece)} alt="" draggable="false" />}
                  </button>;
                })}
              </div>
            ))}
          </div>
          <div className={`chess-player ${game.turn() === (flipped ? 'b' : 'w') && !status.over ? 'chess-player-active' : ''}`}><img src={pieceSource({ color: flipped ? 'b' : 'w', type: 'k' })} alt="" /><span>{flipped ? 'Black' : 'White'}</span><span className="chess-player-turn">{game.turn() === (flipped ? 'b' : 'w') && !status.over ? 'Your move' : ''}</span></div>
          <p className="chess-asset-credit">Pieces by <a href="https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces">CBurnett</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a></p>
          <p className="chess-keyboard-help" id="chess-keyboard-help">Use the arrow keys to move around the board. Enter or space selects a piece or a destination. Escape clears your selection.</p>
        </div>

        <aside className="chess-sidebar" aria-label="Game controls and move history">
          <div className="chess-status" aria-live="polite" aria-atomic="true"><h2>{status.title}</h2><p>{status.detail}</p></div>
          <div className="chess-controls">
            <button type="button" onClick={() => { setFlipped(value => !value); setAnnouncement(`Board flipped. ${flipped ? 'White' : 'Black'} is now at the bottom.`); }}><ArrowsDownUp aria-hidden="true" />Flip board</button>
            <button type="button" onClick={undo} disabled={!history.length}><ArrowUUpLeft aria-hidden="true" />Undo move</button>
            <button type="button" onClick={() => setResetConfirm(true)} disabled={!history.length}><ArrowClockwise aria-hidden="true" />Start again</button>
          </div>
          {resetConfirm && <div className="chess-reset-confirm"><p>Start a fresh game? Your current moves will be cleared.</p><div><button type="button" onClick={reset}>Start a new game</button><button type="button" onClick={() => setResetConfirm(false)}>Keep playing</button></div></div>}
          <div className="chess-move-history"><h3>The game so far</h3>{history.length ? <div className="chess-moves-scroll" ref={moveListRef}><table><thead><tr><th scope="col">Move</th><th scope="col">White</th><th scope="col">Black</th></tr></thead><tbody>{pairs.map(pair => <tr key={pair.number}><th scope="row">{pair.number}</th><td>{pair.white}</td><td>{pair.black || <span aria-label="Awaiting move">—</span>}</td></tr>)}</tbody></table></div> : <p className="chess-empty-history">Every game starts with a little possibility. White goes first.</p>}</div>
          <p className="chess-playing-note">No clock. No rush.<br />Just a good game of chess.</p>
        </aside>
      </div>
      <p className="chess-visually-hidden" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      <dialog className="chess-promotion-dialog" ref={promotionDialog} aria-labelledby="chess-promotion-title" onCancel={event => { event.preventDefault(); closePromotion(); }}>
        <h2 id="chess-promotion-title">Your pawn made it.</h2><p>Choose the piece it becomes.</p>
        <div className="chess-promotion-options">{promotion?.options.map(type => <button key={type} type="button" onClick={() => move(promotion.from, promotion.to, type)}><img src={pieceSource({ color: promotion.color, type })} alt="" /><span>{PIECE_NAMES[type]}</span></button>)}</div>
        <button type="button" className="chess-promotion-cancel" onClick={closePromotion}>Choose another move</button>
      </dialog>
    </div>
  );
}
