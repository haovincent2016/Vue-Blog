/**
 * Same day 12:34  1.23
 * Yesterday
 * In same week, Monday
 * In same year, 02-06
 * Other year, 2017-02-06
 * @param  {[int]} old_time [timestamp]
 * @return {[string]}       [after conversion]
 */
export const convertMessageTime = (old_time) => {
	const now = new Date(),
		old = new Date(old_time),
		now_year = now.getFullYear(),
		old_year = old.getFullYear(),
		now_month = now.getMonth() + 1,
		old_month = old.getMonth() + 1,
		now_date = now.getDate(),
		old_date = old.getDate(),
		format_month = old_month.toString().padStart(2, '0'),
		format_date = old_date.toString().padStart(2, '0'),
		format_minutes = old.getMinutes().toString().padStart(2, '0'),
		dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

	if (now_year == old_year) {
		if (now_month == old_month && now_date - old_date < 7) {
			if (now_date == old_date) {
				return `${old.getHours()}:${format_minutes}`
			} else if (now_date == old_date + 1) {
				return 'Yesterday'
			} else {
				return dayArr[old.getDay()]
			}
		} else {
			return `${format_month}-${format_date}`
		}
	} else {
		return `${old_year}-${format_month}-${format_date}`
	}
}

/**
 * [chat page]
 * @param  {[type]} old_time [timestamp]
 * @return {[type]}          [description]
 */
export const convertChatTime = (old_time) => {
	const now = new Date(),
		old = new Date(old_time),
		now_year = now.getFullYear(),
		old_year = old.getFullYear(),
		now_month = now.getMonth() + 1,
		old_month = old.getMonth() + 1,
		now_date = now.getDate(),
		old_date = old.getDate(),
		format_hour = old.getHours().toString().padStart(2, '0'),
		format_month = old_month.toString().padStart(2, '0'),
		format_date = old_date.toString().padStart(2, '0'),
		format_minutes = old.getMinutes().toString().padStart(2, '0'),
		dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

	if (now_year != old_year) {
		return `${old_year}-${format_month}-${format_date} ${format_hour}:${format_minutes}`
	}
	if (now_month != old_month || (now_month == old_month && now_date - old_date >= 7)) {
		return `${format_month}-${format_date} ${format_hour}:${format_minutes}`
	}
	if (now_date == old_date) {
		return `${format_hour}:${format_minutes}`
	}
	if (now_date == old_date + 1) {
		return `Yesterday ${format_hour}:${format_minutes}`
	}
	return `${dayArr[old.getDay()]} ${format_hour}:${format_minutes}`
}