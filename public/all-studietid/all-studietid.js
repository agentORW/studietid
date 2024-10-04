const tempUserId = 1;



async function displayUserActivity () {
    try {
        const response = await fetch('/getactivity');
        const data = await response.json();

        console.log("activities.length", data.length)

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
            console.log(data[i]);
            if (data[i].idUser == tempUserId) {
                let row = `<tr>
                            <td>${data}</td>
                            <td>${data[i].subject}
                            <td>${data[i].room}</td>
                            <td>${data[i].duration}</td>
                            <td>${data[i].status}</td>
                        </tr>`;
                tableBody.innerHTML += row; // Legger til raden
            }
        }

        table.innerHTML += tableBody.innerHTML; // Legger til body i tabellen

    } catch (error) {
        console.error('Error:', error);
    }
    
}

displayUserActivity()