// Source screenshots: 10–12
// Required import: geometry (drawn polygon)

Map.centerObject(geometry);

var landcover = ee.Image("USGS/GFSAD1000_V1")
  .select('landcover')
  .clip(geometry);

Map.addLayer(
  landcover,
  {
    min: 0,
    max: 9,
    palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow']
  },
  'landcover'
);

Export.image.toDrive({
  image: landcover,
  description: 'landcover_iran',
  scale: 1000,
  region: geometry,
  maxPixels: 1e9
});
