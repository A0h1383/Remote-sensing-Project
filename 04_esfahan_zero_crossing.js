// Source screenshot: 14
// Required import: geometry

// The screenshot starts at line 45, so the original definition of fat was
// outside the visible area. Replace this kernel with the original imported
// definition if you have it.
var fat = ee.Kernel.laplacian8({normalize: false});

var skinny = ee.Kernel.gaussian({
  radius: 3,
  sigma: 1,
  units: 'pixels',
  normalize: true
});

var dog = fat.add(skinny);

// The screenshot refers to landsat8_toa, which was defined above the visible
// area. This is the likely collection setup based on the visible project.
var landsat8_toa = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
  .filterBounds(geometry)
  .filterDate('2019-04-01', '2019-08-01')
  .select('B8')
  .median()
  .clip(geometry);

var zero = landsat8_toa.convolve(dog).zeroCrossing();
Map.addLayer(zero.updateMask(zero), {palette: ['red']}, 'zero');

Export.image.toDrive({
  image: zero,
  description: 'zero_Esfahan',
  scale: 15,
  region: geometry,
  maxPixels: 1e9
});
