class NoteItem extends HTMLElement {
  static get observedAttributes() { return ['note-id']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    try {
      // Pengecekan dasar sebelum render
      if (!this.shadowRoot || !this.hasAttribute('note-id') || !window.notes) {
        console.warn('Kondisi render tidak terpenuhi');
        return;
      }

      const noteId = this.getAttribute('note-id');
      const note = window.notes.find(n => n.id === noteId);
      if (!note) return;

      // Render template
      this.shadowRoot.innerHTML = `
        <style>
          .note-card {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 2px 6px rgba(249, 168, 212, 0.1);
            border-left: 4px solid #f9a8d4;
            margin-bottom: 1rem;
            min-height: 200px;
            display: flex;
            flex-direction: column;
          }
          .note-title {
            font-size: 1.2rem;
            color: #831843;
            margin-bottom: 1rem;
          }
          .note-body {
            flex-grow: 1;
            color: #4b5563;
          }
          .note-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1rem;
          }
          .edit-btn, .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
          }
          .edit-btn { color: #d53f8c; }
          .delete-btn { color: #e53e3e; }
        </style>
        <div class="note-card">
          <div class="note-title">${note.title}</div>
          <div class="note-body">${note.body}</div>
          <div class="note-footer">
            <button class="edit-btn" aria-label="Edit note">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="delete-btn" aria-label="Delete note">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;

      // Event handling dengan pengecekan yang lebih aman
      this.setupEventHandlers(note);
    } catch (error) {
      console.error('Error rendering note:', error);
    }
  }

  setupEventHandlers(note) {
    try {
      if (!this.shadowRoot) return;

      const editBtn = this.shadowRoot.querySelector('.edit-btn');
      const deleteBtn = this.shadowRoot.querySelector('.delete-btn');

      if (!editBtn || !deleteBtn) {
        console.warn('Tombol tidak ditemukan');
        return;
      }

      // Handler untuk edit
      editBtn.onclick = () => {
        try {
          this.dispatchEvent(new CustomEvent('note-edit', {
            detail: {
              noteId: note.id,
              title: note.title,
              body: note.body
            },
            bubbles: true
          }));
        } catch (error) {
          console.error('Error saat edit:', error);
        }
      };

      // Handler untuk delete
      deleteBtn.onclick = () => {
        try {
          this.dispatchEvent(new CustomEvent('note-deleted', {
            detail: { noteId: note.id },
            bubbles: true
          }));
          if (typeof saveNotes === 'function') {
            saveNotes();
          }
        } catch (error) {
          console.error('Error saat delete:', error);
        }
      };

    } catch (error) {
      console.error('Error setting up event handlers:', error);
    }
  }
}

customElements.define('note-item', NoteItem);