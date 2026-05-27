var arr = [1,2,3,4,5];


var reverseArr=function(arr){
    
    var ans = [];

    let i = arr.length;
    while(i--){
        ans.push(arr[i]);
    

    }
    return ans;
};

console.log(reverseArr(arr));
