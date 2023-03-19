export const logError = (error) =>
	console.error(
		`%cERROR: %c${error.name} %c${error.message}`,
		'color: red; font-weight: bold;',
		'color: black;',
		'font-weight: normal;'
	)
export const logMsg = (msg, data = undefined) =>
	console.log(
		`%c${msg}: %c${data ? data : ''}`,
		'font-weight: bold;',
		'font-weight: normal;'
	)
