

const regForm = document.getElementById('registerForm')
//regForm.addEventListener('submit', adduser)
 async function addactivity(event) {
    event.preventDefault();

    const user = {
        idUser: 1,
        startTime: "2024-09-01 08:00:00",
        idSubject: regForm.idSubject.value,
        idRoom: regForm.idRoom.value,
        duration: 90
    };

    try {
        const response = await fetch('/adduser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('error').innerText = data.error;
            document.getElementById('success').innerText = '';
        } else {
            document.getElementById('error').innerText = '';
            document.getElementById('success').innerText = 'Bruker registrert.';
        }
    } catch (error) {
        document.getElementById('error').innerText = 'En feil oppstod. Vennligst prøv igjen.';
        console.error('Error:', error);
    }
}