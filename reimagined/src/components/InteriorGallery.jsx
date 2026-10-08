import PhotoSlideshow from './PhotoSlideshow.jsx';
import { interiorPhotos } from '../data/interiors.js';

export default function InteriorGallery() {
  return <PhotoSlideshow photos={interiorPhotos.slice(0,7)} label="Interior decorating photos" subject="interior"/>;
}
