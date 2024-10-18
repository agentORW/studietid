const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const session = require('express-session');
const bcrypt = require('bcrypt');
const express = require('express');
const { hash } = require('crypto');
const app = express()

const staticPath = path.join(__dirname, 'public')
app.use(express.urlencoded({ extended: true })) // To parse urlencoded parameters
app.use(express.json()); // To parse JSON bodies

app.use(session({
    secret: 'hemmelig_nøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Sett til true hvis du bruker HTTPS
}));

// Function to check if user is logged in
function checkLoggedIn(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('./logg-inn/logg-inn.html');
    }
}

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(staticPath, './info/index.html'))
})

function checkValidEmailFormat(email) {

    // Step 1: Split the email into two parts: local part and domain part
    let parts = email.split('@');

    // Email should have exactly one "@" symbol
    if (parts.length !== 2) {
        return false;
    }

    let localPart = parts[0];
    let domainPart = parts[1];

    // Step 2: Ensure neither the local part nor the domain part is empty
    if (localPart.length === 0 || domainPart.length === 0) {
        return false;
    }

    // Step 3: Check if domain part contains a "."
    if (!domainPart.includes('.')) {
        return false;
    }

    // Step 4: Split the domain into name and extension
    let domainParts = domainPart.split('.');

    // Ensure there is both a domain name and an extension
    if (domainParts.length < 2) {
        return false;
    }

    let domainName = domainParts[0];
    let domainExtension = domainParts[1];

    // Step 5: Validate that both the domain name and extension are non-empty
    if (!domainName || !domainExtension) {
        return false;
    }

    // Step 6: Ensure domain extension is at least 2 characters long (e.g., ".com")
    if (domainExtension.length < 2) {
        return false;
    }

    // Step 7: Additional checks (optional)
    // - Local part should not start or end with a special character
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return false;
    }

    // - Domain name should not start or end with a special character
    if (domainName.startsWith('-') || domainName.endsWith('-')) {
        return false;
    }

    // If all checks pass, return true
    return true;

}

function checkEmailExists(email) {

    let sql = db.prepare("select count(*)  as count from user where email = ?")
    let result = sql.get(email);
    console.log("result.count", result)
    if (result.count > 0) {
        console.log("Email already exists")
        return false;
    }
    return true;

}

function checkEmailregex(email) {
    const emailRegex = /^[^\s@\.][^\s@]*@[^\s@]+\.[^\s@]+$/;
    let result = emailRegex.test(email);
 
    if (!result) {
        return false;
    }
    return true;
}


app.post('/adduser', (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Validate email format and check if email already exists
    if (!checkValidEmailFormat(email)) {
        return res.json({ error: 'Invalid email format.' });
    }
    else 
    if (!checkEmailExists(email)) {
        //return res.json({ error: 'Email already exists.' });

        res.redirect('/app.html?errorMsg=EmailExist');
    }
    else {
        // Insert new user
        const newUser = addUser(firstName, lastName, 2, 0, email);

        if (!newUser) {
            return res.json({ error: 'Failed to register user.' });
        }
        app.get('/', (req, res) => {
            res.sendFile(path.join(staticPath, 'app.html'))
        })
        //return res.json({ message: 'User registered successfully!', user: newUser });
}
    

});

function addUser(firstName, lastName, idRole, isAdmin, email)
 {


    sql = db.prepare("INSERT INTO user (firstName, lastName, idRole, isAdmin, email) " +
                         "values (?, ?, ?, ?, ?)")
    const info = sql.run(firstName, lastName, idRole, isAdmin, email)
    
    sql = db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log('row inserted', rows[0])

    return rows[0]
}

app.get('/getusers/', (req, resp) => {
    console.log('/getusers/')

    const sql = db.prepare('SELECT user.id as userid, firstname, lastname, role.name as role ' + 
        'FROM user inner join role on user.idrole = role.id ');

    console.log(sql);

    let users = sql.all()   
    console.log("users.length", users.length)
    
    resp.send(users)
})

// Function to get all registered activity
app.get('/getactivity/', (req, resp) => {
    console.log('/getactivity/')

    const sql = db.prepare('SELECT activity.idUser as idUser, user.firstName as firstName, user.lastName as lastName, activity.startTime as startTime, subject.name as subject, room.name as room, activity.duration as duration, status.name as status from activity ' +
        'inner join room on activity.idRoom = room.id ' +
        'inner join status on activity.idStatus = status.id ' +
        'inner join subject on activity.idSubject = subject.id ' +
        'inner join user on activity.idUser = user.id'
    );
    let activity = sql.all()   
    console.log("activity.length", activity.length)
    
    resp.send(activity)
})

// Function to register new activity
app.post('/addactivity', (req, res) => {
    const { idUser, startTime, idSubject, idRoom, idStatus, duration } = req.body;
        // Insert new activity
        const newActivity = addActivity(idUser, startTime, idSubject, idRoom, idStatus, duration);

        if (!newActivity) {
            return res.json({ error: 'Failed to register activity.' });
        }

        return res.json({ message: 'Activity registered successfully!', activity: newActivity });
   
});

function addActivity(idUser, startTime, idSubject, idRoom, idStatus, duration) {
    sql = db.prepare("INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration) " +
                         "values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(idUser, startTime, idSubject, idRoom, idStatus, duration)
    
    sql = db.prepare('SELECT activity.id as activityID, user.firstName as firstName, user.lastName as lastName, activity.startTime as startTime, room.name as room, status.name as status, activity.duration from activity ' +
        'inner join user on activity.idUser = user.id ' +
        'inner join room on activity.idRoom = room.id ' +
        'inner join status on activity.idStatus = status.id WHERE activity.id = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log('row inserted', rows[0])

    return rows[0]
}

app.get('/getsubjects', (req, res) => { 
    const sql = db.prepare('SELECT * FROM subject');
    let subjects = sql.all()   
    console.log("subjects.length", subjects.length)
    
    res.send(subjects)
})

//Function to get all registered rooms
app.get('/getrooms', (req, res) => {
    const sql = db.prepare('SELECT * FROM room');
    let rooms = sql.all()   
    console.log("rooms.length", rooms.length)
    
    res.send(rooms)
})

// Get user by email
function getUserByEmail(email) {
    const sql = db.prepare('SELECT * FROM user WHERE email = ?');
    return sql.get(email);
}

// Rute for innlogging
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Finn brukeren basert på brukernavn
    const user = getUserByEmail(email)//hent bruker fra databasen basert på brukernavn
    console.log(user)
    
    if (!user) {
        return res.status(401).send('Ugyldig email eller passord');
    }

    // Sjekk om passordet samsvarer med hash'en i databasen
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // Lagre innloggingsstatus i session
        req.session.loggedIn = true;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        return res.redirect('/')
    } else {
        return res.status(401).send('Ugyldig email eller passord');
    }
});

// Beskyttet rute som krever at brukeren er innlogget
app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        res.send(`Velkommen, ${req.session.firstName}!`);
    } else {
        res.status(403).send('Du må være logget inn for å se denne siden.');
    }
});

app.get('/all-studietid', (req, res) => {
    res.sendFile(path.join(staticPath, './all-studietid/all-studietid.html'))
});

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})