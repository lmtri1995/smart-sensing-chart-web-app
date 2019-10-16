import moment from "moment";

//flag: start => get 12:00 am of input date
//flag: end  => get 23:59 of the input date
export const changeDateToUnix = (inputDate, flag = "start") => {
	let result = moment(inputDate).startOf("date").unix();
	if (flag == "end"){
		result = moment(inputDate).endOf("date").unix();
	}
	return result;
}

export const changeStringToDate = (text) => {
	let day = text.substring(0, 2);
	let month = text.substring(3, 5);
	let year = text.substring(6, 10);
	let result = new Date(year, parseInt(month) - 1, day);
	return result;
}

export const findThreeLargest = (array) => {
	let first = 0, second = 0, third = 0;
	for (let i = 0; i < array.length; i++){
		let x = array[i];
		if (x > first){
			third = second;
			second = first;
			first = x;
		} else if (x > second){
			third = second;
			second = x;
		} else if (x > third){
			third = x;
		}
	}
	return [first, second, third];
}

export const countTotal = (array) => {
	let result = array.reduce((total, current) => {
		return total += current;
	})
	return result;
}
