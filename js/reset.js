function resetInput() {

    //Reset checkboxes
    const checkboxes = document.getElementsByTagName("input");
    for (let cb of checkboxes) {
        if (cb.type == "checkbox") {
            cb.checked = false;
        }
    }
    const pok = document.getElementById("pok");
    pok.checked = true;

    //Reset numbers
    const number = document.getElementById("ranfac");
    number.value = 0;
}

function resetFactions() {
    const checkboxes = document.getElementsByName("fac");
    for (let cb of checkboxes) {
        cb.checked = false;
    }
}

function resetPok() {
    const pok = document.getElementById("pok").value;
    if (!pok) {
        const checkboxes = document.getElementsByName("fac");
        for (let cb of checkboxes) {
            if (cb.parentElement.className == "pokfac") {
                cb.checked = false;
            }
        }
    }
}