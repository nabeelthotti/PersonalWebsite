import { useEffect, useRef, useState } from 'react';

function measureLetter(camera) {
  const door=camera.querySelector('.letter-door');
  const rect=door.getBoundingClientRect();
  const inside=document.querySelector('.inside-site');
  const previous=inside.getAttribute('style');
  // Read the real first-page typography without exposing or loading another page.
  inside.style.cssText='display:block;position:fixed;inset:0;visibility:hidden;width:100vw';
  const heading=inside.querySelector('.story-moment h2');
  const copy=inside.querySelector('.story-moment p');
  const panel=heading.closest('.story-moment');
  const previousTransform=panel.style.transform;
  panel.style.transform='none';
  const headingRect=heading.getBoundingClientRect(),copyRect=copy.getBoundingClientRect();
  const type=getComputedStyle(heading),copyType=getComputedStyle(copy);
  const geometry={x:rect.left+rect.width/2,y:rect.top+rect.height/2,width:rect.height,height:rect.width,
    title:{left:headingRect.left,top:headingRect.top,width:headingRect.width,fontSize:type.fontSize,lineHeight:type.lineHeight},
    copy:{left:copyRect.left,top:copyRect.top,width:copyRect.width,fontSize:copyType.fontSize,lineHeight:copyType.lineHeight},
  };
  panel.style.transform=previousTransform;
  if(previous===null)inside.removeAttribute('style');else inside.setAttribute('style',previous);
  return geometry;
}

export default function useFingerStory(cameraRef) {
  const [phase,setPhase]=useState(() => history.state?.portfolioScroll?.y > 2 || /^#(my-story|beel|work|writing|life|contact)$/.test(location.hash) ? 'open' : 'closed');
  const [siteVisible,setSiteVisible]=useState(phase === 'open');
  const [journey,setJourney]=useState(null);
  const page=useRef(null),surface=useRef(null),heading=useRef(null),details=useRef(null),busy=useRef(false);

  function onHandClick() {
    if(busy.current||phase!=='closed')return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      setSiteVisible(true);setPhase('open');return;
    }
    busy.current=true;
    setJourney({direction:'in',geometry:measureLetter(cameraRef.current)});setPhase('opening');
  }

  function closeEntrance() {
    if(busy.current||phase!=='open')return;
    busy.current=true;
    window.scrollTo({top:0,behavior:'instant'});
    setSiteVisible(false);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      setPhase('closed');busy.current=false;return;
    }
    setPhase('closing');setJourney({direction:'out'});
  }

  // A closed entrance has no scrollable website underneath it.
  useEffect(()=>{
    const html=document.documentElement,body=document.body;
    const previous={html:html.style.overflow,body:body.style.overflow,overscroll:html.style.overscrollBehaviorY};
    html.style.overscrollBehaviorY='none';
    if(phase!=='open'){html.style.overflow='hidden';body.style.overflow='hidden';}
    return()=>{html.style.overflow=previous.html;body.style.overflow=previous.body;html.style.overscrollBehaviorY=previous.overscroll;};
  },[phase]);

  useEffect(()=>{
    if(phase==='open'){
      window.scrollTo({top:0,behavior:'instant'});
      const story=document.getElementById('my-story');
      if(story){story.tabIndex=-1;story.focus({preventScroll:true});}
    } else if(phase==='closed')cameraRef.current?.querySelector('.hello-hand')?.focus({preventScroll:true});
  },[phase,cameraRef]);

  // Only an upward gesture beyond the beginning closes the site, never ordinary
  // upward reading within the story, work, or life sections.
  useEffect(()=>{
    if(phase!=='open')return;
    const abort=new AbortController();
    let upward=0,lastWheel=0,touchY=null;
    const armedAt=performance.now()+400;
    const canClose=()=>performance.now()>armedAt&&window.scrollY<=2;
    window.addEventListener('wheel',event=>{
      if(!canClose()||event.deltaY>=0){upward=0;return;}
      event.preventDefault();
      const now=performance.now();
      if(now-lastWheel>250)upward=0;
      lastWheel=now;upward+=Math.abs(event.deltaY)*(event.deltaMode===1?16:1);
      if(upward>=65)closeEntrance();
    },{passive:false,signal:abort.signal});
    window.addEventListener('touchstart',event=>{touchY=event.touches.length===1&&canClose()&&!event.target.closest('input,textarea,select,button,a,[contenteditable="true"]')?event.touches[0].clientY:null;},{passive:true,signal:abort.signal});
    window.addEventListener('touchmove',event=>{
      if(touchY!==null&&event.touches.length===1&&canClose()&&event.touches[0].clientY-touchY>55){event.preventDefault();touchY=null;closeEntrance();}
    },{passive:false,signal:abort.signal});
    window.addEventListener('touchend',()=>{touchY=null;},{signal:abort.signal});
    window.addEventListener('keydown',event=>{
      if(canClose()&&['ArrowUp','PageUp','Home'].includes(event.key)&&!event.target.closest('input,textarea,select,[contenteditable="true"]')){event.preventDefault();closeEntrance();}
    },{signal:abort.signal});
    return()=>abort.abort();
  },[phase]);

  useEffect(()=>{
    if(!journey)return;
    const opening=journey.direction==='in';
    const geometry=journey.geometry||measureLetter(cameraRef.current);
    const abort=new AbortController(),animations=[];
    let stopped=false;
    const duration=opening?1400:1000;
    const finish=()=>{
      if(stopped)return;
      stopped=true;setSiteVisible(opening);setPhase(opening?'open':'closed');setJourney(null);busy.current=false;
    };
    window.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();finish();}
      else if([' ','ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Tab'].includes(event.key))event.preventDefault();
    },{signal:abort.signal});
    window.addEventListener('resize',finish,{signal:abort.signal});
    const animateFrames=(element,frames,timing={})=>{
      const sequence=opening?frames:[...frames].reverse().map(frame=>({...frame,...(frame.offset===undefined?{}:{offset:1-frame.offset})}));
      const animation=element.animate(sequence,{duration,easing:opening?'cubic-bezier(.48,0,.2,1)':'cubic-bezier(.35,0,.18,1)',fill:'both',...timing});
      animations.push(animation);return animation.finished;
    };
    const animate=(element,start,end)=>animateFrames(element,[start,end]);
    // Lay out one full-size page, then scale it as a single surface. Typography
    // stays proportional to the page instead of growing on a separate timeline.
    Object.assign(heading.current.style,{left:`${geometry.title.left}px`,top:`${geometry.title.top}px`,width:`${geometry.title.width}px`,fontSize:geometry.title.fontSize,lineHeight:geometry.title.lineHeight});
    const copy=details.current.querySelector('p');
    Object.assign(copy.style,{left:`${geometry.copy.left}px`,top:`${geometry.copy.top}px`,width:`${geometry.copy.width}px`,fontSize:geometry.copy.fontSize,lineHeight:geometry.copy.lineHeight});
    const hand=cameraRef.current.querySelector('.hello-hand');
    const handTransform=getComputedStyle(hand).transform;
    const restingTransform=handTransform==='none'?'':handTransform;
    Promise.all([
      // Sway around the wrist; keep the hand anchored instead of sliding it.
      animateFrames(hand,[
        {offset:0,transform:`${restingTransform} rotate(0deg)`},
        {offset:1,transform:`${restingTransform} rotate(9deg)`},
      ],{duration:opening?850:duration,easing:opening?'cubic-bezier(.2,.5,.25,1)':'cubic-bezier(.35,0,.18,1)'}),
      animateFrames(page.current,[
        {offset:0,left:`${geometry.x}px`,top:`${geometry.y}px`,width:`${geometry.width}px`,height:`${geometry.height}px`,transform:'translate(-50%,-50%) rotateZ(-90deg) rotateY(0deg) rotateX(0deg) scale(1)',boxShadow:'0 0 0 #321c1c00'},
        {offset:.52,left:`${geometry.x*.3+innerWidth*.35}px`,top:`${geometry.y*.3+innerHeight*.35}px`,width:'68vw',height:'76svh',transform:'translate(-50%,-50%) rotateZ(-20deg) rotateY(-12deg) rotateX(5deg) scale(.98)',boxShadow:'0 32px 70px #321c1c40'},
        {offset:1,left:'50vw',top:'50svh',width:'100vw',height:'100svh',transform:'translate(-50%,-50%) rotateZ(0deg) rotateY(0deg) rotateX(0deg) scale(1)',boxShadow:'0 0 0 #321c1c00'},
      ]),
      animateFrames(surface.current,[
        {offset:0,transform:`translate(-50%,-50%) scale(${geometry.width/innerWidth})`,filter:'blur(14px)'},
        {offset:.52,transform:'translate(-50%,-50%) scale(.68)',filter:'blur(2px)'},
        {offset:1,transform:'translate(-50%,-50%) scale(1)',filter:'blur(0px)'},
      ]),
      animate(details.current,{opacity:0},{opacity:1}),
      animate(cameraRef.current,{filter:'blur(0px)',opacity:1},{filter:'blur(18px)',opacity:.5}),
    ]).then(finish).catch(()=>{if(!stopped)finish();});
    return()=>{stopped=true;abort.abort();animations.forEach(animation=>animation.cancel());};
  },[journey,cameraRef]);

  return {phase,siteVisible,onHandClick,closeEntrance,
    transition:journey?<div className="finger-story-transition" aria-hidden="true"><div className="letter-page" ref={page}><div className="letter-page-surface" ref={surface}><h2 ref={heading}>I started with code.</h2><div className="letter-page-details" ref={details}><span className="chapter-label">How I got here</span><p>Software engineer. Systems, testing, iteration.</p></div></div></div></div>:null};
}
