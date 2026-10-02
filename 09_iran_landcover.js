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
