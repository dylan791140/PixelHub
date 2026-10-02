const app = document.getElementById('app');

const state = {
    signedIn: false,
    username: '',
    avatar: {
        skin: '#f4c7a1',
        shirt: '#53c8ff',
        pants: '#7ef29a',
        hat: 'none'
    },
    games: []
};

function renderSignupScreen() {
    app.innerHTML = `
        <div class="pixel-shell signup-screen">
            <div class="pixel-logo">
                <div class="pixel-logo-mark"></div>
                <span>PixelHub</span>
            </div>

            <div class="signup-card">
                <div class="signup-header">
                    <h1>Create your account</h1>
                    <p>Start building worlds, avatars, and games.</p>
                </div>

                <form id="signup-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input id="username" name="username" type="text" placeholder="Enter username" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Enter password" required>
                    </div>

                    <button class="primary-btn" type="submit">Sign Up</button>
                </form>

                <div class="form-help">PixelHub saves your account locally in this prototype.</div>
            </div>
        </div>
    `;

    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');

        const username = usernameField.value.trim();
        const password = passwordField.value.trim();

        if (!username || !password) {
            alert('Please enter both a username and a password.');
            return;
        }

        state.username = username;
        state.signedIn = true;

        localStorage.setItem('pixelhub_user', JSON.stringify({
            username,
            password,
            avatar: state.avatar,
            games: state.games
        }));

        renderHomeScreen();
    });
}

function renderHomeScreen() {
    app.innerHTML = `
        <div class="pixel-shell home-screen">
            <header class="topbar">
                <div class="topbar-left">
                    <div class="avatar-badge">🧑</div>
                    <div class="brand-mini">PixelHub</div>
                </div>

                <div class="topbar-right">
                    <div class="user-pill">${state.username}</div>
                    <div class="profile-badge">👤</div>
                </div>
            </header>

            <main class="content-layout">
                <aside class="panel side-panel">
                    <h2>Menu</h2>
                    <div class="nav-list">
                        <div class="nav-item">Home</div>
                        <div class="nav-item">Games</div>
                        <div class="nav-item">Avatar Studio</div>
                        <div class="nav-item">Profile</div>
                    </div>
                </aside>

                <section class="panel main-panel">
                    <h2>Games</h2>
                    <div class="game-spotlight">
                        <div class="empty-games">No games yet<br>Start creating your first world.</div>
                    </div>

                    <div class="game-grid">
                        ${state.games.length ? state.games.map(game => `
                            <div class="game-card">
                                <strong>${game.name}</strong>
                            </div>
                        `).join('') : ''}
                    </div>
                </section>

                <aside class="panel right-panel">
                    <h2>Profile</h2>
                    <div class="profile-box">
                        <div class="profile-badge">👤</div>
                        <div>
                            <div style="font-weight:800;">${state.username}</div>
                            <div class="empty-state">Creator</div>
                        </div>
                    </div>

                    <div class="profile-actions">
                        <button class="secondary-btn small-btn" type="button">Customize Avatar</button>
                        <button class="secondary-btn small-btn" type="button">Create Game</button>
                        <button class="secondary-btn small-btn" type="button" id="reset-account">Reset Account</button>
                    </div>
                </aside>
            </main>
        </div>
    `;

    document.getElementById('reset-account')?.addEventListener('click', () => {
        localStorage.removeItem('pixelhub_user');
        state.signedIn = false;
        state.username = '';
        state.games = [];
        renderSignupScreen();
    });
}

function restoreSession() {
    const saved = localStorage.getItem('pixelhub_user');

    if (!saved) {
        renderSignupScreen();
        return;
    }

    try {
        const user = JSON.parse(saved);
        state.username = user.username || '';
        state.avatar = user.avatar || state.avatar;
        state.games = user.games || [];
        state.signedIn = Boolean(user.username);
    } catch (error) {
        console.warn('Failed to restore PixelHub session', error);
        localStorage.removeItem('pixelhub_user');
    }

    if (state.signedIn) {
        renderHomeScreen();
    } else {
        renderSignupScreen();
    }
}

restoreSession();
