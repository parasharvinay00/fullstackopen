
console.log('Hello from myscript.js')

//it only runs the function(callback) 
// after a specified amount of time (in miliseconds) or once.
setTimeout(() => {
    console.log('I will run only once after 5 seconds.')
}, 5000)


// it runs the provided function (callback) 
// after specified amount of time(in miliseconds) infinitely.
// 1sec = 1000 miliseconds
setInterval(() => {
    console.log("Time is", new Date().toLocaleString('en-IN',
        { timeZone: 'Asia/Kolkata' }))
}, 3_000)

