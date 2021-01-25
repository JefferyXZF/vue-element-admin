
export default {
  methods: {
    /**
     * 上传change
     * @param e {Event} 事件
     */
    uploadChange(e) {
      const obj = e.target
      if (obj) {
        this.uploadFiles(obj)
      }
    },

    // 触发文件上传
    uploadImg() {
      this.$refs.input.value = null
      this.$refs.input.click()
    },

    createImage(file) {
      const URL = window.URL || window.webkitURL
      const img = new Image()
      img.src = URL.createObjectURL(file)
      return img.src
    }
  }
}
