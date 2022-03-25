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
    //Create faction list.
    let factions = new Array();
    for (n of names) {
        factions.push(faction(n));
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
    //Add dummies.
    while (factions.length < 6) {
        order.push(factions.length);
        factions.push(dummy("none"));
    }
    while (getPok() && factions.length < 8) {
        order.push(factions.length);
        factions.push(dummy("pok"));
    }
    //Create color list.
    let colors;
    if (getPok()) {
        colors = [0, 1, 2, 3, 4, 5, 6, 7];
    } else {
        colors = [0, 2, 3, 4, 5, 7];
    }
    //Check if color combos can be avoided.
    let combos = [
        (getRedOrange() && getPok()),
        (getRedPink() && getPok()),
        (getOrangeYellow() && getPok()),
        getBlueBlack(),
        (getPurplePink() && getPok())
    ];
    let index;
    if ((!getPok() && amount > 5 && getBlueBlack()) ||
        (getPok() && amount > 7 && combos.includes(true)) ||
        (getPok() && amount > 6 && (
            (getBlueBlack() && (getRedOrange() || getRedPink() || getOrangeYellow() || getPurplePink())) ||
            (getRedOrange() && getPurplePink()) ||
            (getRedPink() && getOrangeYellow()) ||
            (getOrangeYellow() && getPurplePink()))) ||
        (getPok() && amount > 5 && (
            (getRedPink() && getOrangeYellow() && getBlueBlack()) ||
            (getRedOrange() && getRedPink() && getBlueBlack() && (getOrangeYellow() || getPurplePink())))
        )) {
        for (let c = 0; c < combos.length; c++) {
            combos[c] = false;
        }
        alert("Too many players to avoid color combo(s).")
    } else if (getPok() && amount > 6 && getRedOrange() && getRedPink()) {
        setColor(0);
    } else if (getPok() && amount > 6 && getRedOrange() && getOrangeYellow()) {
        setColor(1);
    } else if (getPok() && amount > 6 && getRedPink() && getPurplePink()) {
        setColor(6);
    } else if (getPok() && amount > 5 && getRedOrange() && getRedPink() && getOrangeYellow() && getPurplePink()) {
        setColor(1);
        setColor(6);
    } else if (getPok() && amount > 5 && getRedOrange() && getRedPink() && getBlueBlack()) {
        setColor(0);
    } else if (getPok() && amount > 5 && getRedOrange() && getOrangeYellow() && (getBlueBlack() || getPurplePink())) {
        setColor(1);
    } else if (getPok() && amount > 5 && getRedPink() && (getOrangeYellow() || getBlueBlack()) && getPurplePink()) {
        setColor(6);
    } else if (getPok() && amount > 4 && !combos.includes(false)) {
        setColor(1);
        setColor(6);
    } else if (getPok() && amount > 4 && getRedOrange() && getOrangeYellow() && getBlueBlack() && getPurplePink()) {
        setColor(1);
    } else if (getPok() && amount > 4 && getRedPink() && getOrangeYellow() && getBlueBlack() && getPurplePink()) {
        setColor(6);
    }
    //Assign
    getAssignment();
    if (combos.includes(true)) {
        setCombos();
    }
    while (combos.includes(true)) {
        excludeColors();
        if (factions.length < amount) {
            alert("Error calculating color assignments with given combos to avoid.");
            throw Error("Error calculating color assignments with given combos to avoid.");
        }
        getAssignment();
        setCombos();
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
    function setCombos() {
        //Find used colors
        let selected = new Array();
        for (let f = 0; f < amount; f++) {
            selected.push(factions[f].color);
        }
        //Check combos
        if (getRedOrange()) {
            if (selected.includes(0) && selected.includes(1)) {
                combos[0] = true;
            } else {
                combos[0] = false;
            }
        } if (getRedPink()) {
            if (selected.includes(0) && selected.includes(6)) {
                combos[1] = true;
            } else {
                combos[1] = false;
            }
        } if (getOrangeYellow()) {
            if (selected.includes(1) && selected.includes(2)) {
                combos[2] = true;
            } else {
                combos[2] = false;
            }
        } if (getBlueBlack()) {
            if (selected.includes(4) && selected.includes(7)) {
                combos[3] = true;
            } else {
                combos[3] = false;
            }
        } if (getPurplePink()) {
            if (selected.includes(5) && selected.includes(6)) {
                combos[4] = true;
            } else {
                combos[4] = false;
            }
        }
    }
    function excludeColors() {
        //Find used colors
        let selected = new Array();
        for (let f = 0; f < amount; f++) {
            selected.push(factions[f].color);
        }
        //Sort by color scores
        let sorted = getSorted(factions.slice(0), selected.length - 1);
        let found = false;
        let s = 0;
        if (combos.includes(true)) {
            while (!found && s < sorted.length) {
                chosenColor = sorted[s].color;
                if (chosenColor == 0) {
                    if (getRedOrange() && selected.includes(1)) {
                        setColor(1);
                        combos[0] = false;
                        found = true;
                    }
                    if (getRedPink() && selected.includes(6)) {
                        setColor(6);
                        combos[1] = false;
                        found = true;
                    }
                } else if (chosenColor == 1) {
                    if (getRedOrange() && selected.includes(0)) {
                        setColor(0);
                        combos[0] = false;
                        found = true;
                    }
                    if (getOrangeYellow() && selected.includes(2)) {
                        setColor(2);
                        combos[2] = false;
                        found = true;
                    }
                } else if (chosenColor == 2) {
                    if (getOrangeYellow() && selected.includes(1)) {
                        setColor(1);
                        combos[2] = false;
                        found = true;
                    }
                } else if (chosenColor == 4) {
                    if (getBlueBlack() && selected.includes(7)) {
                        setColor(7);
                        combos[3] = false;
                        found = true;
                    }
                } else if (chosenColor == 5) {
                    if (getPurplePink() && selected.includes(6)) {
                        setColor(6);
                        combos[4] = false;
                        found = true;
                    }
                } else if (chosenColor == 6) {
                    if (getRedPink() && selected.includes(0)) {
                        setColor(0);
                        combos[1] = false;
                        found = true;
                    }
                    if (getPurplePink() && selected.includes(5)) {
                        setColor(5);
                        combos[4] = false;
                        found = true;
                    }
                } else if (chosenColor == 7) {
                    if (getBlueBlack() && selected.includes(4)) {
                        setColor(4);
                        combos[3] = false;
                        found = true;
                    }
                }
                s++;
            }
        }
    }
    function setColor(color) {
        for (let f of factions) {
            f.envy.pop();
        }
        factions.pop();
        order.pop();
        index = colors.indexOf(color);
        colors.splice(index, 1);
    }
}

//Get speaker choice
function getSpeaker() {
    return document.getElementById("speaker").checked;
}

//Get color combos to avoid
function getRedOrange() {
    return document.getElementById("redora").checked;
}
function getRedPink() {
    return document.getElementById("redpin").checked;
}
function getOrangeYellow() {
    return document.getElementById("orayel").checked;
}
function getBlueBlack() {
    return document.getElementById("blubla").checked;
}
function getPurplePink() {
    return document.getElementById("purpin").checked;
}

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

function dummy(exp) {
    const dummy = {
        name: "Dummy",
        expansion: exp,
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

function getSorted(list, n) {
    let i,l;
    if (n > 0) {
        getSorted(list, n - 1);
        l = list[n];
        i = n - 1;
        while (i >= 0 && list[i].scores[list[i].color] < l.scores[l.color]) {
        //while (i >= 0 && list[i] < l) {
            list[i + 1] = list[i];
            i--;
        }
        list[i + 1] = l;
    }
    return list;
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