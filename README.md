# پروژه‌های سنجش از دور

مجموعه‌ای از اسکریپت‌های Google Earth Engine برای پردازش تصاویر ماهواره‌ای، تحلیل شاخص NDVI، تهیه نقشه پوشش اراضی، تحلیل مدل‌های ارتفاعی، مطالعات هیدرولوژی و برآورد دمای سطح زمین.

## چکیده

<div dir="rtl" align="justify">

این پروژه به بررسی کاربرد سامانه Google Earth Engine در پردازش تصاویر ماهواره‌ای و تحلیل‌های سنجش از دور می‌پردازد. در این پروژه، تصاویر ماهواره‌ای Landsat 8 و Landsat 9 برای تهیه ترکیب‌های رنگی طبیعی و کاذب، محاسبه شاخص پوشش گیاهی NDVI و برآورد دمای سطح زمین پردازش شدند. همچنین تحلیل‌هایی شامل تهیه و مقایسه مدل‌های ارتفاعی، استخراج شیب، جهت شیب و سایه‌روشن، تهیه نقشه پوشش اراضی، شناسایی لبه با الگوریتم‌های Canny و Zero Crossing، استخراج رودخانه‌ها و حوضه‌های آبریز و بررسی جهت و تجمع جریان انجام گرفت. نتایج نشان می‌دهد که Google Earth Engine ابزار مناسبی برای پردازش سریع تصاویر ماهواره‌ای و انجام تحلیل‌های گسترده محیطی و جغرافیایی است.

</div>

## متغیرهای موردنیاز در بخش Imports

<div dir="rtl" align="right">

در برخی اسکریپت‌ها، یک یا چند متغیر از بخش **Imports** محیط Google Earth Engine استفاده شده است. پیش از اجرای کد، این متغیرها را از بخش **Assets** یا ابزار **Geometry Imports** وارد کنید:

<ul>
<li><code>geometry</code> : محدوده مطالعاتی به‌صورت پلیگون ترسیمی</li>
<li><code>table</code> : محدوده مطالعاتی واردشده از بخش Assets</li>
<li><code>Iran</code> : دارایی مربوط به محدوده کشور ایران</li>
<li><code>imageVisParam</code> : پارامترهای بصری‌سازی تصاویر</li>
<li><code>True_color_</code> : پارامترهای نمایش تصویر رنگی طبیعی</li>
<li><code>False_color_</code> : پارامترهای نمایش تصویر رنگی کاذب</li>
<li><code>slope_</code> : پارامترهای بصری‌سازی لایه شیب</li>
<li><code>flow_463</code> و <code>flow_927</code> : پارامترهای بصری‌سازی لایه‌های تجمع جریان</li>
</ul>

</div>

## پروژه‌ها

<div align="center">

|              فایل              |                       موضوع                      |
| :----------------------------: | :----------------------------------------------: |
|   `01_landsat8_basic_ndvi.js`  |   پردازش Landsat 8، ترکیب باندها و محاسبه NDVI   |
|     `02_gfsad_landcover.js`    |   تهیه نقشه پوشش اراضی با استفاده از GFSAD1000   |
|   `03_esfahan_canny_hough.js`  |     تشخیص لبه با الگوریتم Canny و تبدیل Hough    |
|  `04_esfahan_zero_crossing.js` |          تشخیص لبه با روش Zero Crossing          |
|   `05_iran_dem_comparison.js`  | مقایسه مدل‌های ارتفاعی، شیب، جهت شیب و سایه‌روشن |
|   `06_free_flowing_rivers.js`  |       استخراج و خروجی‌گیری شبکه رودخانه‌ها       |
|     `07_hydrosheds_flow.js`    |           بررسی جهت جریان و تجمع جریان           |
|    `08_hydrosheds_basins.js`   |        استخراج حوضه‌های آبریز و خروجی KML        |
|     `09_iran_landcover.js`     |      تهیه نقشه پوشش اراضی ایران با داده KNTU     |
|  `10_topographic_diversity.js` |               بررسی تنوع توپوگرافی               |
|        `11_drylands.js`        |          بررسی اراضی کشاورزی، دیم و آبی          |
| `12_landsat9_ndvi_tirs_lst.js` |   محاسبه NDVI، پردازش باند حرارتی و برآورد LST   |

</div>

## تعریف محدوده مطالعاتی

<div dir="rtl" align="justify">

در Google Earth Engine می‌توان محدوده مطالعاتی را به دو روش تعیین کرد. در روش اول، محدوده به‌صورت دستی و با استفاده از ابزارهای ترسیم Geometry در محیط نقشه ایجاد می‌شود. در این روش، کاربر با رسم یک پلیگون، محدوده موردنظر خود را مشخص می‌کند و متغیر آن معمولاً با نام `geometry` در بخش Imports ایجاد می‌شود.

در روش دوم، محدوده مطالعاتی به‌صورت فایل برداری و از طریق بخش Assets وارد سامانه می‌شود. فایل‌های Shapefile باید معمولاً به‌صورت یک فایل ZIP شامل فایل‌های اصلی مانند `SHP`، `SHX` و `DBF` بارگذاری شوند. پس از بارگذاری، محدوده واردشده با نامی مانند `table` یا `Iran` در اسکریپت قابل استفاده خواهد بود.

برای تمرکز نقشه روی محدوده مطالعاتی نیز از دستورهای زیر استفاده می‌شود:

</div>

```javascript
Map.centerObject(geometry);
Map.addLayer(geometry);
```

## فراخوانی تصاویر ماهواره‌ای Landsat

<div dir="rtl" align="justify">

در این پروژه از تصاویر ماهواره‌ای Landsat 8 و Landsat 9 استفاده شده است. این تصاویر از طریق Earth Engine Data Catalog فراخوانی می‌شوند. برای انتخاب تصاویر مناسب، ابتدا مجموعه تصاویر موردنظر مشخص شده و سپس فیلترهای مکانی و زمانی روی آن اعمال می‌شود.

فیلتر مکانی با استفاده از محدوده مطالعاتی انجام می‌شود تا فقط تصاویری که با محدوده موردنظر هم‌پوشانی دارند انتخاب شوند. فیلتر زمانی نیز برای تعیین بازه زمانی تصاویر به‌کار می‌رود.

</div>

```javascript
var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(geometry)
  .filterDate('2022-01-01', '2023-01-01');

print(landsat, 'landsat');
```

## برش تصاویر بر اساس محدوده مطالعاتی

<div dir="rtl" align="justify">

پس از فراخوانی تصویر، با استفاده از تابع `clip`، تصویر بر اساس محدوده مطالعاتی برش داده می‌شود. این کار باعث می‌شود فقط بخش مربوط به منطقه موردنظر پردازش و نمایش داده شود.

</div>

```javascript
var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_164035_20220112')
  .clip(geometry);

Map.addLayer(image, {}, 'Clipped Image');
```

## تهیه تصاویر رنگی طبیعی و کاذب

<div dir="rtl" align="justify">

برای نمایش تصاویر ماهواره‌ای به شکل قابل تفسیر، چند باند طیفی در کانال‌های قرمز، سبز و آبی ترکیب می‌شوند. در ترکیب رنگی طبیعی یا True Color، معمولاً باندهای قرمز، سبز و آبی به‌ترتیب در کانال‌های مربوط قرار می‌گیرند.

در ترکیب رنگی کاذب یا False Color، از باندهای نزدیک مادون‌قرمز و باندهای مرئی استفاده می‌شود. این ترکیب باعث می‌شود پوشش گیاهی، آب و مناطق شهری با رنگ‌های متفاوت نمایش داده شوند و تفسیر عوارض سطح زمین آسان‌تر شود.

</div>

نمونه ترکیب رنگی طبیعی:

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

نمونه ترکیب رنگی کاذب:

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

## محاسبه شاخص پوشش گیاهی NDVI

<div dir="rtl" align="justify">

شاخص NDVI یکی از پرکاربردترین شاخص‌های سنجش از دور برای بررسی وضعیت و تراکم پوشش گیاهی است. این شاخص بر اساس اختلاف بازتابش باند نزدیک مادون‌قرمز و باند قرمز محاسبه می‌شود.

مقدار NDVI معمولاً بین منفی یک تا مثبت یک قرار دارد. مقادیر بالاتر معمولاً نشان‌دهنده پوشش گیاهی متراکم‌تر و مقادیر پایین‌تر نشان‌دهنده آب، خاک بدون پوشش یا مناطق ساخته‌شده هستند.

فرمول شاخص NDVI به‌صورت زیر است:

</div>

```text
NDVI = (NIR - Red) / (NIR + Red)
```

در تصاویر Landsat 8 و Landsat 9، باند `SR_B5` به‌عنوان باند نزدیک مادون‌قرمز و باند `SR_B4` به‌عنوان باند قرمز استفاده می‌شود.

```javascript
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']);

Map.addLayer(ndvi, {}, 'NDVI');
```

برای بررسی تغییرات زمانی NDVI نیز می‌توان از نمودارهای سری زمانی استفاده کرد:

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

## تهیه نقشه پوشش اراضی

<div dir="rtl" align="justify">

در این پروژه از داده‌های آماده پوشش اراضی برای شناسایی و نمایش انواع پوشش سطح زمین استفاده شده است. یکی از داده‌های مورد استفاده، مجموعه GFSAD1000 است که اطلاعات پوشش اراضی را در مقیاس جهانی ارائه می‌کند.

همچنین از داده پوشش اراضی ایران مربوط به مجموعه KNTU استفاده شده است. پس از انتخاب باند طبقه‌بندی و برش آن بر اساس محدوده مطالعاتی، تصویر با استفاده از تابع `randomVisualizer` نمایش داده می‌شود.

</div>

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

نمونه استفاده از داده پوشش اراضی ایران:

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

## تشخیص لبه با الگوریتم Canny

<div dir="rtl" align="justify">

الگوریتم Canny یکی از روش‌های متداول برای شناسایی لبه‌ها و تغییرات شدید در تصاویر است. این الگوریتم می‌تواند مرز عوارض مختلف مانند ساختمان‌ها، جاده‌ها، رودخانه‌ها و تغییرات ناگهانی سطح زمین را آشکار کند.

در Google Earth Engine، الگوریتم Canny با استفاده از تابع `CannyEdgeDetector` اجرا می‌شود. پارامترهای این تابع میزان آستانه و حساسیت تشخیص لبه را کنترل می‌کنند.

</div>

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

## تبدیل Hough

<div dir="rtl" align="justify">

پس از شناسایی لبه‌ها، می‌توان از تبدیل Hough برای شناسایی الگوهای خطی و ساختارهای منظم در تصویر استفاده کرد. این روش برای بررسی خطوط و عوارض خطی مانند مسیرها، جاده‌ها و برخی ساختارهای هندسی کاربرد دارد.

</div>

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

## تشخیص لبه با روش Zero Crossing

<div dir="rtl" align="justify">

روش Zero Crossing یکی دیگر از روش‌های تشخیص لبه در تصاویر سنجش از دور است. در این روش، تغییر علامت در مقادیر تصویر پس از اعمال فیلترهای مکانی بررسی می‌شود. این روش معمولاً همراه با فیلترهای گاوسی و Difference of Gaussian برای آشکارسازی مرز عوارض استفاده می‌شود.

در این پروژه، ابتدا یک فیلتر مکانی ساخته شده و سپس با اعمال آن روی تصویر، نقاط Zero Crossing استخراج شده‌اند.

</div>

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

## مدل‌های ارتفاعی و مقایسه DEMها

<div dir="rtl" align="justify">

در بخش مدل‌سازی ارتفاعی، چند مدل ارتفاعی رقومی از منابع مختلف فراخوانی و با یکدیگر مقایسه شدند. هدف از این بخش، بررسی تفاوت مدل‌های ارتفاعی و ارزیابی قابلیت آن‌ها برای تحلیل‌های توپوگرافی و هیدرولوژیکی است.

مدل‌های مورد استفاده شامل NASADEM، مدل ارتفاعی ALOS، SRTM با تفکیک مکانی مختلف، مدل ارتفاعی HydroSHEDS، MERIT DEM و ASTER DEM هستند.

</div>

داده‌های ارتفاعی استفاده‌شده:

```text
NASA/NASADEM_HGT/001
JAXA/ALOS/AW3D30/V3_2
USGS/SRTMGL1_003
CGIAR/SRTM90_V4
WWF/HydroSHEDS/03VFDEM
MERIT/DEM/v1_0_3
NASA/ASTER_GED/AG100_003
```

نمونه فراخوانی مدل ارتفاعی:

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

## استخراج شیب، جهت شیب و سایه‌روشن

<div dir="rtl" align="justify">

با استفاده از مدل ارتفاعی می‌توان پارامترهای مختلف توپوگرافی را استخراج کرد. شیب، میزان تغییر ارتفاع در سطح زمین را نشان می‌دهد. جهت شیب، جهت حرکت بیشترین تغییر ارتفاع را مشخص می‌کند و سایه‌روشن نیز برای نمایش بهتر ناهمواری‌ها و شکل زمین مورد استفاده قرار می‌گیرد.

</div>

```javascript
var slope = ee.Terrain.slope(dem);
Map.addLayer(slope, {min: 0, max: 90}, 'Slope');

var aspect = ee.Terrain.aspect(dem);
Map.addLayer(aspect, {}, 'Aspect');

var hillshade = ee.Terrain.hillshade(dem);
Map.addLayer(hillshade, {}, 'Hillshade');
```

## استخراج شبکه رودخانه‌ها

<div dir="rtl" align="justify">

برای استخراج شبکه رودخانه‌ای از مجموعه داده Free Flowing Rivers استفاده شده است. ابتدا رودخانه‌هایی که با محدوده مطالعاتی هم‌پوشانی دارند فیلتر شده و سپس با استفاده از تابع `style` با رنگ و ضخامت مشخص روی نقشه نمایش داده می‌شوند.

در ادامه، شبکه رودخانه‌ای به‌صورت فایل KML خروجی گرفته می‌شود تا بتوان از آن در نرم‌افزارهای GIS مانند QGIS و ArcGIS استفاده کرد.

</div>

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

## بررسی جهت جریان و تجمع جریان

<div dir="rtl" align="justify">

در تحلیل‌های هیدرولوژیکی، جهت جریان نشان می‌دهد که آب سطحی در هر بخش از منطقه به کدام سمت حرکت می‌کند. تجمع جریان نیز میزان تمرکز جریان آب را مشخص می‌کند و می‌تواند برای شناسایی مسیرهای احتمالی رودخانه‌ها و مناطق آبگیر مورد استفاده قرار گیرد.

در این پروژه، داده‌های جهت جریان و تجمع جریان با تفکیک‌های مکانی مختلف از مجموعه HydroSHEDS فراخوانی و با یکدیگر مقایسه شدند.

</div>

داده‌های استفاده‌شده:

```text
WWF/HydroSHEDS/03DIR
WWF/HydroSHEDS/15DIR
WWF/HydroSHEDS/30DIR
WWF/HydroSHEDS/15ACC
WWF/HydroSHEDS/30ACC
```

## استخراج حوضه‌های آبریز

<div dir="rtl" align="justify">

برای شناسایی مرز حوضه‌های آبریز از مجموعه داده HydroSHEDS استفاده شده است. حوضه‌هایی که با محدوده مطالعاتی هم‌پوشانی دارند، با استفاده از تابع `filterBounds` استخراج می‌شوند.

پس از نمایش حوضه‌ها روی نقشه، داده‌های برداری آن‌ها در قالب فایل KML خروجی گرفته می‌شوند.

</div>

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

## بررسی تنوع توپوگرافی

<div dir="rtl" align="justify">

تنوع توپوگرافی بیانگر میزان تغییرات و پیچیدگی شکل زمین در یک محدوده است. در این پروژه از داده ALOS Topographic Diversity برای بررسی تغییرات توپوگرافی محدوده مطالعاتی استفاده شده است.

این داده پس از انتخاب باند موردنظر و برش بر اساس محدوده مطالعاتی روی نقشه نمایش داده شده و برای استفاده‌های بعدی به Google Drive صادر می‌شود.

</div>

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

## بررسی اراضی خشک و پوشش‌های کشاورزی

<div dir="rtl" align="justify">

در این بخش از داده‌های پوشش اراضی برای بررسی مناطق خشک، اراضی کشاورزی، زمین‌های دیم و زمین‌های آبی استفاده شده است. داده‌ها پس از برش بر اساس محدوده مطالعاتی، با روش بصری‌سازی تصادفی نمایش داده می‌شوند تا طبقات مختلف پوشش زمین از یکدیگر قابل تشخیص باشند.

</div>

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

## پردازش تصاویر Landsat 9

<div dir="rtl" align="justify">

در بخش پایانی پروژه، تصاویر Landsat 9 با استفاده از فیلترهای مکانی، زمانی و فیلترهای مربوط به مسیر و ردیف تصویربرداری انتخاب شدند. همچنین برای حذف تصاویر نامناسب، فیلتر پوشش ابری روی مجموعه تصاویر اعمال شد.

</div>

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

## محاسبه NDVI و بررسی تغییرات زمانی در Landsat 9

<div dir="rtl" align="justify">

برای محاسبه NDVI در تصاویر Landsat 9، ضرایب مقیاس‌دهی باندهای بازتابی اعمال شده و سپس شاخص NDVI برای هر تصویر محاسبه می‌شود. با میانگین‌گیری از تصاویر، یک تصویر میانگین NDVI تولید می‌شود.

همچنین با استفاده از نمودار سری زمانی، تغییرات مقدار NDVI در تاریخ‌های مختلف بررسی می‌شود.

</div>

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

## برآورد دمای سطح زمین با باند حرارتی

<div dir="rtl" align="justify">

برای بررسی دمای سطح زمین، از باند حرارتی `ST_B10` تصاویر Landsat 9 استفاده شده است. ابتدا تصویر بر اساس محدوده مطالعاتی برش داده شده و سپس ضرایب مقیاس‌دهی و تبدیل دما روی باند حرارتی اعمال می‌شود.

پس از محاسبه دمای سطح زمین برای هر تصویر، میانگین دمای سطح زمین در محدوده مطالعاتی تهیه شده و تغییرات زمانی آن با استفاده از نمودار سری زمانی بررسی می‌شود.

</div>

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

## ترکیب داده‌های Landsat 8 و Landsat 9

<div dir="rtl" align="justify">

در مرحله پایانی، مجموعه تصاویر حرارتی Landsat 8 و Landsat 9 با یکدیگر ترکیب شدند. ادغام این دو مجموعه داده باعث افزایش تعداد تصاویر قابل استفاده و ایجاد یک مجموعه زمانی کامل‌تر برای بررسی دمای سطح زمین می‌شود.

پس از ادغام مجموعه‌ها، برای هر تصویر ضرایب تبدیل دما اعمال شده و میانگین دمای سطح زمین در کل مجموعه محاسبه می‌شود.

</div>

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

## خروجی‌گیری نتایج

<div dir="rtl" align="justify">

برای ذخیره نتایج پردازش‌شده، از توابع `Export.image.toDrive` و `Export.table.toDrive` استفاده می‌شود. تصاویر رستری مانند NDVI، DEM، شیب، پوشش اراضی و دمای سطح زمین به‌صورت GeoTIFF و داده‌های برداری مانند رودخانه‌ها و حوضه‌های آبریز به‌صورت KML در Google Drive ذخیره می‌شوند.

</div>

نمونه خروجی تصویر:

```javascript
Export.image.toDrive({
  image: ndvi,
  description: 'NDVI_Result',
  scale: 30,
  region: geometry,
  maxPixels: 1e9
});
```

نمونه خروجی داده برداری:

```javascript
Export.table.toDrive({
  collection: rivers,
  description: 'River_Network',
  fileFormat: 'KML'
});
```

## منابع داده مورد استفاده

<div dir="rtl" align="right">

<ul>
<li><code>LANDSAT/LC08/C02/T1_L2</code> : تصاویر Landsat 8</li>
<li><code>LANDSAT/LC09/C02/T1_L2</code> : تصاویر Landsat 9</li>
<li><code>USGS/GFSAD1000_V1</code> : داده پوشش اراضی</li>
<li><code>NASA/NASADEM_HGT/001</code> : مدل ارتفاعی NASADEM</li>
<li><code>JAXA/ALOS/AW3D30/V3_2</code> : مدل ارتفاعی ALOS</li>
<li><code>USGS/SRTMGL1_003</code> : مدل ارتفاعی SRTM</li>
<li><code>WWF/HydroSHEDS</code> : داده‌های هیدرولوژیکی و شبکه آبراهه‌ها</li>
<li><code>KNTU/LiDARLab/IranLandCover/V1</code> : پوشش اراضی ایران</li>
<li><code>CSP/ERGo/1_0/Global/ALOS_topoDiversity</code> : تنوع توپوگرافی</li>
</ul>

</div>

## نحوه اجرای اسکریپت‌ها

<div dir="rtl" align="justify">

برای اجرای اسکریپت‌ها ابتدا وارد محیط Google Earth Engine Code Editor شوید. سپس پروژه Google Cloud مربوط به حساب خود را انتخاب کنید. محدوده مطالعاتی را به‌صورت دستی ترسیم کرده یا از بخش Assets وارد کنید.

پس از باز کردن هر اسکریپت، متغیرهای موردنیاز را از بخش Imports وارد کرده و کد را اجرا کنید. در صورت وجود عملیات خروجی‌گیری، وظایف ایجادشده در بخش Tasks نمایش داده می‌شوند و باید آن‌ها را به‌صورت دستی اجرا کنید.

</div>

## نتیجه‌گیری

<div dir="rtl" align="justify">

این مجموعه پروژه‌ها نشان می‌دهد که Google Earth Engine قابلیت گسترده‌ای برای پردازش تصاویر ماهواره‌ای و تحلیل داده‌های مکانی دارد. با استفاده از این سامانه می‌توان بدون نیاز به دانلود حجم زیادی از تصاویر، عملیات مختلفی مانند فیلتر زمانی و مکانی، برش تصاویر، ترکیب باندها، محاسبه شاخص‌های طیفی، تهیه مدل‌های ارتفاعی، تحلیل توپوگرافی و انجام مطالعات هیدرولوژیکی را انجام داد.

ترکیب تصاویر Landsat، مدل‌های ارتفاعی و داده‌های هیدرولوژیکی امکان بررسی جامع عوارض طبیعی، پوشش زمین، وضعیت پوشش گیاهی، ویژگی‌های توپوگرافی و دمای سطح زمین را فراهم می‌کند. این قابلیت‌ها Google Earth Engine را به ابزاری مناسب برای پروژه‌های دانشگاهی، پژوهش‌های سنجش از دور و تحلیل‌های محیطی تبدیل کرده است.

</div>
