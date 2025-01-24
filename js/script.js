document.addEventListener('DOMContentLoaded', () => {
    // Start Game Button
    const startButton = document.querySelector('#start-game');
    const hamburger = document.querySelector('#hamburger');
    const menu = document.querySelector('#menu');
    const closeMenu = document.querySelector('#close-menu');
    const homeLink = document.querySelector('#home-link');
    const howToPlayLink = document.querySelector('#how-to-play-link');

    // Navigate to game page
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    }

    // Open Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            menu.style.display = 'flex';
        });
    }

    // Close Menu
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    // Navigate Back to Home
    if (homeLink) {
        homeLink.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Show How to Play Information
    if (howToPlayLink) {
        howToPlayLink.addEventListener('click', () => {
            alert('How to Play:\n\n- Use Arrow Keys to move.\n- Rotate using Up Arrow.\n- Clear lines to score points.');
        });
    }

    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    };

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);

        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }

        darkModeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    };

    // Glow
    const glow = document.createElement('div');
    glow.classList.add('glow');
    document.body.appendChild(glow);
    
    document.addEventListener('mousemove', (e) => {
      const x = e.pageX;
      const y = e.pageY;
    
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    });

});
