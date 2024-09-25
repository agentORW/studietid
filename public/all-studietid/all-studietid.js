function displayAllStudietid() {
    fetchStudieTid();
}

async function fetchStudieTid() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getactivity/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON

        let table = document.getElementById('activity'); // Henter tabellen fra HTML

        table.innerHTML = ""; // Nullstiller tabellen

        // Nå må vi iterere gjennom data.results, ikke data direkte
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            let row = `<tr>
                        <td>${data[i].activityID}</td>
                        <td>${data[i].firstName}</td>
                        <td>${data[i].lastName}</td>
                        <td>${data[i].startTime}</td>
                        <td>${data[i].room}</td>
                        <td>${data[i].status}</td>
                        <td>${data[i].duration}</td>
                        <td><button onclick="deleteStudietid(${data[i].activityID})">Slett</button></td>
                      </tr>`;
            table.innerHTML += row; // Legger til raden
        }

    } catch (error) {
        console.error('Error:', error); // Håndterer eventuelle feil
    }
}

displayAllStudietid(); // Kjører funksjonen for å hente data fra studietidDB