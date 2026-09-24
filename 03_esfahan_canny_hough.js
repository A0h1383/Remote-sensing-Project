// Source screenshot: 13
// Required imports: geometry and imageVisParam

Map.centerObject(geometry);

var landsat8 = ee.ImageCollection("LANDSAT/LC08/C02/T1")
  .filterBounds(geometry)
  .filterDate('2019-04-01', '2019-08-01')
  .select('B8')
  .median()
  .clip(geometry);
Map.addLayer(landsat8, imageVisParam, 'landsat8');

var canny = ee.Algorithms.CannyEdgeDetector(landsat8, 10, 3);
Map.addLayer(canny, {palette: ['blue', 'red']}, 'canny');

var hough = ee.Algorithms.HoughTransform(canny, 256, 16, 40);
Map.addLayer(hough.updateMask(hough), {palette: ['red']}, 'hough');

Export.image.toDrive({
  image: hough,
  description: 'hough_Esfahan',
  scale: 15,
  region: geometry,
  maxPixels: 1e9
});
