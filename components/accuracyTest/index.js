const accuracyTest = {
  template: `
  <el-scrollbar height="700px">
      <div class="accuracy_box">
        <div class="header_tooltip">
            <i class="iconfont icon-icon"></i>
            如果测试结果不满意,请优化或完善客服训练库
        </div>

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
                    />
                    <div class="flex">
                      <div></div>
                      <el-button type="success" style="padding:8px 30px">测试</el-button>
                    </div>
                </div>
            </div>

            <div class="accuracy_faq_item answer flex">
              <div class="flex flex_start">
                <div style="width:40px">
                  <span class="circle faq">答</span>
                </div>
                <div class="answer_content" :class="isEn? 'isEN' :''">
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
            </div>
        </div>

        <div class="test_result_analyse"> 
          <div class="test_result_analyse_title font_weight">测试结果分析</div>
          <div class="test_result_analyse_content flex flex_wrap">
            <div class="test_result_analyse_content_item" v-for="item in 4">
              <div class="test_result_analyse_content_item_similarity flex">
                <span class="font_weight">#1</span>
                <el-progress :percentage="65.57" status="warning" style="width:100%;margin-left:40px">
                  <div style="margin-left:10px">相似度0.6557</div>
                </el-progress>
              </div>
              <div class="test_result_analyse_content_item_questions flex flex_start">
                <div style="width:40px">
                  <div class="circle faq">问</div>
                </div>
                <div class="questions_text flex1">你们的最小订购了？</div>
              </div>
              <div class="test_result_analyse_content_item_answer flex flex_start">
                <div style="width:40px">
                  <div class="circle faq">答</div>
                </div>
                <div class="answer_text flex1">最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。最低订单数量因产品而异。</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </el-scrollbar> 
    `,

  data() {
    return {
      questionsValue: "",
      // 查看翻译
      viewsTranslateText: "查看翻译",
      isEn: true,
      answerText:
        "The minimum order quantities vary depending on the product. Please provide specific details about the product you are interested in, and we can provide you with the minimum order quantity",
      originalText:
        "最低起订量视产品而定。请提供您感兴趣的产品的具体细节，我们可以为您提供最小起订量",
    };
  },
  props: [""],
  methods: {
    // 查看翻译
    viewsTranslate() {
      this.isEn = !this.isEn;
      this.isEn
        ? (this.viewsTranslateText = "查看翻译")
        : (this.viewsTranslateText = "查看原文");
    },
  },
};
