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
