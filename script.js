let phdLink = document.getElementById("phd-link");
let phdWindow = document.getElementById("phd-window");
let closeButton = document.getElementById("close");

phdLink.addEventListener("click", function (event) {
    event.preventDefault();
    phdWindow.style.display = "block";
});

closeButton.addEventListener("click", function () {
    phdWindow.style.display = "none";
});