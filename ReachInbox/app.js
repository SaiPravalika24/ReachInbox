document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const oneboxPage = document.getElementById('onebox-page');
    const threadsList = document.getElementById('threads-list');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Perform login (authenticate via API)
        loginUser();
    });

    function loginUser() {
        // Perform API call for login
        // On success, show the onebox page
        oneboxPage.style.display = 'block';
    }

    // Fetch threads list and display
    function fetchThreads() {
        fetch('/onebox/list')
            .then(response => response.json())
            .then(data => {
                displayThreads(data);
            });
    }

    function displayThreads(threads) {
        threadsList.innerHTML = '';
        threads.forEach(thread => {
            const threadElement = document.createElement('div');
            threadElement.textContent = thread.subject;
            threadsList.appendChild(threadElement);

            threadElement.addEventListener('click', () => {
                fetch(`/onebox/${thread.id}`)
                    .then(response => response.json())
                    .then(data => {
                        openThread(data);
                    });
            });
        });
    }

    function openThread(thread) {
        // Display thread content in the editor
        document.getElementById('editor').innerHTML = thread.body;
    }

    // Implement keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'D') {
            deleteThread();
        } else if (e.key === 'R') {
            openReplyBox();
        }
    });

    function deleteThread() {
        const selectedThreadId = getSelectedThreadId();
        fetch(`/onebox/${selectedThreadId}`, { method: 'DELETE' })
            .then(() => {
                fetchThreads(); // Refresh the list after deletion
            });
    }

    function openReplyBox() {
        // Open the reply box and focus on the editor
    }

    // Implement light/dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    fetchThreads(); // Fetch the threads on page load
});


const express = require('express');
const app = express();

app.use(express.json());

// Mock Data
const threads = [
    { id: 1, subject: 'Thread 1', body: '<p>This is thread 1</p>' },
    { id: 2, subject: 'Thread 2', body: '<p>This is thread 2</p>' },
];

app.get('/onebox/list', (req, res) => {
    res.json(threads);
});

app.get('/onebox/:thread_id', (req, res) => {
    const thread = threads.find(t => t.id === parseInt(req.params.thread_id));
    res.json(thread);
});

app.delete('/onebox/:thread_id', (req, res) => {
    const index = threads.findIndex(t => t.id === parseInt(req.params.thread_id));
    threads.splice(index, 1);
    res.status(204).send();
});

app.post('/reply/:thread_id', (req, res) => {
    const { from, to, subject, body } = req.body;
    // Handle sending reply (e.g., send an email)
    res.status(200).send({ message: 'Reply sent' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});