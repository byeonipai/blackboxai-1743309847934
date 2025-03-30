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
    const noteId = this.getAttribute('note-id');
    const note = window.notes.find(n => n.id == noteId);
    
    if (!note) return;

    this.shadowRoot.innerHTML = `
      <style>
        .note-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 6px rgba(249, 168, 212, 0.1);
          transition: all 0.2s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-left: 4px solid #f9a8d4;
          margin-bottom: 1rem;
        }
        .note-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #831843;
        }
        .note-body {
          color: #4b5563;
          flex-grow: 1;
        }
        .note-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        .edit-btn {
          color: #d53f8c;
          cursor: pointer;
        }
        .delete-btn {
          color: #e53e3e;
          cursor: pointer;
        }
      </style>
      <div class="note-card">
        <div class="note-title">${note.title}</div>
        <div class="note-body">${note.body}</div>
        <div class="note-meta text-sm text-gray-500 mt-2">
          ${new Date(note.createdAt).toLocaleString()}
        </div>
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

    const editBtn = this.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = this.shadowRoot.querySelector('.delete-btn');

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('note-edit', {
          detail: { 
            noteId: note.id,
            title: note.title,
            body: note.body 
          },
          bubbles: true
        }));
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('note-deleted', {
          detail: { noteId: note.id },
          bubbles: true
        }));
      });
    }
  }
}

customElements.define('note-item', NoteItem);

document.addEventListener('note-deleted', (e) => {
  window.notes = window.notes.filter(note => note.id !== e.detail.noteId);
  const event = new Event('note-added');
  document.dispatchEvent(event);
});