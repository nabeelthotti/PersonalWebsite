import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { boardSquares, movePairs, playSelectedMove, describeGame } from '../src/lib/chess.js';

test('flipping the board reverses visual order without changing square identities', () => {
  const whiteView = boardSquares();
  assert.equal(whiteView[0], 'a8');
  assert.equal(whiteView[63], 'h1');
  assert.equal(new Set(whiteView).size, 64);
  assert.deepEqual(boardSquares(true), [...whiteView].reverse());
});

test('a promotion waits for a choice and applies the selected underpromotion once', () => {
  const game = new Chess('8/P7/7k/8/8/8/8/K7 w - - 0 1');
  const before = game.fen();
  const result = playSelectedMove(game, 'a7', 'a8');
  assert.equal(result.kind, 'promotion');
  assert.deepEqual(result.options, ['q', 'r', 'b', 'n']);
  assert.equal(game.fen(), before);
  assert.equal(game.history().length, 0);
  assert.equal(playSelectedMove(game, 'a7', 'a8', 'r').kind, 'moved');
  assert.equal(game.get('a8').type, 'r');
  assert.equal(game.history().length, 1);
});

test('invalid square choices or promotion choices leave the game untouched', () => {
  const game = new Chess();
  const before = game.fen();
  assert.equal(playSelectedMove(game, 'e2', 'e5').kind, 'invalid');
  assert.equal(playSelectedMove(game, 'e7', 'e5').kind, 'invalid');
  assert.equal(game.fen(), before);
  const promotionGame = new Chess('8/P7/7k/8/8/8/8/K7 w - - 0 1');
  const promotionBefore = promotionGame.fen();
  assert.equal(playSelectedMove(promotionGame, 'a7', 'a8', 'k').kind, 'invalid');
  assert.equal(promotionGame.fen(), promotionBefore);
});

test('move history keeps a pending black reply in the correct row after undo', () => {
  const game = new Chess();
  playSelectedMove(game, 'e2', 'e4');
  playSelectedMove(game, 'e7', 'e5');
  playSelectedMove(game, 'g1', 'f3');
  assert.deepEqual(movePairs(game.history()), [{ number: 1, white: 'e4', black: 'e5' }, { number: 2, white: 'Nf3', black: '' }]);
  game.undo();
  assert.deepEqual(movePairs(game.history()), [{ number: 1, white: 'e4', black: 'e5' }]);
  game.reset();
  assert.deepEqual(movePairs(game.history()), []);
});

test('finished games show the winner and prevent further board moves', () => {
  const game = new Chess();
  for (const [from, to] of [['f2', 'f3'], ['e7', 'e5'], ['g2', 'g4'], ['d8', 'h4']]) playSelectedMove(game, from, to);
  assert.deepEqual(describeGame(game), { title: 'Black wins.', detail: 'Checkmate. A well-played game.', over: true });
  const before = game.fen();
  assert.equal(playSelectedMove(game, 'a2', 'a3').kind, 'invalid');
  assert.equal(game.fen(), before);
});
