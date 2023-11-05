const IntelligentCustomerService = {
  template: `
    <div class="intelligent_customer_service_box">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="客服训练库" name="first"></el-tab-pane>
            <el-tab-pane label="准确度测试" name="second"></el-tab-pane>
            <el-tab-pane label="高级设置" name="third"></el-tab-pane>
        </el-tabs>

        <div class="intelligent_customer_service_content">
            <div v-if="activeName === 'first'">
                <service-training-library></service-training-library>
            </div>
        </div>
    </div>

    
    `,

  data() {
    return {
      activeName: "first",
    };
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
