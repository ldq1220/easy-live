const IntelligentCustomerService = {
  template: `
    <initialize v-if="isInitialize" />

    <div class="intelligent_customer_service_box" v-if="!isInitialize">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="客服训练库" name="first"></el-tab-pane>
            <el-tab-pane label="准确度测试" name="second"></el-tab-pane>
            <el-tab-pane label="高级设置" name="third"></el-tab-pane>
        </el-tabs>

        <div class="intelligent_customer_service" v-if="activeName === 'first'">
                <service-training-library></service-training-library>
        </div>

        <div class="accuracy_test"  v-if="activeName === 'second'">
          <accuracy-test></accuracy-test>
        </div>

        <div class="advanced_setup"  v-if="activeName === 'third'">
          <advanced-setup></advanced-setup>
        </div>
    </div>
    `,

  data() {
    return {
      activeName: "first",
      isInitialize: true, // 是 初始化
    };
  },
  mounted() {
    setTimeout(() => {
      this.isInitialize = false;
    }, 500);
  },
  methods: {
    dialog() {
      this.dialogVisible = true;
    },
    handleClick() {
      this.$emit("fatherEmit", "this.data");
    },
  },
};
