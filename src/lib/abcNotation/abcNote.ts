export class AbcPitch {
  private accidental: number;
  private naturalName: string;

  constructor(readonly pitch: string) {
    this.accidental = pitch.includes('#') ? 1 : pitch.includes('b') ? -1 : 0;
    this.naturalName = pitch.slice(0, -1).replace(/[#b]/g, '') ?? '';
  }

  toString() {
    return this.toAccidental();
  }

  private toAccidental() {
    if (this.accidental === 1) {
      return `^${this.naturalName}`;
    }
    if (this.accidental === -1) {
      return `_${this.naturalName}`;
    }

    return this.naturalName;
  }
}

export class AbcNote {
  pitch: AbcPitch;
  octave: number;
  duration: AbcEightNote;

  constructor(note: string) {
    this.octave = parseInt(note.slice(-1) ?? '4');
    this.pitch = new AbcPitch(note);
    this.duration = new AbcEightNote();
  }

  toString() {
    return this.pitch.toString() + this.toOctave() + new AbcEightNote().toString();
  }

  private toOctave() {
    if (this.octave === 0) {
      return ',,,,';
    }

    if (this.octave === 1) {
      return ',,,';
    }

    if (this.octave === 2) {
      return ',,';
    }

    if (this.octave === 3) {
      return ',';
    }

    if (this.octave === 4) {
      return "'";
    }

    if (this.octave === 5) {
      return "''";
    }

    if (this.octave === 6) {
      return "'''";
    }

    if (this.octave === 7) {
      return "''''";
    }

    if (this.octave === 8) {
      return "'''''";
    }

    return '';
  }
}

class AbcEightNote {
  toString() {
    return '';
  }
}
