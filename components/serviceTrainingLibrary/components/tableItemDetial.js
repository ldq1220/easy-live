const tableItemDetial = {
  template: `
      <div class="table_item_detial">
          <div class="return" @click="returnPage">
            <i class="iconfont icon-31fanhui"></i>
            {{title}}
          </div>
          <div class="table_item_detial_header flex">
            <el-row>
              <el-button type="primary" @click="openSystemFaqDrillDialog">
                <i class="iconfont icon-baxin icon"></i>系统问答库训练
              </el-button>
              <div class="completeness flex" >
                <span class="completeness_text">完成度</span>
                <el-progress :percentage="90"  :stroke-width="16" color="#67C23A" style="width:300px" />
              </div>
            </el-row>
            <el-row>
              <el-input v-model="searchValue"  placeholder="搜索" style="width:216px;margin-right:20px">
                <template #prefix>
                  <i class="iconfont icon-sousuo"></i>
                </template>
              </el-input>
              <el-button type="success" @click="openAddEditDialog('add')">
                  <i class="iconfont icon-jia icon"></i>添加
              </el-button>
            </el-row>
            
          </div>

          <div class="table_item_detial_body flex">
            <div class="body_item_card " v-for="item in cardData" :key="item.id">
              <el-card class="box_card"  @click="openAddEditDialog('edit')">
                <template #header>
                  <div class="card-header">
                    <div class="circle faq">问</div>
                    {{item.questions}}
                  </div>
                </template>
                <div  class="body_item_card_content">
                  <div class="content_answers">
                    <div class="circle faq">答 </div>
                      {{item.answers}}
                  </div>
                  <div class="card_content_footer flex">
                      <span>#001</span>
                      <div class="card_content_footer_detial_icon">
                        <i class="iconfont icon-shanchu"></i>
                      </div>
                  </div>
                </div>
              </el-card>
            </div> 
          </div>
      </div>

      <faq-add-edit-dialog :dialogVisible="faqAddEditDialogVisible" :type="type" @closeAddEditDialog="closeAddEditDialog"></faq-add-edit-dialog>

      <system-faq-dirll-dialog :dialogVisible="systemFaqDrillDialogVisible" @closeSystemFaqDrillDialog="closeSystemFaqDrillDialog"></system-faq-dirll-dialog>
    `,

  data() {
    return {
      cardData: [
        {
          id: "1",
          questions: "你们的最小订购量是多少？",
          answers:
            "最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。",
        },
        {
          id: "2",
        },
        {
          id: "3",
        },
        {
          id: "4",
        },
        {
          id: "5",
        },
        {
          id: "6",
        },
      ],
      faqAddEditDialogVisible: false,
      systemFaqDrillDialogVisible: false,
      type: "add",
    };
  },
  props: ["title"],
  methods: {
    openAddEditDialog(type) {
      if (type === "add") {
        this.type = "add";
      } else {
        this.type = "edit";
      }
      this.faqAddEditDialogVisible = true;
    },
    closeAddEditDialog() {
      this.faqAddEditDialogVisible = false;
    },
    openSystemFaqDrillDialog() {
      this.systemFaqDrillDialogVisible = true;
    },
    closeSystemFaqDrillDialog() {
      this.systemFaqDrillDialogVisible = false;
    },
    // 返回
    returnPage() {
      this.$emit("returnHome");
    },
  },
};
