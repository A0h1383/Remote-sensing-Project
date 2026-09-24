// Source screenshots: 27–28
// Required import: geometry (drawn polygon)

Map.centerObject(geometry);

var basin1 = ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_12")
  .filterBounds(geometry);
Map.addLayer(basin1, {}, 'basin1');

var basin = basin1.style({
  color: 'green',
  width: 1.0
});
Map.addLayer(basin, {}, 'basin');

Export.table.toDrive({
  collection: basin1,
  description: 'basin',
  fileFormat: 'KML'
});
