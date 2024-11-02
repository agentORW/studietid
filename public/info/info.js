//import { generateNavBar } from "../globalfunctions";
document.title = "Info";
async function generateNavBar() {
    const navbarreq = await fetch('/getnavbar');
    const navbarjson = await navbarreq.json();
    const navbar = navbarjson.navBarList;

    const navbarDoc = document.getElementById('navlist');
    navbarDoc.innerHTML = "";
    navbar.forEach(element => {
        let navButton = document.createElement('li');
        navButton.innerHTML = `<a href="${element.link}">${element.name}</a>`;
        navbarDoc.appendChild(navButton);
    });
    console.log("navbar", navbar)
}

generateNavBar()