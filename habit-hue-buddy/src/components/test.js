let timer;
function sendbackend(){
    clearTimeout(timer);

    timer=setTimeout(()=>{
console.log("datasent to backend")
    },1500)
}
sendbackend();
setTimeout(sendbackend,1000);
setTimeout(sendbackend,2000);
setTimeout(sendbackend,3000);
setTimeout(sendbackend,4000);
setTimeout(sendbackend,5000);

// setTimeout(sendbackend, 1000);

// setTimeout(sendbackend, 2000);

// setTimeout(sendbackend, 5000);