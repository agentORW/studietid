export function generateNavBar() {
    let navBar = document.createElement('nav');
    navBar.innerHTML = `
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    `;
    return navBar;
}