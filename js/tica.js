function assignColors() {

    //Remove existing colors
    let id;
    for (let t = 1; t <= 8; t++) {
        id = "row" + t;
        document.getElementById(id).style.display = "none";
    }

    //Find which factions have been selected.
    //If PoK factions have been selected but PoK is unchecked, discard those factions.
    let cb;
    let pokfac;
    let label;
    let names = new Array();
    const list = document.getElementsByName("fac");
    for (let l of list) {
        if (l.checked) {
            pokfac = (l.parentElement.className === "pokfac");
            if (!(pokfac && !getPok())) {
                label = l.nextElementSibling.innerText;
                names.push(label);
            }
        }
    }
    let amount = names.length;

    //Validate amount of factions.
    if (amount < 3) {
        alert("Must select 3 or more factions.");
        throw Error("Must select 3 or more factions.");
    } else if (!getPok() && amount > 6) {
        alert("Must select 6 or fewer factions.");
        throw Error("Must select 6 or fewer factions.");
    } else if (getPok() && amount > 8) {
        alert("Must select 8 or fewer factions.");
        throw Error("Must select 8 or fewer factions.");
    }

    //Create color list.
    let colors;
    if (getPok()) {
        colors = [0, 1, 2, 3, 4, 5, 6, 7];
    } else {
        colors = [0, 2, 3, 4, 5, 7];
    }

    //Exclude colors.
    let index;
    if (getExcludeRed()) {
        index = colors.indexOf(0);
        colors.splice(index, 1);
    }
    if (getExcludeOrange()) {
        index = colors.indexOf(1);
        colors.splice(index, 1);
    }
    if (getExcludeYellow()) {
        index = colors.indexOf(2);
        colors.splice(index, 1);
    }
    if (getExcludeGreen()) {
        index = colors.indexOf(3);
        colors.splice(index, 1);
    }
    if (getExcludeBlue()) {
        index = colors.indexOf(4);
        colors.splice(index, 1);
    }
    if (getExcludePurple()) {
        index = colors.indexOf(5);
        colors.splice(index, 1);
    }
    if (getExcludePink()) {
        index = colors.indexOf(6);
        colors.splice(index, 1);
    }
    if (getExcludeBlack()) {
        index = colors.indexOf(7);
        colors.splice(index, 1);
    }

    //Check if there are enough remaining colors.
    if (colors.length < amount){
        alert("Too many colors excluded.");
        throw Error("Too many colors excluded.");
    }

    //Create faction list.
    let factions = new Array();
    for (n of names) {
        factions.push(faction(n));
    }

    //Find all possible assignment permutations.
    let permColors = [];
    let permScores = [];
    function getPerms(temp) {
        if (temp.length == amount) {
            if (getRedOrange() && temp.includes(0) && temp.includes(1)) return;
            if (getRedYellow() && temp.includes(0) && temp.includes(2)) return;
            if (getRedGreen() && temp.includes(0) && temp.includes(3)) return;
            if (getRedBlue() && temp.includes(0) && temp.includes(4)) return;
            if (getRedPurple() && temp.includes(0) && temp.includes(5)) return;
            if (getRedPink() && temp.includes(0) && temp.includes(6)) return;
            if (getRedBlack() && temp.includes(0) && temp.includes(7)) return;
            if (getOrangeYellow() && temp.includes(1) && temp.includes(2)) return;
            if (getOrangeGreen() && temp.includes(1) && temp.includes(3)) return;
            if (getOrangeBlue() && temp.includes(1) && temp.includes(4)) return;
            if (getOrangePurple() && temp.includes(1) && temp.includes(5)) return;
            if (getOrangePink() && temp.includes(1) && temp.includes(6)) return;
            if (getOrangeBlack() && temp.includes(1) && temp.includes(7)) return;
            if (getYellowGreen() && temp.includes(2) && temp.includes(3)) return;
            if (getYellowBlue() && temp.includes(2) && temp.includes(4)) return;
            if (getYellowPurple() && temp.includes(2) && temp.includes(5)) return;
            if (getYellowPink() && temp.includes(2) && temp.includes(6)) return;
            if (getYellowBlack() && temp.includes(2) && temp.includes(7)) return;
            if (getGreenBlue() && temp.includes(3) && temp.includes(4)) return;
            if (getGreenPurple() && temp.includes(3) && temp.includes(5)) return;
            if (getGreenPink() && temp.includes(3) && temp.includes(6)) return;
            if (getGreenBlack() && temp.includes(3) && temp.includes(7)) return;
            if (getBluePurple() && temp.includes(4) && temp.includes(5)) return;
            if (getBluePink() && temp.includes(4) && temp.includes(6)) return;
            if (getBlueBlack() && temp.includes(4) && temp.includes(7)) return;
            if (getPurplePink() && temp.includes(5) && temp.includes(6)) return;
            if (getPurpleBlack() && temp.includes(5) && temp.includes(7)) return;
            if (getPinkBlack() && temp.includes(6) && temp.includes(7)) return;
            permColors.push([...temp]);
            let s = 0;
            let t = 0;
            while (t < amount) {
                s = s + Number(factions[t].scores[temp[t]]);
                t++;
            }
            permScores.push(s);
            return;
        }
        for (let c of colors) {
            if (!temp.includes(c)) {
                getPerms([...temp, c]);
            }
        }
    }
    getPerms([]);
    if (permColors.length == 0) {
        alert("Error calculating color assignments with given pairs to avoid.");
        throw Error("Error calculating color assignments with given pairs to avoid.");
    }

    //Find max scoring permutations and remove all others from list
    let maxScore = Math.max(...permScores);
    let p = 0;
    while (p < permScores.length) {
        if (permScores[p] < maxScore) {
            permScores.splice(p, 1);
            permColors.splice(p, 1);
        }
        else {
            p++;
        }
    }

    //Assign colors. If more than one permutation is valid, select a random one.
    let perm = permColors[getRandomNumber(permColors.length - 1)];
    for (let f = 0; f < amount; f++) {
        factions[f].color = perm[f];
    }

    //Show results
    let color;
    for (let f = 0; f < names.length; f++) {
        rowId = "row" + (f+1);
        row = document.getElementById("row" + (f + 1));
        fac = document.getElementById("faction" + (f + 1));
        col = document.getElementById("color" + (f + 1));
        fac.innerHTML = factions[f].name;
        color = getColor(factions[f].color);
        col.innerHTML = "<div><span class='square " + color.toLowerCase() + "'></span> " + color + "</div>";
        row.style.display = "table-row";
    }

    //Assign speaker
    if (getSpeaker()) {
        spk = getRandomNumber(names.length);
        fac = document.getElementById("faction" + (spk + 1));
        fac.innerHTML = "<strong>SPEAKER:</strong>" + fac.innerHTML;
    }
}

//Get speaker choice
function getSpeaker() {
    return document.getElementById("speaker").checked;
}

//Get colors to exclude
function getExcludeRed() {
    return document.getElementById("exclred").checked;
}
function getExcludeOrange() {
    return document.getElementById("exclora").checked;
}
function getExcludeYellow() {
    return document.getElementById("exclyel").checked;
}
function getExcludeGreen() {
    return document.getElementById("exclgre").checked;
}
function getExcludeBlue() {
    return document.getElementById("exclblu").checked;
}
function getExcludePurple() {
    return document.getElementById("exclpur").checked;
}
function getExcludePink() {
    return document.getElementById("exclpin").checked;
}
function getExcludeBlack() {
    return document.getElementById("exclbla").checked;
}

//Get color pairs to avoid
function getRedOrange() {
    return document.getElementById("redora").checked;
}
function getRedYellow() {
    return document.getElementById("redyel").checked;
}
function getRedGreen() {
    return document.getElementById("redgre").checked;
}
function getRedBlue() {
    return document.getElementById("redblu").checked;
}
function getRedPurple() {
    return document.getElementById("redpur").checked;
}
function getRedPink() {
    return document.getElementById("redpin").checked;
}
function getRedBlack() {
    return document.getElementById("redbla").checked;
}
function getOrangeYellow() {
    return document.getElementById("orayel").checked;
}
function getOrangeGreen() {
    return document.getElementById("oragre").checked;
}
function getOrangeBlue() {
    return document.getElementById("orablu").checked;
}
function getOrangePurple() {
    return document.getElementById("orapur").checked;
}
function getOrangePink() {
    return document.getElementById("orapin").checked;
}
function getOrangeBlack() {
    return document.getElementById("orabla").checked;
}
function getYellowGreen() {
    return document.getElementById("yelgre").checked;
}
function getYellowBlue() {
    return document.getElementById("yelblu").checked;
}
function getYellowPurple() {
    return document.getElementById("yelpur").checked;
}
function getYellowPink() {
    return document.getElementById("yelpin").checked;
}
function getYellowBlack() {
    return document.getElementById("yelbla").checked;
}
function getGreenBlue() {
    return document.getElementById("greblu").checked;
}
function getGreenPurple() {
    return document.getElementById("grepur").checked;
}
function getGreenPink() {
    return document.getElementById("grepin").checked;
}
function getGreenBlack() {
    return document.getElementById("grebla").checked;
}
function getBluePurple() {
    return document.getElementById("blupur").checked;
}
function getBluePink() {
    return document.getElementById("blupin").checked;
}
function getBlueBlack() {
    return document.getElementById("blubla").checked;
}
function getPurplePink() {
    return document.getElementById("purpin").checked;
}
function getPurpleBlack() {
    return document.getElementById("purbla").checked;
}
function getPinkBlack() {
    return document.getElementById("pinbla").checked;
}

//Sort lists
function getSorted(colorsList, scoresList, n) {
    let i, c, s;
    if (n > 0) {
        getSorted(colorsList, scoresList, n - 1);
        c = colorsList[n];
        s = scoresList[n];
        i = n - 1;
        while (i >= 0 && scoresList[i] < s) {
            colorsList[i + 1] = colorsList[i];
            scoresList[i + 1] = scoresList[i];
            i--;
        }
        colorsList[i + 1] = c;
        scoresList[i + 1] = s;
    }
    return [colorsList, scoresList];
}

//Generate faction
function faction(name) {
    let expansion;
    let scores = new Array();
    const table = document.getElementById("sco");
    for (let r = 1, row; row = table.rows[r]; r++) {
        if (row.cells[0].innerText === name) {
            if (row.className === "poktr") {
                expansion = "pok";
            } else {
                expansion = "none";
            }
            for (let c = 1, col; col = row.cells[c]; c++) {
                scores.push(col.firstElementChild.value);
            }
        }
    }
    const fac = {
        name: name,
        expansion: expansion,
        scores: scores,
        color: -1
    }
    return fac;
}

//Gets color name
function getColor(c) {
    switch (c) {
        case 0:
            return "Red";
        case 1:
            return "Orange";
        case 2:
            return "Yellow";
        case 3:
            return "Green";
        case 4:
            return "Blue";
        case 5:
            return "Purple";
        case 6:
            return "Pink";
        case 7:
            return "Black";
    }
}