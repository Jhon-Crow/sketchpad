export function doSeveralTimes(callback, times){
    const results = new Array(times);
    for (let i = 0; i < times; i++){
        results[i] = callback();
    }
    return results;
}