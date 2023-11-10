const serviceTrainingLibrary = {
  template: `
      <div class="service_training_library" v-loading="operateLoading"  element-loading-text="数据处理中，请稍候...">
        <div class="service_training_library_header flex space_between" v-if="!showDetail"> 
            <el-button type="primary" @click="openSystemFaqDrillDialog">
              <i class="iconfont icon-baxin icon"></i>系统问答库训练
            </el-button>
            
            <div class="flex">
                <el-input v-model="searchValue" class="w-50 m-2" placeholder="搜索" style="margin-right:20px" @keyup.enter="getDatasetList">
                    <template #prefix>
                        <i class="iconfont icon-sousuo cursor"  @click="getDatasetList" ></i>
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
                        </el-dropdown-menu>
                    </template>
                 </el-dropdown>
            </div>
        </div>

        <div class="service_training_library_table" v-if="!showDetail"  v-loading="loading"  element-loading-text="数据加载中，请稍候...">
            <el-table :data="tableData" row-class-name="table_row_item cursor"  height="400" style="width: 100%" @row-click="imgSelected" :header-cell-style="{ background: '#F7F7F7', color: '#606266' }">
                <el-table-column type="index" label="#" align="center" />
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column prop="dataAmount" label="数据总量" align="center" />
                <el-table-column prop="trainingAmount" label="状态" align="center">
                  <template #default="scope">
                    <div style="height:28px;line-height:28px ;">
                    <span style="display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color: #38a169" v-if="scope.row.trainingAmount == 0"></span>
                    <span style="display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color: #ff8500" v-else></span>
                      {{scope.row.trainingAmount == 0?'已就绪': scope.row.trainingAmount + '索引中'}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align="center">
                    <template #default="scope">
                        <i class="iconfont icon-shanchu delete_icon " style="color:#FD4D4F;" v-if="!scope.row.isSystem" @click.stop="handleDelete(scope.row._id)"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
      </div>

     
      <new-faq :dialogVisible="newFaqDialogVisible" :tableDataLength="tableDataLength" @closenewfaq="closeNewFAQ" @getDatasetList="getDatasetList"></new-faq>
      <async-faq :dialogVisible="asyncFaqDialogVisible" :tableData="tableData" @closenewfaq="closeNewFAQ" @getDatasetList="getDatasetList"></async-faq>
      <split-qa :dialogVisible="splitQaDialogVisible" @closenewfaq="closeNewFAQ"></split-qa>

      <table-item-detial v-if="showDetail" :isPopup="isPopup" :tableRowData="tableRowData" @returnHome="returnHome" @cancel="cancel"/>
    `,

  data() {
    return {
      activeName: "first",
      searchValue: "", // 搜索框 value
      tableData: [],
      tableDataLength: "",
      tableRowData: {},
      newFaqDialogVisible: false,
      asyncFaqDialogVisible: false,
      splitQaDialogVisible: false,
      showDetail: false, // 是否显示 列表详情
      isPopup: false, // 是否 自动弹出 问答库训练弹窗
      loading: false,
      operateLoading: false,
    };
  },
  mounted() {
    this.getDatasetList(); // 获取数据集列表
  },
  methods: {
    // 获取数据集列表
    async getDatasetList() {
      this.loading = true;

      let res = await reqDatasetList({
        pageNum: 1,
        pageSize: 10,
        datasetId: config.datasetId,
        // searchText: this.searchValue,
      });
      const { code, data } = res;
      if (code == 200) {
        data.data.forEach((item) => {
          item.updateTime = dayjs(item.updateTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        this.tableData = data.data;
        this.tableDataLength = data.data.length;
      }
      this.loading = false;
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
      Object.assign(this.tableRowData, row);
      this.showDetail = true;
    },
    returnHome() {
      this.showDetail = false;
      this.isPopup = false;
      this.getDatasetList(); // 获取数据集列表
    },
    // 系统问答库训练 弹窗
    openSystemFaqDrillDialog() {
      this.tableData.forEach((item) => {
        if (item.name === "系统问答库") {
          this.tableRowData = item;
        }
      });
      this.showDetail = true;
      this.isPopup = true;
    },
    // 取消 系统问答库训练弹窗 自动弹出
    cancel() {
      this.isPopup = false;
    },
    // 删除数据集
    async handleDelete(id) {
      this.operateLoading = true;
      this.$confirm("确认删除该问答数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await reqDeleteDataset(id);
        const { code } = res;
        if (code === 200) {
          this.$message.success("删除成功");
          this.getDatasetList(); // 获取数据集列表
        }
        this.operateLoading = false;
      });
    },
  },
};
