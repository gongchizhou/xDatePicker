# xDatePicker

曾经公司里的一个项目,产品设计了一个时间选择器,网上没有找到类似可直接用的，就自己写了一个

## Usage

```js
$(el).xDatePicker([options]);
```
## Demo

效果演示地址
Check the [demo](https://gongchizhou.github.io/xDatePicker/).

### 参数设置

 * __range__: 可以按年份、月份或季度选择时间，可以是数组或字符串，默认为`['year', 'month', 'season']`
 * __limit__: 按年份筛选时，显示年份的数量，默认为`5`

### options

 * __range__: pick date by year,month or season, can be Array or String, default is `['year', 'month', 'season']`
 * __limit__: the number of years shown from current year, default is `5`

 ### 事件

 * __date.apply__: 选择日期后触发

  ### events

 * __date.apply__: triggered when date is picked
