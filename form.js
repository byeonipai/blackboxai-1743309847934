class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold mb-4 dark:text-white">Add New Note</h2>
        <form id="note-form">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
            <input 
              type="text" 
              id="title" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Note title"
              required
            >
            <p class="text-red-500 text-sm mt-1 hidden" id="title-error"></p>
          </div>
          <div class="mb-4">
            <label for="body" class="block text-sm font-medium mb-1 dark:text-gray-300">Content</label>
            <textarea 
              id="body" 
              rows="4"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Note content"
              required
            ></textarea>
            <p class="text-red-500 text-sm mt-1 hidden" id="body-error"></p>
          </div>
          <button 
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            <i class="fas fa-plus mr-2"></i>Add Note
          </button>
        </form>
      </div>
    `;

    // Form validation and submission
    const form = this.querySelector('#note-form');
    const titleInput = this.querySelector('#title');
    const bodyInput = this.querySelector('#body');
    const titleError = this.querySelector('#title-error');
    const bodyError = this.querySelector('#body-error');

    // Real-time validation
    titleInput.addEventListener('input', () => this.validateField(titleInput, titleError));
    bodyInput.addEventListener('input', () => this.validateField(bodyInput, bodyError));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = this.validateField(titleInput, titleError) && 
                     this.validateField(bodyInput, bodyError);

      if (isValid) {
        const newNote = {
          id: `notes-${Math.random().toString(36).substring(2, 15)}`,
          title: titleInput.value,
          body: bodyInput.value,
          createdAt: new Date().toISOString(),
          archived: false
        };
        window.notes.push(newNote);
        this.dispatchEvent(new CustomEvent('note-added', { bubbles: true }));
        form.reset();
      }
    });
  }

  validateField(input, errorElement) {
    if (!input.value.trim()) {
      errorElement.textContent = 'This field is required';
      errorElement.classList.remove('hidden');
      return false;
    }
    errorElement.classList.add('hidden');
    return true;
  }
}

customElements.define('note-form', NoteForm);