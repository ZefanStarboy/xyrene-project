// Script tambahan luar React (opsional)
document.addEventListener('DOMContentLoaded', () => {
  const profileToggle = document.querySelector('#profileToggle');
  const dropdownMenu = document.querySelector('#profileDropdown');

  if (profileToggle && dropdownMenu) {
    profileToggle.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });

    // Optional: klik di luar dropdown untuk menutup
    document.addEventListener('click', (e) => {
      if (!profileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }
});