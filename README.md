# ecg-sensor

個人實驗專案，將 [ecg-sensor](https://github.com/explooosion/ecg-sensor) 進行資料轉換，用於 Matlab。

以 Node.js 為後端，支援 `Windows`, `macOS`。

1. [ecg-sensor](https://github.com/explooosion/ecg-sensor) - 接收設備資料之專案。
2. [ecg-split](https://github.com/explooosion/ecg-split) - 將資料以指定分鐘數切割，用於計算 QRS 波。
3. [ecg-convert](https://github.com/explooosion/ecg-convert) - 將資料轉換成純數值，用於 Matlab。

### 資料準備

將欲轉換的資料夾放置於 `src/data` 裡面，資料夾為 [ecg-sensor](https://github.com/explooosion/ecg-sensor) 所產生的 `stage` 資料夾，可一次放入多個進行轉換。 


資料內容預期格式：

```json
[
  { "data":81, "time":"2019-01-25T15:47:12.425" },  
  { "data":310, "time":"2019-01-25T15:47:12.430" }
]
```

## 執行

```sh
yarn start
```

#### 輸出資料

輸出於 `out/` 資料夾。


資料輸出預期格式：

```sh
81
310
295
285
321
307
277
303
297
277
...
```

