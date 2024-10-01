

const regForm = document.getElementById('registerForm')
regForm.addEventListener('submit', addactivity)

 async function addactivity(event) {
    event.preventDefault();

    const subject = document.getElementById('subject')
    const room = document.getElementById('room')

    if (subject.value == "" || room.value == "") {
        alert('Fyll ut alle feltene.');

    } else {
        const user = {
            idUser: 1,
            startTime: "2024-09-01 08:00:00",
            idSubject: Number(subject.value),
            idRoom: Number(room.value),
            idStatus: 1,
            duration: 90
        };

        try {
            const response = await fetch('/addactivity', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error)
            } else {
                alert("User registered successfully!")
            }
        } catch (error) {
            alert("En feil oppstod. Prøv igjen.")
            console.error('Error:', error);
        }
    }
}

// Function to get all registered subjects
async function populateSubjects() {
    try {
        const response = await fetch('/getsubjects');
        const subjects = await response.json();

        console.log("subjects.length", subjects.length)

        const subjectList = document.getElementById('subject')
        subjects.forEach(subject => {
            const option = document.createElement('option')
            option.value = subject.id
            option.text = subject.name
            subjectList.add(option)
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to get all registered rooms
async function populateRooms() {
    try {
        const response = await fetch('/getrooms');
        const rooms = await response.json();

        console.log("rooms.length", rooms.length)

        const roomList = document.getElementById('room')
        rooms.forEach(room => {
            const option = document.createElement('option')
            option.value = room.id
            option.text = room.name
            roomList.add(option)
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function test (){
    console.log('test')
}

populateSubjects()
populateRooms()