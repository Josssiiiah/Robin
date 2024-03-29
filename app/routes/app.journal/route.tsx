import React, { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { useSubmit } from '@remix-run/react';
import { Editor } from "novel";
import { Input } from '~/components/ui/input';
import { FaTrash } from 'react-icons/fa';

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
}

export default function Journal() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSave = () => {
    if (title.trim() !== '' && content.trim() !== '') {
      const newNote: Note = {
        id: Date.now(),
        title: title.trim(),
        content: content,
        timestamp: new Date().toLocaleString(),
      };
      setNotes([...notes, newNote]);
      setCurrentNote(newNote);
      setTitle('');
      setContent('');
    }
  };

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDeleteNote = () => {
    if (currentNote) {
      const updatedNotes = notes.filter((note) => note.id !== currentNote.id);
      setNotes(updatedNotes);
      setCurrentNote(null);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4 text-center">Notes</h2>
        <ul className="divide-y divide-gray-300">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`cursor-pointer p-2 hover:bg-gray-200 ${
                currentNote?.id === note.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleNoteClick(note)}
            >
              <div className="font-bold">{note.title}</div>
              <div className="text-xs text-gray-500">{note.timestamp}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4"
        />
        <Editor
          disableLocalStorage={true}
          defaultValue={{ "type": "doc", "content": [] }}
          onDebouncedUpdate={(editor?: any) => {
            setContent(editor?.getHTML());
          }}
        />
        <div className="mt-4 flex justify-between">
          <Button onClick={handleSave}>Save Note</Button>
          {currentNote && (
            <Button
              onClick={handleDeleteNote}
              variant="destructive"
              className="ml-4"
            >
              <FaTrash className="mr-2" />
              Delete Note
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}