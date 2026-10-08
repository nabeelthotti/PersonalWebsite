import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuietGalleryFrame, getGalleryProgressForIndex } from '../src/lib/workMotion.js';

test('quiet gallery centers every selected project and hides its neighbors', () => {
  for (let i=0; i<12; i++) {
    const frame = getQuietGalleryFrame(getGalleryProgressForIndex(i,12),12);
    assert.equal(frame.activeIndex,i);
    assert.ok(Math.abs(frame.cards[i].x)<.001);
    assert.ok(frame.cards[i].opacity>.999);
    assert.deepEqual(frame.cards.filter(c=>c.visible),[frame.cards[i]]);
  }
});
test('quiet gallery starts centered and remains bounded in both scroll directions', () => {
  for (const p of [0,-1,1,2,.4,.3,NaN]) {
    const frame=getQuietGalleryFrame(p,12);
    assert.ok(frame.cards.filter(c=>c.visible).length<=2);
    for(const card of frame.cards) assert.ok(Number.isFinite(card.x)&&card.opacity>=0&&card.opacity<=1);
  }
  assert.equal(getQuietGalleryFrame(0,12).cards[0].x,0);
  assert.equal(getQuietGalleryFrame(0,12).cards[0].opacity,1);
});
