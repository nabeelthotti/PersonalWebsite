import { profile } from '../data.js';
import { travelPlaces } from '../data/travel.js';
import { interiorPhotos } from '../data/interiors.js';

// Only real, explicitly configured photographs get image markup and sitemap entries.
// Never describe generated artwork or a placeholder as a photograph of Nabeel.
export function getPhotos() {
  const portrait = profile.portrait?.src ? [{
    id: 'nabeel-thotti', ...profile.portrait,
    title: 'Nabeel Thotti', caption: profile.portrait.caption || 'Nabeel Thotti',
    alt: profile.portrait.alt || 'Portrait of Nabeel Thotti', category: 'Portrait',
  }] : [];
  const travel = travelPlaces.filter(place => place.photo).map(place => ({
    id: `travel-${place.id}`, src: place.photo, title: `Nabeel Thotti in ${place.name}`,
    alt: place.alt || `Nabeel Thotti in ${place.name}`, caption: place.caption || `Nabeel Thotti in ${place.name}`,
    width: place.width, height: place.height, category: 'Travel',
  }));
  const interiors = interiorPhotos.filter(photo => photo.src).map((photo, i) => ({
    ...photo, id: photo.id, title: photo.title || `Interior decorating by Nabeel Thotti — ${i + 1}`,
    category: 'Interior decorating',
  }));
  return [...portrait, ...travel, ...interiors];
}

