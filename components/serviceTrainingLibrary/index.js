const serviceTrainingLibrary = {
  template: `
      <div class="service_training_library">
        <div class="service_training_library_header flex space_between">
            <el-button type="primary" @click="abc">
                <i class="iconfont icon-baxin icon"></i>系统问答库训练
            </el-button>
            <loading-icon></loading-icon>
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

        <div class="service_training_library_table">
            <el-table :data="tableData"  style="width: 100%" :header-cell-style="{ background: '#F7F7F7', color: '#606266' }">
                <el-table-column prop="index" label="#" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="dataSum" label="数据总量" />
                <el-table-column prop="time" label="时间" />
                <el-table-column prop="status" label="状态" />
                <el-table-column prop="status" label="操作">
                    <template #default="scope">
                        <div class="iconfont icon-shanchu cursor table_content" style="color:#FD4D4F;"></div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
      </div>

      <new-faq :dialogVisible="newFaqDialogVisible" @closenewfaq="closeNewFAQ"></new-faq>
      <async-faq :dialogVisible="asyncFaqDialogVisible" @closenewfaq="closeNewFAQ"></async-faq>
      <split-qa :dialogVisible="splitQaDialogVisible" @closenewfaq="closeNewFAQ"></split-qa>
      
    `,

  data() {
    return {
      activeName: "first",
      searchValue: "", // 搜索框 value
      tableData: [
        {
          index: "1",
          name: "系统问答库",
          dataSum: "100",
          time: "2023-9-27 10:20",
          status: "已就绪",
        },
        {
          index: "2",
          name: "手动录入",
          dataSum: "0",
          time: "2023-9-27 10:20",
          status: "索引中",
        },
      ],
      newFaqDialogVisible: false,
      asyncFaqDialogVisible: false,
      splitQaDialogVisible: false,
    };
  },
  mounted() {
    console.log("智能客服库组件挂载啦！！！！");
  },
  methods: {
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
  },
};
