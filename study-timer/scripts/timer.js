let i
start.onclick = function workfunc() {
    start.textContent="ストップ"
    start.id="stopbtn"
    min.textContent=work.value
    sec.textContent="00"
    document.body.style.backgroundColor = "pink"
    i = timer(restfunc)
    function restfunc() {
        min.textContent=rest.value
        sec.textContent="00"
        document.body.style.backgroundColor = "#00ffff"
        i = timer(workfunc)
    }
}
function timer(f) {
    return setInterval(() => {
        if (sec.textContent--<2) {
            if (min.textContent--<1) {
                clearInterval(i)
                setTimeout(f)
            }else {sec.textContent="59"}
        }
        if (sec.textContent<10) {
            sec.textContent="0"+sec.textContent
        }
    }, 1000);
}
stopbtn.onclick = function() {
    clearInterval(i)
    stopbtn.textContent="スタート"
    stopbtn.id="start"
    min.textContent=work.value
}