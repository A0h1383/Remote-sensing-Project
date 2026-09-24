// Source screenshots: 19–23
// Required import: table = projects/rs-gee-507519/assets/Province

Map.centerObject(table);
Map.addLayer(table);

var NASADEM = ee.Image("NASA/NASADEM_HGT/001")
  .select('elevation')
  .clip(table);
Map.addLayer(NASADEM, {min: 1300, max: 2600}, 'NASADEM', false);

var DSM_ALOS = ee.ImageCollection("JAXA/ALOS/AW3D30/V3_2")
  .filterBounds(table)
  .select('DSM')
  .mosaic()
  .clip(table);
Map.addLayer(DSM_ALOS, {min: 1300, max: 2600}, 'DSM', false);

var SRTM30 = ee.Image("USGS/SRTMGL1_003")
  .select('elevation')
  .clip(table);
Map.addLayer(SRTM30, {min: 1300, max: 2600}, 'SRTM30', false);

var SRTM90 = ee.Image("CGIAR/SRTM90_V4")
  .select('elevation')
  .clip(table);
Map.addLayer(SRTM90, {min: 1300, max: 2600}, 'SRTM90', false);

var DEM_WWF = ee.Image("WWF/HydroSHEDS/03VFDEM")
  .select('b1')
  .clip(table);
Map.addLayer(DEM_WWF, {min: 1300, max: 2600}, 'DEM_WWF', false);

// These two definitions are reconstructed from the visible layer names and
// Inspector output in screenshots 19–23.
var DEM_MERIT = ee.Image("MERIT/DEM/v1_0_3")
  .select('dem')
  .clip(table);
Map.addLayer(DEM_MERIT, {min: 1300, max: 2600}, 'DEM_MERIT', false);

var DEM_ASTER = ee.Image("NASA/ASTER_GED/AG100_003")
  .select('elevation')
  .clip(table);
Map.addLayer(DEM_ASTER, {min: 1300, max: 2600}, 'DEM_ASTER', false);

Export.image.toDrive({
  image: SRTM90,
  description: 'SRTM90',
  scale: 90,
  region: table,
  maxPixels: 1e9
});

// Extract terrain
var slope = ee.Terrain.slope(DEM_ASTER);
Map.addLayer(slope, {min: 0, max: 90}, 'slope', false);

var aspect = ee.Terrain.aspect(DEM_ASTER);
Map.addLayer(aspect, {}, 'aspect', false);

var hillshade = ee.Terrain.hillshade(DEM_ASTER);
Map.addLayer(hillshade, {}, 'hillshade', false);

Export.image.toDrive({
  image: slope,
  description: 'slope',
  scale: 90,
  region: table,
  maxPixels: 1e9
});
