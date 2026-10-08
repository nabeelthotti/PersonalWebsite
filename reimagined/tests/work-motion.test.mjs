import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGalleryFrame,
  getGalleryProgressForIndex,
  getGalleryScrollScreens,
  getGallerySelectorScrollLeft,
} from '../src/lib/workMotion.js';

function assertFiniteFrame(frame) {
  for (const [field, value] of Object.entries(frame)) {
    if (typeof value === 'number') assert.ok(Number.isFinite(value), `${field} must be finite`);
  }
  for (const object of [frame.backdrop, ...frame.cards]) {
    for (const [field, value] of Object.entries(object)) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value), `${field} must be finite`);
    }
  }
  for (const card of frame.cards) {
    assert.ok(card.opacity >= 0 && card.opacity <= 1, 'Opacity must remain renderable');
  }
}

test('Every selector brings its project into focus, including the full twelve-project collection', () => {
  for (const count of [1, 3, 6, 12]) {
    let previousProgress = -1;
    for (let index = 0; index < count; index += 1) {
      const progress = getGalleryProgressForIndex(index, count);
      const frame = getGalleryFrame(progress, count);
      const selectedCard = frame.cards[index];

      assert.ok(progress >= 0 && progress <= 1, 'Selector must target the gallery scroll range');
      assert.ok(progress > previousProgress, 'Projects must follow selector order');
      assert.equal(frame.activeIndex, index, 'Caption and selected screenshot must agree');
      assert.equal(selectedCard.visible, true);
      assert.equal(selectedCard.opacity, 1);
      assert.ok(Math.abs(selectedCard.z) < 1e-8, 'Selected screenshot should be on the focal plane');
      assertFiniteFrame(frame);
      previousProgress = progress;
    }
  }
});

test('Overscrolling clamps to stable first and last frames without losing the end projects', () => {
  for (const count of [3, 6, 12]) {
    const first = getGalleryFrame(0, count);
    const last = getGalleryFrame(1, count);
    assert.deepEqual(getGalleryFrame(-2, count), first);
    assert.deepEqual(getGalleryFrame(4, count), last);
    assert.equal(first.activeIndex, 0);
    assert.equal(first.cards[0].visible, true);
    assert.equal(first.cards[0].opacity, 1);
    assert.equal(last.activeIndex, count - 1);
    assert.equal(last.cards[count - 1].visible, true);
    assert.equal(last.cards[count - 1].opacity, 1);
    assert.equal(last.cards[0].visible, false, 'Passed projects must leave the last project unobscured');
    assert.equal(getGalleryProgressForIndex(-4, count), getGalleryProgressForIndex(0, count));
    assert.equal(getGalleryProgressForIndex(count + 4, count), getGalleryProgressForIndex(count - 1, count));
  }
});

test('Scrolling backward reproduces the same scene, independent of traversal history', () => {
  const positions = Array.from({ length: 121 }, (_, index) => index / 120);
  for (const [width, height] of [[1280, 800], [800, 600], [1920, 1080]]) {
    const forward = positions.map((progress) => getGalleryFrame(progress, 12, width, height));
    for (let index = positions.length - 1; index >= 0; index -= 1) {
      const reversed = getGalleryFrame(positions[index], 12, width, height);
      assert.deepEqual(reversed, forward[index]);
      assertFiniteFrame(reversed);
      assert.ok(reversed.cards[reversed.activeIndex].visible, 'Active project must remain visible between selectors');
    }
  }
});

test('Empty and single-project collections produce finite, usable frames', () => {
  for (const progress of [-1, 0, .25, .5, 1, 2, Number.NaN]) {
    const empty = getGalleryFrame(progress, 0);
    assert.equal(empty.activeIndex, -1);
    assert.deepEqual(empty.cards, []);
    assertFiniteFrame(empty);

    const single = getGalleryFrame(progress, 1);
    assert.equal(single.activeIndex, 0);
    assert.equal(single.cards.length, 1);
    assert.equal(single.cards[0].visible, true);
    assert.equal(single.cards[0].opacity, 1);
    assert.ok(Math.abs(single.cards[0].z) < 1e-8);
    assertFiniteFrame(single);
  }
  assert.equal(getGalleryProgressForIndex(0, 0), 0);
  assert.equal(getGalleryProgressForIndex(0, 1), 0);
});

test('The collection keeps a bounded scroll distance and the homepage is shorter', () => {
  const fullCollection = getGalleryScrollScreens(6);
  const compactSelection = getGalleryScrollScreens(3, true);
  assert.ok(fullCollection >= 4 && fullCollection <= 6);
  assert.ok(compactSelection > 1 && compactSelection < fullCollection);
  assert.ok(getGalleryScrollScreens(12) >= 8 && getGalleryScrollScreens(12) <= 9, 'All twelve projects need readable space without an excessive pinned section');
  assert.ok(getGalleryScrollScreens(12, true) >= 8 && getGalleryScrollScreens(12, true) < getGalleryScrollScreens(12));
  assert.ok(getGalleryScrollScreens(100) <= 8.8, 'Additional projects must not create an endless scroll region');
  assert.ok(Number.isFinite(getGalleryScrollScreens(0)));
  assert.ok(Number.isFinite(getGalleryScrollScreens(Number.NaN)));
});

test('Selector visibility is stable for empty and single-item strips', () => {
  assert.equal(getGallerySelectorScrollLeft(), 0);
  assert.equal(getGallerySelectorScrollLeft({ scrollLeft: 20, viewportWidth: 700, scrollWidth: 0 }), 0);
  assert.equal(getGallerySelectorScrollLeft({ viewportWidth: 700, scrollWidth: 168, itemLeft: 0, itemWidth: 168 }), 0);
  assert.equal(getGallerySelectorScrollLeft({ scrollLeft: Number.NaN, viewportWidth: Number.NaN, scrollWidth: Number.NaN }), 0);
});

test('All twelve selectors can be revealed within the horizontal strip without overshooting', () => {
  for (const viewportWidth of [620, 980, 1440]) {
    const itemWidth = 168;
    const step = itemWidth + 21;
    const scrollWidth = step * 12 - 21;
    let scrollLeft = 0;
    for (const index of [...Array(12).keys(), ...Array(12).keys()].map((value, index) => index < 12 ? value : 11 - value)) {
      const itemLeft = index * step;
      const next = getGallerySelectorScrollLeft({ scrollLeft, viewportWidth, itemLeft, itemWidth, scrollWidth });
      assert.ok(next >= 0 && next <= scrollWidth - viewportWidth, 'Strip movement must stay within its own scroll range');
      assert.ok(itemLeft >= next && itemLeft + itemWidth <= next + viewportWidth, 'The complete selected tab should be visible');
      assert.equal(getGallerySelectorScrollLeft({ scrollLeft: next, viewportWidth, itemLeft, itemWidth, scrollWidth }), next, 'Already visible selectors should not drift');
      scrollLeft = next;
    }
  }
});


test('Phone galleries reach every project within a shorter bounded scroll track', () => {
  const count = 12;
  const screens = getGalleryScrollScreens(count, false, true);
  assert.ok(screens > 1 && screens < getGalleryScrollScreens(count) * .75);
  assert.ok(getGalleryScrollScreens(100, false, true) <= 6.5);
  for (const [width, height] of [[320, 568], [390, 844], [844, 390]]) {
    const travel = (screens - 1) * height;
    const seen = new Set();
    for (let offset = 0; offset <= travel; offset += 8) {
      const frame = getGalleryFrame(offset / travel, count, width, height);
      assertFiniteFrame(frame);
      seen.add(frame.activeIndex);
      assert.ok(frame.cards[frame.activeIndex].visible);
    }
    assert.equal(seen.size, count, 'Every project remains reachable by native phone scroll');
    assert.equal(getGalleryFrame(1, count, width, height).activeIndex, count - 1);
  }
});
