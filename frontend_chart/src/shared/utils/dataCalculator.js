export const standardDeviation = (arr, average, usePopulation = false) => {
    return Math.sqrt(
        variance(arr, average, usePopulation)
    );
};

const variance = (arr, average, usePopulation = false) => {
    const sumOfSquareDifferenceFromAvg = arr.reduce(
        (acc, val) => acc + ((val - average) ** 2),
        0   // initial value -> assigned to acc
    );

    return sumOfSquareDifferenceFromAvg / (arr.length - (usePopulation ? 0 : 1));
};
