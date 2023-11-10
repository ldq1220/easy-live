const tableItemDetial = {
  template: `
      <div class="table_item_detial">
          <div class="return" @click="returnPage">
            <i class="iconfont icon-31fanhui"></i>
            {{tableRowData.name}}
          </div>
          <div class="table_item_detial_header flex">
            <el-row v-if="tableRowData.isSystem">
              <el-button type="primary" @click="openSystemFaqDrillDialog">
                <i class="iconfont icon-baxin icon"></i>企业知识模型训练
              </el-button>
              <div class="completeness flex" >
                <span class="completeness_text">完成度</span>
                <el-progress :percentage="percentage"  :stroke-width="16" color="#67C23A" style="width:300px" />
              </div>
            </el-row>
            <el-row></el-row>
            <el-row>
              <el-input v-model="searchValue" placeholder="搜索" style="width:216px;margin-right:20px" @keyup.enter="handleSearch" @blur="handleSearch">
                <template #prefix>
                  <i class="iconfont icon-sousuo cursor" @click="handleSearch"></i>
                </template>
              </el-input>
              <el-button type="success" @click="openAddEditDialog('add')" v-if="!tableRowData.isSystem">
                  <i class="iconfont icon-jia icon"></i>添加
              </el-button>
            </el-row>
            
          </div>

          <div class="table_item_detial_body flex2" v-loading="loading" element-loading-text="数据加载中，请稍候...">
            <div class="body_item_card " v-for="item in questionList" :key="item.id">
              <el-card class="box_card"  @click="openAddEditDialog('edit',item)">
                <template #header>
                  <div class="card-header">
                    <div class="circle faq">问</div>
                    {{ item.questionsCn }}
                  </div>
                </template>
                <div  class="body_item_card_content">
                  <div class="content_answers">
                    <div class="circle faq">答 </div>
                      {{ item.answersCn }}
                  </div>
                  <div class="card_content_footer flex" >
                      <span>#{{ item.index + 9 * (pageNum - 1)}}</span>
                      <div class="card_content_footer_detial_icon" @click.stop="deleteQuestion(item.id)">
                        <i class="iconfont icon-shanchu"></i>
                      </div>
                  </div>
                </div>
              </el-card>
            </div> 
          </div>

          <div class="flex" v-if="total != 0">
            <div></div>
            <el-pagination v-model:current-page="pageNum" :page-size="9" background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"/>
          </div>
          
      </div>

      <faq-add-edit-dialog :dialogVisible="faqAddEditDialogVisible" :type="type" :tableRowData="tableRowData" :faqdata="faqdata" @closeAddEditDialog="closeAddEditDialog" @getQuestionList="getQuestionList"></faq-add-edit-dialog>

      <system-faq-dirll-dialog :dialogVisible="systemFaqDrillDialogVisible" :tableRowData="tableRowData" :questionIds="questionIds" :questionLibraryList="questionLibraryList" 
      :percentage="percentage" @closeSystemFaqDrillDialog="closeSystemFaqDrillDialog" @getQuestionList="getQuestionList"></system-faq-dirll-dialog>
    `,

  data() {
    return {
      percentage: 0, // 完成度
      searchValue: "", // 搜索框
      cardData: [
        {
          id: "1",
          questions: "你们的最小订购量是多少？",
          answers:
            "最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。最低订单数量因产品而异。请提供您感兴趣的产品的具体细节，我们可以为您提供最低订单数量。",
        },
      ],
      faqdata: {}, //点击某个问答 当前问答的数据
      faqAddEditDialogVisible: false,
      systemFaqDrillDialogVisible: false,
      questionLibraryList: [], // 系统问答库总列表
      questionList: [], // 问答库列表
      questionIds: [],
      type: "add",
      // 分页
      pageNum: 1,
      total: 0,
      loading: false,
    };
  },
  props: ["tableRowData", "isPopup", "isSystem"],
  mounted() {
    if (this.tableRowData.isSystem) {
      this.getQuestionLibraryList(); // 获取 系统问答库总列表
    } else {
      this.getQuestionList(); // 获取系统问答库 数据集的数据列表
    }
  },
  methods: {
    // 获取 系统问答库总列表
    async getQuestionLibraryList() {
      this.loading = true;

      await axios.get(config.questionLibraryListUrl).then((res) => {
        this.questionLibraryList = res.data;
        this.getQuestionList(); // 获取系统问答库 数据集的数据列表
        if (
          !this.searchValue.trim() &&
          this.questionIds.length !== 0 &&
          this.questionLibraryList.length !== 0
        ) {
          this.percentage = Math.round(
            (this.questionIds.length / this.questionLibraryList.length) * 100
          );
        }
      });
    },
    // 获取系统问答库 数据集的数据列表
    async getQuestionList() {
      this.loading = true;
      let reqData = {
        pageNum: this.pageNum,
        pageSize: 9,
        collectionId: this.tableRowData._id, // 测试用
        searchText: this.searchValue,
      };
      let res = await reqGetDataList(reqData);
      const { code, data } = res;
      if (code === 200) {
        this.questionList = data.data.map((item, index) => {
          return {
            id: item.id,
            index: index + 1,
            questionsCn: filterText(item.qCn)[0],
            questionsEn: filterText(item.q)[0],
            answersCn: filterText(item.qCn)[1],
            answersEn: filterText(item.q)[1],
          };
        });

        this.questionIds = data.questionIds;
        this.total = data.total;

        if (
          !this.searchValue.trim() &&
          this.questionIds.length !== 0 &&
          this.questionLibraryList.length !== 0
        ) {
          this.percentage = Math.round(
            (this.questionIds.length / this.questionLibraryList.length) * 100
          );
        }

        if (this.isPopup && this.percentage !== 100) {
          this.systemFaqDrillDialogVisible = true;
        } else {
          if (!this.isSystem) {
            this.systemFaqDrillDialogVisible = false;
          }
          this.$emit("cancel");
        }
      }

      this.loading = false;
    },
    //删除数据集中的数据
    deleteQuestion(id) {
      this.$confirm("确认删除该问答数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await delDataById(id);
        const { code } = res;
        if (code === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getQuestionList(); // 获取系统问答库 数据集的数据列表
        }
      });
    },
    openAddEditDialog(type, item) {
      if (type === "add") {
        this.type = "add";
      } else {
        this.type = "edit";
        this.faqdata = item;
      }
      this.faqAddEditDialogVisible = true;
    },
    // 搜索
    handleSearch() {
      this.getQuestionList();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getQuestionList(); // 获取系统问答库 数据集的数据列表
    },
    closeAddEditDialog() {
      this.faqAddEditDialogVisible = false;
    },
    openSystemFaqDrillDialog() {
      if (this.percentage === 100) {
        return this.$message.warning("暂无更多系统问答题目");
      }
      this.systemFaqDrillDialogVisible = true;
    },
    closeSystemFaqDrillDialog() {
      this.$emit("cancel");
      this.systemFaqDrillDialogVisible = false;
    },
    // 返回
    returnPage() {
      this.$emit("returnHome");
    },
  },
};
