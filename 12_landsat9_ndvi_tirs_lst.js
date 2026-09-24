// Source screenshots: 33–38
// Required import: geometry (drawn polygon)

var landsat9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35))
  .filter(ee.Filter.lessThan('CLOUD_COVER', 35));

print(landsat9, 'landsat9');

var lan9 = ee.Image('LANDSAT/LC09/C02/T1_L2/LC09_164035_20220104');
Map.addLayer(lan9, {}, 'lan9');

// NDVI
var landsat9_NDVI = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35))
  .map(function(image) {
    var clip = image.clip(geometry);
    var optical = clip.select('SR_B[1-7]')
      .multiply(0.0000275)
      .add(-0.2);
    var ndvi = optical.normalizedDifference(['SR_B5', 'SR_B4']);
    return ndvi.copyProperties(image, ['system:time_start', 'system:time_end']);
  });

var meanndvi = landsat9_NDVI.mean();
Map.addLayer(meanndvi, {}, 'meanndvi');
print(ui.Chart.image.series(
  landsat9_NDVI,
  geometry,
  ee.Reducer.mean(),
  30,
  'system:time_start'
));

// TIRS
var landsat9_TIRS = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35))
  .map(function(image) {
    var clip = image.clip(geometry);
    var TIRS = clip.select('ST_B10')
      .multiply(0.00341802)
      .add(149)
      // Kept as shown in screenshot 37; standard Celsius conversion is 273.15.
      .subtract(217.15);
    return TIRS.copyProperties(image, ['system:time_start', 'system:time_end']);
  });

print(landsat9_TIRS, 'landsat9_TIRS');
var mean = landsat9_TIRS.mean();
Map.addLayer(mean, {}, 'TIRS');
print(ui.Chart.image.series(
  landsat9_TIRS,
  geometry,
  ee.Reducer.mean(),
  100,
  'system:time_start'
));

// Landsat 8 & Landsat 9
var landsat9_st = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .select('ST_B10')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35));
print(landsat9_st, 'landsat9');

var landsat8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .select('ST_B10')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35));
print(landsat8, 'landsat8');

var dataset = landsat9_st.merge(landsat8);
print(dataset, 'dataset');

var LST = dataset.map(function(image) {
  var clip = image.clip(geometry);
  var lst = clip.multiply(0.00341802).add(149.0);
  return lst.copyProperties(image, ['system:time_start', 'system:time_end']);
});

var mean_LST = LST.toBands();
Map.addLayer(mean_LST, {}, 'mean_LST');
print(ui.Chart.image.series(
  LST,
  geometry,
  ee.Reducer.mean(),
  100,
  'system:time_start'
));
