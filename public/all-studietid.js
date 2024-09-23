function displayAllStudietid() {
    fetchStudieTid();
}

async function fetchStudieTid() {
    try {
        // Fetch API brukes for å hente data fra URLen
        let response = await fetch('/getactivity/'); // Hente brukere fra studietidDB
        let data = await response.json(); // Konverterer responsen til JSON

        // Nå må vi iterere gjennom data.results, ikke data direkte
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
        }

    } catch (error) {
        console.error('Error:', error); // Håndterer eventuelle feil
    }
}

displayAllStudietid(); // Kjører funksjonen for å hente data fra studietidDB