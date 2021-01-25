<template>
  <div class="cropper-app">
    <div
      class="upload-container"
      :class="[imageUrl ? 'upload-has-img' : 'upload-none-img']"
      @click="uploadImg"
    >
      <i class="el-icon-close remove-icon" @click.stop="removeImg" />
      <!-- 图片上传 -->
      <div v-show="imageUrl" class="upload-img">
        <img :src="imageUrl" alt="图片">
      </div>
      <div class="upload-icon">
        <i class="el-icon-upload" />
        <div class="upload-text">
          {{ imageUrl ? '重新上传' : '上传文件' }}
        </div>
      </div>
    </div>
    <div class="el-upload__tip">{{ tips }}</div>
    <input
      ref="input"
      class="input-upload"
      type="file"
      :accept="accept"
      @change="uploadChange"
    >

    <!-- 图片裁剪框 -->
    <clipper-dialog
      :visible.sync="showClipperDialog"
      :url="clippUrl"
      v-bind="$attrs"
      :before-upload="validUploadImg"
      :save-handler="uploadSuccess"
    />
  </div>
</template>

<script>

import ClipperDialog from './clipper-dialog.vue'
import mixin from './mixin.js'

export default {

  name: 'ImageCropper',

  components: {
    ClipperDialog
  },

  mixins: [mixin],

  inheritAttrs: false,

  props: {
    // 上传文件接受的类型
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png'
    },
    fileSize: {
      type: Number,
      default: 500
    },
    tips: {
      type: String,
      default: '仅支持png、jpg、jpeg格式，且不超过500K； 建议上传尺寸：200*50'
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      showClipperDialog: false,
      clippUrl: ''
    }
  },

  methods: {
    uploadFiles(obj) {
      if (obj.files && obj.files[0]) {
        const file = obj.files[0]
        this.beforeUpload(file)
      }
    },
    /**
     * [logoBeforeUpload logo图片上传前的钩子函数]
     */
    beforeUpload(file) {
      if (!this.validUploadImg(file)) return

      this.clippUrl = this.createImage(file)
      this.showClipperDialog = true
    },
    // 校验上传文件
    validUploadImg(file) {
      if (this.accept.indexOf(file.type) === -1) {
        this.$alert('上传文件类型错误', 'warning')
        return false
      }
      const flag = file.size / 1024 < this.fileSize
      if (!flag) {
        this.$alert('上传文件超过500k', 'warning')
        return false
      }
      return true
    },
    uploadSuccess(file) {
      // const codeString = file ? file.code.toString() : ''
      console.log(file)
      this.imageUrl = file
      // if (`${codeString[2]}${codeString[3]}` === '10') {
      //   // 文件存储空间不足
      //   return
      // }
      if (file.code === 0) {
        this.getPortalInfo()
        this.$alertMsg(this.$t('portalset.portalsetSet.sucessTip'), 'success')
      } else {
        this.$alertMsg(file.msg, 'error')
      }
    },
    removeImg() {
      this.$alert('是否删除该logo', '删除logo', {
        confirmButtonText: '确定',
        callback: action => {
          this.imageUrl = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  position: relative;
  width: 200px;
  height: 50px;
  border-radius: 6px;
  border: 1px dashed #dddddd;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  box-sizing: content-box;
  &.upload-none-img:hover {
    border-color: #409eff;
  }
  .remove-icon {
    display: none;
    position: absolute;
    width: 30px;
    height: 20px;
    line-height: 20px;
    top: 5px;
    left: 170px;
    cursor: pointer;
    text-align: center;
    z-index: 10;
  }
  .upload-icon,
  .upload-img {
    position: absolute;
    border-radius: 6px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    img {
      width: 100%;
    }
  }
  .upload-img {
    z-index: 2;
  }
  .el-icon-upload {
    font-size: 26px;
    color: #c0c4cc;
    line-height: 50px;
  }
  .upload-text {
    display: inline-block;
    position: relative;
    color: #333333;
    bottom: 4px;
    line-height: 30px;
  }
}
.upload-has-img:hover {
  .remove-icon {
    display: block;
    z-index: 30;
  }
  img {
    border-radius: 6px;
  }
  .upload-icon {
    z-index: 20;
    background: rgba(255, 255, 255, 0.9);
  }
}
.input-upload {
  display: none;
}
</style>
