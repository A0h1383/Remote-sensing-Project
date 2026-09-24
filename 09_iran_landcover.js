// Source screenshots: 29–30
// Required import: table = projects/rs-gee-507519/assets/Hozeh-north

Map.centerObject(table);
Map.addLayer(table);

var landcover = ee.Image("KNTU/LiDARLab/IranLandCover/V1")
  .select('classification')
  .clip(table);

Map.addLayer(landcover.randomVisualizer(), {}, 'landcover', false);

Export.image.toDrive({
  image: landcover,
  description: 'landcover',
  scale: 100,
  region: table,
  maxPixels: 1e9
});
