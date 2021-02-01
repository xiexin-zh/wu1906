/**
 * @description 基础表单验证
 * @params {object} yzForm 表单验证数据提示语
 * @params {object} form 表单数据
 * @params {object} callBack 表单验证成功的回调函数
 */
const validateForm = (yzForm, form, callBack) => {
  for (let val in form) {
    if (yzForm.hasOwnProperty(val)) {
      if (form[val] === '' || JSON.stringify(form[val]) === '[]' || JSON.stringify(form[val]).indexOf('请选择') > -1) {
				uni.showToast({
					title: yzForm[val],
					icon: 'none'
				});
        return
      }
    }
  }
  callBack()
}

export default validateForm
