const commentRecord = {
  template: `
      <div class="comment_record_box">
        <div class="comment_record_header flex space_between"> 
          <h3>阿里直播访客评论记录</h3>
          <div class="flex">
              <el-input v-model="searchValue" class="w-50 m-2" placeholder="输入评论关键词" style="margin-right:20px" @keyup.enter="searchComment">
                  <template #prefix>
                      <i class="iconfont icon-sousuo cursor"></i>
                  </template>
              </el-input>
              <el-button type="primary" style="padding: 8px 30px">搜索</el-button>
          </div>
        </div>

        <div class="comment_record_table" v-if="!showDetail"  v-loading="tableLoading"  element-loading-text="数据加载中，请稍候...">
            <el-table :data="tableData" border row-class-name="table_row_item cursor"  height="400" style="width: 100%"  :header-cell-style="{ background: '#F7F7F7', color: '#606266' }">
                <el-table-column type="index" label="热度排名" align="center" width="140">
                  <template #default="scope">
                    <span>{{scope.row.index}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="message" label="评论内容" align="center">
                  <template #default="scope">
                    <span>{{scope.row.message}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="翻译" align="center" class="translate_text">
                  <template #default="scope" >
                    <div v-loading="scope.row.translateLoading" element-loading-text="翻译中，请稍候...">
                      <span v-if="scope.row.translateText">{{scope.row.translateText}}</span>
                      <i class="iconfont icon-fanyi-full" @click="handleTranslate(scope.row)" v-else></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="出现次数" align="center"/>
                <el-table-column  label="操作" align="center">
                    <template #default="scope">
                        <span class="op_icon" style="color:#CBA43F;width:80px;height:30px;line-height:30px" @click="toAccuracyTest(scope.row.message)">
                          <i class="iconfont icon-ceshi"></i>
                          测试
                        </span>
                        <span class="op_icon" style="color:#7728F5;width:120px;height:30px;line-height:30px" @click="openAddDialog(scope.row)">
                          <i class="iconfont icon-jia" @click=""></i>
                          加入知识库
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex" v-if="total != 0" style="margin-top:20px">
              <div></div>
              <el-pagination v-model:current-page="pageNum" :page-size="pageSize" background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"/>
            </div>
          </div>
      </div>

      <faq-add-dialog :dialogVisible="faqAddDialogVisible" :options="options" :itemData="itemData" @closeAddDialog="closeAddDialog"></faq-add-dialog>
    `,

  data() {
    return {
      searchValue: "",
      tableData: [{}],
      tableLoading: false,
      translateLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      faqAddDialogVisible: false,
      options: [],
      itemData: {},
    };
  },
  props: [""],
  mounted() {
    this.getQueryLiveComment();
    this.getDataset();
  },
  methods: {
    //获取评论列表
    async getQueryLiveComment() {
      this.tableLoading = true;

      const req = {
        userId: config.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      await axios({
        methods: "get",
        url: config.queryLiveCommentUrl,
        params: req,
      }).then((res) => {
        this.tableData = res.data.data;
        this.tableData.forEach((item, index) => {
          item.index = index + this.pageSize * (this.pageNum - 1) + 1;
        });
        this.total = res.data.total;
      });

      this.tableLoading = false;
    },
    // 获取数据集列表 用作加入知识库弹窗 数据集选择下拉数据
    async getDataset() {
      let res = await reqDatasetList({
        pageNum: 1,
        pageSize: 10,
        datasetId: config.datasetId,
      });
      const { code, data } = res;
      if (code == 200) {
        data.data.forEach((item) => {
          this.options.push({
            label: item.name,
            value: item._id,
          });
        });
      }
    },
    // 翻译
    async handleTranslate(row) {
      let flag = false;

      this.tableData.forEach((item) => {
        if (item.translateLoading) {
          flag = true;
        }

        if (item.message === row.message && !flag) {
          item.translateLoading = true;
        }
      });

      if (flag)
        return this.$message.warning("一次只能翻译一条评论内容,请等待翻译完成");

      try {
        let req = new FormData();
        req.append("text", row.message);
        await axios.post(config.chatTranslateUrl, req).then((res) => {
          console.log(res.data, res.data.result);
          if (res.data.result) {
            this.tableData.forEach((item) => {
              if (item.message == row.message) {
                item.translateText = res.data.data;
              }
            });
            this.$message.success("翻译成功");
          }
        });
      } catch (error) {
        this.$message.warning("翻译失败,请重试");
      }

      this.tableData.forEach((item) => {
        if (item.message === row.message) {
          item.translateLoading = false;
        }
      });
    },
    // 去测试
    toAccuracyTest(message) {
      this.$emit("gotoAccuracyTest", message);
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getQueryLiveComment();
    },
    // 加入知识库
    openAddDialog(row) {
      this.itemData = row;
      this.faqAddDialogVisible = true;
    },
    closeAddDialog() {
      this.faqAddDialogVisible = false;
    },
  },
};
