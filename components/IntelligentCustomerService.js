const IntelligentCustomerService = {
  template: `
    <initialize v-if="isInitialize" />

    <div class="intelligent_customer_service_box" v-if="!isInitialize">
      <div class="tabs_box flex flex_end">
        <div class="tabs_box_left">
          <div style="line-height: 50px;font-size: 22px;">智能客服</div>
          <p>通过训练 让AI成为你的专属客服</p>
          
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="header_svg" viewBox="0 0 32 32" width="144" height="144" style="border-color: rgba(0,0,0,0);border-width: bpx;border-style: undefined" filter="none">  
          <g>
          <path d="M7.273 20l-5.94 4.667v-20.667c0-0.736 0.597-1.333 1.333-1.333v0h20c0.736 0 1.333 0.597 1.333 1.333v0 16h-16.727zM6.351 17.333h14.983v-12h-17.333v13.847l2.351-1.847zM10.667 22.667h13.649l2.351 1.847v-13.847h1.333c0.736 0 1.333 0.597 1.333 1.333v0 18l-5.94-4.667h-11.393c-0.736 0-1.333-0.597-1.333-1.333v0-1.333z" fill="rgba(255,255,255,0.34)"></path>
          </g>
          </svg>
          
        </div>
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="客服训练库" name="first"></el-tab-pane>
            <el-tab-pane label="准确度测试" name="second"></el-tab-pane>
            <el-tab-pane label="高级设置" name="third"></el-tab-pane>
        </el-tabs>

      </div>
        
        <el-scrollbar height="calc(100vh - 160px)" style="border-radius: 5px;">
          <div class="intelligent_customer_service" v-if="activeName === 'first'">
            <service-training-library></service-training-library>
          </div>

          <div class="accuracy_test"  v-if="activeName === 'second'">
            <accuracy-test></accuracy-test>
          </div>

          <div class="advanced_setup"  v-if="activeName === 'third'">
             <advanced-setup  @gotoAccuracyTest="gotoAccuracyTest"></advanced-setup>
          </div>
        </el-scrollbar> 
    </div>
    `,

  data() {
    return {
      activeName: "first",
      isInitialize: false, // 是 初始化
    };
  },
  mounted() {
    if (config.initStatus) this.isInitialize = false;
    // else this.initFastGPT();
  },
  methods: {
    async initFastGPT() {
      await axios.post("/faq/initFastGPT").then((res) => {
        if (res.data.result) {
          this.isInitialize = false;
          config.appId = res.data.data.appId;
          config.datasetId = res.data.data.datasetId;
          config.authorization =
            res.data.data.apiKey + "-" + res.data.data.appId;
        }
      });
    },
    dialog() {
      this.dialogVisible = true;
    },
    handleClick() {
      this.$emit("fatherEmit", "this.data");
    },
    gotoAccuracyTest() {
      this.activeName = "second";
    },
  },
};
