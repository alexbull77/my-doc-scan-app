import Dexie, { type Table } from "dexie";

export interface Note {
  date: string;
  text: string;
  images: string[];
}

export class NotesDB extends Dexie {
  notes!: Table<Note, string>;

  constructor() {
    super("notesDB");
    this.version(1).stores({
      notes: "date",
    });
  }
}

export const db = new NotesDB();
