const getRandomItemFromArray = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export {
    getRandomItemFromArray
}