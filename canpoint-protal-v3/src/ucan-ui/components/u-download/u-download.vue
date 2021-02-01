<template>
  <div class="download-file">
    <u-button :icon="hasIcon ? 'download' : ''" :type="buttonType" @click="exportClick">{{ title }}</u-button>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Download',
  props: {
    title: {
      // 按钮标题
      type: String,
      default: '下载'
    },
    fileName: {
      // 自定义文件名
      type: String,
      default: ''
    },
    fileType: {
      // 下载文件类型：支持zip压缩文件和xls等office文件下载
      type: String,
      default: ''
    },
    hasIcon: {
      // 是否有图标
      type: Boolean,
      default: true
    },
    buttonType: {
      // 按钮类型
      type: String,
      default: 'light'
    },
    reqObj: {
      // 请求信息： url请求地址，params请求参数
      type: Object,
      default: () => {
        return {
          url: '',
          method: '',
          params: {}
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  methods: {
    exportClick() {
      const loading = this.$message.loading('加载中...', 0)
      try {
        axios
          .request({
            url: this.reqObj.url,
            method: this.reqObj.method,
            data: this.reqObj.params,
            responseType: this.fileType === 'zip' ? 'arraybuffer' : 'blob'
          })
          .then(res => {
            setTimeout(loading, 0)
            const filename = res.headers['content-disposition']
            if (this.fileType === 'zip') {
              const data = res.data
              const blob = new Blob([data], {
                type: 'application/zip;charset=UTF-8'
              })
              const url = window.URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              if (this.fileName) {
                link.setAttribute('download', `${this.fileName}.${this.fileType}`)
              } else {
                link.setAttribute('download', filename.split('=')[1])
              }
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              this.$message.success(`${this.title}成功`)
            } else {
              // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
              console.log(res)
              const BLOB = res.data
              // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
              const fileReader = new FileReader()
              // 开始读取指定的Blob中的内容。读取完成result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
              fileReader.readAsDataURL(BLOB)
              // 处理load事件，该事件在读取操作完成时触发
              fileReader.onload = event => {
                const a = document.createElement('a')
                if (this.fileName) {
                  a.download = `${this.fileName}.${this.fileType}`
                } else {
                  a.download = filename.split('=')[1]
                }
                a.href = event.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                this.$message.success(`${this.title}成功`)
              }
            }
          })
      } catch (err) {
        setTimeout(loading, 0)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
