const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById("btnSearch");
const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && sex && age && condition) {
        patients.push({name, sex, age, condition});
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="sex"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

function searchCondition() {
    const input = document.getElementById("conditionInput").value.toLowerCase();
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
    .then(response => response.json())
    .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if(condition){
            const symptoms = condition.symptoms.join(', ');
            const prevention = condition.prevention.join(', ');
            const treatment = condition.treatment;
            resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
            resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;
            resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
            resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
            resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        }
        else {
            resultDiv.innnerHTML = "Condition not found";
        }
    })
    .catch(error => {
        console.error("Error detected: ", error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}

function generateReport() {
    let numPatients = patients.length;
    let numConditions = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0
    };
    let countConditionsBySex = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0
        }
    };

    patients.forEach(patient => {
        numConditions[patient.condition]++;
        countConditionsBySex[patient.sex][patient.condition]++;
    });

    report.innerHTML = `Number of patients: ${numPatients}<br>`;
    report.innerHTML += `<br>Conditions Breakdown: <br>`;
    for (const condition in numConditions) {
        report.innerHTML += `${condition}: ${numConditions[condition]}<br>`;
    }

    report.innerHTML += `<br>Sex-based conditions:<br>`;
    for (const sex in countConditionsBySex) {
        report.innerHTML += `${sex}:<br>`;
        for (const condition in countConditionsBySex[sex]) {
            report.innerHTML += ` &nbsp;&nbsp;${condition}: ${countConditionsBySex[sex][condition]} <br>`;
        };
    }
}

addPatientButton.addEventListener('click', addPatient);
btnSearch.addEventListener('click', searchCondition);
