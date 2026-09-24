// Source screenshots: 24–26
// Required import: table = projects/rs-gee-507519/assets/Hozeh-north

Map.centerObject(table);
Map.addLayer(table);

var flow_Dir_92 = ee.Image("WWF/HydroSHEDS/03DIR")
  .select('b1')
  .clip(table);
Map.addLayer(flow_Dir_92, {}, 'flow_Dir_92', false);

var flow_Dir_463 = ee.Image("WWF/HydroSHEDS/15DIR")
  .select('b1')
  .clip(table);
Map.addLayer(flow_Dir_463, {}, 'flow_Dir_463', false);

var flow_Dir_927 = ee.Image("WWF/HydroSHEDS/30DIR")
  .select('b1')
  .clip(table);
Map.addLayer(flow_Dir_927, {}, 'flow_Dir_927', false);

Export.image.toDrive({
  image: flow_Dir_92,
  description: 'flow_Dir_92',
  scale: 92,
  region: table,
  maxPixels: 1e9
});

// flow_accu
var flow_accu_463 = ee.Image("WWF/HydroSHEDS/15ACC")
  .select('b1')
  .clip(table);
Map.addLayer(flow_accu_463, flow_463, 'flow_accu_463', false);

var flow_accu_927 = ee.Image("WWF/HydroSHEDS/30ACC")
  .select('b1')
  .clip(table);
Map.addLayer(flow_accu_927, flow_927, 'flow_accu_927', false);

Export.image.toDrive({
  image: flow_accu_463,
  description: 'flow_accu_463',
  scale: 463,
  region: table,
  maxPixels: 1e9
});
