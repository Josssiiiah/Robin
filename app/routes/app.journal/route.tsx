import { useState, useEffect } from 'react';

interface Folder {
  id: string;
  name: string;
}

interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
}

export default function Route() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');

  useEffect(() => {
    // Load folders and notes from local storage
    const storedFolders = localStorage.getItem('folders');
    const storedNotes = localStorage.getItem('notes');
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    // Save folders and notes to local storage whenever they change
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [folders, notes]);

  const createFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: `New Folder ${folders.length + 1}`,
    };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((folder) => folder.id !== folderId);
    const updatedNotes = notes.filter((note) => note.folderId !== folderId);
    setFolders(updatedFolders);
    setNotes(updatedNotes);
    setSelectedFolderId(null);
    setSelectedNoteId(null);
    setNoteContent('');
  };

  const createNote = () => {
    if (selectedFolderId) {
      const newNote: Note = {
        id: Date.now().toString(),
        folderId: selectedFolderId,
        title: `New Note ${notes.filter((note) => note.folderId === selectedFolderId).length + 1}`,
        content: '',
      };
      setNotes([...notes, newNote]);
      setSelectedNoteId(newNote.id);
      setNoteContent('');
    }
  };

  const saveNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: noteContent };
        }
        return note;
      });
      setNotes(updatedNotes);
    }
  };

  const deleteNote = () => {
    if (selectedNoteId) {
      const updatedNotes = notes.filter((note) => note.id !== selectedNoteId);
      setNotes(updatedNotes);
      setSelectedNoteId(null);
      setNoteContent('');
    }
  };

  useEffect(() => {
    // Update noteContent when selectedNoteId changes
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    if (selectedNote) {
      setNoteContent(selectedNote.content);
    } else {
      setNoteContent('');
    }
  }, [selectedNoteId, notes]);

  return (
    <div className="flex flex-col min-h-screen p-10 bg-gray-100">
            <h1 className="font-bold text-4xl text-center pb-12">Journals</h1>

      <div className='flex w-full'>

      <div className="w-1/4 bg-gray-100 ">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Folders</h2>
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className={`flex items-center justify-between cursor-pointer ${
                  selectedFolderId === folder.id ? 'bg-blue-200' : ''
                } p-2 rounded`}
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <span>{folder.name}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(folder.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-black text-white px-4 py-2 mt-4 rounded"
            onClick={createFolder}
          >
            New Folder
          </button>
        </div>
      </div>
      <div className="w-[15%] bg-gray-50 border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Notes</h2>
          <ul className="space-y-2">
            {notes
              .filter((note) => note.folderId === selectedFolderId)
              .map((note) => (
                <li
                  key={note.id}
                  className={`cursor-pointer ${
                    selectedNoteId === note.id ? 'bg-blue-200' : ''
                  } p-2 rounded`}
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  {note.title}
                </li>
              ))}
          </ul>
          <button
            className="bg-black text-white px-4 py-2 mt-4 rounded"
            onClick={createNote}
            disabled={!selectedFolderId}
          >
            New Note
          </button>
        </div>
      </div>
      <div className="flex-1 p-4">
        {selectedNoteId ? (
          <div>
            <textarea
              className="w-full h-64 p-2 border rounded"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="mt-4 space-x-2">
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={saveNote}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteNote}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a note to view its content.</p>
        )}
      </div>
      </div>

    </div>
  );
}