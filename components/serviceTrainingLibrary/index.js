const serviceTrainingLibrary = {
  template: `
      <div class="service_training_library">
        <div class="service_training_library_header flex space_between" v-if="!showDetail"> 
            <el-button type="primary" @click="openSystemFaqDrillDialog">
              <i class="iconfont icon-baxin icon"></i>系统问答库训练
            </el-button>
            
            <div class="flex">
                <el-input v-model="searchValue" class="w-50 m-2" placeholder="搜索" style="margin-right:20px">
                    <template #prefix>
                        <i class="iconfont icon-sousuo"></i>
                    </template>
                </el-input>
                <el-dropdown>
                    <el-button type="success" >新建 / 导入</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item  @click="handleOpenDialog('newFAQ')">
                              <i class="iconfont icon-xinjian"></i>新建FAQ库
                          </el-dropdown-item>
                          <el-dropdown-item  @click="handleOpenDialog('asyncFAQ')"> 
                              <i class="iconfont icon-tongbu"></i>同步旧FAQ
                          </el-dropdown-item>
                          <el-dropdown-item @click="handleOpenDialog('splitQA')">  
                              <i class="iconfont icon-chaifen"></i>文档QA拆分
                          </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                 </el-dropdown>
            </div>
        </div>

        <div class="service_training_library_table" v-if="!showDetail">
            <el-table :data="tableData" row-class-name="table_row_item cursor"  height="400" style="width: 100%" @row-click="imgSelected" :header-cell-style="{ background: '#F7F7F7', color: '#606266' }">
                <el-table-column type="index" label="#" align="center" />
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column prop="dataAmount" label="数据总量" align="center" />
                <el-table-column prop="updateTime" label="时间" align="center" />
                <el-table-column prop="trainingAmount" label="状态" align="center">
                  <template #default="scope">
                    <div style="height:50px;line-height:50px ;">
                      {{scope.row.trainingAmount == 0?'已就绪': scope.row.trainingAmount + '索引中'}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align="center">
                    <template #default="scope">
                        <i class="iconfont icon-shanchu cursor table_content" style="color:#FD4D4F;" v-if="!scope.row.isSystem"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
      </div>

     
      <new-faq :dialogVisible="newFaqDialogVisible" @closenewfaq="closeNewFAQ"></new-faq>
      <async-faq :dialogVisible="asyncFaqDialogVisible" @closenewfaq="closeNewFAQ"></async-faq>
      <split-qa :dialogVisible="splitQaDialogVisible" @closenewfaq="closeNewFAQ"></split-qa>
      <system-faq-dirll-dialog :dialogVisible="systemFaqDrillDialogVisible" @closeSystemFaqDrillDialog="closeSystemFaqDrillDialog"></system-faq-dirll-dialog>
      <table-item-detial v-if="showDetail" :title="title" @returnHome="returnHome"/>
    `,

  data() {
    return {
      activeName: "first",
      searchValue: "", // 搜索框 value
      tableData: [],
      newFaqDialogVisible: false,
      asyncFaqDialogVisible: false,
      splitQaDialogVisible: false,
      showDetail: false, // 是否显示 列表详情
      title: "系统问答库",
      systemFaqDrillDialogVisible: false, // 系统问答库训练弹窗
    };
  },
  mounted() {
    console.log("智能客服库组件挂载啦！！！！");
    this.getDatasetList(); // 获取数据集列表
  },
  methods: {
    // 获取数据集列表
    async getDatasetList() {
      let res = await getList({
        pageNum: 1,
        pageSize: 10,
        datasetId: "654a0e916bcc679370ccbef8",
      });
      const { code, data } = res;
      if (code == 200) {
        data.data.forEach((item) => {
          item.updateTime = dayjs(item.updateTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        this.tableData = data.data;
      }
    },
    handleClick() {
      this.$emit("fatherEmit", "this.data");
    },
    handleOpenDialog(flag) {
      if (flag == "newFAQ") {
        this.newFaqDialogVisible = true;
      } else if (flag == "asyncFAQ") {
        this.asyncFaqDialogVisible = true;
      } else if (flag == "splitQA") {
        this.splitQaDialogVisible = true;
      }
    },
    closeNewFAQ() {
      this.newFaqDialogVisible = false;
      this.asyncFaqDialogVisible = false;
      this.splitQaDialogVisible = false;
    },
    // 点击表格某一行
    imgSelected(row, event, column) {
      //点击获取索引
      // this.showDetail = false;
      console.log(row);
    },
    // 系统问答库训练 弹窗
    openSystemFaqDrillDialog() {
      this.showDetail = true;
      this.systemFaqDrillDialogVisible = true;
    },
    closeSystemFaqDrillDialog() {
      this.systemFaqDrillDialogVisible = false;
    },
    returnHome() {
      this.showDetail = false;
    },
  },
};
