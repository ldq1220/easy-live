const asyncFAQ = {
  template: `
        <el-dialog v-model="dialogVisible" title="同步旧FAQ" width="40%" @close="closeDialog" :before-close="handleClose" align-center>
            <div class="content" style="text-align:center" v-if="!isToLead">
              是否导入旧版本的FAQ数据?
            </div>
            <div class="flex2 " style="width:140px;margin:0 auto;" v-else>
              <div style="width:50px;height:50px">
                <loading-icon></loading-icon>
              </div>
              <p class="font_weight">正在导入中...</p>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="closeDialog" v-if="!isToLead">取消</el-button>
                <el-button type="primary" @click="save" v-if="!isToLead">确认</el-button>
              </div>
            </template>
          </el-dialog>
      `,

  data() {
    return {
      faqName: "",
      isToLead: false,
    };
  },
  props: ["dialogVisible", "tableData"],
  methods: {
    closeDialog() {
      this.$emit("closenewfaq");
    },
    async save() {
      if (this.tableData.length >= 10) {
        this.$message.warning("仅可创建10个数据集");
        this.closeDialog();
        return;
      }

      this.isToLead = true;
      await axios
        .get(config.queryListByUserIdUrl)
        .then((res) => {
          if (res.data.length === 0) {
            this.$message.warning("旧FAQ数据为空，不需要添加到训练库");
            this.isToLead = false;
            this.closeDialog();
            return;
          }
          this.arrDataSet(res.data); // 创建新的数据集
        });
    },
    // 创建新的数据集
    async arrDataSet(data) {
      let req = {
        datasetId: config.datasetId,
        parentId: "",
        name: "旧FAQ数据集",
        type: "file",
      };

      let addRes = await reqCreateDataset(req);

      if (addRes.code === 200) {
        this.dataSetAddItem(addRes.data, data);
      }
    },
    // 往数据集中插入数据
    dataSetAddItem(id, data) {
      if(data.length === 0 ){
        this.$emit("getDatasetList");
        this.isToLead = false;
        this.closeDialog();
        return
      }

      let falg = 0;

      data.forEach(async (item) => {
        let req = {
          datasetId: config.datasetId,
          collectionId: id,
          qCn: item.title,
          aCn: item.content,
          questionId: item.userId,
          translate: true,
        };

        let res = await reqInsertData(req);
        if (res.code === 200) {
          falg += 1;
          if (falg === data.length) {
            this.$emit("getDatasetList");
            this.$message.success("导入成功");
            this.isToLead = false;
            this.closeDialog();
          }
        }
      });
    },
    handleClose(done) {
      if (!this.isToLead) {
        done();
      }
    },
  },
};
