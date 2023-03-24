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
    prompt("Copy this text string and save it somewhere safe:",text);
}

function defaultScores() {
    const scores = [
       //Rd,Or,Yw,Gn,Bu,Pr,Pi,Ba
        [ 1, 2, 6,10, 0, 1, 0, 2],//The Arborec
        [ 2,10, 2, 7, 2, 2, 0, 1],//The Argent Flight
        [ 8, 2, 0, 1, 4, 0, 0, 9],//The Barony of Letnev
        [ 1, 9, 8, 1, 0, 1, 0, 2],//The Clan of Saar
        [ 8, 9, 4, 0, 0, 0, 0, 4],//The Embers of Muaat
        [ 4, 8, 9, 0, 0, 0, 0, 1],//The Emirates of Hacan
        [ 7, 4, 1, 0, 2, 9, 3, 5],//The Empyrean
        [ 2, 0, 8, 2, 9, 0, 0, 1],//The Federation of Sol
        [ 0, 1, 0, 1,10, 2, 1, 7],//The Ghosts of Creuss
        [ 8, 1, 0, 1, 9, 0, 0, 8],//The L1Z1X Mindnet
        [ 1, 0,10, 0, 0, 7, 2, 1],//The Mahact Gene-Sorcerers
        [ 0, 9, 9, 0, 0, 4, 0, 8],//The Mentak Coalition
        [ 0, 9, 9, 8, 0, 1, 0, 1],//The Naalu Collective
        [ 1, 0, 7,10, 0, 1, 0, 2],//The Naaz-Rokha Alliance
        [10, 1, 1, 0, 1, 1, 0, 4],//The Nekro Virus
        [ 1, 1, 2, 1, 8, 8, 7, 4],//The Nomad
        [ 9, 0, 2, 4, 0, 0, 0, 8],//Sardakk N'orr
        [ 0, 0, 1, 1, 1, 4,10, 1],//The Titans of Ul
        [ 0, 0, 1, 2, 8, 9, 4, 1],//The Universities of Jol-Nar
        [10, 6, 1, 0, 0, 0, 0, 6],//The Vuil'Raith Cabal
        [ 6, 8, 8, 2, 0, 9, 1, 1],//The Winnu
        [ 0, 1, 4,10, 6, 1, 0, 2],//The Xxcha Kingdom
        [ 0, 1, 7, 0, 0, 8, 4, 5],//The Yin Brotherhood
        [ 7, 1, 8, 9, 0, 2, 0, 6],//The Yssaril Tribes
    ];
    setScores(scores);
}