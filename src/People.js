import React, { useState } from 'react';

function People() {
    const [users, setUsers] = useState([
    ]);

    const addUserToEnd = (newUser) => {
        setUsers(state => [...state, newUser])
    }

    
    function clearPeople() {
        setUsers([]);
    }

    function addPerson() {
        var personName = document.getElementById('personName');

        if (personName.value !== "") {
            var lines = personName.value.split('\n');
            
            var newPerson = null;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line === "") {
                    if (newPerson != null) {
                        addUserToEnd(newPerson);
                        newPerson = null;
                    }
                } else {
                    if (newPerson == null) {
                        newPerson = {name: line, doses: [], immunocompromised: false};
                    } else {
                        if (line[0] >= '0' && line[0] <= '9') {
                            var ms = Date.parse(line);
                            var date = new Date(ms);
                            newPerson.birthDate = date;
                            console.log(newPerson.birthDate);
                        } else if (line.toLowerCase() === "immunocompromised" || line.toLowerCase() === "ic") {
                            newPerson.immunocompromised = true;
                        } else {
                            var chunks = line.split(' ');
                            var dose = { "vaccine": chunks[0], "date": chunks[1] };
                            newPerson.doses.push(dose);
                        }

                    }
                }
            }
            if (newPerson != null) {
                addUserToEnd(newPerson);
                newPerson = null;
            }
        }
    }

    function calculateAge(birthDate) {
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        age = age + m / 12;
        return age;
    }

    function showAge(birthDate) {
        var age = calculateAge(birthDate);
        if (isNaN(age)) {
            return "(unknown age)";
        } else {
            return "(" + age.toFixed(1) + ")";
        }
    }

    function calculateDosesNeeded(user) {
        var age = calculateAge(user.birthDate);
        var immunocompromised = user.immunocompromised;

        var dosesNeeded = 0;
        if (age > .5 && age < 5) {
            dosesNeeded = 3;
        } else if (age >=5 && age < 12) {
            dosesNeeded = 3;
            if (immunocompromised) { dosesNeeded++; }
        } else if (age >= 12 && age < 50) {
            dosesNeeded = 3;
            if (immunocompromised) { dosesNeeded = 5; }
        } else if (age >= 50) {
            dosesNeeded = 4;
            if (immunocompromised) { dosesNeeded = 5; }
        } else if (isNaN(age)) {
            dosesNeeded = NaN;
        }

        return dosesNeeded;
    }

    function showDosesNeeded(user) {
        var dosesNeeded = calculateDosesNeeded(user);
        return isNaN(dosesNeeded) ? "unknown" : dosesNeeded;
    }

    function calculateDosesToSchedule(user) {
        if ('doses' in user) {
            var dosesNeeded = calculateDosesNeeded(user) - user.doses.length;
            return dosesNeeded;
        } else {
            return NaN;
        }
    }

    function showDosesToSchedule(user) {
        var dosesToSchedule = calculateDosesToSchedule(user);
        if (isNaN(dosesToSchedule)) {
            return "unknown";
        } else if (dosesToSchedule > 0) {
            return dosesToSchedule;
        } else {
            return "";
        }
    }
    return (
        <>
            <div className="container">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className='w200'>Person</th>
                            <th className='w200'>Doses Received</th>
                            <th>Recommended Doses</th>
                            <th>Doses to Schedule</th>
                            <th>Next Dose Timing</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user =>
                            <tr key={user.id}>
                                <td>{user.name} {showAge(user.birthDate)} {user.immunocompromised ? ", Immunocompromised" : ""}</td>
                                <td>
                                    {user.doses && user.doses.map((dose,index) => 
                                    <>
                                        <div>{dose.date} {dose.vaccine}</div>
                                    </>
                                    )}
                                </td>
                                <td>{showDosesNeeded(user)}</td>
                                <td>{showDosesToSchedule(user)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='tal'>
                <br/>
                <div className='tal'><b>Type in data about 1 or more people using the pattern below, then press 'import':</b></div>

                <br/>
                <textarea className='w400 h400' id='personName' /><br/>
                <button onClick={addPerson}>import</button>
                <button onClick={clearPeople}>clear all people</button>
                <br/>
                <br/>
                <div className='tal'><b>Example data format:</b></div>
                
                <div className='sampleData'>
                    George Washington<br/>
                    2/22/1732<br/>
                    Pfizer 2/1/2021<br/>
                    Pfizer 4/1/2021<br/>
                    <br/>
                    Abraham Lincoln<br/>
                    2/12/1809<br/>
                    Immunocompromised<br/>
                    Moderna 2/8/2021<br/>
                    Moderna 4/8/2021<br/>
                </div>
            </div>
        </>
    );
}

export default People;
