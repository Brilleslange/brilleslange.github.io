// JavaScript source code
function getPok() {
    return document.getElementById("pok").checked;
}

function setPok() {
    const exclude = document.getElementsByClassName("pokexclude");
        for (let e of exclude) {
            if (getPok()) {
                e.style.display = "list-item";
            } else {
                e.style.display = "none";
            }
        }
    const combo = document.getElementsByClassName("pokcombo");
    for (let c of combo) {
        if (getPok()) {
            c.style.display = "list-item";
        } else {
            c.style.display = "none";
        }
    }
    const fac = document.getElementsByClassName("pokfac");
    for (let f of fac) {
        if (getPok()) {
            f.style.display = "list-item";
        } else {
            f.style.display = "none";
        }
    }
    const str = document.getElementsByClassName("poktr");
    for (let r of str) {
        if (getPok()) {
            r.style.display = "table-row";
        } else {
            r.style.display = "none";
        }
    }
    const std = document.getElementsByClassName("poktd");
    for (let d of std) {
        if (getPok()) {
            d.style.display = "table-cell";
        } else {
            d.style.display = "none";
        }
    }
    const ran = document.getElementById("ranfac");
    if (getPok()) {
        ran.max = 24;
    } else {
        ran.max = 17;
    }
}