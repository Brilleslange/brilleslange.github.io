function getRandomNumber(number) {
    if (isNaN(number)) {
        throw Error("You must select a number.");
    } else {
        return Math.floor(Math.random() * number);
    }
}

function randomFactions() {
    const number = document.getElementById("ranfac").value;
    const pok = getPok();
    if (isNaN(number)) {
        alert("You must enter a number.");
        throw Error("You must enter a number.");
    } else if (number < 0) {
        alert("You must enter a positive number.");
        throw Error("You must enter a positive number.");
    } else if (!pok && number > 17) {
        alert("Cannot select more than 17 factions.");
        throw Error("Cannot select more than 17 factions.");
    } else if (pok && number > 24) {
        alert("Cannot select more than 24 factions.");
        throw Error("Cannot select more than 24 factions.");
    } else {
        const fac = document.getElementsByName("fac");
        for (let f of fac) {
            f.checked = false;
        }
        let n = 0;
        while (n < number) {
            let r = getRandomNumber(24)
            if (!(fac[r].checked || (!pok && fac[r].parentElement.className=="pokfac"))) {
                fac[r].checked = true;
                n++;
            }
        }
    }
}