import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { geoArea, geoContains, geoOrthographic, geoPath } from 'd3-geo';
import { travelPlaces, travelByShape, normalizeRotation, shortestLongitude } from '../src/data/travel.js';
const map=JSON.parse(fs.readFileSync(new URL('../public/assets/travel/world.json',import.meta.url)));

test('all 28 confirmed places are unique and have geography or a separate region',()=>{
  assert.equal(travelPlaces.length,28);
  assert.equal(new Set(travelPlaces.map(p=>p.id)).size,28);
  for(const place of travelPlaces){
    if(place.shape)assert.ok(map.features.some(f=>f.id===place.shape),`Missing geography for ${place.name}`);
    else assert.equal(place.id,'jammu-kashmir');
    assert.equal(place.photo,null);
  }
});
test('UK destinations are separate; Wales and unvisited countries remain unfilled',()=>{
  for(const iso of ['GB-ENG','GB-SCT','GB-NIR']){
    assert.ok(travelByShape.has(iso));
    const feature=map.features.find(f=>f.id===iso);
    assert.ok(geoArea(feature)<Math.PI*2,'Boundary must cover the place, not the rest of the globe');
    assert.ok(geoContains(feature,travelByShape.get(iso).center));
  }
  for(const iso of ['826','GB-WLS','156','643','620'])assert.equal(travelByShape.has(iso),false);
  assert.equal(map.features.some(f=>f.id==='826'),false);
});
test('every visited shape renders when turned toward its destination',()=>{
  for(const place of travelPlaces.filter(p=>p.shape)){
    const path=geoPath(geoOrthographic().rotate([-place.center[0],-place.center[1]]));
    const rendered=path(map.features.find(f=>f.id===place.shape));
    assert.ok(rendered&&!rendered.includes('NaN'),place.name);
  }
});
test('rotation crosses the date line on the short route and cannot flip over the poles',()=>{
  assert.equal(shortestLongitude(170,-170),20);
  assert.equal(shortestLongitude(-170,170),-20);
  assert.deepEqual(normalizeRotation([725,120]),[5,75]);
  assert.deepEqual(normalizeRotation([-725,-120]),[-5,-75]);
});
