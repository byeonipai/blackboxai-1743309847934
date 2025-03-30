class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <i class="fas fa-book-open"></i>
          Notes App
        </h1>
        <button id="theme-toggle" class="px-3 py-1 rounded bg-white text-blue-600 hover:bg-blue-50 transition">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    `;

    // Theme toggle functionality
    this.querySelector('#theme-toggle').addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const icon = this.querySelector('#theme-toggle i');
      icon.classList.toggle('fa-moon');
      icon.classList.toggle('fa-sun');
    });
  }
}

customElements.define('app-header', AppHeader);