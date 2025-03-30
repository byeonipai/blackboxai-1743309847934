// Data contoh notes
const sampleNotes = [
  {
    id: 'notes-jT-jjsyz61J8XKiI',
    title: 'Welcome to Notes, Dimas!',
    body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
    createdAt: '2022-07-28T10:03:12.594Z',
    archived: false,
  },
  {
    id: 'notes-aB-cdefg12345',
    title: 'Meeting Agenda',
    body: 'Discuss project updates and assign tasks for the upcoming week.',
    createdAt: '2022-08-05T15:30:00.000Z',
    archived: false,
  },
  // ... (data lainnya sesuai contoh yang diberikan)
];

// Inisialisasi notes dari localStorage atau gunakan data contoh jika kosong
window.notes = JSON.parse(localStorage.getItem('notes')) || sampleNotes;

// Fungsi untuk menyimpan notes ke localStorage
function saveNotes() {
  try {
    localStorage.setItem('notes', JSON.stringify(window.notes));
  } catch (error) {
    console.error('Gagal menyimpan notes:', error);
  }
}

// Simpan data contoh ke localStorage jika belum ada
if (!localStorage.getItem('notes')) {
  saveNotes();
}
