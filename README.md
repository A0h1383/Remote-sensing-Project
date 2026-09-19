# Remote-sensing-Project
Remote Sensing Projects in Google Earth Engine

## چکیده پروژه
در این پروژه با استفاده از برنامه نویسی به زبان جاوا در محیط Google Earth Engine تحلیل‌های سنجش از دوری را انجام می‌دهیم.

در بیشتر اسکریپت‌ها یک یا چند متغیر از بخش **Imports** کد ادیتور آمده است و باید قبل از اجرا دوباره از بخش Assets/Geometry وارد شود:

- `geometry`: پلیگون ترسیمی
- `table`: جدول/مرز دارایی `projects/rs-gee-507519/assets/Province` یا `projects/rs-gee-507519/assets/Hozeh-north`
- `Iran`: همان دارایی Province
- `imageVisParam`, `True_color_`, `False_color_`, `slope_`: پارامترهای visualization واردشده در تصاویر
- `flow_463`, `flow_927`: پارامترهای visualization که در اسکریپت جهت/تجمع جریان به‌صورت Import استفاده شده‌اند

## پروژه‌ها
<div align = 'center'>

| فایل | موضوع | تصاویر منبع |
|:---:|:---:|:---:|
| `01_landsat8_basic_ndvi.js` | فیلتر Landsat 8، نمایش رنگی و NDVI | 1, 4–9 |
| `02_gfsad_landcover.js` | پوشش اراضی GFSAD1000 | 10–12 |
| `03_esfahan_canny_hough.js` | تشخیص لبه Canny و تبدیل Hough | 13 |
| `04_esfahan_zero_crossing.js` | Zero Crossing با Difference of Gaussian | 14 |
| `05_iran_dem_comparison.js` | مقایسه DEMها و استخراج شیب/جهت/سایه‌روشن | 19–23 |
| `06_free_flowing_rivers.js` | استخراج و خروجی رودخانه‌ها | 17–18 |
| `07_hydrosheds_flow.js` | جهت جریان و تجمع جریان | 24–26 |
| `08_hydrosheds_basins.js` | استخراج حوضه آبریز و خروجی KML | 27–28 |
| `09_iran_landcover.js` | پوشش اراضی ایران از KNTU | 29–30 |
| `10_topographic_diversity.js` | تنوع توپوگرافی | 31 |
| `11_drylands.js` | لایه مناطق خشک | 32 |
| `12_landsat9_ndvi_tirs_lst.js` | NDVI، TIRS و ترکیب Landsat 8/9 برای LST | 33–38 |

</div>

## پروژه نمایش رنگی ماهواره Landsat 8

تصاویر 2 و 3 فقط نمایش دارایی/صفحه Dataset هستند و کد مستقل جدیدی نشان نمی‌دهند. تصاویر 11، 12، 18، 20، 27 و 30 عمدتاً خروجی یا تنظیمات نمایش‌اند و کد جداگانه‌ای به آن‌ها اضافه نشده است.
