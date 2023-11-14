const faqAddDialog = {
  template: `
          <el-dialog v-model="dialogVisible" title="加入知识库" width="827px" @open="openDialog" @close="closeDialog" align-center :before-close="handleClose">
              <div class="faq_add_edit_dialog_content flex" v-loading="loading" element-loading-text="正在添加中，请稍候...">
                  <div class="faq_form" style="width:100%">
                    <div class="faq_form_item question">
                      <div class="faq_form_item_label flex2" style="margin-bottom:20px">
                        <span class="label_text font_weight" style="width:90px;margin-right:24px">选择知识库</span>
                        <el-select v-model="selectValue" class="m-2" placeholder="Select">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                      <div>
                        <div class="faq_form_item_label flex2" style="">
                          <span class="label_text font_weight" style="width:70px;margin-right:44px">问题</span>
                          <p>{{itemData.message}}</p>
                        </div>
                      </div>
                    </div>

                    <div class="faq_form_item answer">
                      <el-row class="answer flex_start">
                        <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                          <span class="label_text font_weight">回答</span>
                          <span class="circle zn">中</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                        <el-input
                            v-model="answerValue"
                            :rows="4"
                            type="textarea"
                            placeholder="使用中文输入回答内容"
                        />
                        </div>
                      </el-row>
                    </div>
                  </div>
              </div>
              <template #footer>
                <div class="dialog_footer flex">
                  <div class="footer_tooltip">
                    <i class="iconfont icon-wenhao"></i>
                    不要重复多次添加同样的问题和回答
                  </div>
                 
                  <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                  </div>
                </div>
              </template>
            </el-dialog>
        `,

  data() {
    return {
      selectValue: "",
      answerValue: "",
      loading: false,
    };
  },
  props: ["dialogVisible", "options", "itemData"],
  mounted() {},
  methods: {
    openDialog() {
      this.selectValue = this.options[0].value;
    },
    // 添加
    async handleAdd() {
      if (this.loading) return;
      if (!this.answerValue) return this.$message.error("回答内容不能为空");
      this.loading = true;

      let req = {
        datasetId: config.datasetId,
        collectionId: this.selectValue,
        qCn: this.itemData.message,
        aCn: this.answerValue,
        translate: true,
      };

      let res = await reqInsertData(req);
      const { code } = res;
      if (code === 200) {
        this.$message.success("添加成功");
        this.$emit("closeAddDialog");
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
    },
    // 弹窗关闭
    closeDialog() {
      if (this.loading) return;
      this.answerValue = "";
      this.$emit("closeAddDialog");
    },
    // 弹窗关闭前
    handleClose(done) {
      if (this.loading) return;
      this.$emit("closeAddDialog");
      done();
    },
  },
};
