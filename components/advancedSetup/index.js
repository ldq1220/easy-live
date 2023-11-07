const advancedSetup = {
  template: `
  <el-scrollbar height="700px">
      <div class="advanced_setup_box">
        <div class="advanced_setup_title">
            <i class="iconfont icon-icon"></i>
            如果没有详细了解AI特性, 建议不要修改默认设置; 修改完可以到<span>准确度测试</span>栏目看看效果。 
        </div>

        <div class="setup_item_box">
            <div class="setup_item_title font_weight">搜索参数调整</div>
            <div class="setup_item flex2">
                <div class="setup_item_label font_weight" style="width:100px">相似度</div>
                <div style="width:30px">0</div>
                <el-slider v-model="similarityValue" :format-tooltip="formatTooltipSimilarity" style="width:400px"/>
                <div style="width:30px;margin-left:16px">1</div>
            </div>
            <div class="setup_item flex2 search_num">
                <div class="setup_item_label font_weight" style="width:100px">单次搜索量</div>
                <div style="width:30px">1</div>
                <el-slider v-model="searchNumValue" :format-tooltip="formatTooltipSearchNum" style="width:400px"/>
                <div style="width:30px;margin-left:16px">20</div>
            </div>
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
                    <div class="emtpy_content_tooltip flex flex_start"  style="width:600px">
                        <i style="width:40px" class="iconfont icon-wenhao"></i>
                        <div>若填写该内容，没有搜索到对应内容时，将直接回复填写的内容。
                        为了连贯上下文，系统会取部分上一个聊天的搜索记录作为补充，因此在连续对话时，该功能可能会失效。</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="setup_item_box">
            <div class="setup_item_title font_weight">AI高级设置</div>
            <div class="setup_item flex2">
                <div class="setup_item_label font_weight" style="width:100px">温度</div>
                <div style="width:30px;transform: translateX(-20px);">严谨</div>
                <el-slider v-model="temperatureValue" :format-tooltip="formatTooltipTemperature" style="width:400px"/>
                <div style="width:30px;margin-left:16px">发散</div>
            </div>
             <div class="setup_item flex2 flex_start" style="margin-top:40px">
                <div class="setup_item_label font_weight" style="width:100px">AI语言</div>
                <div>
                <el-select v-model="langSelect"  style="width:160px;transform: translateX(-20px);">
                    <el-option label="英语" value="英语" />
                    <el-option label="法语" value="法语" />
                    <el-option label="意大利语" value="意大利语" />
                </el-select>
                </div>
            </div>
        </div>
        
        <div class="advanced_setup_btns flex" style="margin-top:20px">
            <div></div>
            <div>
                <el-button  @click="" style="padding:10px 30px">恢复默认</el-button>
                <el-button type="primary" @click="" style="padding:10px 40px">保存</el-button>
            </div>
        </div>
      </div>
    </el-scrollbar> 
    `,

  data() {
    return {
      similarityValue: 40, // 相似度
      searchNumValue: 25, // 单次搜索量
      emtpyContentValue: "", // 空搜索回复
      temperatureValue: 0, // 温度
      langSelect: "英语",
    };
  },
  props: [""],
  methods: {
    formatTooltipSimilarity(val) {
      return val / 100;
    },
    formatTooltipSearchNum(val) {
      return val / 5;
    },
    formatTooltipTemperature(val) {
      return val / 10;
    },
  },
};
