var timeoutInMiliseconds = 300000; // five minutes of idleness before auto logout
var timeoutId; 

async function logout() {
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

function startTimer() { 
    // window.setTimeout returns an Id that can be used to start and stop a timer
    timeoutId = window.setTimeout(logout, timeoutInMiliseconds)
}

function resetTimer() { 
    window.clearTimeout(timeoutId)
    startTimer();
}
 
function setupTimers () {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    startTimer();
}

window.addEventListener('load', startTimer);
document.querySelector('#logout').addEventListener('click', logout);