import React, { useState } from 'react';
import vaccineSchedule from "./data/cdc-schedule.json";

function People() {
    const [users, setUsers] = useState([
    ]);

    const addUserToEnd = (newUser) => {
        setUsers(state => [...state, newUser])
    }

    function clearPeople() {
        setUsers([]);
    }

    function copySampleData() {
        var sampleData = document.getElementById('sampleData');
        var importData = document.getElementById('importData');

        importData.value = sampleData.value;
    }

    function addPerson() {
        var importData = document.getElementById('importData');

        if (importData.value !== "") {
            var lines = importData.value.split('\n');
            
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

    function matchesRange(age, range) {
        var firstCompare = range[0];
        var secondCompare = range[range.length - 1];
        var ages = range.substring(1, range.length-1).split(',');
        if (ages[1] === "") { ages[1] = Infinity; }
        var firstAnswer = firstCompare === "[" ? age >= ages[0] : age > ages[0];
        var secondAnswer = secondCompare === "]" ? age <= ages[1] : age < ages[1];

        return firstAnswer && secondAnswer;
    }

    function calculateDosesNeeded(user) {
        var age = calculateAge(user.birthDate);
        var immunocompromised = user.immunocompromised;

        var firstVaccineType = user.doses[0].vaccine;

        for (var i = 0; i < vaccineSchedule.vaccineSchedules.length; i++) {
            if (vaccineSchedule.vaccineSchedules[i].vaccine.toLowerCase().startsWith(firstVaccineType.toLowerCase())) {
                for (var j = 0; j < vaccineSchedule.vaccineSchedules[i].schedules.length; j++) {
                    var ageMatch = matchesRange(age, vaccineSchedule.vaccineSchedules[i].schedules[j].ages);
                    var immunocompromisedSchedule = "immunocompromised" in vaccineSchedule.vaccineSchedules[i].schedules[j];
                    if (ageMatch) {
                        if (immunocompromisedSchedule === immunocompromised) {
                            return vaccineSchedule.vaccineSchedules[i].schedules[j].doses.length;
                        }
                    }
                }
            }
        }

        return "unknown";
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

    function getSampleData() {
        var sample = 'George Washington\n2/22/1732\nPfizer 2/1/2021\nPfizer 4/1/2021\n\nAbraham Lincoln\n2/12/1809\nImmunocompromised\nModerna 2/8/2021\nModerna 4/8/2021\n';
        var lines = sample.split('\n');
        return lines.join('\n');
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
                <textarea className='w400 h400' id='importData' /><br/>
                <button onClick={addPerson}>import</button>
                <button onClick={copySampleData}>copy sample data to box above</button>
                <button onClick={clearPeople}>clear all people</button>
                <br/>
                <br/>
                <div className='tal'><b>Example data format:</b></div>
                
                <textarea className='sampleData w400 h400' id='sampleData' defaultValue={getSampleData()} >
                </textarea>
            </div>
        </>
    );
}

export default People;
