class Worker {
  constructor(group, name, input) {
    this.group = group;
    this.name = name;
    // 所有資料頭尾去除 10 分鐘
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
   * 計算每人每天起始、中間以及結束的二十分鐘平均值
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
          // 開始後二十分鐘的平均
          pointers[`${h}_前`] = (d[0][index] + d[1][index] + d[2][index] + d[3][index]) / 4;
          // 中間區二十分鐘的平均
          pointers[`${h}_中`] = (d[dLength - 1][index] + d[dLength][index] + d[dLength + 1][index] + d[dLength + 2][index]) / 4;
          // 結束前二十分鐘的平均
          pointers[`${h}_後`] = (d[d.length - 1][index] + d[d.length - 2][index] + d[d.length - 3][index] + d[d.length - 4][index]) / 4;
        }
      }); // End Header loop
      this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
    }); // End stage loop
    return this.output;
  }

  /**
   * 計算每人第一天與最後一天的起始、中間以及結束的二十分鐘平均值
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
            // 開始後二十分鐘的平均
            pointers[`${h}_前`] = (d[0][index] + d[1][index] + d[2][index] + d[3][index]) / 4;
            // 中間區二十分鐘的平均
            pointers[`${h}_中`] = (d[dLength - 1][index] + d[dLength][index] + + d[dLength + 1][index] + d[dLength + 2][index]) / 4;
            // 結束前二十分鐘的平均
            pointers[`${h}_後`] = (d[d.length - 1][index] + d[d.length - 2][index] + d[d.length - 3][index] + d[d.length - 4][index]) / 4;
          }
        }); // End Header loop
        this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
      }
    }); // End stage loop
    return this.output;
  }

  /**
   * 每個人第一天平均值與最後一天平均值
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
            // 將前中後的二十分鐘，計算出平均值，不可以用整體時段，會影響到 pp50 等個數比例
            const dFML = [
              d[1][hindex],
              d[2][hindex],
              d[3][hindex],
              d[4][hindex],
              d[dLength - 1][hindex],
              d[dLength][hindex],
              d[dLength + 1][hindex],
              d[dLength + 2][hindex],
              d[d.length - 1][hindex],
              d[d.length - 2][hindex],
              d[d.length - 3][hindex],
              d[d.length - 4][hindex],
            ];
            pointers[h] = dFML.reduce((acc, value) => acc + value, 0) / dFML.length;
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

  /**
   * 每個人第一天平均值與第四天平均值
   */
  caculate4() {
    this.stages.forEach((s, sindex) => {
      // 只抓出第一個和第四天
      if (sindex === 0 || sindex === 3) {
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
            // 將前中後的二十分鐘，計算出平均值，不可以用整體時段，會影響到 pp50 等個數比例
            const dFML = [
              d[1][hindex],
              d[2][hindex],
              d[3][hindex],
              d[4][hindex],
              d[dLength - 1][hindex],
              d[dLength][hindex],
              d[dLength + 1][hindex],
              d[dLength + 2][hindex],
              d[d.length - 1][hindex],
              d[d.length - 2][hindex],
              d[d.length - 3][hindex],
              d[d.length - 4][hindex],
            ];
            pointers[h] = dFML.reduce((acc, value) => acc + value, 0) / dFML.length;
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

  /**
   * 計算每人第一天與最後一天的起始、中間以及結束的二十分鐘平均值，橫面時間比較
   */
  caculate5() {
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
            // 開始後二十分鐘的平均
            pointers[`${h}_前`] = (d[0][index] + d[1][index] + d[2][index] + d[3][index]) / 4;
            // // 中間區二十分鐘的平均
            pointers[`${h}_中`] = (d[dLength - 1][index] + d[dLength][index] + d[dLength + 1][index] + d[dLength + 2][index]) / 4;
            // // 結束前二十分鐘的平均
            pointers[`${h}_後`] = (d[d.length - 1][index] + d[d.length - 2][index] + d[d.length - 3][index] + d[d.length - 4][index]) / 4;
          }
        }); // End Header loop
        this.output.push({ Group: this.group, Name: this.name, Stage: s, ...pointers });
      }
    }); // End stage loop
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