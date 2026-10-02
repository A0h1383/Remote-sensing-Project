<p align="center">
  <b>English</b> |
  <a href="README.fa.md">فارسی</a>
</p>

# Remote Sensing Projects

A collection of Google Earth Engine scripts for satellite image processing, NDVI analysis, land-cover mapping, digital elevation model (DEM) analysis, hydrological studies, and land surface temperature (LST) estimation.

## Abstract

This project explores the application of Google Earth Engine (GEE) to satellite image processing and remote sensing analysis. Landsat 8 and Landsat 9 imagery is processed to generate true- and false-color composites, calculate the Normalized Difference Vegetation Index (NDVI), and estimate land surface temperature. Additional analyses include the generation and comparison of digital elevation models, extraction of slope, aspect, and hillshade, land-cover mapping, edge detection using Canny and Zero Crossing methods, extraction of river networks and drainage basins, and analysis of flow direction and flow accumulation. The results demonstrate the suitability of Google Earth Engine for rapid satellite-data processing and a broad range of environmental and geospatial analyses.

## Required Variables in the Imports Section

Some scripts use one or more variables from the **Imports** section of the Google Earth Engine Code Editor. Before running the code, import or define these variables using **Assets** or the **Geometry Imports** tools:

<ul>
<li><code>geometry</code>: Study area defined as a manually drawn polygon</li>
<li><code>table</code>: Study area imported from Assets</li>
<li><code>Iran</code>: Asset representing the boundary of Iran</li>
<li><code>imageVisParam</code>: Image visualization parameters</li>
<li><code>True_color_</code>: Visualization parameters for true-color imagery</li>
<li><code>False_color_</code>: Visualization parameters for false-color imagery</li>
<li><code>slope_</code>: Visualization parameters for the slope layer</li>
<li><code>flow_463</code> and <code>flow_927</code>: Visualization parameters for flow-accumulation layers</li>
</ul>

## Projects

<div align="center">

| File | Topic |
| :---: | :---: |
| `01_landsat8_basic_ndvi.js` | Landsat 8 processing, band composites, and NDVI calculation |
| `02_gfsad_landcover.js` | Land-cover mapping using GFSAD1000 |
| `03_esfahan_canny_hough.js` | Edge detection using the Canny algorithm and Hough Transform |
| `04_esfahan_zero_crossing.js` | Edge detection using the Zero Crossing method |
| `05_iran_dem_comparison.js` | Comparison of DEMs, slope, aspect, and hillshade |
| `06_free_flowing_rivers.js` | River-network extraction and export |
| `07_hydrosheds_flow.js` | Flow-direction and flow-accumulation analysis |
| `08_hydrosheds_basins.js` | Drainage-basin extraction and KML export |
| `09_iran_landcover.js` | Land-cover mapping of Iran using KNTU data |
| `10_topographic_diversity.js` | Topographic-diversity analysis |
| `11_drylands.js` | Analysis of agricultural, rainfed, and irrigated land |
| `12_landsat9_ndvi_tirs_lst.js` | NDVI calculation, thermal-band processing, and LST estimation |

</div>

## Defining the Study Area

In Google Earth Engine, the study area can be defined in two main ways. The first method is to create the area manually using the Geometry drawing tools in the map interface. By drawing a polygon, the user defines the area of interest, which is typically added to the **Imports** section under a variable such as `geometry`.

The second method is to import the study area as vector data through the **Assets** section. Shapefiles are typically uploaded as a ZIP archive containing the main components such as `SHP`, `SHX`, and `DBF`. After upload, the imported area can be accessed in the script through a variable such as `table` or `Iran`.

The following commands can be used to center the map on the study area and display it:

```javascript
Map.centerObject(geometry);
Map.addLayer(geometry);
```

## Loading Landsat Satellite Imagery

This project uses Landsat 8 and Landsat 9 satellite imagery. The imagery is accessed through the Earth Engine Data Catalog. To select suitable scenes, the required image collection is first specified and then filtered spatially and temporally.

The spatial filter restricts the collection to images that overlap the study area, while the temporal filter defines the required acquisition period.

```javascript
var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2023-01-01');

print(landsat, 'landsat');
```

## Clipping Images to the Study Area

After loading an image, the `clip` function can be used to restrict it to the study-area boundary. This ensures that only the portion of the image corresponding to the area of interest is processed and displayed.

```javascript
var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_164035_20220112')
  .clip(geometry);

Map.addLayer(image, {}, 'Clipped Image');
```

## Creating True-Color and False-Color Composites

To visualize satellite imagery in an interpretable form, multiple spectral bands are assigned to the red, green, and blue display channels. In a **True Color** composite, the red, green, and blue bands are usually mapped to their corresponding display channels.

In a **False Color** composite, near-infrared and visible bands are combined. This enhances the visual separation of vegetation, water, and urban areas and makes land-surface features easier to interpret.

Example of a true-color composite:

```javascript
var trueColor = image.select(['SR_B4', 'SR_B3', 'SR_B2']);

Map.addLayer(
  trueColor,
  {
    min: 9616.82,
    max: 16952.18
  },
  'True Color'
);
```

Example of a false-color composite:

```javascript
var falseColor = image.select(['SR_B5', 'SR_B4', 'SR_B3']);

Map.addLayer(
  falseColor,
  {
    min: 9616.82,
    max: 16952.18
  },
  'False Color'
);
```

## Calculating the Normalized Difference Vegetation Index (NDVI)

The Normalized Difference Vegetation Index (NDVI) is one of the most widely used remote-sensing indices for assessing vegetation condition and density. It is calculated from the difference between near-infrared and red reflectance.

NDVI values typically range from -1 to +1. Higher values generally indicate denser vegetation, while lower values are commonly associated with water, bare soil, or built-up surfaces.

The NDVI formula is:

```text
NDVI = (NIR - Red) / (NIR + Red)
```

For Landsat 8 and Landsat 9 imagery, `SR_B5` is used as the near-infrared band and `SR_B4` as the red band.

```javascript
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']);

Map.addLayer(ndvi, {}, 'NDVI');
```

Time-series charts can also be used to examine temporal changes in NDVI:

```javascript
print(
  ui.Chart.image.series(
    landsatCollection,
    geometry,
    ee.Reducer.mean(),
    30,
    'system:time_start'
  )
);
```

## Land-Cover Mapping

This project uses existing land-cover datasets to identify and visualize different land-surface classes. One of the datasets used is GFSAD1000, which provides global land-cover information.

The project also uses an Iran land-cover dataset from the KNTU collection. After selecting the classification band and clipping it to the study area, the image is displayed using `randomVisualizer`.

```javascript
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
  'Land Cover'
);
```

Example using the Iran land-cover dataset:

```javascript
var iranLandcover = ee.Image("KNTU/LiDARLab/IranLandCover/V1")
  .select('classification')
  .clip(table);

Map.addLayer(
  iranLandcover.randomVisualizer(),
  {},
  'Iran Land Cover'
);
```

## Edge Detection Using the Canny Algorithm

The Canny algorithm is a common method for detecting edges and strong intensity changes in imagery. It can reveal the boundaries of different features such as buildings, roads, rivers, and other abrupt changes across the land surface.

In Google Earth Engine, the Canny algorithm is implemented using the `CannyEdgeDetector` function. Its parameters control the detection threshold and sensitivity.

```javascript
var canny = ee.Algorithms.CannyEdgeDetector(
  landsatImage,
  10,
  3
);

Map.addLayer(
  canny,
  {
    palette: ['blue', 'red']
  },
  'Canny Edges'
);
```

## Hough Transform

After edge detection, the Hough Transform can be used to identify linear patterns and regular structures within the image. This method is useful for examining linear features such as routes, roads, and certain geometric structures.

```javascript
var hough = ee.Algorithms.HoughTransform(
  canny,
  256,
  16,
  40
);

Map.addLayer(
  hough.updateMask(hough),
  {
    palette: ['red']
  },
  'Hough Transform'
);
```

## Edge Detection Using the Zero Crossing Method

Zero Crossing is another method used for edge detection in remote-sensing imagery. It examines sign changes in image values after spatial filtering. The method is commonly used with Gaussian-based filters and Difference of Gaussian operations to reveal feature boundaries.

In this project, a spatial filter is first created and applied to the image, after which Zero Crossing locations are extracted.

```javascript
var zero = landsat8_toa
  .convolve(dog)
  .zeroCrossing();

Map.addLayer(
  zero.updateMask(zero),
  {
    palette: ['red']
  },
  'Zero Crossing'
);
```

## Digital Elevation Models and DEM Comparison

In the elevation-modeling section, several digital elevation models from different sources are loaded and compared. The purpose is to investigate differences among the elevation datasets and evaluate their suitability for topographic and hydrological analyses.

The datasets used include NASADEM, ALOS DEM, SRTM at different spatial resolutions, HydroSHEDS DEM, MERIT DEM, and ASTER DEM.

Elevation datasets used:

```text
NASA/NASADEM_HGT/001
JAXA/ALOS/AW3D30/V3_2
USGS/SRTMGL1_003
CGIAR/SRTM90_V4
WWF/HydroSHEDS/03VFDEM
MERIT/DEM/v1_0_3
NASA/ASTER_GED/AG100_003
```

Example of loading a DEM:

```javascript
var dem = ee.Image("NASA/NASADEM_HGT/001")
  .select('elevation')
  .clip(table);

Map.addLayer(
  dem,
  {
    min: 1300,
    max: 2600
  },
  'NASADEM'
);
```

## Extracting Slope, Aspect, and Hillshade

A digital elevation model can be used to derive several topographic parameters. **Slope** represents the rate of elevation change across the terrain. **Aspect** represents the direction of the steepest slope, while **hillshade** provides a shaded-relief representation that improves visualization of terrain morphology.

```javascript
var slope = ee.Terrain.slope(dem);
Map.addLayer(slope, {min: 0, max: 90}, 'Slope');

var aspect = ee.Terrain.aspect(dem);
Map.addLayer(aspect, {}, 'Aspect');

var hillshade = ee.Terrain.hillshade(dem);
Map.addLayer(hillshade, {}, 'Hillshade');
```

## River-Network Extraction

The Free Flowing Rivers dataset is used to extract the river network. Rivers intersecting the study area are first filtered and then displayed on the map with a specified color and line width using the `style` function.

The resulting river network is subsequently exported as a KML file for use in GIS software such as QGIS and ArcGIS.

```javascript
var rivers = ee.FeatureCollection(
  "WWF/HydroSHEDS/v1/FreeFlowingRivers"
).filterBounds(geometry);

var styledRivers = rivers.style({
  color: '#132bd6',
  width: 1.0
});

Map.addLayer(styledRivers, {}, 'Rivers');

Export.table.toDrive({
  collection: rivers,
  description: 'river',
  fileFormat: 'KML'
});
```

## Flow Direction and Flow Accumulation

In hydrological analysis, flow direction indicates the direction in which surface water moves from each location. Flow accumulation represents the degree to which runoff is concentrated and can be used to identify likely drainage paths and catchment areas.

In this project, flow-direction and flow-accumulation datasets at different spatial resolutions are loaded from HydroSHEDS and compared.

Datasets used:

```text
WWF/HydroSHEDS/03DIR
WWF/HydroSHEDS/15DIR
WWF/HydroSHEDS/30DIR
WWF/HydroSHEDS/15ACC
WWF/HydroSHEDS/30ACC
```

## Drainage-Basin Extraction

HydroSHEDS is used to identify drainage-basin boundaries. Basins that intersect the study area are extracted using the `filterBounds` function.

After the basins are displayed on the map, their vector data is exported in KML format.

```javascript
var basins = ee.FeatureCollection(
  "WWF/HydroSHEDS/v1/Basins/hybas_12"
).filterBounds(geometry);

Map.addLayer(basins, {}, 'Basins');

Export.table.toDrive({
  collection: basins,
  description: 'basin',
  fileFormat: 'KML'
});
```

## Topographic-Diversity Analysis

Topographic diversity describes the degree of variation and complexity in terrain morphology within a given area. In this project, the ALOS Topographic Diversity dataset is used to examine topographic variability within the study area.

After selecting the required band and clipping the dataset to the study area, the resulting layer is displayed on the map and can be exported to Google Drive for further use.

```javascript
var diversity = ee.Image(
  "CSP/ERGo/1_0/Global/ALOS_topoDiversity"
)
  .select('constant')
  .clip(table);

Map.addLayer(
  diversity,
  {},
  'Topographic Diversity'
);
```

## Drylands and Agricultural Land-Cover Analysis

In this section, land-cover data is used to examine dry regions, agricultural land, rainfed cropland, and irrigated cropland. After clipping the data to the study area, random visualization is used to distinguish the different land-cover classes.

```javascript
var drylands = ee.Image("USGS/GFSAD1000_V1")
  .select('landcover')
  .clip(table);

Map.addLayer(
  drylands.randomVisualizer(),
  {},
  'Drylands'
);
```

## Landsat 9 Image Processing

In the final part of the project, Landsat 9 imagery is selected using spatial and temporal filters as well as filters based on WRS path and row. A cloud-cover filter is also applied to remove unsuitable scenes from the image collection.

```javascript
var landsat9 = ee.ImageCollection(
  "LANDSAT/LC09/C02/T1_L2"
)
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35))
  .filter(ee.Filter.lessThan('CLOUD_COVER', 35));

print(landsat9, 'Landsat 9');
```

## NDVI Calculation and Temporal Analysis for Landsat 9

To calculate NDVI from Landsat 9 imagery, scale factors are first applied to the optical reflectance bands, after which NDVI is calculated for each image. A mean NDVI image is then generated by averaging the image collection.

Temporal variations in NDVI can also be examined using a time-series chart.

```javascript
var landsat9NDVI = landsat9.map(function(image) {
  var clipped = image.clip(geometry);

  var optical = clipped
    .select('SR_B[1-7]')
    .multiply(0.0000275)
    .add(-0.2);

  var ndvi = optical.normalizedDifference([
    'SR_B5',
    'SR_B4'
  ]);

  return ndvi.copyProperties(
    image,
    ['system:time_start', 'system:time_end']
  );
});

var meanNDVI = landsat9NDVI.mean();

Map.addLayer(
  meanNDVI,
  {},
  'Mean NDVI'
);
```

## Land Surface Temperature Estimation Using the Thermal Band

For land surface temperature analysis, the `ST_B10` thermal band from Landsat 9 imagery is used. Each image is first clipped to the study area, after which the thermal-band scale and temperature-conversion factors are applied.

Once land surface temperature has been calculated for each image, the mean temperature over the study area can be generated and its temporal variation examined using a time-series chart.

```javascript
var landsat9TIRS = landsat9.map(function(image) {
  var clipped = image.clip(geometry);

  var tirs = clipped
    .select('ST_B10')
    .multiply(0.00341802)
    .add(149);

  return tirs.copyProperties(
    image,
    ['system:time_start', 'system:time_end']
  );
});

var meanLST = landsat9TIRS.mean();

Map.addLayer(
  meanLST,
  {},
  'Land Surface Temperature'
);
```

## Combining Landsat 8 and Landsat 9 Data

In the final stage, the Landsat 8 and Landsat 9 thermal image collections are merged. Combining the two datasets increases the number of available observations and creates a more complete temporal dataset for land surface temperature analysis.

After the collections are merged, the temperature-conversion factors are applied to each image and the resulting land surface temperature dataset is prepared for further analysis.

```javascript
var landsat8 = ee.ImageCollection(
  "LANDSAT/LC08/C02/T1_L2"
)
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .select('ST_B10')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35));

var landsat9Thermal = ee.ImageCollection(
  "LANDSAT/LC09/C02/T1_L2"
)
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2022-03-01')
  .select('ST_B10')
  .filter(ee.Filter.equals('WRS_PATH', 164))
  .filter(ee.Filter.equals('WRS_ROW', 35));

var dataset = landsat8.merge(landsat9Thermal);

var lst = dataset.map(function(image) {
  var clipped = image.clip(geometry);

  return clipped
    .multiply(0.00341802)
    .add(149)
    .copyProperties(
      image,
      ['system:time_start', 'system:time_end']
    );
});

var meanLST = lst.toBands();

Map.addLayer(
  meanLST,
  {},
  'Mean LST'
);
```

## Exporting Results

Processed results are saved using the `Export.image.toDrive` and `Export.table.toDrive` functions. Raster outputs such as NDVI, DEM, slope, land cover, and land surface temperature are exported to Google Drive as GeoTIFF files, while vector data such as river networks and drainage basins are exported as KML files.

Example image export:

```javascript
Export.image.toDrive({
  image: ndvi,
  description: 'NDVI_Result',
  scale: 30,
  region: geometry,
  maxPixels: 1e9
});
```

Example vector-data export:

```javascript
Export.table.toDrive({
  collection: rivers,
  description: 'River_Network',
  fileFormat: 'KML'
});
```

## Data Sources Used

<ul>
<li><code>LANDSAT/LC08/C02/T1_L2</code>: Landsat 8 imagery</li>
<li><code>LANDSAT/LC09/C02/T1_L2</code>: Landsat 9 imagery</li>
<li><code>USGS/GFSAD1000_V1</code>: Land-cover data</li>
<li><code>NASA/NASADEM_HGT/001</code>: NASADEM digital elevation model</li>
<li><code>JAXA/ALOS/AW3D30/V3_2</code>: ALOS digital elevation model</li>
<li><code>USGS/SRTMGL1_003</code>: SRTM digital elevation model</li>
<li><code>WWF/HydroSHEDS</code>: Hydrological and drainage-network data</li>
<li><code>KNTU/LiDARLab/IranLandCover/V1</code>: Iran land-cover dataset</li>
<li><code>CSP/ERGo/1_0/Global/ALOS_topoDiversity</code>: Topographic-diversity data</li>
</ul>

## Running the Scripts

To run the scripts, first open the Google Earth Engine Code Editor and select the Google Cloud project associated with your account. Define the study area either by drawing it manually or by importing it through the **Assets** section.

After opening each script, add the required variables from the **Imports** section and run the code. If the script contains export operations, the generated tasks will appear in the **Tasks** tab and must be started manually.

## Conclusion

This collection of projects demonstrates the broad capabilities of Google Earth Engine for satellite-image processing and geospatial analysis. The platform supports workflows such as spatial and temporal filtering, image clipping, band composition, spectral-index calculation, digital elevation modeling, topographic analysis, and hydrological studies without requiring users to download large volumes of satellite imagery locally.

By combining Landsat imagery, elevation models, and hydrological datasets, the project enables integrated analysis of natural features, land cover, vegetation condition, topographic characteristics, and land surface temperature. These capabilities make Google Earth Engine a suitable platform for academic projects, remote sensing research, and environmental analysis.
