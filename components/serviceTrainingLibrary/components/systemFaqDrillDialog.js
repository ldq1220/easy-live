const systemFaqDrillDialog = {
  template: `
            <el-dialog v-model="dialogVisible" title="系统问答库" width="827px" @open="openDialog" @close="closeDialog" align-center :before-close="handleClose">
                <div class="system_faq_drill_completeness flex2">
                  <span class="completeness_text">完成度</span>
                  <el-progress :percentage="percentage"  :stroke-width="16" color="#67C23A" style="width:300px" />
                </div>
                <div class="faq_add_edit_dialog_content flex" v-loading="loading" element-loading-text="Loading...">
                    <div class="number font_weight" style="width:70px;">#{{ questionIdsLength + 1}}</div>
                    <div class="faq_form" style="width:100%">
                      <div class="faq_form_item question">
                        <el-row class="flex">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span class="label_text font_weight">问题</span>
                            <span class="circle zn">中</span>
                          </div>
                          <div class="faq_form_item_input font_weight" style="width:530px">
                            {{ questionLibraryCruuent.questionCn }}
                          </div>
                        </el-row>
                        <br/>
                        <el-row class="flex">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span></span>
                            <span class="circle en">EN</span>
                          </div>
                          <div class="faq_form_item_input" style="width:530px">
                          {{ questionLibraryCruuent.questionEn }}
                          </div>
                        </el-row>
                      </div> 

                      <div class="faq_form_item answer">
                        <el-row class="answer">
                          <div class="faq_form_item_label flex" style="margin-right:10px">
                            <div class="label_text font_weight" style="margin-right:50px">回答</div>
                            <el-radio-group v-model="radio" class="ml-4" style="width:300px;margin-bottom:10px" @change="changeRadio">
                              <el-radio :label="0" size="large">自己回答</el-radio>
                              <el-radio :label="1" size="large">使用官方推荐回答</el-radio>
                            </el-radio-group>
                          </div>
                          <div class="iconfont icon-fuzhi copy" @click="copyContent"></div>
                        </el-row>

                        <el-row>
                          <div class="faq_form_item_input flex flex_start" style="width:530px;margin-left:78px">
                            <span class="circle zn" style="margin-right:10px">中</span>
                            <el-input
                                v-model="answerValue"
                                :rows="4"
                                type="textarea"
                                placeholder="使用中文输入回答内容"
                                id="myInput"
                                :disabled="radio == 1"
                            />
                          </div>
                        </el-row>

                        <br/>

                        <el-row class="flex flex_start">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span></span>
                            <span class="circle en">EN</span>
                          </div>
                          <div class="faq_form_item_input" style="width:530px">
                          {{ answerValueEn }}
                          </div>
                        </el-row>
                      </div>
                    </div>

                </div>
                <template #footer>
                  <div class="dialog_footer flex">
                    <div class="footer_tooltip">
                      <i class="iconfont icon-wenhao"></i>
                      多完成回答内容,AI回复的准确度会更高
                    </div>
                    <div>
                      <el-button type="info" @click="closeDialog">退出训练</el-button>
                      <el-button type="primary" @click="handleAddQuestionList">加入问答库</el-button>
                      <el-button @click="handleSkip">跳过</el-button>
                    </div>
                  </div>
                </template>
              </el-dialog>
          `,

  data() {
    return {
      percentage: 0,
      visiable: false,
      loading: false,
      radio: 0,
      answerValue: "",
      answerValueEn: "加入问答库后AI自动翻译",
      questionLibraryIndex: 0, // 当前用户在 问答库总列表中 即将展示数据项的下标
      questionLibraryCruuent: {}, // 当前 问答项 数据
      questionIdsLength: 0,
      filterQuestionLibraryList: [], // 过滤出来的 系统问答库列表
    };
  },
  props: [
    "dialogVisible",
    "type",
    "tableRowData",
    "questionIds",
    "questionLibraryList",
  ],
  mounted() {},
  methods: {
    //获取系统问答库总列表
    openDialog() {
      this.questionIdsLength = this.questionIds.length;
      this.filterQuestionList(); // 获取用户当前 展示数据项的下标
      this.countPercentage(); // 计算完成度
    },
    // 复制 官方推荐回答
    copyContent() {
      let copyText = document.getElementById("myInput");
      navigator.clipboard.writeText(copyText.value);
      this.$message.success("官方推荐回答内容已复制");
      this.radio = 0;
      this.answerValue = copyText.value;
      this.answerValueEn = "加入问答库后AI自动翻译";
    },
    // 加入问答库
    async handleAddQuestionList() {
      if (!this.answerValue) return this.$message.error("回答内容不能为空");
      if (this.loading) return;

      this.loading = true;

      let reqData = {
        datasetId: config.datasetId,
        collectionId: this.tableRowData._id,
        qCn: this.questionLibraryCruuent.questionCn,
        q: this.questionLibraryCruuent.questionEn,
        questionId: this.questionLibraryCruuent.id,
        aCn: this.answerValue,
        a: this.radio === 0 ? "" : this.answerValueEn,
        translate: true,
      };

      let res = await reqInsertData(reqData);
      const { code } = res;
      if (code === 200) {
        this.$emit("getQuestionList");

        if (
          this.questionLibraryIndex ==
            this.filterQuestionLibraryList.length - 1 ||
          this.percentage === 100
        ) {
          this.$emit("closeSystemFaqDrillDialog");
          this.$message.success("加入问答库成功,暂无更多系统问答题目");
        } else {
          this.questionLibraryIndex += 1;
          this.questionIdsLength += 1;
          this.questionLibraryCruuent =
            this.filterQuestionLibraryList[this.questionLibraryIndex];
          this.answerValue = this.questionLibraryCruuent.answerCn;
          this.answerValueEn = this.questionLibraryCruuent.answerEn;

          this.radio = 0;

          this.countPercentage(); // 计算完成度
          this.$message.success("加入问答库成功,请继续");
        }

        this.loading = false;
      } else {
        this.$message.error(res.message);
        this.loading = false;
      }
    },
    // 跳过
    handleSkip() {
      if (this.loading) return;

      if (
        this.questionLibraryIndex ===
        this.filterQuestionLibraryList.length - 1
      )
        return this.$emit("closeSystemFaqDrillDialog");

      this.questionIdsLength += 1;
      this.questionLibraryIndex += 1;
      this.questionLibraryCruuent =
        this.filterQuestionLibraryList[this.questionLibraryIndex];
      this.radio = 0;
      this.answerValue = "";
      this.answerValueEn = this.questionLibraryCruuent.answerEn;
    },
    // 遍历 问答库总列表 查询目前用户 加入到第几个问答题目
    filterQuestionList() {
      if (this.questionIdsLength === 0) {
        this.questionLibraryCruuent = this.questionLibraryList[0];
        this.filterQuestionLibraryList = this.questionLibraryList;
        return;
      }

      for (let i = 0; i < this.questionLibraryList.length; i++) {
        if (!this.questionIds.includes(this.questionLibraryList[i].id)) {
          this.filterQuestionLibraryList.push(this.questionLibraryList[i]);
        }
      }
      this.questionLibraryIndex = 0;
      this.questionLibraryCruuent =
        this.filterQuestionLibraryList[this.questionLibraryIndex];
    },
    // 计算完成度
    countPercentage() {
      if (this.questionIdsLength === 0) {
        return (this.percentage = 0);
      }

      this.percentage = Math.round(
        (this.questionIdsLength / this.questionLibraryList.length) * 100
      );

      if (this.questionIdsLength === 100) {
        this.$emit("closeSystemFaqDrillDialog");
      }
    },

    // 关闭弹窗
    closeDialog() {
      if (this.loading) return;

      this.filterQuestionLibraryList = [];
      this.$emit("closeSystemFaqDrillDialog");
    },
    // 弹窗关闭前
    handleClose(done) {
      if (!this.loading) {
        done();
      }
    },
    changeRadio(value) {
      if (value === 0) {
        this.answerValue = "";
        this.answerValueEn = "加入问答库后AI自动翻译";
      } else {
        this.answerValue = this.questionLibraryCruuent.answerCn;
        this.answerValueEn = this.questionLibraryCruuent.answerEn;
      }
    },
  },
};
