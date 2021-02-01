const getSchoolCode = (path) => {
	if (path.indexOf('canpointlive.com') > -1) {
		return 'CANPOINT'
	} else if (path.indexOf('ai2.canpoint.net') > -1) {
		return 'SCCDSHZX'
	} else {
		return 'CANPOINT'
	}
}
export default getSchoolCode