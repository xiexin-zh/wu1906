import {actions, store, setStore} from '../../store/index.js'
import $tools from '@u/tools'
import eventBus from '@u/eventBus'
const initData = {
	/**
	 * @description 已读消息
	 * @param {}  
	 */
	async readNotice (noticeCodes) {
		await actions.readPersonNotice({
			eduCode: store.userInfo.schoolCode,
			noticeCodes: [noticeCodes],
			userCode: store.userInfo.userCode
		})
		const index = $tools.getQuery().get('index') || 2
		const oldTotal = store.noticeTotal[index]
		const newTotal = oldTotal - 1 <= 0 ? 0 : oldTotal - 1
		const newArr = JSON.parse(JSON.stringify(store.noticeTotal))
		newArr[index] = newTotal
		console.log(newArr)
		eventBus.$emit('showTotal', '')
		setStore({
			noticeTotal: newArr
		})
	}
}

export default initData