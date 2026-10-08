import { Play, ArrowUpRight } from '@phosphor-icons/react';
import { videos } from '../data.js';
import './short-videos.css';

export default function ShortVideos() {
  return <div className="short-grid">{videos.map(video=><article className="short-card" key={video.id}>
    <a className="short-poster" href={video.url} target="_blank" rel="noreferrer" aria-label={`Watch ${video.title} on YouTube`}>
      <img src={video.thumbnail} alt={`Thumbnail for ${video.title}`} width="1080" height="1920" loading="lazy" onError={event=>{const fallback=`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;if(event.currentTarget.src!==fallback)event.currentTarget.src=fallback;}}/>
      <span className="short-play" aria-hidden="true"><Play weight="fill" size={24}/></span>
    </a>
    <p className="short-meta">YouTube Short · {video.dateLabel}</p>
    <h3><a href={video.url} target="_blank" rel="noreferrer">{video.title}</a></h3>
    <a className="short-watch" href={video.url} target="_blank" rel="noreferrer">Watch Short <ArrowUpRight size={18} aria-hidden="true"/></a>
  </article>)}</div>;
}
