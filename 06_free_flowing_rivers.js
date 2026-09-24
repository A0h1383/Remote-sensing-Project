// Source screenshots: 17–18
// Required import: geometry (drawn polygon)

Map.centerObject(geometry);

var river = ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers")
  .filterBounds(geometry);
// Map.addLayer(river, {}, 'river');

var riverStyled = river.style({
  color: '#132bd6',
  width: 1.0
});

Map.addLayer(riverStyled, {}, 'river');

var river2 = ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers")
  .filterBounds(geometry);

Export.table.toDrive({
  collection: river2,
  description: 'river',
  fileFormat: 'kml'
});
