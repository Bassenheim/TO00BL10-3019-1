const form = document.getElementById('tyoajanSeuranta');
const startTimeInput = document.getElementById('aloitusAika');
const endTimeInput = document.getElementById('lopetusAika');
const activitySelect = document.getElementById('aktiviteetti');
const commentsInput = document.getElementById('comments');
const submitButton = document.getElementById('tallennaTiedot');
const errorViesti = document.getElementById('virheMessage');
const recordedInfoContainer = document.getElementById('recordedInfo');
const storedRecords = JSON.parse(localStorage.getItem('records')) || [];

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

if (activitySelect.value !== 'comment') {
    commentsInput.value = '';
    commentsInput.setAttribute('readonly', 'readonly');
    commentsInput.style.color = '#999';
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

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
        startTime,
        endTime,
        activity,
        comments,
    };
    
    let records = JSON.parse(localStorage.getItem('ecords')) || [];
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    
    tulostaTiedot(record);
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
        recordedInfo.textContent = `Time: ${totalTime} Activity: ${activityText}`;
        recordedInfoContainer.appendChild(recordedInfo);
    }
}

function laskeAika(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMinutes = (end - start) / 60000;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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