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
}

generateNavBar()

async function displayUserActivity () {
    try {
        const response = await fetch('/getactivity');
        const data = await response.json();

        let table = document.getElementById('activityTable'); // Henter tabellen fra HTML

        table.innerHTML = ""; // Nullstiller tabellen

        const tableHead = 
        `<thead>
            <tr>
                <th>Navn</th>
                <th>Dato og tid</th>
                <th>Rom</th>
                <th>Tid brukt</th>
                <th>Endre status</th>
            </tr>
        </thead>`;

        table.innerHTML += tableHead;

        let tableBody = document.createElement('tbody');
        // Nå må vi iterere gjennom data.results, ikke data direkte
        for (let i = 0; i < data.length; i++) {
            if (data[i].statusId == 2) {
                let row = `<tr name=${data[i].id}>
                            <td>${data[i].firstName} ${data[i].lastName}</td>
                            <td>${data[i].subject}
                            <td>${data[i].room}</td>
                            <td>${data[i].duration}</td>
                            <td>
                            <button class="confirm" onclick="updateStatus(${data[i].id}, 3)">Bekreft</button> 
                            <button class="cancel" onclick="updateStatus(${data[i].id}, 1)">Annuler</button>
                            </td>
                        </tr>`;
                tableBody.innerHTML += row; // Legger til raden
            }
        }

        table.innerHTML += tableBody.innerHTML; // Legger til body i tabellen

    } catch (error) {
        console.error('Error:', error);
    }
    
}

function updateStatus (activityID, newStatus) {

    fetch('/updatestatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            activityID: activityID,
            newStatus: newStatus
        }),
    })
    .then(response => response.json())
    .then(data => {
        displayUserActivity();
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    displayUserActivity()
}

displayUserActivity()