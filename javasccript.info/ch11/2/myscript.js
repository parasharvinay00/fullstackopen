let promise1 = new Promise(function (resolve, reject) {
    // the function is executed automatically when the promise is constructed

    // after 5 second signal that the job is done with the result "done"
    setTimeout(() => resolve("done"), 5000);
});
console.log('promise1?', promise1);

// resolve runs the first function in .then
promise1.then(result => {
    console.log("promise1?", result); // shows "done!" after 5 second
}).catch(error => {
    console.log("promise1?", error); // doesn't run
});

let promise2 = new Promise(function (resolve, reject) {
    // after 10 second signal that the job is finished with an error
    setTimeout(() => reject(new Error("Whoops!")), 10000);
});
console.log('promise2?', promise2);
promise2.then(
    result => console.log("promise2?", result), // shows "done!" after 10 second
).catch(error => {
    console.log("promise2?", error); // doesn't run
});