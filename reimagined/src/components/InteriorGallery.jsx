import PhotoSlideshow from './PhotoSlideshow.jsx';
import { interiorPhotos } from '../data/interiors.js';

export default function InteriorGallery() {
  return <PhotoSlideshow photos={interiorPhotos} label="Interior decorating photos" subject="interior"/>;
}
