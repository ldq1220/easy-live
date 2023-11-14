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
                      <el-button type="primary" style="padding:8px 30px" @click="handleTest" :disabled="disabled">测试</el-button>
                    </div>
                </div>
            </div>

            <div class="accuracy_faq_item answer flex" v-loading="chatLoading" :element-loading-text="loadingText">
              <el-scrollbar height="207px" style="width:100%">
                <div class="flex flex_start" style="width:100%">
                  <div style="width:40px">
                    <span class="circle faq">答</span>
                  </div>
                  <div class="answer_content">
                    <div class="flex">
                      <span class="font_weight">AI回答内容</span>
                      <div class="views_translate" @click="viewsTranslate">
                        <i class="iconfont icon-fanyi-full"></i> {{viewsTranslateText}}
                      </div>  
                    </div>
                    <div class="answer_content_text">
                      <span>{{ isEn? answerText :originalText }}</span>
                      <span class="answer_content_text_span" v-if="chatResult"></span>
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
          <div class="test_result_analyse_content flex flex_wrap" v-loading="testResultLoading" element-loading-text="测试中，请稍候...">
            <div class="test_result_analyse_content_item" v-for="(item,index) in testResultData" :key="item.id" @click="openAddEditDialog('edit',item,index)">
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
   
      <faq-add-edit-dialog :dialogVisible="faqAddEditDialogVisible" :type="type" :index="index"  :faqdata="faqdata"  :pageNum="1" @closeAddEditDialog="closeAddEditDialog" @getQuestionList="getQuestionList"></faq-add-edit-dialog>
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
      chatResult: false,
      loadingText: "回答中,请稍后...",
      // 编辑弹窗
      faqAddEditDialogVisible: false,
      type: "edit",
      faqdata: {},
      index: 0,
    };
  },
  props: ["message", "accuracyText"],
  mounted() {
    if (this.accuracyText) {
      this.questionsValue = this.accuracyText;
    }
  },
  methods: {
    // 查看翻译
    async viewsTranslate() {
      if (this.viewsTranslateText === "查看翻译" && !this.originalText) {
        this.chatLoading = true;
      }

      if (!this.answerText) return this.$message.warning("暂无翻译内容");

      if (this.isEn && !this.originalText) {
        this.loadingText = "翻译中,请稍后...";

        let req = new FormData();
        req.append("text", this.answerText);
        await axios.post(config.chatTranslateUrl, req).then((res) => {
          if (res.data.result) {
            this.originalText = res.data.data;
            this.isEn = false;
            this.viewsTranslateText = "查看原文";
            this.chatLoading = false;
          } else {
            this.$message.warning("翻译失败,请重试");
          }
        });
      } else if (!this.isEn && this.originalText) {
        this.loadingText = "回答中,请稍后...";
        this.isEn = true;
        this.viewsTranslateText = "查看翻译";
      } else {
        this.isEn = false;
        this.viewsTranslateText = "查看原文";
      }
    },
    // 测试
    async handleTest() {
      if (!this.questionsValue)
        return this.$message.warning("测试问题不能为空");

      this.chatResult = true;
      this.testResultLoading = true;
      this.answerText = "";
      this.originalText = "";
      this.isEn = true;
      this.viewsTranslateText = "查看翻译";

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

      // 对话
      this.chatDialogue();
    },
    // 对话
    async chatDialogue() {
      let chatReqData = {
        chatId: "",
        // stream: false,
        stream: true,
        detail: true,
        messages: [
          {
            content: this.questionsValue,
            role: "user",
          },
        ],
      };
      const response = await window.fetch(config.chatCompletionsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + config.authorization,
        },
        // signal: abortSignal.signal,
        body: JSON.stringify({
          ...chatReqData,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      parseStreamChunk = (value) => {
        const chunk = decoder.decode(value);
        const chunkLines = chunk.split("\n\n").filter((item) => item);
        const chunkResponse = chunkLines.map((item) => {
          const splitEvent = item.split("\n");
          if (splitEvent.length === 2) {
            return {
              event: splitEvent[0].replace("event: ", ""),
              data: splitEvent[1].replace("data: ", ""),
            };
          }
          return {
            event: "",
            data: splitEvent[0].replace("data: ", ""),
          };
        });

        return chunkResponse;
      };
      class SSEParseData {
        storeReadData = "";
        storeEventName = "";

        parse(item) {
          if (item.data === "[DONE]")
            return { eventName: item.event, data: item.data };

          if (item.event) {
            this.storeEventName = item.event;
          }

          try {
            const formatData = this.storeReadData + item.data;
            const parseData = JSON.parse(formatData);
            const eventName = this.storeEventName;

            this.storeReadData = "";
            this.storeEventName = "";

            return {
              eventName,
              data: parseData,
            };
          } catch (error) {
            if (
              typeof item.data === "string" &&
              !item.data.startsWith(": ping")
            ) {
              this.storeReadData += item.data;
            } else {
              this.storeReadData = "";
            }
          }
          return {};
        }
      }

      const sseResponseEventEnum = {
        error: "error",
        answer: "answer",
        moduleStatus: "moduleStatus",
        appStreamResponse: "appStreamResponse", // sse response request
      };

      let responseText = "";
      let errMsg = "";
      let responseData = [];

      const parseData = new SSEParseData();

      const read = async () => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            if (response.status === 200 && !errMsg) {
              this.chatResult = false;
              return resolve({
                responseText,
                responseData,
              });
            } else {
              return reject({
                message: errMsg || "响应过程出现异常~",
                responseText,
              });
            }
          }
          const chunkResponse = parseStreamChunk(value);
          chunkResponse.forEach((item) => {
            // parse json data
            const { eventName, data } = parseData.parse(item);
            if (eventName === "answer") {
              const answer = data?.choices?.[0]?.delta?.content || "";
              this.answerText += answer;
            }

            if (!eventName || !data) return;

            if (
              eventName === sseResponseEventEnum.answer &&
              data !== "[DONE]"
            ) {
              const answer = data?.choices?.[0]?.delta?.content || "";
              // onMessage({ text: answer });
              responseText += answer;
            } else if (
              eventName === sseResponseEventEnum.moduleStatus &&
              data?.name &&
              data?.status
            ) {
              // onMessage(data);
            } else if (
              eventName === sseResponseEventEnum.appStreamResponse &&
              Array.isArray(data)
            ) {
              responseData = data;
            } else if (eventName === sseResponseEventEnum.error) {
              errMsg = getErrText(data, "流响应错误");
            }
          });
          read();
        } catch (err) {
          if (err?.message === "The user aborted a request.") {
            return resolve({
              responseText,
              responseData,
            });
          }
        }
      };
      read();
    },
    // 编辑
    openAddEditDialog(type, item, index) {
      this.type = "testEdit";

      this.faqdata = {
        ...item,
        questionsEn: item.q,
        questionsCn: item.qCn,
        answersCn: item.answer,
        answersEn: item.a,
      };
      this.index = index + 1;
      this.faqAddEditDialogVisible = true;
    },
    closeAddEditDialog() {
      this.faqAddEditDialogVisible = false;
    },
  },
  computed: {
    disabled() {
      return this.chatResult || this.testResultLoading;
    },
  },
};
