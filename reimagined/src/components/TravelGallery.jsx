import PhotoSlideshow from './PhotoSlideshow.jsx';
import { travelPlaces } from '../data/travel.js';

export default function TravelGallery() {
  const photographedPlaces=travelPlaces.filter(place=>place.photo);
  const photos=(photographedPlaces.length ? photographedPlaces : travelPlaces).map(place=>({id:`travel-${place.id}`,src:place.photo,objectPosition:place.objectPosition,alt:place.alt || `Nabeel Thotti in ${place.name}`,width:place.width,height:place.height,placeholder:`Me in ${place.name}`,caption:place.caption || place.name}));
  return <PhotoSlideshow photos={photos} label="Travel photos" subject="travel"/>;
}
