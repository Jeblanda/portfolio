const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

let icon = toggleButton.querySelector('.icon');
if (!icon) {
    icon = document.createElement('span');
    icon.classList.add('icon');
    icon.textContent = '☀️';
    icon.style.display = 'inline-block';
    icon.style.transition = 'transform 0.4s ease';
    toggleButton.prepend(icon);
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
        icon.textContent = '🌙';
        toggleButton.style.backgroundColor = '#f5f5f5';
        toggleButton.style.color = '#121212';
        icon.style.transform = 'translateX(5px)';
    } else {
        icon.textContent = '☀️';
        toggleButton.style.backgroundColor = '#121212';
        toggleButton.style.color = '#f5f5f5';
        icon.style.transform = 'translateX(-5px)';
    }

    setTimeout(() => {
        icon.style.transform = 'translateX(0)';
    }, 200);
});
