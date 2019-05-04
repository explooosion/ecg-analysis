# ecg-analysis

個人實驗專案，將 [ecg-sensor](https://github.com/explooosion/ecg-sensor) 進行資料轉換，用於 Matlab。

以 Node.js 為後端，支援 `Windows`, `macOS`。

1. [ecg-sensor](https://github.com/explooosion/ecg-sensor) - 接收設備資料之專案。
2. [ecg-split](https://github.com/explooosion/ecg-split) - 將資料以指定分鐘數切割，用於計算 QRS 波。
3. ~~[ecg-convert](https://github.com/explooosion/ecg-convert) - 將資料轉換成純數值，用於 Matlab。~~
4. [ecg-analysis](https://github.com/explooosion/ecg-analysis)) - 將 Matlab 跑完 Start1.m, Start2.m 後，進行分群切割、維度縮減、矩陣翻轉。

### 資料準備

將 Matlab 跑完後欲分析的資料夾放置於 `src/data` 裡面。 


## 執行

```sh
yarn start
```

#### 輸出資料

輸出於 `out/` 資料夾。

