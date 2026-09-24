// Source screenshots: 1, 4–9
// Required import: geometry (drawn polygon)

Map.setCenter(50.353452316844916, 35.024013059041835, 20);

var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2023-01-01');
print(landsat, 'landsat');

var lan8 = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_165036_20210422')
  .clip(geometry);
Map.addLayer(lan8, imageVisParam, 'lan8');

var True_color = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_165036_20210422')
  .clip(geometry);
Map.addLayer(True_color, True_color_, 'True_color');

var False_color = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_165036_20210422')
  .clip(geometry);
Map.addLayer(False_color, False_color_, 'False_color');

var ndvi = lan8.normalizedDifference(['SR_B5', 'SR_B4']);
Map.addLayer(ndvi, {}, 'ndvi');

Export.image.toDrive({
  image: ndvi,
  description: 'ndvi',
  scale: 30,
  region: geometry,
  maxPixels: 1e9
});
