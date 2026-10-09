// Nabeel's confirmed list, updated 8 October 2026. Coordinates center the view, not trip locations.
// Add a photo path and caption when Nabeel supplies the actual photographs.
export const travelPlaces = [
  { id:'usa', photo:"/assets/photos/travel/nabeel-thotti-usa.webp", caption:"United States", alt:"Nabeel Thotti drinking chai in a café in the United States", width:1600, height:1280, name:'United States', shape:'840', center:[-100,39] },
  { id:'canada', name:'Canada', shape:'124', center:[-106,55] },
  { id:'england', photo:"/assets/photos/travel/nabeel-thotti-england.webp", caption:"England", alt:"Nabeel Thotti beside a red telephone box in England", width:1200, height:1600, name:'England', shape:'GB-ENG', center:[-1.5,52.5] },
  { id:'scotland', photo:"/assets/photos/travel/nabeel-thotti-scotland.webp", caption:"Scotland", alt:"Nabeel Thotti on the coast in Scotland", width:1200, height:1600, name:'Scotland', shape:'GB-SCT', center:[-4,57] },
  { id:'wales', photo:"/assets/photos/travel/nabeel-thotti-wales.webp", caption:"Wales", alt:"Nabeel Thotti looking out from a castle in Wales", width:1200, height:1600, name:'Wales', shape:'GB-WLS', center:[-3.8,52.3] },
  { id:'ireland', photo:"/assets/photos/travel/nabeel-thotti-ireland.webp", caption:"Ireland", alt:"Nabeel Thotti posing beside a statue in Ireland", width:1200, height:1600, name:'Ireland', shape:'372', center:[-8,53] },
  { id:'france', name:'France', shape:'250', center:[2,47] },
  { id:'spain', photo:"/assets/photos/travel/nabeel-thotti-spain.webp", caption:"Spain", alt:"Nabeel Thotti with friends in Spain", width:1200, height:1600, name:'Spain', shape:'724', center:[-4,40] },
  { id:'morocco', photo:"/assets/photos/travel/nabeel-thotti-morocco.webp", caption:"Morocco", alt:"Nabeel Thotti walking through a garden in Morocco", width:1200, height:1600, name:'Morocco', shape:'504', center:[-7,32] },
  { id:'greece', photo:"/assets/photos/travel/nabeel-thotti-greece.webp", caption:"Greece", alt:"Nabeel Thotti overlooking the coast at night in Greece", width:1200, height:1600, name:'Greece', shape:'300', center:[23,39] },
  { id:'italy', photo:"/assets/photos/travel/nabeel-thotti-italy.webp", caption:"Italy", alt:"Nabeel Thotti and a friend posing beside the Leaning Tower of Pisa in Italy", width:1199, height:1600, name:'Italy', shape:'380', center:[12.5,43] },
  { id:'netherlands', name:'The Netherlands', shape:'528', center:[5.3,52.2] },
  { id:'belgium', name:'Belgium', shape:'056', center:[4.5,50.8] },
  { id:'czechia', objectPosition:'center bottom', photo:"/assets/photos/travel/nabeel-thotti-czechia.webp", caption:"Czechia", alt:"Nabeel Thotti walking along a cobbled street in Czechia", width:1200, height:1600, name:'Czechia', shape:'203', center:[14.4,50.1], note:'Prague' },
  { id:'austria', name:'Austria', shape:'040', center:[14,47.6] },
  { id:'hungary', name:'Hungary', shape:'348', center:[19,47] },
  { id:'turkey', name:'Turkey', shape:'792', center:[35,39] },
  { id:'saudi-arabia', photo:"/assets/photos/travel/nabeel-thotti-saudi-arabia.webp", caption:"Saudi Arabia", alt:"Nabeel Thotti in a barber chair in Saudi Arabia", width:1200, height:1600, name:'Saudi Arabia', shape:'682', center:[45,24] },
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
