// JavaScript source code
function setScores(scores) {
    const table = document.getElementById("sco");
    for (let r = 1, row; row = table.rows[r]; r++) {
        for (let c = 1, col; col = row.cells[c]; c++) {
            col.firstElementChild.value = scores[r - 1][c - 1];
        }
    }
}

function importScores() {
    let text = prompt("Scores to import:");
    let c = 0;
    let sc = 0;
    for (let t of text) {
        if (t === ",") {
            c++;
        } else if (t === ";") {
            sc++;
        }
    }
    if (c < 168 || sc < 24) {
        alert("Invalid input.");
        throw Error("Invalid import.")
    }
    let factions = new Array();
    let scores = new Array();
    let number = "";
    let n = 0;
    for (let t of text) {
        if (t === ",") {
            n = parseInt(number);
            scores.push(n);
            number = "";
        } else if (t === ";") {
            n = parseInt(number);
            scores.push(n);
            factions.push(scores);
            scores = new Array();
            number = "";
        } else if (!isNaN(t)) {
            number += t;
        } else {
            alert("Invalid input.");
            throw Error("Invalid import.");
        }
    }
    console.log(factions);
    setScores(factions);
}

function exportScores() {
    const table = document.getElementById("sco");
    let text = "";
    for (let r = 1, row; row = table.rows[r]; r++) {
        for (let c = 1, col; col = row.cells[c]; c++) {
            text += col.firstElementChild.value;
            if (c == 8) {
                text += ";";
            } else {
                text += ",";
            }
        }
    }
    alert("Copy this text into a text editor (such as Notepad):\n" + text);
}

function defaultScores() {
    const scores = [
        //Rd,Or,Yw,Gn,Bu,Pr,Pi,Ba
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Argent Flight
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Arborec
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Barony of Letnev
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Clan of Saar
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Embers of Muaat
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Emirates of Hacan
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Empyrean
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Federation of Sol
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Ghosts of Creuss
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The L1Z1X Mindnet
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Mahact Gene-Sorcerers
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Mentak Coalition
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Naalu Collective
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Naaz-Rokha Alliance
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Nekro Virus
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Nomad
        [ 0, 0, 0, 0, 0, 0, 0, 0],//Sardakk N'orr
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Titans of Ul
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Universities of Jol-Nar
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Vuil'Raith Cabal
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Winnu
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Xxcha Kingdom
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Yin Brotherhood
        [ 0, 0, 0, 0, 0, 0, 0, 0],//The Yssaril Tribes
    ];
    setScores(scores);
}

function randomValues() {
    const table = document.getElementById("sco");
    for (let r = 1, row; row = table.rows[r]; r++) {
        for (let c = 1, col; col = row.cells[c]; c++) {
            col.firstElementChild.value = getRandomNumber(7);
        }
    }
}