import ObjectsToCsv from 'objects-to-csv';

/**
 * 計算每人每天起始與結束的平均值
 */
class Worker {
  constructor(group, name, input) {
    this.group = group;
    this.name = name;
    this.input = input;
    this.output = [];

    this.datas = [];
    this.header = [];
    this.stages = [];

    this.init();
  }

  init() {
    // 取得表頭
    this.header = this.input[0];
    // 取得純資料，移除表頭, 並將文字資料轉成數值資料
    this.datas = this.input
      .filter((hrv, index) => index > 0)
      .map(hrv => hrv.map(h => Number(h)));
    // 取得共收了幾天
    this.stages = [...new Set(this.datas.map(hrv => hrv[0]))];
  }

  /**
   * 每個人每天開始前與結束後的疲勞 => 檢測每天的疲勞變化
   */
  caculate1() {
    this.stages.forEach(s => {
      const d = this.datas.filter(hrv => hrv[0] === s);
      const dLength = Math.round(d.length / 2);
      // 將所有指標存於此物件
      const pointers = {};
      this.header.forEach((h, index, arr) => {
        // 第一個 Header 是 Stage，需要跳過。
        if (index > 0) {
          // 開始後十分鐘的平均
          pointers[`${h}_前`] = (d[1][index] + d[2][index]) / 2;
          // 中間區十分鐘的平均
          pointers[`${h}_中`] = (d[dLength][index] + d[dLength + 1][index]) / 2;
          // 結束前十分鐘的平均
          pointers[`${h}_後`] = (d[d.length - 1][index] + d[d.length - 2][index]) / 2;
        }
      }); // End Header loop
      this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
    }); // End stage loop
    return this.output;
  }

  /**
   * 每個人第一天開始與最後一天開始 => 檢測前後的開始變化
   * 每個人第一天結束與最後一天結束 => 檢測前後的結束變化
   */
  caculate2() {
    this.stages.forEach((s, sindex) => {
      // 只抓出第一個和最後一個
      if (sindex === 0 || sindex === this.stages.length - 1) {
        const d = this.datas.filter(hrv => hrv[0] === s);
        const dLength = Math.round(d.length / 2);
        // 將所有指標存於此物件
        const pointers = {};
        this.header.forEach((h, index) => {
          // 第一個 Header 是 Stage，需要跳過。
          if (index > 0) {
            // 開始後十分鐘的平均
            pointers[`${h}_前`] = (d[1][index] + d[2][index]) / 2;
            // 中間區十分鐘的平均
            pointers[`${h}_中`] = (d[dLength][index] + d[dLength + 1][index]) / 2;
            // 結束前十分鐘的平均
            pointers[`${h}_後`] = (d[d.length - 1][index] + d[d.length - 2][index]) / 2;
          }
        }); // End Header loop
        this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
      }
    }); // End stage loop
    return this.output;
  }

  /**
   * 每個人第一天平均與最後一天平均 => 檢測前後測試的一天平均變化
   */
  caculate3() {
    this.stages.forEach((s, sindex) => {
      // 只抓出第一個和最後一個
      if (sindex === 0 || sindex === this.stages.length - 1) {
        const d = this.datas.filter(hrv => hrv[0] === s);
        const dLength = Math.round(d.length / 2);
        // 將所有指標存於此物件
        const pointers = {};
        this.header.forEach((h, hindex) => {
          // 第一個 Header 是 Stage，需要跳過。
          // if (hindex > 0) {
          //   pointers[`${h}_前`] = d.reduce((prev, data) => prev + data[hindex], 0) / d.length;
          // };
          if (hindex > 0) {
            // 開始後十分鐘的平均，前兩筆
            pointers[`${h}_前`] = (d[1][hindex] + d[2][hindex]) / 2;
            // 中間區十分鐘的平均，前兩筆
            pointers[`${h}_中`] = (d[dLength][hindex] + d[dLength + 1][hindex]) / 2;
            // 結束前十分鐘的平均，末兩筆
            pointers[`${h}_後`] = (d[d.length - 1][hindex] + d[d.length - 2][hindex]) / 2;
          }
        }); // End Header loop
        this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
      }
    }); // End stage loop
    // return this.output;
    // 重組欄位
    this.output = Object.keys(this.output[0]).reduce((acc, k) => {
      return {
        ...acc,
        [`${k}1`]: this.output[0][k],
        [`${k}2`]: this.output[1][k],
      }
    }, {});
    return [this.output];
  }
}

export default Worker;