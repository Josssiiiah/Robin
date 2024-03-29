import React, { useState } from 'react';
import { Textarea } from '~/components/ui/textarea';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useSubmit } from '@remix-run/react';

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
}

export default function Journal() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const submit = useSubmit();

  const handleSave = () => {
    if (currentNote.trim() !== '') {
      const newNote: Note = {
        id: Date.now(),
        title: currentTitle.trim() !== '' ? currentTitle : 'Untitled',
        content: currentNote,
        timestamp: new Date().toLocaleString(),
      };
      setNotes([...notes, newNote]);
      setCurrentNote('');
      setCurrentTitle('');
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        <ul className="divide-y divide-gray-300">
          {notes.map((note) => (
            <li
              key={note.id}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => {
                setCurrentNote(note.content);
                setCurrentTitle(note.title);
              }}
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
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          className="w-full mb-4"
        />
        <Textarea
          placeholder="Write your note here..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="w-full h-80 mb-4"
        />
        <Button onClick={handleSave}>Save Note</Button>
      </div>
    </div>
  );
}