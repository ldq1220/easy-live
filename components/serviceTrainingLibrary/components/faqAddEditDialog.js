const faqAddEditDialog = {
  template: `
          <el-dialog v-model="dialogVisible" title="手动录入" width="827px" @open="openDialog" @close="closeDialog">
              <div class="faq_add_edit_dialog_content flex">
                  <div class="number font_weight" style="width:70px;">#001</div>
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
                          <span class="circle en">EN</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                          asddddddddddddddddddddddddd
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

                      <el-row class="flex" v-if="!hasAdd">
                        <div class="faq_form_item_label flex" style="width:100px;margin-right:10px">
                          <span></span>
                          <span class="circle en">EN</span>
                        </div>
                        <div class="faq_form_item_input" style="width:530px">
                          asddddddddddddddddddddddddd
                        </div>
                      </el-row>
                    </div>
                  </div>
              </div>
              <template #footer>
                <div class="dialog_footer flex">
                  <div class="footer_tooltip">
                    <i class="iconfont icon-wenhao"></i>
                    不要重复多次添加同样的问题和问答
                  </div>
                  <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="closeDialog">
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
      answerValue: "",
      hasAdd: true,
    };
  },
  props: ["dialogVisible", "type"],
  methods: {
    openDialog() {
      this.type === "add" ? (this.hasAdd = true) : (this.hasAdd = false);
    },
    closeDialog() {
      this.$emit("closeAddEditDialog");
    },
  },
};
