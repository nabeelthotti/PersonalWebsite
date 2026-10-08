import test from 'node:test';
import assert from 'node:assert/strict';
import { initialRoom, constrainObject, evaluateRoom } from '../src/lib/room-design.js';

const reading = () => initialRoom('reading').map(object => ({ ...object, ...({ chair: { x: .5, y: .70 }, lamp: { x: .30, y: .62 }, table: { x: .69, y: .70 } }[object.id]) }));
const result = (objects, brief, light = true) => Object.fromEntries(evaluateRoom(objects, brief, light).map(item => [item.id, item.done]));

test('reading corner needs a clear path, nearby furniture, and light', () => {
  assert.deepEqual(result(reading(), 'reading'), { walkway: true, space: true, light: true, table: true });
  assert.equal(result(reading(), 'reading', false).light, false);
  const moved = reading().map(object => object.id === 'chair' ? { ...object, y: .9 } : object);
  assert.equal(result(moved, 'reading').walkway, false);
  assert.equal(result(reading().map(object => object.id === 'lamp' ? { ...object, x: .9 } : object), 'reading').light, false);
});

test('room feedback detects colliding footprints even when the walkway is clear', () => {
  const objects = reading().map(object => object.id === 'table' ? { ...object, x: .5 } : object);
  assert.equal(result(objects, 'reading').space, false);
  assert.equal(result(objects, 'reading').walkway, true);
});

test('conversation seating requires facing, alignment, and reachable table', () => {
  const seats = initialRoom('conversation').map(object => object.type === 'chair' ? { ...object, facing: object.id === 'chair' ? 'right' : 'left' } : object);
  assert.equal(result(seats, 'conversation').seats, true);
  assert.equal(result(initialRoom('conversation'), 'conversation').seats, false);
  assert.equal(result(seats.map(object => object.id === 'seat' ? { ...object, y: .5 } : object), 'conversation').seats, false);
  assert.equal(result(seats.map(object => object.id === 'table' ? { ...object, x: .9 } : object), 'conversation').table, false);
});

test('dragging to any edge leaves entire furniture image inside the room', () => {
  for (const object of initialRoom('reading')) {
    const first = constrainObject(object, -5, -5);
    const last = constrainObject(object, 5, 5);
    assert.ok(first.x > 0 && first.y > 0);
    assert.ok(last.x < 1 && last.y <= .96);
    assert.equal(constrainObject(first, first.x, first.y).x, first.x);
    assert.equal(constrainObject(last, last.x, last.y).y, last.y);
  }
});
