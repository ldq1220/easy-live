const accuracyTest = {
  template: `
  
      <div class="accuracy_box">
        <div class="accuracy_faq flex flex_start">
            <div class="accuracy_faq_item questions flex flex_start">
                <div style="width:40px">
                    <span class="circle faq">问</span>
                </div>
                <div class="questions_form">
                    <span class="font_weight">测试问题</span>
                    <el-input
                      class="accuracy_questions_input"
                      v-model="questionsValue"
                      :rows="6"
                      type="textarea"
                      placeholder="输入需要测试的问题"
                      @keyup.enter="handleTest"
                    />
                    <div class="flex">
                      <div></div>
                      <el-button type="primary" style="padding:8px 30px" @click="handleTest">测试</el-button>
                    </div>
                </div>
            </div>

            <div class="accuracy_faq_item answer flex" v-loading="chatLoading"  element-loading-text="Loading...">
              <el-scrollbar height="207px" style="width:100%">
                <div class="flex flex_start" style="width:100%">
                  <div style="width:40px">
                    <span class="circle faq">答</span>
                  </div>
                  <div class="answer_content" :class="isEn && answerText!=''? 'isEN' :''">
                    <div class="flex">
                      <span class="font_weight">AI回答内容</span>
                      <div class="views_translate" @click="viewsTranslate">
                        <i class="iconfont icon-fanyi-full"></i> {{viewsTranslateText}}
                      </div>  
                    </div>
                    <div class="answer_content_text">
                      {{ isEn? answerText :originalText }}
                    </div>
                  </div>
                </div>
                <el-scrollbar>
            </div>
        </div>

        <div class="header_tooltip">
            <i class="iconfont icon-icon"></i>
            如果测试结果不满意,请优化或完善客服训练库
        </div>

        <div class="test_result_analyse"> 
          <div class="test_result_analyse_title font_weight">测试结果分析</div>
          <div class="test_result_analyse_content flex flex_wrap" v-loading="testResultLoading" element-loading-text="Loading...">
            <div class="test_result_analyse_content_item" v-for="(item,index) in testResultData" :key="item.id">
              <div class="test_result_analyse_content_item_similarity flex">
                <span class="font_weight">#{{index + 1}}</span>
                <el-progress :percentage="item.score * 100" style="width:100%;margin-left:40px">
                  <div style="margin-left:10px">相似度{{item.score}}</div>
                </el-progress>
              </div>
              <div class="test_result_analyse_content_item_questions flex flex_start">
                <div style="width:40px">
                  <div class="circle faq">问</div>
                </div>
                <div class="questions_text flex1">{{ item.questions }}</div>
              </div>
              <div class="test_result_analyse_content_item_answer flex flex_start">
                <div style="width:40px">
                  <div class="circle faq">答</div>
                </div>
                <div class="answer_text flex1">{{ item.answer }}</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
   
    `,

  data() {
    return {
      questionsValue: "",
      // 查看翻译
      viewsTranslateText: "查看翻译",
      isEn: true,
      answerText: "",
      originalText: "",
      testResultData: [],
      testResultLoading: false,
      chatLoading: false,
    };
  },
  props: [""],
  mounted() {},
  methods: {
    // 查看翻译
    async viewsTranslate() {
      if (!this.answerText) return this.$message.warning("暂无翻译内容");

      if (this.isEn) {
        await axios
          .post(config.chatTranslateUrl, {
            text: this.answerText,
          })
          .then((res) => {
            if (true) {
              this.originalText = res.data;
              this.isEn = false;
              this.viewsTranslateText = "查看原文";
            } else {
              this.$message.warning("翻译失败,请重试");
            }
          });
      } else {
        this.isEn = true;
        this.viewsTranslateText = "查看翻译";
      }
    },
    // 测试
    async handleTest() {
      if (!this.questionsValue)
        return this.$message.warning("测试问题不能为空");

      this.chatLoading = true;
      this.testResultLoading = true;
      // 对话
      let chatReqData = {
        chatId: "",
        stream: false,
        // stream: true,
        detail: false,
        messages: [
          {
            content: this.questionsValue,
            role: "user",
          },
        ],
      };

      const chatRes = await reqChatCompletions(chatReqData);
      this.answerText = chatRes.choices[0].message.content;
      this.chatLoading = false;

      // 搜索测试
      setTimeout(async () => {
        const reqData = {
          datasetId: config.datasetId,
          text: this.questionsValue,
        };

        const res = await reqSearchTest(reqData);
        const { code, data } = res;
        if (code === 200) {
          this.testResultData = data;
          this.testResultLoading = false;

          this.testResultData.forEach((item) => {
            item.questions = filterText(item.qCn)[0];
            item.answer = filterText(item.qCn)[1];
            item.score = item.score.toFixed(4);
          });
        }
      }, 100);
    },
  },
};
