const newFAQ = {
  template: `
      <el-dialog v-model="dialogVisible" title="新建FAQ库" width="40%" @close="closeDialog">
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
  props: ["dialogVisible"],
  methods: {
    closeDialog() {
      this.$emit("closenewfaq");
    },
    save() {
      this.$message.success("创建成功");
      this.closeDialog();
    },
  },
};
