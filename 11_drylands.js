// Source screenshot: 32
// Required import: table = projects/rs-gee-507519/assets/Hozeh-north

Map.centerObject(table);
Map.addLayer(table);

var drylands = ee.Image("USGS/GFSAD1000_V1")
  .select('landcover')
  .clip(table);

Map.addLayer(drylands.randomVisualizer(), {}, 'drylands');

Export.image.toDrive({
  image: drylands,
  description: 'drylands',
  scale: 1000,
  region: table,
  maxPixels: 1e9
});
