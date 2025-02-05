alert("javascript loading");
    window.addEventListener("deviceorientation", function (event) {
        document.getElementById("alpha").textContent = event.alpha
        document.getElementById("beta").textContent = event.beta
        document.getElementById("gamma").textContent = event.gamma
        array_devicerotation = {
            "alpha" : event.alpha,
            "beta" : event.beta,
            "gamma" : event.gamma
        };
        console.log(event);
    }, false);
