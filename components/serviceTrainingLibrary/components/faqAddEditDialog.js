const faqAddEditDialog = {
  template: `
          <el-dialog v-model="dialogVisible" title="手动录入" width="827px" @open="openDialog" @close="closeDialog" align-center :before-close="handleClose">
              <div class="faq_add_edit_dialog_content flex" v-loading="loading" element-loading-text="正在进库训练中，请稍候...">
                  <div class="number font_weight" style="width:70px;color:#808080">#{{ index + 9 * (pageNum - 1)}}</div>
                  <div class="faq_form" style="width:100%">
                    <div class="faq_form_item question">
                      <el-row class="flex">
                        <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                          <span class="label_text font_weight">问题</span>
                          <span class="circle zn">中</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                          <el-input v-model="questionValue"  placeholder="使用中文输入问题" style="width:100%"></el-input>
                        </div>
                      </el-row>
                      <br/>
                      <el-row class="flex" v-if="!hasAdd">
                        <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                          <span></span>
                          <span class="circle en">En</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                          {{ questionEn }}
                        </div>
                      </el-row>
              
                    </div>


                    <div class="faq_form_item answer">
                      <el-row class="flex answer">
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

                      <br/>

                      <el-row class="flex flex_start" v-if="!hasAdd">
                        <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                          <span></span>
                          <span class="circle en">En</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                          {{ answersEn }}
                        </div>
                      </el-row>
                    </div>
                  </div>
              </div>
              <template #footer>
                <div class="dialog_footer flex">
                  <div class="footer_tooltip" v-if="type === 'add'">
                    <i class="iconfont icon-wenhao"></i>
                    不要重复多次添加同样的问题和问答
                  </div>
                  <div class="footer_tooltip" v-else>
                    <i class="iconfont icon-wenhao"></i>
                    英文翻译将在保存后才会更新
                  </div>
                  <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="save">
                      确认
                    </el-button>
                  </div>
                </div>
              </template>
            </el-dialog>
        `,

  data() {
    return {
      faqName: "",
      questionValue: "",
      questionEn: "",
      answerValue: "",
      answersEn: "",
      hasAdd: true,
      loading: false,
    };
  },
  props: [
    "dialogVisible",
    "type",
    "index",
    "pageNum",
    "tableRowData",
    "faqdata",
  ],
  methods: {
    openDialog() {
      if (this.type === "add") {
        this.hasAdd = true;
        this.questionValue = "";
        this.answerValue = "";
        this.questionEn = "";
        this.answersEn = "";
      } else {
        this.hasAdd = false;
        this.questionValue =
          this.type === "testEdit"
            ? filterText(this.faqdata.questionsCn)[0]
            : this.faqdata.questionsCn;
        this.questionEn =
          this.type === "testEdit"
            ? filterText(this.faqdata.questionsEn)[0]
            : this.faqdata.questionsEn;

        this.answerValue = this.faqdata.answersCn;
        this.answersEn = this.faqdata.answersEn;
      }
    },
    async save() {
      if (this.loading) return;
      if (!this.questionValue.trim())
        return this.$message.warning("请填写中文问题");
      if (!this.answerValue.trim())
        return this.$message.warning("请填写中文回答内容");

      let reqData = {
        datasetId: config.datasetId,
        collectionId:
          this.type === "testEdit"
            ? this.faqdata.collectionId
            : this.tableRowData._id,
        qCn: this.questionValue,
        q: "",
        aCn: this.answerValue,
        a: "",
        translate: true,
      };
      let res;

      if (this.type === "add") {
        this.loading = true;
        res = await reqInsertData(reqData);
      } else {
        this.loading = true;
        let reqData2 = {
          id: this.faqdata.id,
          ...reqData,
        };

        res = await reqUpdateData(reqData2);
      }

      const { code } = res;
      if (code === 200) {
        this.loading = false;
        this.type === "add"
          ? this.$message.success("添加成功")
          : this.$message.success("修改成功");
        this.$emit("getQuestionList");
        this.closeDialog();
      } else {
        this.$message.error(res.message);
        this.loading = false;
      }
    },
    // 弹窗关闭前
    closeDialog() {
      if (this.loading) return;

      this.questionValue = "";
      this.answerValue = "";
      this.$emit("closeAddEditDialog");
    },
    // 弹窗关闭前
    handleClose(done) {
      if (!this.loading) {
        done();
      }
    },
  },
};
