<template>
  <div class="cropper-app">
    <el-dialog
      :title="cutTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <div class="cropper-container">
        <div class="cropper-left">
          <div
            v-show="!showCropperArea"
            class="left-select"
            @click="uploadImg"
          >
            <i class="el-icon-circle-plus-outline" />
            <span class="left-select-name">
              添加图片
            </span>
            <input
              ref="input"
              class="cropper-upload"
              type="file"
              :accept="accept"
              @change="uploadChange"
            >
          </div>
          <div v-show="showCropperArea">
            <div class="left-cropper">
              <vue-cropper
                ref="coverCropper"
                :img="vueCropperOption.img"
                :full="vueCropperOption.full"
                :output-size="vueCropperOption.outputSize"
                :can-scale="vueCropperOption.canScale"
                :center-box="vueCropperOption.centerBox"
                :info-true="vueCropperOption.infoTrue"
                :info="vueCropperOption.info"
                :auto-crop="vueCropperOption.autoCrop"
                :can-move="vueCropperOption.canMove"
                :fixed="vueCropperOption.fixed"
                :output-type="vueCropperOption.outputType"
                :auto-crop-width="vueCropperOption.autoCropWidth"
                :auto-crop-height="vueCropperOption.autoCropHeight"
                :fixed-number="vueCropperOption.fixedNumber"
                @realTime="previewHandler"
              />
            </div>
            <div class="left-desc">
              <span class="renew-label" @click="renew">
                重新上传
              </span>
              <div>
                <i
                  class="el-icon-remove-outline"
                  @click="changeScale(-1)"
                />
                <i
                  class="el-icon-circle-plus-outline"
                  @click="changeScale(1)"
                />
                <i
                  class="el-icon-refresh-right"
                  @click="rotateRight"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="cropper-right">
          <div class="review-text">预览</div>
          <div :style="{width: previewImg.width+'px', height: previewImg.height+'px', }" class="preview-img">
            <div :style="previewStyle">
              <img
                :src="previewImg.url"
                :style="previewImg.style"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="save"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { VueCropper } from 'vue-cropper'
import mixin from './mixin.js'

export default {
  name: 'CropperDialog',

  components: {
    VueCropper
  },

  mixins: [mixin],

  props: {
    // 弹窗宽度
    width: {
      type: [Number, String],
      default: 500
    },

    // 裁切框标题
    cutTitle: {
      type: String,
      default: '图片裁剪'
    },

    // 上传文件接受的类型
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png'
    },

    // 裁切弹框显示隐藏
    visible: {
      type: Boolean,
      default: false
    },

    // 关闭处理
    closeHandler: {
      type: Function,
      default: undefined
    },

    // 取消处理
    cancelHandler: {
      type: Function,
      default: undefined
    },

    // 保存处理
    saveHandler: {
      type: Function,
      default: undefined
    },

    // 文件上传前处理
    beforeUpload: {
      type: Function,
      default: undefined
    },

    // 裁切图片资源链接
    url: {
      type: [String, Blob],
      default: ''
    },

    // 裁剪框配置
    cropperConfig: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      dialogVisible: false,
      showCropperArea: false, // 裁剪区域显示
      canClickSize: false, // 选择尺寸显示

      previewImg: {
        width: 200,
        height: 50
      },
      previewStyle: {},
      vueCropperOption: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        canMove: true, // 上传图片是否可以移动
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        outputType: 'png', // 输出格式
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        info: false, // 裁剪框的大小信息
        autoCropWidth: 544, // 默认生成截图框宽度
        autoCropHeight: 231 // 默认生成截图框高度
      }
    }
  },

  computed: {
    dialogWidth() {
      const width = this.width
      return typeof width === 'number' ? width + 'px' : width
    }
  },

  watch: {
    visible(val) {
      this.dialogVisible = val
      // 裁剪配置
      const cropperConfig = Object.prototype.toString.call(this.cropperConfig) === '[object Object]' ? this.cropperConfig : {}
      Object.assign(this.vueCropperOption, cropperConfig)
    },

    url(newValue) {
      this.initUrl(newValue)
    }
  },

  created() {
    this.initUrl(this.url)
  },

  methods: {
    /**
     * 初始化裁切图片
     * @param url [String, Blob] 裁切图片的资源
     */
    initUrl(url) {
      if (url) {
        this.vueCropperOption.img = url
        this.canClickSize = true
        this.showCropperArea = true
      }
    },

    // 裁切弹窗取消
    cancel() {
      this.cancelHandler
        ? this.cancelHandler()
        : this.$emit('update:visible', false)
    },

    // 保存按钮
    save() {
      // 判断是否上传了裁切图片
      if (this.canClickSize) {
        // 获取2.35:1截图的base64 数据
        this.$refs.coverCropper.getCropData(data => {
          this.saveHandler && this.saveHandler(data)
          this.vueCropperOption.img = ''
          this.$emit('update:visible', false)
        })
      } else {
        this.$emit('update:visible', false)
      }
    },

    /**
     * 裁剪图片放大缩小
     * @param num {number} 1放大 -1缩小
     */
    changeScale(num) {
      num = num || 1
      this.$refs.coverCropper.changeScale(num)
    },

    // 裁剪图片旋转
    rotateRight() {
      this.$refs.coverCropper.rotateRight()
      setTimeout(() => {
        this.$refs.coverCropper.showPreview()
      }, 17)
    },

    /**
     * 实时预览处理
     * @param data {Object} 实时预览的数据
     * @param index {number} 预览框下标
     */
    previewHandler(data) {
      Object.assign(this.previewImg, {
        url: data.url,
        style: data.img
      })

      const scale = this.previewImg.height / data.h
      this.previewStyle = {
        width: data.w + 'px',
        height: data.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: scale
      }
    },

    // 重新上传
    renew() {
      this.uploadImg()
    },

    /**
     * 裁切上传
     * @param obj {File} 文件资源对象
     */
    uploadFiles(obj) {
      if (obj.files && obj.files[0]) {
        var file = obj.files[0]
        const before = this.beforeUpload && this.beforeUpload(file)
        if (this.beforeUpload && !before) {
          return
        }
        const url = this.createImage(file)
        this.initUrl(url)
      }
    },

    // 处理裁切弹窗关闭
    handleClose() {
      this.closeHandler
        ? this.closeHandler()
        : this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper-container {
  display: flex;
  .left-select,
  .left-cropper {
    width: 200px;
    height: 200px;
  }
  .left-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    background-color: #f7f7f7;
    i {
      font-size: 30px;
      color: #ff884d;
    }
    span {
      margin-top: 12px;
    }
    .cropper-upload {
      display: none;
    }
  }
  .left-desc {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;
    i {
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .renew-label {
    color: #FF884D;
    cursor: pointer;
  }
  .cropper-right {
    flex: 1;
    padding-left: 40px;
    box-sizing: border-box;
  }
  .preview-img {
    background-color: #f7f7f7;
  }
  .review-text {
    line-height: 30px;
    color: #595959;
    font-size: 14px;
  }
}
</style>
