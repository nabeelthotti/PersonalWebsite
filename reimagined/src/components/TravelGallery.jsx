import PhotoSlideshow from './PhotoSlideshow.jsx';
import { travelPlaces } from '../data/travel.js';

export default function TravelGallery() {
  const photos=travelPlaces.map(place=>({id:place.id,src:place.photo,alt:`Nabeel in ${place.name}`,placeholder:`Me in ${place.name}`,caption:place.caption || place.name}));
  return <PhotoSlideshow photos={photos} label="Travel photos" subject="travel"/>;
}
