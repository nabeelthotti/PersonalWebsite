// Nabeel's confirmed list, 7 October 2026. Coordinates center the view, not trip locations.
// Add a photo path and caption when Nabeel supplies the actual photographs.
export const travelPlaces = [
  { id:'usa', name:'United States', shape:'840', center:[-100,39] },
  { id:'canada', name:'Canada', shape:'124', center:[-106,55] },
  { id:'england', name:'England', shape:'GB-ENG', center:[-1.5,52.5] },
  { id:'scotland', name:'Scotland', shape:'GB-SCT', center:[-4,57] },
  { id:'ireland', name:'Ireland', shape:'372', center:[-8,53] },
  { id:'northern-ireland', name:'Northern Ireland', shape:'GB-NIR', center:[-6.7,54.7] },
  { id:'france', name:'France', shape:'250', center:[2,47] },
  { id:'spain', name:'Spain', shape:'724', center:[-4,40] },
  { id:'morocco', name:'Morocco', shape:'504', center:[-7,32] },
  { id:'greece', name:'Greece', shape:'300', center:[23,39] },
  { id:'italy', name:'Italy', shape:'380', center:[12.5,43] },
  { id:'netherlands', name:'The Netherlands', shape:'528', center:[5.3,52.2] },
  { id:'germany', name:'Germany', shape:'276', center:[10,51] },
  { id:'belgium', name:'Belgium', shape:'056', center:[4.5,50.8] },
  { id:'czechia', name:'Czechia', shape:'203', center:[14.4,50.1], note:'Prague' },
  { id:'austria', name:'Austria', shape:'040', center:[14,47.6] },
  { id:'hungary', name:'Hungary', shape:'348', center:[19,47] },
  { id:'denmark', name:'Denmark', shape:'208', center:[10,56] },
  { id:'turkey', name:'Turkey', shape:'792', center:[35,39] },
  { id:'saudi-arabia', name:'Saudi Arabia', shape:'682', center:[45,24] },
  { id:'uae', name:'United Arab Emirates', shape:'784', center:[54,24] },
  { id:'qatar', name:'Qatar', shape:'634', center:[51.2,25.3] },
  { id:'india', name:'India', shape:'356', center:[79,22] },
  { id:'jammu-kashmir', name:'Jammu and Kashmir', center:[75,34], region:true, note:'A separate travel stop' },
  { id:'japan', name:'Japan', shape:'392', center:[138,37] },
  { id:'mexico', name:'Mexico', shape:'484', center:[-102,24] },
  { id:'dominican-republic', name:'Dominican Republic', shape:'214', center:[-70.5,19] },
  { id:'bahamas', name:'The Bahamas', shape:'044', center:[-77,25] },
].map(place=>({photo:null,caption:'',...place}));

export const travelByShape = new Map(travelPlaces.filter(p=>p.shape).map(p=>[p.shape,p]));
export const travelById = new Map(travelPlaces.map(p=>[p.id,p]));
export function normalizeRotation([longitude,latitude]) {
  return [((longitude+180)%360+360)%360-180, Math.max(-75,Math.min(75,latitude))];
}
export function shortestLongitude(from,to) {
  return ((to-from+180)%360+360)%360-180;
}
