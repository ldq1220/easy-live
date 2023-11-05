const asyncFAQ = {
  template: `
        <el-dialog v-model="dialogVisible" title="同步旧FAQ" width="40%" @close="closeDialog">
            <div class="content" style="text-align:center">
              是否导入旧版本的FAQ数据?
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="closeDialog">
                  确认
                </el-button>
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
  },
};
