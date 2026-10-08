export const ROOM_ASSETS = {
  chair: { src: '/assets/heroes/yellow-chair.png', width: .27, aspect: 1322 / 1190, rx: .102, ry: .058 },
  lamp: { src: '/assets/heroes/reading-lamp.png', width: .18, aspect: 887 / 1774, rx: .031, ry: .027 },
  table: { src: '/assets/heroes/walnut-table.png', width: .17, aspect: 1, rx: .068, ry: .041 },
};
export const ROOM_ASPECT = 1.55;
export const WALKWAY = .84;
export const ROOM_BRIEFS = {
  reading: { name: 'A reading corner', description: 'One chair. Good light. Somewhere to put your tea.' },
  conversation: { name: 'Room for a conversation', description: 'Two people, facing each other. Leave room to come and go.' },
};

export function initialRoom(brief, alternate = false) {
  if (brief === 'conversation') return [
    { id: 'chair', type: 'chair', name: 'First chair', x: alternate ? .69 : .28, y: .73, facing: 'left' },
    { id: 'seat', type: 'chair', name: 'Second chair', x: alternate ? .31 : .72, y: .70, facing: 'right' },
    { id: 'lamp', type: 'lamp', name: 'Reading lamp', x: alternate ? .83 : .16, y: .64 },
    { id: 'table', type: 'table', name: 'Side table', x: .5, y: alternate ? .89 : .70 },
  ];
  return [
    { id: 'chair', type: 'chair', name: 'Yellow chair', x: alternate ? .58 : .47, y: alternate ? .69 : .87, facing: alternate ? 'left' : 'right' },
    { id: 'lamp', type: 'lamp', name: 'Reading lamp', x: alternate ? .18 : .81, y: .64 },
    { id: 'table', type: 'table', name: 'Side table', x: alternate ? .79 : .22, y: .70 },
  ];
}

// Positions are each object's floor contact point, normalized to the room.
// Visual bounds keep the entire cutout reachable; footprints model floor space.
export function constrainObject(object, x, y) {
  const visual = ROOM_ASSETS[object.type];
  return { ...object, x: Math.max(visual.width / 2 + .015, Math.min(1 - visual.width / 2 - .015, x)),
    y: Math.max(visual.width / visual.aspect * ROOM_ASPECT + .025, Math.min(.96, y)) };
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function evaluateRoom(objects, brief, lightOn) {
  const chairs = objects.filter(object => object.type === 'chair');
  const lamp = objects.find(object => object.type === 'lamp');
  const table = objects.find(object => object.type === 'table');
  const blocked = objects.filter(object => object.y + ROOM_ASSETS[object.type].ry > WALKWAY);
  let collision = null;
  for (let a = 0; a < objects.length; a++) for (let b = a + 1; b < objects.length; b++) {
    const first = objects[a], second = objects[b];
    const dx = (first.x - second.x) / (ROOM_ASSETS[first.type].rx + ROOM_ASSETS[second.type].rx);
    const dy = (first.y - second.y) / (ROOM_ASSETS[first.type].ry + ROOM_ASSETS[second.type].ry);
    if (dx * dx + dy * dy < 1) collision = [first.name, second.name];
  }
  const feedback = [
    { id: 'walkway', done: blocked.length === 0, text: blocked.length ? `Move the ${blocked[0].name.toLowerCase()} out of the walkway.` : 'A clear way in and out.' },
    { id: 'space', done: !collision, text: collision ? `Give the ${collision[0].toLowerCase()} and ${collision[1].toLowerCase()} a little space.` : 'Every piece has room to sit.' },
  ];
  if (brief === 'reading') {
    const lampClose = distance(lamp, chairs[0]) <= .255;
    feedback.push({ id: 'light', done: lampClose && lightOn, text: !lampClose ? 'Bring the lamp beside the chair.' : !lightOn ? 'Switch on the reading light.' : 'Light right where you need it.' });
    const tableClose = distance(table, chairs[0]) <= .27;
    feedback.push({ id: 'table', done: tableClose, text: tableClose ? 'A place for tea, within reach.' : 'Bring the table within reach of the chair.' });
  } else {
    const [left, right] = [...chairs].sort((a, b) => a.x - b.x);
    const gap = distance(left, right);
    const facing = left.facing === 'right' && right.facing === 'left';
    const aligned = Math.abs(left.y - right.y) <= .14;
    const close = gap >= .29 && gap <= .56;
    feedback.push({ id: 'seats', done: facing && aligned && close, text: !facing ? 'Turn the chairs toward each other.' : !aligned ? 'Line the chairs up a little more.' : gap > .56 ? 'Bring the chairs closer for a conversation.' : gap < .29 ? 'Give the two seats a little breathing room.' : 'Two seats, ready for a conversation.' });
    const reachable = chairs.every(chair => distance(table, chair) <= .30);
    feedback.push({ id: 'table', done: reachable, text: reachable ? 'The table is within reach of both seats.' : 'Put the table where both people can reach it.' });
  }
  return feedback;
}
