export const downloadFile = (url, type) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = type;
  a.click();
}

export const throttle = (func, delay) => {
  let timer;
  let lastExecTime = 0;
  return function() {
    const context = this;
    const args = arguments;
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime < delay) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        lastExecTime = currentTime;
        func.apply(context, args);
      }, delay);
    } else {
      lastExecTime = currentTime;
      func.apply(context, args);
    }
  };
}

export const debounce = (fn, delay) => {
  let timer;
  return function(){
    clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this, arguments)
    },delay)
  }
}
