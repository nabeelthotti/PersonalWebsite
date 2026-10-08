// Replace each null with a public image URL, e.g. /assets/interiors/living-room.jpg.
// Keep up to seven entries. Captions and alt text can be customized per photo.
export const interiorPhotos = Array.from({length:7},(_,index)=>({
  id:`interior-${index+1}`,
  src:null,
  alt:'A room Nabeel helped decorate',
  caption:'A space with a little personality.',
}));
