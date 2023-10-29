const form = document.getElementById('tyoajanSeuranta');
const startTimeInput = document.getElementById('aloitusAika');
const endTimeInput = document.getElementById('lopetusAika');
const activitySelect = document.getElementById('aktiviteetti');
const commentsInput = document.getElementById('comments');
const submitButton = document.querySelector('button[type="submit"]');
const errorViesti = document.getElementById('virheMessage');

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
            errorViesti.textContent = 'must be shorter than 100 characters';
            return;
        }
    }

    if (activity === 'comment') {
        if (comments.trim().length >= 100) {
            errorViesti.textContent = 'Comments must be between 4 and 99 characters.';
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

    let records = JSON.parse(localStorage.getItem('workRecords')) || [];
    records.push(record);
    localStorage.setItem('workRecords', JSON.stringify(records));

    form.reset();

});

function tarkastaaUTF8(input) {
    const pattern = /^[A-Za-z0-9\såäöÅÄÖ]*$/;
    return pattern.test(input);
}