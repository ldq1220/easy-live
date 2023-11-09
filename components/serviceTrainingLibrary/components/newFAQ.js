const newFAQ = {
  template: `
      <el-dialog v-model="dialogVisible" title="新建FAQ库" width="40%" @close="closeDialog" align-center>
          <div class="flex">
            <div style="width:120px;">FAQ库名称</div>
            <el-input v-model="faqName" placeholder="输入名称" class="input-with-select"></el-input>
          </div>
          <template #footer>
            <div class="new_faq_dialog_footer flex">
              <div>
                <i class="iconfont icon-wenhao icon">  创建一个新的容器装入回答内容</i>
              </div>
              <div class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="save">确认</el-button>
              </div>
            </div>
           
          </template>
        </el-dialog>
    `,

  data() {
    return {
      faqName: "",
    };
  },
  props: ["dialogVisible", "tableDataLength"],
  methods: {
    closeDialog() {
      this.$emit("closenewfaq");
    },
    async save() {
      if (this.tableDataLength >= 10) {
        this.$message.warning("仅可创建10个数据集");
        this.closeDialog();
        return;
      }

      if (!this.faqName.trim()) return this.$message.error("请输入FAQ库名称");
      let reqData = {
        datasetId: config.datasetId,
        parentId: "",
        name: this.faqName,
        type: "file",
      };
      let res = await reqCreateDataset(reqData);
      const { code } = res;
      if (code === 200) {
        this.$message.success("创建成功");
        this.closeDialog();
        this.$emit("getDatasetList");
      }
    },
  },
};
