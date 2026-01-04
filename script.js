// --- Elements ---
const laptop = document.getElementById('laptop');
const gitRepo = document.getElementById('git-repo');
const githubRepo = document.getElementById('github-repo');

const codeFile = document.getElementById('code-file');
const localSnapshot = document.getElementById('local-snapshot');
const remoteSnapshot = document.getElementById('remote-snapshot');

const calloutMsg = document.getElementById('callout-msg');

const btnWrite = document.getElementById('btn-write');
const btnCommit = document.getElementById('btn-commit');
const btnPush = document.getElementById('btn-push');
const btnPull = document.getElementById('btn-pull');

// Mode Elements
const btnModeDev = document.getElementById('mode-dev');
const btnModePhoto = document.getElementById('mode-photo');
const analogyItems = document.querySelectorAll('.analogy-item');

// Labels to update
const labelLaptop = laptop.querySelector('.zone-label');
const iconLaptop = laptop.querySelector('.zone-icon');
const labelGit = gitRepo.querySelector('.zone-label');
const iconGit = gitRepo.querySelector('.zone-icon');
const labelGithub = githubRepo.querySelector('.zone-label');
const iconGithub = githubRepo.querySelector('.zone-icon');

// Config
const CONFIG = {
    dev: {
        labels: ["Developer Laptop", "Git (Local)", "GitHub (Remote)"],
        icons: ["💻", "Scm", "☁️"],
        buttons: ["1. Create index.html", "2. Commit v1", "3. Push to Cloud", "4. Pull Updates"],
        objType: "code",
        objContent: "{ }",
        msg: {
            write: "Scenario: You create 'index.html' for your portfolio on your Laptop.",
            commit: "Action: git commit. You take a SNAPSHOT (v1) of your work.",
            push: "Action: git push. Sending v1 to GitHub (Remote)...",
            pull: "Action: git pull. Downloading the new README...",
            teammate: "...Wait! A teammate just pushed a 'README.md' to GitHub!",
            done: "Done! Now you have the README locally too."
        }
    },
    photo: {
        labels: ["My Phone", "Gallery (Local)", "Google Photos (Cloud)"],
        icons: ["📱", "🖼️", "☁️"],
        buttons: ["1. Take Photo", "2. Save to Gallery", "3. Backup to Cloud", "4. Download Shared"],
        objType: "photo",
        objContent: "IMG",
        msg: {
            write: "Scenario: You take a nice photo on your Phone.",
            commit: "Action: Save. The photo is stored in your Local Gallery.",
            push: "Action: Backup. Uploading photo to Google Photos...",
            pull: "Action: Download. Getting the photo your friend shared...",
            teammate: "...Ping! A friend just shared a new photo to the Cloud Album!",
            done: "Done! Now you have the shared photo in your Gallery."
        }
    }
};

// State
let currentMode = 'dev';
let hasCode = false;
let hasCommit = false;
let hasPushed = false;
let remoteHasUpdate = false;

// --- Helpers ---
function setMode(mode) {
    currentMode = mode;

    // Toggle Buttons
    if (mode === 'dev') {
        btnModeDev.classList.add('active');
        btnModePhoto.classList.remove('active');
    } else {
        btnModeDev.classList.remove('active');
        btnModePhoto.classList.add('active');
    }

    // Reset Visuals
    resetAll();

    // Update Text/Icons
    const conf = CONFIG[mode];

    labelLaptop.textContent = conf.labels[0];
    iconLaptop.textContent = conf.icons[0];

    labelGit.textContent = conf.labels[1];
    iconGit.textContent = conf.icons[1]; // SCM is text in CSS? No, it's content.
    if (mode === 'photo') iconGit.textContent = conf.icons[1];
    // if mode dev, we might need to reset 'Scm' if it was changed. 
    // In HTML it was hardcoded 'Scm'. 
    if (mode === 'dev') iconGit.textContent = 'Scm';

    labelGithub.textContent = conf.labels[2];
    iconGithub.textContent = conf.icons[2];

    btnWrite.textContent = conf.buttons[0];
    btnCommit.textContent = conf.buttons[1];
    btnPush.textContent = conf.buttons[2];
    btnPull.textContent = conf.buttons[3];

    setCallout(`Switched to ${mode === 'dev' ? 'Developer' : 'Photographer'} Mode.`);
}

function resetAll() {
    hasCode = false;
    hasCommit = false;
    hasPushed = false;
    remoteHasUpdate = false;

    localSnapshot.style.display = 'none';
    remoteSnapshot.style.display = 'none';
    codeFile.style.display = 'none';

    // Clear dynamic elements
    const traveling = document.getElementById('traveling-snapshot');
    if (traveling) traveling.remove();

    const readme = document.querySelector('.readme');
    if (readme) readme.remove();

    // Reset buttons
    btnCommit.disabled = true;
    btnPush.disabled = true;
    btnPull.disabled = true;
    btnPull.classList.remove('primary');

    // Clear highlights
    analogyItems.forEach(item => item.classList.remove('active-row'));
}

function setCallout(text, color = '#00e676') {
    calloutMsg.style.opacity = '0';
    setTimeout(() => {
        calloutMsg.textContent = text;
        calloutMsg.style.color = color;
        calloutMsg.style.opacity = '1';
        calloutMsg.classList.add('visible');
    }, 200);
}

function highlightZone(zone) {
    laptop.classList.remove('active');
    gitRepo.classList.remove('active');
    githubRepo.classList.remove('active');
    if (zone) zone.classList.add('active');
}

function highlightAnalogyRow(index) {
    analogyItems.forEach(item => item.classList.remove('active-row'));
    // index matches the analogy items order: 0=Local, 1=Remote... wait.
    // Analogy Items in HTML: 
    // 0: Git/Gallery (Local)
    // 1: GitHub/Cloud (Remote)
    // 2: Push
    // 3: Pull
    if (index >= 0 && analogyItems[index]) {
        analogyItems[index].classList.add('active-row');
    }
}

// --- Actions ---

function writeCode() {
    highlightZone(laptop);
    setCallout(CONFIG[currentMode].msg.write);

    // Reset visual flow
    localSnapshot.style.display = 'none';
    remoteSnapshot.style.display = 'none';
    if (document.getElementById('traveling-snapshot')) document.getElementById('traveling-snapshot').remove();

    codeFile.className = 'file-obj';
    if (currentMode === 'photo') {
        codeFile.classList.add('photo-file'); // We can add CSS for this
    }

    codeFile.style.display = 'flex';
    codeFile.style.transition = 'none';

    // Content UPDATE
    if (currentMode === 'dev') {
        codeFile.textContent = '</>';
    } else {
        codeFile.textContent = '📸'; // Emoji content or CSS?
    }

    codeFile.style.left = '50%';
    codeFile.style.top = '50%';
    codeFile.style.transform = 'translate(-50%, -50%) scale(0)';

    void codeFile.offsetWidth;
    codeFile.style.animation = 'writeCodeAnim 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    hasCode = true;
    hasCommit = false;
    hasPushed = false;
    remoteHasUpdate = false;

    btnCommit.disabled = false;
    btnPush.disabled = true;
    btnPull.disabled = true;
    btnPull.textContent = CONFIG[currentMode].buttons[3];
}

function commitCode() {
    if (!hasCode) return;

    setCallout(CONFIG[currentMode].msg.commit);
    highlightZone(gitRepo);
    highlightAnalogyRow(0); // Git/Gallery Row

    const laptopRect = laptop.getBoundingClientRect();
    const gitRect = gitRepo.getBoundingClientRect();
    const deltaX = (gitRect.left + gitRect.width / 2) - (laptopRect.left + laptopRect.width / 2);

    codeFile.style.transition = 'transform 1s ease-in-out, opacity 0.5s';
    codeFile.style.transform = `translate(calc(-50% + ${deltaX}px), -50%)`;

    setTimeout(() => {
        codeFile.style.opacity = '0';
        localSnapshot.style.display = 'flex';
        localSnapshot.style.left = '50%';
        localSnapshot.style.top = '50%';
        localSnapshot.style.transform = 'translate(-50%, -50%) scale(0)';

        // Snapshot content
        if (currentMode === 'photo') {
            localSnapshot.textContent = '🖼️';
            localSnapshot.classList.add('photo-snap');
        } else {
            localSnapshot.textContent = '';
            localSnapshot.classList.remove('photo-snap');
        }

        void localSnapshot.offsetWidth;
        localSnapshot.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        localSnapshot.style.transform = 'translate(-50%, -50%) scale(1)';

        hasCommit = true;
        btnPush.disabled = false;
    }, 900);
}

function pushCode() {
    if (!hasCommit) return;

    setCallout(CONFIG[currentMode].msg.push, '#2979ff');
    highlightZone(githubRepo);
    highlightAnalogyRow(2); // Push Row

    const travelingSnapshot = localSnapshot.cloneNode(true);
    travelingSnapshot.id = 'traveling-snapshot';
    document.querySelector('.visualizer-container').appendChild(travelingSnapshot);

    const containerRect = document.querySelector('.visualizer-container').getBoundingClientRect();
    const gitRect = gitRepo.getBoundingClientRect();
    const githubRect = githubRepo.getBoundingClientRect();

    travelingSnapshot.style.position = 'absolute';
    travelingSnapshot.style.left = (gitRect.left - containerRect.left + gitRect.width / 2) + 'px';
    travelingSnapshot.style.top = '50%';
    travelingSnapshot.style.transform = 'translate(-50%, -50%)';
    travelingSnapshot.style.zIndex = '20';
    travelingSnapshot.style.transition = 'left 1.5s ease-in-out';

    requestAnimationFrame(() => {
        travelingSnapshot.style.left = (githubRect.left - containerRect.left + githubRect.width / 2) + 'px';
    });

    setTimeout(() => {
        travelingSnapshot.remove();
        remoteSnapshot.style.display = 'flex';
        remoteSnapshot.style.opacity = 0;

        // Content
        if (currentMode === 'photo') {
            remoteSnapshot.textContent = '☁️';
            remoteSnapshot.classList.add('photo-snap');
        } else {
            remoteSnapshot.textContent = '';
            remoteSnapshot.classList.remove('photo-snap');
        }

        remoteSnapshot.style.left = '50%';
        remoteSnapshot.style.top = '50%';
        remoteSnapshot.style.transform = 'translate(-50%, -50%)';

        void remoteSnapshot.offsetWidth;
        remoteSnapshot.style.transition = 'opacity 0.5s';
        remoteSnapshot.style.opacity = 1;

        // Highlight Remote/Cloud row
        highlightAnalogyRow(1);

        hasPushed = true;
        triggerRemoteEvent();
    }, 1500);
}

function triggerRemoteEvent() {
    setTimeout(() => {
        setCallout(CONFIG[currentMode].msg.teammate, '#ff9100');

        const newFile = document.createElement('div');
        newFile.className = 'file-obj readme';

        if (currentMode === 'photo') {
            newFile.textContent = '🥳'; // Party photo?
        } else {
            newFile.textContent = 'Read';
        }

        newFile.style.position = 'absolute';
        newFile.style.left = '60%';
        newFile.style.top = '40%';
        newFile.style.zIndex = '15';
        newFile.style.display = 'flex';
        newFile.style.opacity = '0';
        newFile.style.transform = 'scale(0)';

        githubRepo.appendChild(newFile);

        requestAnimationFrame(() => {
            newFile.style.transition = 'all 0.5s ease';
            newFile.style.opacity = '1';
            newFile.style.transform = 'scale(1)';
        });

        remoteHasUpdate = true;
        btnPull.disabled = false;
        btnPull.classList.add('primary');
    }, 2500);
}


function pullCode() {
    setCallout(CONFIG[currentMode].msg.pull, '#ff9100');
    highlightZone(laptop);
    highlightAnalogyRow(3); // Pull Row

    const readme = githubRepo.querySelector('.readme');
    if (!readme) return;

    const travelingFile = readme.cloneNode(true);
    document.querySelector('.visualizer-container').appendChild(travelingFile);

    const containerRect = document.querySelector('.visualizer-container').getBoundingClientRect();
    const githubRect = githubRepo.getBoundingClientRect();
    const laptopRect = laptop.getBoundingClientRect();

    travelingFile.style.position = 'absolute';
    travelingFile.style.left = (githubRect.left - containerRect.left + githubRect.width / 2) + 'px';
    travelingFile.style.top = '50%';
    travelingFile.style.transform = 'translate(-50%, -50%)';
    travelingFile.style.zIndex = '20';
    travelingFile.style.transition = 'left 1.5s ease-in-out';

    requestAnimationFrame(() => {
        travelingFile.style.left = (laptopRect.left - containerRect.left + laptopRect.width / 2) + 'px';
    });

    setTimeout(() => {
        travelingFile.remove();

        const localReadMe = document.createElement('div');
        localReadMe.className = 'file-obj readme';
        if (currentMode === 'photo') localReadMe.textContent = '🥳';
        else localReadMe.textContent = 'Read';

        localReadMe.style.position = 'absolute';
        localReadMe.style.left = '60%';
        localReadMe.style.top = '40%';
        localReadMe.style.display = 'flex';

        laptop.appendChild(localReadMe);

        setCallout(CONFIG[currentMode].msg.done, '#00e676');
        btnPull.classList.remove('primary');
        btnPull.disabled = true;
        btnPull.textContent = "Up to date";
    }, 1500);
}

// Bind events
btnWrite.addEventListener('click', writeCode);
btnCommit.addEventListener('click', commitCode);
btnPush.addEventListener('click', pushCode);
btnPull.addEventListener('click', pullCode);

btnModeDev.addEventListener('click', () => setMode('dev'));
btnModePhoto.addEventListener('click', () => setMode('photo'));

// Init
setCallout("Choose a mode: Developer or Photographer");
