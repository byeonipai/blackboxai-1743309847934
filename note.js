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
        .note-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
          white-space: pre-wrap;
        }
        .note-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
        .delete-btn {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
        }
        .dark .note-card {
          background: #1e293b;
        }
        .dark .note-title {
          color: #f8fafc;
        }
        .dark .note-body {
          color: #94a3b8;
        }
      </style>
      <div class="note-card">
        <div class="note-title">${note.title}</div>
        <div class="note-body">${note.body}</div>
        <div class="note-meta text-sm text-gray-500 dark:text-gray-400 mt-2">
          ${new Date(note.createdAt).toLocaleString()}
        </div>
        <div class="note-footer flex justify-between items-center mt-4">
          <button class="archive-btn text-blue-500 dark:text-blue-400" aria-label="${note.archived ? 'Unarchive' : 'Archive'} note">
            <i class="fas ${note.archived ? 'fa-box-open' : 'fa-archive'}"></i>
          </button>
          <button class="delete-btn text-red-500" aria-label="Delete note">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('note-deleted', {
        detail: { noteId: note.id },
        bubbles: true
      }));
    });

    this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('note-archived', {
        detail: { noteId: note.id },
        bubbles: true
      }));
    });
  }
}

customElements.define('note-item', NoteItem);

// Event listener for note updates
document.addEventListener('note-added', () => {
  const notesGrid = document.querySelector('.notes-grid');
  notesGrid.innerHTML = '';
  window.notes.forEach(note => {
    const noteItem = document.createElement('note-item');
    noteItem.setAttribute('note-id', note.id);
    notesGrid.appendChild(noteItem);
  });
});

document.addEventListener('note-deleted', (e) => {
  window.notes = window.notes.filter(note => note.id !== e.detail.noteId);
  const event = new Event('note-added');
  document.dispatchEvent(event);
});