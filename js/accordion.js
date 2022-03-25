// JavaScript source code
function toggleDisplay(a) {
    a.classList.toggle("active");
    const p = a.nextElementSibling;
    console.log(a);
    console.log(p);
    if (p.style.display === "none") {
        p.style.display = "flex";
    } else {
        p.style.display = "none";
    }
}