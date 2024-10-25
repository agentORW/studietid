export function generateNavBar() {
    let request = fetch('/getnavbar')
    const navbar = document.querySelector('navbar')
    navbar.innerHTML = request;
}