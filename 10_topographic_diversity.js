// Source screenshot: 31
// Required import: table = projects/rs-gee-507519/assets/Hozeh-north

Map.centerObject(table);
Map.addLayer(table);

var diversity = ee.Image("CSP/ERGo/1_0/Global/ALOS_topoDiversity")
  .select('constant')
  .clip(table);

Map.addLayer(diversity, {}, 'diversity', false);

Export.image.toDrive({
  image: diversity,
  description: 'diversity',
  region: table,
  scale: 270.0,
  maxPixels: 1e9
});
