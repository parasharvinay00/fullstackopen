let promise1 = new Promise(function (resolve, reject) {
    // the function is executed automatically when the promise is constructed

    // after 5 second signal that the job is done with the result "done"
    setTimeout(() => resolve("I AM RESOLVED"), 5000);
});
console.log('promise1?', promise1);

// resolve runs the first function in .then
promise1.then(result => {
    console.log("promise1 (then)?", result); // shows "I AM RESOLVED!" after 5 second
}).catch(error => {
    console.log("promise1 (catch)?", error); // doesn't run
}).finally(() => {
    console.log('promise1 (finally) - I will run always in last')
});

let promise2 = new Promise(function (resolve, reject) {
    // after 10 second signal that the job is finished with an error
    setTimeout(() => reject("I AM REJECTED"), 10000);
});
console.log('promise2?', promise2);
promise2.then(result => {
    console.log("promise2 (then)?", result);
}).catch(error => {
    console.log("promise2 (catch)?", error);
}).finally(() => {
    console.log('promise2 (finally) - I will run always in last')
});



