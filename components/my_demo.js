const MyDemoComponent = {
  template: `
    <div>
      <el-button type="warning" @click="dialog">打开弹框</el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
        <span>This is a message</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
  `,

  data() {
    return {
      dialogVisible: false,
    };
  },
  props: ["content"],
  methods: {
    dialog() {
      this.dialogVisible = true;
    },
    handleClick() {
      this.$emit("fatherEmit", "this.data");
    },
  },
};
