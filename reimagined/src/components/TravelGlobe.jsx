import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { travelByShape, travelById, normalizeRotation, shortestLongitude } from '../data/travel.js';
import './travel-globe.css';

const INITIAL = [-15,-27];
const graticule = geoGraticule10();
export default function TravelGlobe() {
  const [features,setFeatures] = useState(null);
  const [mapError,setMapError] = useState(false);
  const [rotation,setRotation] = useState(INITIAL);
  const [zoom,setZoom] = useState(1);
  const [selected,setSelected] = useState(null);
  const [hovered,setHovered] = useState(null);
  const [photoError,setPhotoError] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const region = useRef(null);
  const drag = useRef(null);
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const globe = useRef(null);
  const closeButton = useRef(null);
  const animation = useRef(0);
  const rotationRef = useRef(rotation);
  const id = useId();
  const place = travelById.get(selected);
  rotationRef.current = rotation;
  const projection = useMemo(()=>geoOrthographic().translate([320,320]).scale(287*zoom).rotate(rotation).clipAngle(90).precision(.35),[rotation,zoom]);
  const path = useMemo(()=>geoPath(projection),[projection]);


  useEffect(()=>{
    const abort = new AbortController();
    let requested=false;
    const load = async()=>{
      if(requested)return;
      requested=true; setMapError(false);
      try {
        const response=await fetch('/assets/travel/world.json',{signal:abort.signal});
        if(!response.ok)throw new Error('Map unavailable');
        const data=await response.json();
        setFeatures(data.features);
      } catch(error) { if(error.name!=='AbortError')setMapError(true); }
    };
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){load();observer.disconnect();}},{rootMargin:'500px'});
    observer.observe(region.current);
    return()=>{abort.abort();observer.disconnect();};
  },[attempt]);
  useEffect(()=>()=>cancelAnimationFrame(animation.current),[]);

  useEffect(()=>{
    const svg=globe.current;
    const onWheel=event=>{
      const rect=svg.getBoundingClientRect();
      const x=(event.clientX-rect.left)*640/rect.width-320;
      const y=(event.clientY-rect.top)*640/rect.height-320;
      if(Math.hypot(x,y)>288)return;
      event.preventDefault();
      if(svg.contains(document.activeElement))document.activeElement.blur();
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?rect.height:1);
      setZoom(value=>Math.max(1,Math.min(7,value*Math.exp(-delta*.002))));
    };
    svg.addEventListener('wheel',onWheel,{passive:false});
    return()=>svg.removeEventListener('wheel',onWheel);
  },[]);

  function closePhoto() {
    setSelected(null);
    requestAnimationFrame(()=>globe.current?.focus({preventScroll:true}));
  }
  useEffect(()=>{
    if(!selected)return;
    closeButton.current?.focus({preventScroll:true});
    const escape=event=>{if(event.key==='Escape'){event.preventDefault();closePhoto();}};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[selected]);

  function turnTo(target) {
    cancelAnimationFrame(animation.current);
    const end=normalizeRotation(target);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){setRotation(end);return;}
    const start=rotationRef.current;
    const delta=shortestLongitude(start[0],end[0]);
    const began=performance.now();
    const tick=now=>{
      const t=Math.min(1,(now-began)/850);
      const ease=t*t*(3-2*t);
      setRotation(normalizeRotation([start[0]+delta*ease,start[1]+(end[1]-start[1])*ease]));
      if(t<1)animation.current=requestAnimationFrame(tick);
    };
    animation.current=requestAnimationFrame(tick);
  }
  function choose(key) {
    const next=travelById.get(key);
    if(!next)return;
    setSelected(key);setPhotoError(false);setHovered(null);
    turnTo([-next.center[0],-next.center[1]]);
  }

  function pointerDown(event) {
    if(event.button!==0)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const point=[(event.clientX-rect.left)*640/rect.width,(event.clientY-rect.top)*640/rect.height];
    if(Math.hypot(point[0]-320,point[1]-320)>288)return;
    event.preventDefault();
    cancelAnimationFrame(animation.current);
    pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    event.currentTarget.setPointerCapture(event.pointerId);
    if(pointers.current.size>1){
      const [a,b]=[...pointers.current.values()];
      pinch.current={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom};
      drag.current=null;
      return;
    }
    const coordinates=projection.invert(point);
    const regionPlace=coordinates&&geoDistance(coordinates,[75,34])<.04?'jammu-kashmir':null;
    drag.current={id:event.pointerId,x:event.clientX,y:event.clientY,start:rotationRef.current,moved:false,place:regionPlace || event.target.closest('[data-place]')?.dataset.place};
  }
  function pointerMove(event) {
    if(!pointers.current.has(event.pointerId))return;
    pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pinch.current&&pointers.current.size>1){
      const [a,b]=[...pointers.current.values()];
      setZoom(Math.max(1,Math.min(7,pinch.current.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.current.distance)));
      return;
    }
    if(!drag.current || drag.current.id!==event.pointerId)return;
    const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;
    if(Math.hypot(dx,dy)>6)drag.current.moved=true;
    if(drag.current.moved) {
      const scale=640/event.currentTarget.getBoundingClientRect().width;
      setRotation(normalizeRotation([drag.current.start[0]+dx*.24*scale/zoom,drag.current.start[1]-dy*.24*scale/zoom]));
    }
  }
  function pointerUp(event) {
    const previous=drag.current;
    pointers.current.delete(event.pointerId);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(pinch.current){
      if(pointers.current.size===0)pinch.current=null;
      // A pinch never becomes an accidental country tap when the first finger lifts.
      drag.current=null;
      return;
    }
    drag.current=null;
    if(event.type==='pointerup'&&previous?.id===event.pointerId&&!previous.moved&&previous.place)choose(previous.place);
  }
  function globeKey(event) {
    if(event.target!==event.currentTarget)return;
    if(['+','=','-','_'].includes(event.key)){event.preventDefault();setZoom(z=>Math.max(1,Math.min(7,z*((event.key==='-'||event.key==='_') ? .8 : 1.25))));return;}
    const moves={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,10],ArrowDown:[0,-10]};
    if(moves[event.key]){event.preventDefault();cancelAnimationFrame(animation.current);setRotation(normalizeRotation([rotation[0]+moves[event.key][0],rotation[1]+moves[event.key][1]]));}
  }
  function placeKey(event,key) {if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(key);}}

  return <>
    <div className="life-copy travel-copy" ref={region}>
      <h2>A little further<br />from home.</h2>
      <p>Find a country to open a memory.</p>
    </div>
    <div className="travel-map">
      <div className={`travel-globe-surface${place ? ' has-photo' : ''}`}>
      <div className="travel-globe-base" inert={!!place}>
      <svg ref={globe} viewBox="0 0 640 640" role="group" tabIndex={0} aria-label="Travel globe. Drag to rotate, pinch or scroll to zoom. Keyboard: arrow keys rotate, plus and minus zoom. Select a filled country for its photo." onKeyDown={globeKey} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
        <defs><clipPath id={`${id}-clip`}><circle cx="320" cy="320" r="288" /></clipPath></defs>
        <circle cx="320" cy="320" r="288" className="travel-ocean" />
        <g clipPath={`url(#${id}-clip)`}>
          <path d={path(graticule)} className="travel-graticule" />
          {features?.map(feature=>{
            const visited=travelByShape.get(feature.id);
            const d=path(feature);
            return d ? <path key={feature.id || feature.properties.name} d={d} data-place={visited?.id} className={`travel-country${visited?' is-visited':''}${selected===visited?.id?' is-selected':''}`} role={visited?'button':undefined} tabIndex={visited?0:undefined} aria-label={visited?`See ${visited.name} photo`:undefined} aria-pressed={visited?selected===visited.id:undefined} onKeyDown={visited?e=>placeKey(e,visited.id):undefined} onPointerEnter={()=>setHovered(visited?.name||null)} onPointerLeave={()=>setHovered(null)}><title>{feature.properties.name}{visited?' — visited':''}</title></path>:null;
          })}
        </g>
        <circle cx="320" cy="320" r="288" className="travel-globe-edge" />
      </svg>
      </div>
      {place && <div className="travel-photo-overlay" role="dialog" aria-label={`Photo from ${place.name}`}>
        <figure className="life-photo travel-photo" key={selected}>
          {place.photo&&!photoError?<img src={place.photo} style={{objectPosition:place.objectPosition}} alt={place.alt || `Nabeel Thotti in ${place.name}`} width={place.width} height={place.height} onError={()=>setPhotoError(true)}/>:<div className="travel-photo-placeholder" role="img" aria-label={`Nabeel in ${place.name}. Photo to add.`}><span>Me in {place.name}</span><small>Photo to add</small></div>}
          <figcaption>{place.caption || place.name}</figcaption>
          <button ref={closeButton} className="travel-photo-close" aria-label="Close travel photo" onClick={closePhoto}>×</button>
        </figure>
      </div>}
      </div>
      {!features&&<div className="travel-map-status" role="status">{mapError?<><span>The globe couldn’t load.</span><button onClick={()=>setAttempt(n=>n+1)}>Try again</button></>:'Loading the globe…'}</div>}
      <div className="travel-hover" aria-hidden="true">{hovered || <><span className="globe-desktop-hint">Drag to explore. Scroll to zoom.</span><span className="globe-touch-hint">Drag to explore. Pinch to zoom.</span></>}</div>
    </div>
  </>;
}
