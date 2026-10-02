const app = document.getElementById('app');

const state = {
    signedIn: false,
    username: '',
    avatar: {
        skin: '#f4c7a1',
        shirt: '#53c8ff',
        pants: '#7ef29a',
        hat: 'none',
        aiGenerated: false,
        prompt: ''
    },
    games: [],
    currentView: 'signup'
};

const colorOptions = {
    skin: ['#f4c7a1', '#d9a066', '#8d5524', '#f1d0a3'],
    shirt: ['#53c8ff', '#ff6ec7', '#ffd166', '#7ef29a', '#ff6b6b'],
    pants: ['#7ef29a', '#4db6ff', '#9b7cff', '#ff8a5b', '#8bd4b9'],
    hat: ['none', 'red', 'blue', 'green', 'purple']
};

function saveUser() {
    localStorage.setItem('pixelhub_user', JSON.stringify({
        username: state.username,
        avatar: state.avatar,
        games: state.games
    }));
}

function buildPixelAvatar() {
    const skin = state.avatar.skin || '#f4c7a1';
    const shirt = state.avatar.shirt || '#53c8ff';
    const pants = state.avatar.pants || '#7ef29a';
    const hat = state.avatar.hat || 'none';

    const hatMarkup = hat === 'none' ? '' : `
        <div class="pixel-hat pixel-hat-${hat}"></div>
    `;

    return `
        <div class="pixel-character" aria-label="Avatar preview">
            ${hatMarkup}
            <div class="pixel-head" style="background:${skin};"></div>
            <div class="pixel-body" style="background:${shirt};"></div>
            <div class="pixel-arm left" style="background:${skin};"></div>
            <div class="pixel-arm right" style="background:${skin};"></div>
            <div class="pixel-leg left" style="background:${pants};"></div>
            <div class="pixel-leg right" style="background:${pants};"></div>
        </div>
    `;
}

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
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please enter both a username and a password.');
            return;
        }

        state.username = username;
        state.signedIn = true;
        saveUser();
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
                    <button class="profile-badge" id="open-profile">👤</button>
                </div>
            </header>

            <main class="content-layout">
                <aside class="panel side-panel">
                    <h2>Menu</h2>
                    <div class="nav-list">
                        <div class="nav-item active">Home</div>
                        <div class="nav-item">Games</div>
                        <div class="nav-item" id="open-avatar-studio">Avatar Studio</div>
                        <div class="nav-item" id="open-create-game">Create Game</div>
                        <div class="nav-item" id="reset-account">Reset Account</div>
                    </div>
                </aside>

                <section class="panel main-panel">
                    <h2>Games</h2>
                    <div class="game-spotlight">
                        ${state.games.length ? '' : '<div class="empty-games">No games yet<br>Start creating your first world.</div>'}
                        ${state.games.length ? `
                            <div class="game-grid wide-grid">
                                ${state.games.map(game => `
                                    <div class="game-card">
                                        <div class="game-card-inner">
                                            <strong>${game.name}</strong>
                                            <span>${game.description}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </section>

                <aside class="panel right-panel">
                    <h2>Profile</h2>
                    <div class="profile-box">
                        <div class="avatar-mini-wrap">${buildPixelAvatar()}</div>
                        <div>
                            <div class="profile-name">${state.username}</div>
                            <div class="empty-state">Creator</div>
                        </div>
                    </div>

                    <div class="profile-actions">
                        <button class="secondary-btn small-btn" type="button" id="open-avatar-studio-2">Customize Avatar</button>
                        <button class="secondary-btn small-btn" type="button" id="open-create-game-2">Create Game</button>
                    </div>
                </aside>
            </main>
        </div>
    `;

    document.getElementById('open-avatar-studio').addEventListener('click', renderAvatarStudio);
    document.getElementById('open-avatar-studio-2').addEventListener('click', renderAvatarStudio);
    document.getElementById('open-create-game').addEventListener('click', renderCreateGameScreen);
    document.getElementById('open-create-game-2').addEventListener('click', renderCreateGameScreen);
    document.getElementById('open-profile').addEventListener('click', renderProfileScreen);
    document.getElementById('reset-account').addEventListener('click', () => {
        localStorage.removeItem('pixelhub_user');
        state.signedIn = false;
        state.username = '';
        state.games = [];
        state.avatar = { skin: '#f4c7a1', shirt: '#53c8ff', pants: '#7ef29a', hat: 'none', aiGenerated: false, prompt: '' };
        renderSignupScreen();
    });
}

function renderAvatarStudio() {
    app.innerHTML = `
        <div class="pixel-shell studio-screen">
            <header class="studio-header">
                <button class="back-btn" id="back-to-home">← Back</button>
                <h2>Avatar Studio</h2>
            </header>

            <div class="studio-layout">
                <section class="panel preview-panel">
                    <div class="preview-box">
                        ${buildPixelAvatar()}
                    </div>

                    <div class="avatar-status">
                        ${state.avatar.aiGenerated ? 'AI-generated avatar active' : 'Custom avatar'}
                    </div>
                </section>

                <section class="panel controls-panel">
                    <div class="option-group">
                        <h3>Skin</h3>
                        <div class="swatches">
                            ${colorOptions.skin.map(color => `
                                <button class="swatch ${state.avatar.skin === color ? 'active' : ''}" data-type="skin" data-value="${color}" style="background:${color};"></button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="option-group">
                        <h3>Shirt</h3>
                        <div class="swatches">
                            ${colorOptions.shirt.map(color => `
                                <button class="swatch ${state.avatar.shirt === color ? 'active' : ''}" data-type="shirt" data-value="${color}" style="background:${color};"></button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="option-group">
                        <h3>Pants</h3>
                        <div class="swatches">
                            ${colorOptions.pants.map(color => `
                                <button class="swatch ${state.avatar.pants === color ? 'active' : ''}" data-type="pants" data-value="${color}" style="background:${color};"></button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="option-group">
                        <h3>Hat</h3>
                        <div class="swatches">
                            ${colorOptions.hat.map(name => `
                                <button class="hat-swatch ${state.avatar.hat === name ? 'active' : ''}" data-type="hat" data-value="${name}">
                                    ${name === 'none' ? 'None' : name[0].toUpperCase() + name.slice(1)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="ai-section">
                        <h3>AI Character Builder</h3>
                        <textarea id="ai-avatar-prompt" rows="4" placeholder="Describe your ideal pixel character...">${state.avatar.prompt || ''}</textarea>
                        <button class="primary-btn" id="generate-ai-avatar">Generate AI Character</button>
                    </div>
                </section>
            </div>
        </div>
    `;

    document.getElementById('back-to-home').addEventListener('click', renderHomeScreen);

    document.querySelectorAll('.swatch').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const value = button.dataset.value;
            state.avatar[type] = value;
            state.avatar.aiGenerated = false;
            state.avatar.prompt = '';
            saveUser();
            renderAvatarStudio();
        });
    });

    document.querySelectorAll('.hat-swatch').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const value = button.dataset.value;
            state.avatar[type] = value;
            state.avatar.aiGenerated = false;
            state.avatar.prompt = '';
            saveUser();
            renderAvatarStudio();
        });
    });

    document.getElementById('generate-ai-avatar').addEventListener('click', () => {
        const prompt = document.getElementById('ai-avatar-prompt').value.trim();
        if (!prompt) {
            alert('Describe the character you want to generate.');
            return;
        }

        state.avatar.prompt = prompt;
        state.avatar.aiGenerated = true;

        const palette = [
            '#ffb703', '#fb8500', '#90be6d', '#8ecae6', '#ffafcc', '#cdb4db', '#00bbf9', '#f72585'
        ];

        const randomSkin = palette[Math.floor(Math.random() * palette.length)];
        const randomShirt = palette[Math.floor(Math.random() * palette.length)];
        const randomPants = palette[Math.floor(Math.random() * palette.length)];

        state.avatar.skin = randomSkin;
        state.avatar.shirt = randomShirt;
        state.avatar.pants = randomPants;
        state.avatar.hat = Math.random() > 0.5 ? 'purple' : 'blue';

        saveUser();
        renderAvatarStudio();
    });
}

function renderProfileScreen() {
    app.innerHTML = `
        <div class="pixel-shell profile-screen">
            <header class="studio-header">
                <button class="back-btn" id="back-to-home">← Back</button>
                <h2>Profile</h2>
            </header>

            <section class="panel profile-card">
                <div class="profile-top">
                    <div class="avatar-mini-wrap large-avatar">${buildPixelAvatar()}</div>
                    <div>
                        <h3>${state.username}</h3>
                        <p>Pixel creator</p>
                    </div>
                </div>

                <div class="profile-info-grid">
                    <div class="info-box">
                        <span>Games</span>
                        <strong>${state.games.length}</strong>
                    </div>
                    <div class="info-box">
                        <span>Style</span>
                        <strong>${state.avatar.aiGenerated ? 'AI' : 'Custom'}</strong>
                    </div>
                </div>

                <div class="profile-actions">
                    <button class="secondary-btn" id="go-avatar">Edit Avatar</button>
                    <button class="secondary-btn" id="go-games">View Games</button>
                    <button class="secondary-btn danger" id="reset-account-profile">Reset Account</button>
                </div>
            </section>
        </div>
    `;

    document.getElementById('back-to-home').addEventListener('click', renderHomeScreen);
    document.getElementById('go-avatar').addEventListener('click', renderAvatarStudio);
    document.getElementById('go-games').addEventListener('click', renderHomeScreen);
    document.getElementById('reset-account-profile').addEventListener('click', () => {
        localStorage.removeItem('pixelhub_user');
        state.signedIn = false;
        state.username = '';
        state.games = [];
        state.avatar = { skin: '#f4c7a1', shirt: '#53c8ff', pants: '#7ef29a', hat: 'none', aiGenerated: false, prompt: '' };
        renderSignupScreen();
    });
}

function renderCreateGameScreen() {
    app.innerHTML = `
        <div class="pixel-shell create-game-screen">
            <header class="studio-header">
                <button class="back-btn" id="back-to-home">← Back</button>
                <h2>Create Game</h2>
            </header>

            <section class="panel creator-panel">
                <label class="create-label" for="game-prompt">Describe your 2D game</label>
                <textarea id="game-prompt" rows="6" placeholder="Example: A tiny cave explorer where you dodge falling crystals and collect gems."></textarea>

                <div class="game-form-row">
                    <input id="game-name" type="text" placeholder="Game name" />
                    <input id="game-description" type="text" placeholder="Short description" />
                </div>

                <div class="button-row">
                    <button class="primary-btn" id="generate-game">Generate Game</button>
                    <button class="secondary-btn" id="publish-game">Publish</button>
                </div>

                <div class="game-preview-box" id="game-preview-box">
                    <div class="preview-placeholder">AI will generate a 2D game idea here.</div>
                </div>
            </section>
        </div>
    `;

    document.getElementById('back-to-home').addEventListener('click', renderHomeScreen);

    document.getElementById('generate-game').addEventListener('click', () => {
        const prompt = document.getElementById('game-prompt').value.trim();
        if (!prompt) {
            alert('Give the AI a game idea first.');
            return;
        }

        const preview = document.getElementById('game-preview-box');
        preview.innerHTML = `
            <div class="generated-game-preview">
                <div class="mini-scene"></div>
                <div class="mini-scene-label">AI concept: ${prompt}</div>
            </div>
        `;
    });

    document.getElementById('publish-game').addEventListener('click', () => {
        const name = document.getElementById('game-name').value.trim() || 'Untitled Game';
        const description = document.getElementById('game-description').value.trim() || 'A new PixelHub game';

        const newGame = {
            name,
            description
        };

        state.games.push(newGame);
        saveUser();
        renderHomeScreen();
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
        console.warn('Could not restore session:', error);
        localStorage.removeItem('pixelhub_user');
        renderSignupScreen();
        return;
    }

    if (state.signedIn) {
        renderHomeScreen();
    } else {
        renderSignupScreen();
    }
}

restoreSession();
