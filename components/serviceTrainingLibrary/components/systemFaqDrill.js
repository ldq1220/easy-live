const systemFaqDrill = {
  template: `
            <el-button type="primary" @click="openDialog">
              <i class="iconfont icon-baxin icon"></i>系统问答库训练
            </el-button>

            <el-dialog v-model="visiable" title="系统问答库" width="827px" @open="openDialog" @close="closeDialog">
                <div class="system_faq_drill_completeness flex2">
                  <span class="completeness_text">完成度</span>
                  <el-progress :percentage="90"  :stroke-width="16" color="#67C23A" style="width:300px" />
                </div>
                <div class="faq_add_edit_dialog_content flex">
                    <div class="number font_weight" style="width:70px;">#001</div>
                    <div class="faq_form" style="width:100%">
                      <div class="faq_form_item question">
                        <el-row class="flex">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span class="label_text font_weight">问题</span>
                            <span class="circle zn">中</span>
                          </div>
                          <div class="faq_form_item_input font_weight" style="width:530px">
                            {{ question.content }}
                          </div>
                        </el-row>
                        <br/>
                        <el-row class="flex">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span></span>
                            <span class="circle en">EN</span>
                          </div>
                          <div class="faq_form_item_input" style="width:530px">
                            {{ question.en}}
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
                        </el-row>

                        <el-row>
                          <div class="faq_form_item_input flex flex_start" style="width:530px;margin-left:78px">
                            <span class="circle zn" style="margin-right:10px">中</span>
                            <el-input
                                v-model="answer.content"
                                :rows="4"
                                type="textarea"
                                placeholder="使用中文输入回答内容"
                            />
                          </div>
                        </el-row>

                        <br/>

                        <el-row class="flex">
                          <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                            <span></span>
                            <span class="circle en">EN</span>
                          </div>
                          <div class="faq_form_item_input" style="width:530px">
                            {{answer.en}}
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
                      <el-button type="primary" @click="closeDialog">
                        确认
                      </el-button>
                      <el-button @click="closeDialog">跳过</el-button>
                      <el-radio-group v-model="sortRadio" class="ml-4" style="margin-left:10px">
                          <el-radio :label="0" size="large">按编号</el-radio>
                          <el-radio :label="1" size="large">随机</el-radio>
                        </el-radio-group>
                    </div>
                  </div>
                </template>
              </el-dialog>
          `,

  data() {
    return {
      question: {
        content: "你们的最小订购量是多少？",
        en: "What is the minimum order quantity?",
      },
      answer: {
        content: "",
        en: "加入问答库后AI回自动翻译",
      },
      visiable: false,
      radio: 0,
      sortRadio: 0,
    };
  },
  props: ["dialogVisible", "type"],
  methods: {
    openDialog() {
      this.visiable = true;
    },
    closeDialog() {
      this.visiable = false;
    },
    changeRadio(value) {
      if (value === 0) {
        this.answer = {
          content: "",
          en: "加入问答库后AI回自动翻译",
        };
      } else {
        this.answer = {
          content: "我是官方回答",
          en: "zxcnbmasd",
        };
      }
    },
  },
};
