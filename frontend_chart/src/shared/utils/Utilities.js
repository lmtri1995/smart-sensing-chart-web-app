import moment from "moment";

export const changeNumberFormat = (input, suffix = "") => {
    let result = input;
    if (typeof input == 'number'){
        result = Math.round(input * 100)/100
        result = result.toLocaleString('en') + suffix;
    } else {
        result = "-";
    }
    return result;
};


export const specifyCurrentShift = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();
    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();
    //shift 1: 6:00 am - 2:00 pm
    //shift 2: 2:00 am - 20:00 pm
    //shift 3: 20:00 pm - 6:00 am
    let currentTime = moment.utc([yyyy, mm, dd, hour, minute, second]).unix();
    let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
    let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
    let shift2From = shift1To;
    let shift2To = moment.utc([yyyy, mm, dd, 22, 0, 0]).unix();
    //let shift3From = shift2To;
    //let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

    let result = 0;
    if (currentTime >= shift1From && currentTime < shift1To) {
        result = 1;
    } else if (currentTime >= shift2From && currentTime < shift2To) {
        result = 2;
    } else {
        result = 3;
    }

    return result;
}
