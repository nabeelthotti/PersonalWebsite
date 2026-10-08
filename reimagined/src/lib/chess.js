export const PIECE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

export function boardSquares(flipped = false) {
  const files = flipped ? 'hgfedcba' : 'abcdefgh';
  const ranks = flipped ? '12345678' : '87654321';
  return Array.from(ranks).flatMap(rank => Array.from(files, file => `${file}${rank}`));
}

// A promotion is a pending choice, never a partially applied move.
export function playSelectedMove(game, from, to, promotion) {
  if (game.isGameOver()) return { kind: 'invalid' };
  const choices = game.moves({ square: from, verbose: true }).filter(move => move.to === to);
  if (!choices.length) return { kind: 'invalid' };
  const promotions = choices.filter(move => move.promotion).map(move => move.promotion);
  if (promotions.length && !promotion) {
    return { kind: 'promotion', from, to, color: game.turn(), options: ['q', 'r', 'b', 'n'].filter(piece => promotions.includes(piece)) };
  }
  if (promotion && !promotions.includes(promotion)) return { kind: 'invalid' };
  const move = game.move({ from, to, ...(promotion ? { promotion } : {}) });
  return { kind: 'moved', move };
}

export function describeGame(game) {
  const turn = game.turn() === 'w' ? 'White' : 'Black';
  if (game.isCheckmate()) return { title: `${turn === 'White' ? 'Black' : 'White'} wins.`, detail: 'Checkmate. A well-played game.', over: true };
  if (game.isStalemate()) return { title: 'A draw.', detail: 'Stalemate: no legal move, but the king is not in check.', over: true };
  if (game.isThreefoldRepetition()) return { title: 'A draw.', detail: 'The same position has appeared three times.', over: true };
  if (game.isInsufficientMaterial()) return { title: 'A draw.', detail: 'There are not enough pieces left to give checkmate.', over: true };
  if (game.isDrawByFiftyMoves()) return { title: 'A draw.', detail: 'Fifty moves have passed without a pawn move or capture.', over: true };
  if (game.isDraw()) return { title: 'A draw.', detail: 'This game has ended in a draw.', over: true };
  return { title: `${turn} to move.`, detail: game.isCheck() ? `${turn} is in check. Protect your king.` : 'Select a piece, then choose a highlighted square.', over: false };
}

export function movePairs(history) {
  const pairs = [];
  for (let index = 0; index < history.length; index += 2) {
    pairs.push({ number: index / 2 + 1, white: history[index], black: history[index + 1] ?? '' });
  }
  return pairs;
}
