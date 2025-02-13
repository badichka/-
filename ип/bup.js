let alarmTimeouts = [];
let alarmSound = document.getElementById('alarmSound');

// Восстанавливаем будильники из Local Storage
function restoreAlarms() {
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.forEach(alarm => {
        setAlarm(alarm);
    });
}

document.getElementById('setAlarm').addEventListener('click', () => {
    const timeInput = document.getElementById('alarmTime').value;
    if (!timeInput) {
        alert('Пожалуйста, выберите время!');
        return;
    }

    const [hours, minutes] = timeInput.split(':').map(Number);
    const now = new Date();
    let alarmTime = new Date();
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1); // Если время в прошлом, устанавливаем на следующий день
    }

    const timeToAlarm = alarmTime.getTime() - now.getTime();
    let alarmTimeout = setTimeout(() => playAlarm(alarmTime), timeToAlarm);

    setAlarm({ time: alarmTime.toLocaleTimeString(), timeout: alarmTimeout });
    document.getElementById('status').innerText = Будильник установлен на ${alarmTime.toLocaleTimeString()};
});

function setAlarm(alarm) {
    alarmTimeouts.push(alarm);
    localStorage.setItem('alarms', JSON.stringify(alarmTimeouts));
    updateAlarmList();
}

function playAlarm(alarmTime) {
    alarmSound.play();
    document.getElementById('status').innerText = "Время пробуждения!";
}

function updateAlarmList() {
    const alarmList = document.getElementById('alarmList');
    alarmList.innerHTML = ''; // Очищаем список
    alarmTimeouts.forEach(alarm => {
        const li = document.createElement('li');
        li.innerText = Будильник установлен на: ${alarm.time};
        alarmList.appendChild(li);
    });
}

document.getElementById('resetAlarms').addEventListener('click', () => {
    localStorage.removeItem('alarms');
    alarmTimeouts = [];
    updateAlarmList();
    document.getElementById('status').innerText = "Все будильники сброшены.";
});

// Восстанавливаем будильники при загрузке страницы
restoreAlarms();
