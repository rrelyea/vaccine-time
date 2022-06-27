import React, { useState } from 'react';

function People() {
    const [users, setUsers] = useState([
        {   id: 1, 
            name: 'F',
            birthDate: '5/1/1969',
            doses: [
                { vaccine: 'Pfizer', date: '4/15/2021' },
                { vaccine: 'Pfizer', date: '5/15/2021' },
                { vaccine: 'Pfizer', date: '10/15/2021' },
                { vaccine: 'Pfizer', date: '6/15/2022' },
            ]
        },
        {   id: 2, 
            name: 'M',
            birthDate: '3/1/1971',
            immunocompromised: 'true',
            doses: [
                { vaccine: 'Pfizer', date: '4/15/2021' },
                { vaccine: 'Pfizer', date: '5/15/2021' },
                { vaccine: 'Pfizer', date: '10/15/2021' },
            ]
        },
        {   id: 3, 
            name: 'C1',
            birthDate: '7/1/1999',
            doses: [
                { vaccine: 'Pfizer', date: '4/15/2021' },
                { vaccine: 'Pfizer', date: '5/15/2021' },
                { vaccine: 'Pfizer', date: '10/15/2021' },
            ]
        },
        {   id: 4, 
            name: 'C2',
            birthDate: '7/1/2002',
            doses: [
                { vaccine: 'Pfizer', date: '4/15/2021' },
                { vaccine: 'Pfizer', date: '5/15/2021' },
                { vaccine: 'Pfizer', date: '10/15/2021' },
            ]
        },
        {   id: 5, 
            name: 'Unvaccinated adult',
            birthDate: '8/1/2000',
            doses: [
            ]
        },
        {   id: 6, 
            name: 'Unvaccinated toddler',
            birthDate: '8/1/2020',
            doses: [
            ]
        },
        {   id: 7, 
            name: 'Unvaccinated young child',
            birthDate: '8/1/2015',
            doses: [
            ]
        },
    ]);

    const addUserToEnd = (newUser) => {
        setUsers(state => [...state, newUser])
    }

    function addPerson() {
        var personName = document.getElementById('personName');
        if (personName.value !== "") {
            addUserToEnd({id:3, name: personName.value});
            personName.value = "";
            personName.focus();
        }
    }

    function calculateAge(birthDateStr) {
        var today = new Date();
        var birthDate = new Date(birthDateStr);
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
        var immunocompromised = user.immunocompromised === "true";

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
                            <th>Next Dose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user =>
                            <tr key={user.id}>
                                <td>{user.name} {showAge(user.birthDate)} {user.immunocompromised === "true" ? ", Immunocompromised" : ""}</td>
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
            <div>
                <input type='text' id='personName' />
                <button onClick={addPerson}>add person</button>
            </div>
        </>
    );
}

export default People;
