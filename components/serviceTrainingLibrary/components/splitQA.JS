const splitQA = {
  template: `
        <el-dialog v-model="dialogVisible" title="文档QA拆分" width="40%" @close="closeDialog">
            <div class="content">
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                >
                    <div style="text-align:center">
                        <el-button>
                            <i class="iconfont icon-shangchuan"></i><span class="upload_text">上传文件</span>
                        </el-button>
                        <br/>
                        <br/>
                        支持 .txt, .doc, .docx, .pdf, .md 文件
                    </div>
                </el-upload>
            </div>
            <template #footer>
              <div class="new_faq_dialog_footer flex">
                <div>
                  <i class="iconfont icon-wenhao icon">  选择文本文件,让大模型自动生产问答对话</i>
                </div>
                <div class="dialog-footer">
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
      upload: null,
    };
  },
  props: ["dialogVisible"],
  methods: {
    closeDialog() {
      this.$emit("closenewfaq");
    },
    handleExceed(files) {},
  },
};
