export class AbcPitch {
  private accidental: number;
  private naturalName: string;

  constructor(readonly pitch: string) {
    this.accidental = pitch.includes('#') ? 1 : pitch.includes('b') ? -1 : 0;
    this.naturalName = pitch.slice(0, -1).replace(/[#b]/g, '');
  }

  toString(): string {
    return this.toAccidental();
  }

  get pitchNaturalName(): string {
    return this.naturalName;
  }

  private toAccidental(): string {
    if (this.accidental === 1) {
      return `^${this.naturalName}`;
    }
    if (this.accidental === -1) {
      return `_${this.naturalName}`;
    }

    return this.naturalName;
  }
}

class AbcEightNote {
  toString(): string {
    return '';
  }
}

export class AbcNote {
  pitch: AbcPitch;
  octave: number;
  duration: AbcEightNote;

  constructor(note: string) {
    this.octave = parseInt(note.slice(-1));
    this.pitch = new AbcPitch(note);
    this.duration = new AbcEightNote();
  }

  toString(): string {
    return this.toOctave() + new AbcEightNote().toString();
  }

  private toOctave(): string {
    const octaveNotations: Record<number, (pitch: string) => string> = {
      0: (p) => `${p.toUpperCase()},,,`,
      1: (p) => `${p.toUpperCase()},,`,
      2: (p) => `${p.toUpperCase()},`,
      3: (p) => p.toUpperCase(),
      4: (p) => p.toLowerCase(),
      5: (p) => `${p.toLowerCase()}'`,
      6: (p) => `${p.toLowerCase()}''`,
      7: (p) => `${p.toLowerCase()}'''`,
      8: (p) => `${p.toLowerCase()}''''`,
    };

    // Get the appropriate notation function based on octave, or default to just the pitch
    const notationFn = octaveNotations[this.octave] ?? ((p) => p);
    return notationFn(this.pitch.toString());
  }
}
