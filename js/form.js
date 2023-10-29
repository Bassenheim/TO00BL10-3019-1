const form = document.getElementById('tyoajanSeuranta');
const startTimeInput = document.getElementById('aloitusAika');
const endTimeInput = document.getElementById('lopetusAika');
const activitySelect = document.getElementById('aktiviteetti');
const commentsInput = document.getElementById('comments');
const submitButton = document.getElementById('tallennaTiedot');
const errorViesti = document.getElementById('virheMessage');
const recordedInfoContainer = document.getElementById('recordedInfo');
const storedRecords = JSON.parse(localStorage.getItem('records')) || [];
const totalTimeContainer = document.getElementById('aikaYht');
const totalTimeElement = document.getElementById('totalTime');
const clearAllButton = document.getElementById('tyhjennaTiedot');
const activityFilter = document.getElementById('aktiviteettiFiltteri');

let aikaPankki = 0;
if (localStorage.getItem('totalTime')) {
    aikaPankki = parseInt(localStorage.getItem('totalTime'), 10);
} else {
    aikaPankki = laskeYhtaika(storedRecords);
}

let diffMinutes;

for (const record of storedRecords) {
    tulostaTiedot(record);
}

activitySelect.addEventListener('change', function () {
    if (activitySelect.value === 'comment') {
        commentsInput.removeAttribute('readonly');
        commentsInput.style.color = 'black';
    } else {
        commentsInput.value = '';
        commentsInput.setAttribute('readonly', 'readonly');
        commentsInput.style.color = '#999';
    }
});

activityFilter.addEventListener('change', function () {
    const selectedActivity = activityFilter.value;
    filterActivities(selectedActivity);
});

clearAllButton.addEventListener('click', function () {
    localStorage.removeItem('records');
    aikaPankki = 0;
    recordedInfoContainer.innerHTML = '';
    totalTimeElement.textContent = '00:00';
    localStorage.removeItem('totalTime');
});

if (activitySelect.value !== 'comment') {
    commentsInput.value = '';
    commentsInput.setAttribute('readonly', 'readonly');
    commentsInput.style.color = '#999';
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    aikaPankki += diffMinutes;
    paivitaAikaPankki(aikaPankki);
    totalTimeElement.textContent = laskeYhtaika(aikaPankki);

    errorViesti.textContent = '';
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const activity = activitySelect.value;
    const comments = commentsInput.value;

    if (!startTime || !endTime || !activity) {
        errorViesti.textContent = 'Please fill in all required fields.';
        return;
    }

    if (startTime >= endTime) {
        errorViesti.textContent = 'End time must be greater than start time.';
        return;
    }

    if (activity === 'comment') {
        if (comments.trim().length < 4) {
            errorViesti.textContent = 'must be longer than 3 characters';
            return;
        }
    }

    if (activity === 'comment') {
        if (comments.trim().length >= 100) {
            errorViesti.textContent = 'must be shorter than 100 characters';
            return;
        }
    }    

    if (!tarkastaaUTF8(comments)) {
        errorMessage.textContent = 'contains invalid characters';
        taskInput.style.borderColor = 'red';
        taskInput.style.borderWidth = '2px';
        return;
    }

    const record = {
        date: dateTime(),
        startTime,
        endTime,
        activity,
        comments,
    };
    
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    
    tulostaTiedot(record);
    tulostaYhtaika(records);
    form.reset();

});

comments.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        tulostaTiedot(record);
    }
});

function tarkastaaUTF8(input) {
    const pattern = /^[A-Za-z0-9\såäöÅÄÖ]*$/;
    return pattern.test(input);
}

function tulostaTiedot(record) {
    const totalTime = laskeAika(record.startTime, record.endTime);
    let activityText = tekstiTiedot(record.activity, record.comments);

    if (recordedInfoContainer) {
        const recordedInfo = document.createElement('div');
        recordedInfo.textContent = `Date: ${record.date} Time: ${totalTime} Activity: ${activityText}`;
        recordedInfoContainer.appendChild(recordedInfo);
    }
}

function laskeAika(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    diffMinutes = (end - start) / 60000;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function laskeYhtaika(records) {
    if (!records) {
        return '00:00';
    }
    let totalMinutes = 0;
    for (const record of records) {
        const start = new Date(`2000-01-01T${record.startTime}`);
        const end = new Date(`2000-01-01T${record.endTime}`);
        const diffMinutes = (end - start) / 60000;
        totalMinutes += diffMinutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function tulostaYhtaika(records) {
    const totalTimeElement = document.getElementById('totalTime');

    const totalTime = laskeYhtaika(records);
    totalTimeElement.textContent = totalTime;
    
    if (records.length === 0) {
        totalTimeElement.textContent = '00:00';
    }
}

function paivitaAikaPankki(aikaPankki) {
    localStorage.setItem('totalTime', aikaPankki);
}

function tekstiTiedot(activity, comments) {
    if (activity === 'comment') {
        return comments;
    } else if (activity === 'lunch') {
        return 'Lunch';
    } else if (activity === 'outoftheoffice') {
        return 'Out of the Office';
    } else if (activity === 'vacation') {
        return 'Vacation';
    }
}

function dateTime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function filterActivities(selectedActivity) {
    const recordedInfo = document.getElementById('recordedInfo');
    const records = JSON.parse(localStorage.getItem('records')) || [];

    recordedInfo.innerHTML = '';

    let filteredRecords;
    if (selectedActivity === 'all') {
        filteredRecords = records;
    } else {
        filteredRecords = records.filter(record => selectedActivity === record.activity);
    }

    for (const record of filteredRecords) {
        tulostaTiedot(record);
    }

    const totalTimeElement = document.getElementById('totalTime');
    const totalTime = laskeYhtaika(filteredRecords);
    totalTimeElement.textContent = totalTime;
    localStorage.setItem('totalTime', totalTime);
}

