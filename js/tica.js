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

    //Minimize envy mode
    if (getMode().localeCompare("minenv") == 0) {

        //Find all possible assignment combinations.
        let combos = [];
        function getCombos(temp, start, end, index, r) {
            if (index == r) {
                combos.push([...temp]);
                return;
            }
            for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
                temp[index] = colors[i];
                getCombos(temp, i + 1, end, index + 1, r);
            }
        }
        getCombos(new Array(amount), 0, colors.length - 1, 0, amount);

        //Check if color pairs can be avoided.
        let pairs = [];
        if (getRedOrange()) pairs.push([0, 1]);
        if (getRedYellow()) pairs.push([0, 2]);
        if (getRedGreen()) pairs.push([0, 3]);
        if (getRedBlue()) pairs.push([0, 4]);
        if (getRedPurple()) pairs.push([0, 5]);
        if (getRedPink()) pairs.push([0, 6]);
        if (getRedBlack()) pairs.push([0, 7]);
        if (getOrangeYellow()) pairs.push([1, 2]);
        if (getOrangeGreen()) pairs.push([1, 3]);
        if (getOrangeBlue()) pairs.push([1, 4]);
        if (getOrangePurple()) pairs.push([1, 5]);
        if (getOrangePink()) pairs.push([1, 6]);
        if (getOrangeBlack()) pairs.push([1, 7]);
        if (getYellowGreen()) pairs.push([2, 3]);
        if (getYellowBlue()) pairs.push([2, 4]);
        if (getYellowPurple()) pairs.push([2, 5]);
        if (getYellowPink()) pairs.push([2, 6]);
        if (getYellowBlack()) pairs.push([2, 7]);
        if (getGreenBlue()) pairs.push([3, 4]);
        if (getGreenPurple()) pairs.push([3, 5]);
        if (getGreenPink()) pairs.push([3, 6]);
        if (getGreenBlack()) pairs.push([3, 7]);
        if (getBluePurple()) pairs.push([4, 5]);
        if (getBluePink()) pairs.push([4, 6]);
        if (getBlueBlack()) pairs.push([4, 7]);
        if (getPurplePink()) pairs.push([5, 6]);
        if (getPurpleBlack()) pairs.push([5, 7]);
        if (getPinkBlack()) pairs.push([6, 7]);
        let c;
        for (p of pairs) {
            c = 0;
            while (c < combos.length) {
                if (combos[c].includes(p[0]) && combos[c].includes(p[1])) {
                    combos.splice(c, 1);
                } else {
                    c++;
                }
            }
        }
        if (combos.length == 0) {
            alert("Error calculating color assignments with given pairs to avoid.");
            throw Error("Error calculating color assignments with given pairs to avoid.");
        }

        //If certain colors cannot be included, remove them from the list.
        let removal = colors.slice(0);
        for (c of combos) {
            for (r of c) {
                index = removal.indexOf(r);
                if (index > -1) {
                    removal.splice(index, 1);
                }
            }
        }
        for (r of removal) {
            index = colors.indexOf(r);
            if (index > -1) {
                colors.splice(index, 1);
            }
        }
        if (colors.length < amount) {
            alert("Error calculating color assignments with given pairs to avoid.");
            throw Error("Error calculating color assignments with given pairs to avoid.");
        }

        //Generate random faction order.
        let order = new Array();
        let a;
        let i = 0;
        while (i < amount) {
            a = getRandomNumber(amount);
            if (!order.includes(a)) {
                order.push(a);
                i++;
            }
        }

        //Add dummies to faction list.
        while (factions.length < colors.length) {
            order.push(factions.length);
            factions.push(dummy());
        }

        //Initial assignment
        getAssignment();

        //Remove colors if part of pairs to avoid, then reassign
        let remove = getColorToRemove();
        while (remove > -1) {
            //Remove dummy factions
            for (let f of factions) {
                f.envy.pop();
            }
            factions.pop();
            order.pop();
            //Remove color
            index = colors.indexOf(remove);
            colors.splice(index, 1);
            if (colors.length < amount) {
                alert("Error calculating color assignments with given pairs to avoid.");
                throw Error("Error calculating color assignments with given pairs to avoid.");
            }
            getAssignment();
            remove = getColorToRemove();
        }

        //Helper functions

        function getAssignment() {
            //Give factions their favorite color, in order.
            let remaining = colors.slice(0);
            let chosenColor;
            let chosenScore;
            let score;
            for (let o of order) {
                chosenColor = -1;
                chosenScore = -1;
                for (let c of colors) {
                    if (remaining.includes(c)) {
                        score = factions[o].scores[c];
                        if (score > chosenScore) {
                            chosenColor = c;
                            chosenScore = score;
                        }
                    }
                }
                factions[o].color = chosenColor;
                index = remaining.indexOf(chosenColor);
                remaining.splice(index, 1);
            }
            //Calculate initial envy
            factions = setEnvy(factions);
            //Assign
            let envious = getSwitch(factions);
            let f1;
            let f2;
            while (typeof envious !== "undefined") {
                f1 = envious[0];
                f2 = envious[1];
                c1 = factions[f1].color;
                c2 = factions[f2].color;
                factions[f1].color = c2;
                factions[f2].color = c1;
                factions = setEnvy(factions);
                envious = getSwitch(factions);
            }
        }
        function getColorToRemove() {
            //Find used colors
            let c;
            let selectedColors = new Array();
            let selectedScores = new Array();
            for (let f = 0; f < amount; f++) {
                c = factions[f].color;
                selectedColors.push(c);
                selectedScores.push(Number(factions[f].scores[c]));
            }
            //Sort by color scores
            [selectedColors, selectedScores] = getSorted(selectedColors.slice(0), selectedScores.slice(0), amount - 1);
            //Check if any colors are to be removed
            c = 0;
            let i;
            let j;
            let removeColor = -1;
            let removeScore = -1;
            //For each color, starting with the highest scoring color, check if it is part of one of the pairs to avoid. If the color is part of multiple pairs, select the lowest scoring pairing color.
            while (removeColor == -1 && c < amount) {
                for (let p of pairs) {
                    i = p.indexOf(selectedColors[c]);
                    if (i > -1) {
                        console.log(p);
                        i = Math.abs(i - 1);
                        j = selectedColors.indexOf(p[i]);
                        if (j > -1 && (removeScore == -1 || removeScore > selectedScores[j])) {
                            removeColor = selectedColors[j];
                            removeScore = selectedScores[j];
                            console.log(removeColor);
                            console.log(removeScore);
                        }
                    }
                }
                c++;
            }
            return removeColor;
        }
    }

    //Maximize scores mode
    else if (getMode().localeCompare("maxsco") == 0) {

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
    }

    //Throw an error if no calculation mode is selected.
    else {
        alert("Must select an assignment mode.");
        throw Error("Must select an assignment mode.");
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

//Get assignment mode
function getMode() {
    if (document.getElementById("minenv").checked) {
        return "minenv";
    } else if (document.getElementById("maxsco").checked) {
        return "maxsco";
    } else {
        return "";
    }
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
        color: -1,
        envy: [0, 0, 0, 0, 0, 0, 0, 0]
    }
    return fac;
}

//Generate dummy faction
function dummy(exp) {
    const dummy = {
        name: "Dummy",
        expansion: "dummy",
        scores: [-100, -100, -100, -100, -100, -100, -100, -100],
        color: -1,
        envy: [0, 0, 0, 0, 0, 0, 0, 0]
    }
    return dummy;
}

/*
For each faction, their envy of each other faction is calculated. Faction A's envy of faction B is the difference
between faction A's score for faction B's color and faction A's score for their own color. A positive score
indicates that faction A is envious of faction B, i.e. likes faction B's color better than their own; a negative
score indicates that faction A does not envy faction B, i.e. likes faction B's color less than their own; a score
of zero indicates that faction A likes faction B's color just as much as their own.
*/
function setEnvy(factions) {
    for (let f1 = 0; f1 < factions.length; f1++) {
        for (let f2 = 0; f2 < factions.length; f2++) {
            factions[f1].envy[f2] = factions[f1].scores[factions[f2].color] - factions[f2].scores[factions[f2].color];
        }
    }
    return factions;
}

/*
Checks the envy matrix to see if any two factions would like to switch colors. If a pair of factions is found
where faction A and B both envy each other (their envy scores for each other are both positive), or faction A
envies faction B's color more than faction B dislikes faction A's color (faction A's envy score for faction B is
positive and faction B's envy score for faction A is negative, but the combined score is positive), then
faction A and faction B switch colors and the function returns True. Otherwise, the function returns False.
*/
function getSwitch(factions) {
    const amount = factions.length;
    for (let f1 = 0; f1 < amount; f1++) {
        for (let f2 = 0; f2 < amount; f2++) {
            if (factions[f1].envy[f2] + factions[f2].envy[f1] > 0) {
                return [f1, f2];
            }
        }
    }
}

//Sort list
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