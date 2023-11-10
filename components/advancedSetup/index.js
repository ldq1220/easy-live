const advancedSetup = {
  template: `
      <div class="advanced_setup_box" v-loading="loading" :element-loading-text="loadingText">
        <div class="advanced_setup_title">
            <i class="iconfont icon-icon"></i>
            如果没有详细了解AI特性, 建议不要修改默认设置; 修改完可以到<span @click="toAccuracyTest">准确度测试</span>栏目看看效果。 
        </div>

        <div class="setup_item_box" >
            <div class="setup_item_title font_weight">搜索参数调整</div>
            <div class="setup_item flex2">
                <div class="setup_item_label font_weight" style="width:100px">相似度</div>
                <div style="width:30px">0</div>
                <el-slider v-model="similarityValue" :mix="0" :max="1" :step="0.1" style="width:400px"/>
                <div style="width:30px;margin-left:16px">1</div>
            </div>
            <div style="text-align: left;color: #808080;margin: 10px 0 0 30px">客户问题搜索的答案与客服训练库的匹配度，数值越小匹配度越低，数值越高匹配度越高。</div>
            <div style="text-align: left;color: #808080;margin: 10px 0 0 30px"><span style="color: #fc4949;">注意：</span>相似度过高时，可能搜索不到对应的答案，就会进行空搜索回复，建议设置在0.5~0.8之间。</div>
            <div class="setup_item flex2 search_num">
                <div class="setup_item_label font_weight" style="width:100px">单次搜索量</div>
                <div style="width:30px">1</div>
                <el-slider v-model="searchNumValue" :mix="1" :max="20" :step="1" style="width:400px"/>
                <div style="width:30px;margin-left:16px">20</div>
            </div>
            <div style="text-align: left;color: #808080;margin: 10px 0 40px 30px">客户问题搜索的答案数量。</div>
             <div class="setup_item flex2 flex_start">
                <div class="setup_item_label font_weight" style="width:100px">空搜索回复</div>
                <div>
                    <el-input
                        v-model="emtpyContentValue"
                        :rows="4"
                        type="textarea"
                        placeholder="输入默认空搜索回复的内容"
                        class="emtpy_content_textarea"
                        style="width:600px"
                    />
                    <div class="emtpy_content_tooltip flex2"  style="width:600px">
                        <i style="width:40px" class="iconfont icon-wenhao"></i>
                        <div style="text-align: left;">若填写该内容，没有搜索到对应答案时，将直接回复填写的内容。</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="setup_item_box">
            <div class="setup_item_title font_weight">AI高级设置</div>
            <div class="setup_item flex2">
                <div class="setup_item_label font_weight" style="width:100px">温度</div>
                <div style="width:30px;transform: translateX(-20px);">严谨</div>
                <el-slider v-model="temperatureValue" :mix="0" :max="1" :step="0.1" style="width:400px"/>
                <div style="width:30px;margin-left:16px">发散</div>
            </div>
            <div style="text-align: left;color: #808080;margin: 10px 0 40px 40px">温度数值影响到AI人性化回复</div>
             <div class="setup_item flex2 " style="margin-top:40px">
                <div class="setup_item_label font_weight" style="width:100px">AI语言</div>
                <div>
                <el-select v-model="langSelect"  style="width:160px;transform: translateX(-20px);">
                    <el-option label="英语" value="英语" />
                </el-select>
                </div>
            </div>
            <div style="text-align: left;color: #808080;margin: 10px 0 40px 40px">选择该语言后，AI会用所选的语言进行回复。</div>
        </div>
        
        <div class="advanced_setup_btns flex" style="margin-top:20px">
            <div></div>
            <div>
                <el-button  @click="" style="padding:10px 30px" @click="handleDefault">恢复默认</el-button>
                <el-button type="primary" @click="handleSave" style="padding:10px 40px">保存</el-button>
            </div>
        </div>
      </div>
    `,

  data() {
    return {
      similarityValue: 0, // 相似度
      searchNumValue: 0, // 单次搜索量
      emtpyContentValue: "", // 空搜索回复
      temperatureValue: 0, // 温度
      langSelect: "英语",
      loading: false,
      loadingText:'获取数据中，请稍候...'
    };
  },
  props: [""],
  mounted() {
    this.getSetup(); // 获取高级设置
  },
  methods: {
    // 获取高级设置
    async getSetup(type) {
      this.loading = true;
      let res = await reqDetailModule(config.appId);
      const { code, data } = res;
      if (code === 200) {

        this.similarityValue = data.similarity;
        this.searchNumValue = data.limit;
        this.emtpyContentValue = data.emptyText;
        this.temperatureValue = data.temperature;
        this.langSelect = data.systemPrompt.split("[")[1].split("]")[0];
        if(type){
          this.$message({
            type: "success",
            message: type === "save" ? "保存成功" : "已恢复默认",
          });
        }

        this.loading = false;
      }
    },
    // 保存
    async handleSave() {
      let reqData = {
        similarity: this.similarityValue,
        limit: this.searchNumValue,
        emptyText: this.emtpyContentValue,
        temperature: this.temperatureValue,
        systemPrompt: `你必须要用[${this.langSelect}]回复`,
      };

      this.updateSetup(reqData, "save");
    },
    // 恢复默认
    async handleDefault() {
      let reqData = {
        similarity: 0.6,
        limit: 10,
        emptyText:
          "Sorry, I can't answer your question at the moment, a member of staff will contact you later",
        temperature: 0,
        systemPrompt: "你必须要用[英语]回复",
      };

      this.updateSetup(reqData, "default");
    },
    // 修改数据
    async updateSetup(req, type) {
      this.loading = true;
      this.loadingText = '保存数据中，请稍候...'

      let res = await reqUpdateModule(config.appId, req);
      const { code, data } = res;
      if (code === 200) {
        if (type === "default") {
          this.similarityValue = 0.6
          this.searchNumValue = 10
          this.emtpyContentValue =  "Sorry, I can't answer your question at the moment, a member of staff will contact you later"
          this.temperatureValue = 0
          this.langSelect = "英语"
        }
        this.$message.success('修改成功')
      }
      this.loading = false;
    },
    toAccuracyTest() {
      this.$emit("gotoAccuracyTest");
    },
  },
};
