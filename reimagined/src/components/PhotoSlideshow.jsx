import { useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function PhotoSlideshow({photos,label,subject}) {
  const swipe = useRef(null);
  const [index,setIndex]=useState(0);
  const [failed,setFailed]=useState(false);
  const photo=photos[index];
  if(!photo)return null;
  function step(direction) {
    setIndex(current=>(current+direction+photos.length)%photos.length);
    setFailed(false);
  }
  function onKeyDown(event) {
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      step(event.key==='ArrowLeft'?-1:1);
    }
  }
  return <figure className="life-photo interior-gallery" role="group" aria-roledescription="carousel" aria-label={label} tabIndex={0} onKeyDown={onKeyDown}
    onTouchStart={event=>{
      if(event.touches.length!==1||event.target.closest('button')){swipe.current=null;return;}
      swipe.current={x:event.touches[0].clientX,y:event.touches[0].clientY,time:Date.now()};
    }}
    onTouchCancel={()=>{swipe.current=null;}}
    onTouchEnd={event=>{
      const start=swipe.current;swipe.current=null;
      if(!start||!event.changedTouches.length)return;
      const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
      if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*2&&Date.now()-start.time<600)step(dx<0?1:-1);
    }}>
    {photo.src&&!failed?<img key={photo.id} src={photo.src} alt={photo.alt} draggable={false} loading="lazy" onError={()=>setFailed(true)}/>:<div role="img" aria-label={`${photo.alt}. Photo to add.`}><span>{photo.placeholder || photo.alt}</span><small>Photo {index+1} to add</small></div>}
    <figcaption>
      <button type="button" onClick={()=>step(-1)} disabled={photos.length<2} aria-label={`Previous ${subject} photo`}><CaretLeft size={23}/></button>
      <span className="interior-caption">{photo.caption}<small aria-live="polite" aria-atomic="true">{index+1} / {photos.length}</small></span>
      <button type="button" onClick={()=>step(1)} disabled={photos.length<2} aria-label={`Next ${subject} photo`}><CaretRight size={23}/></button>
    </figcaption>
  </figure>;
}
