import './App.css';
import Header from './Header';
import LeftSide from './LeftSide';
import Body from './Body';
import RightSide from './RightSide';
import Footer from './Footer';
import {
  BarryHarrisLine,
  ChordPattern,
  ClosedChord,
  Duration,
  GuitarPitchLines,
  Key,
  Note,
  Octave,
  Pitch,
  Position,
  Rest,
  Scale,
  ScaleDegree,
  ScalePattern,
  SimpleTimeSignature,
  Song,
  Tab,
  abcTune,
} from 'glenn';
import { useState } from 'react';

function HarrisApp() {
  const [rootPitch] = useState<Pitch>(Pitch.C);
  const [scalePattern] = useState<ScalePattern>(ScalePattern.Mixolydian);
  const [scale] = useState<Scale>(new Scale(scalePattern, rootPitch));

  const abc = () => {
    const timeSignature = new SimpleTimeSignature(4, Duration.Quarter);
    const song = new Song(timeSignature, Key.CMajor);

    song
      .add(new Note(Pitch.C, Duration.Quarter, Octave.C4))
      .add(new Note(Pitch.E, Duration.Quarter, Octave.C4))
      .add(new Note(Pitch.G, Duration.Eighth, Octave.C4))
      .add(new Rest(Duration.Eighth))
      .add(new Note(Pitch.B, Duration.Eighth, Octave.C4))
      .add(new Note(Pitch.C, Duration.Eighth, Octave.C5))
      .add(new ClosedChord(Pitch.C, ChordPattern.Major, Duration.Whole, Octave.C4));

    const tune = new abcTune(song.To, Duration.Eighth.To);

    return tune.toString();
  };

  const tab = () => {
    const line = new BarryHarrisLine(scale)
      .arpeggioUpFrom(ScaleDegree.I)
      .resolveTo(Pitch.A)
      .scaleDownFromLastPitchTo(ScaleDegree.III)
      .arpeggioUpFromLastPitch()
      .resolveTo(Pitch.E)
      .pivotArpeggioUpFromLastPitch()
      .build();

    const guitarLine = new GuitarPitchLines(line, Position.C);
    return Tab.render(guitarLine.toTab());
  };

  return (
    <section className="layout">
      <Header />
      <LeftSide />
      <Body tab={tab()} abc={abc()} />
      <RightSide />
      <Footer />
    </section>
  );
}

export default HarrisApp;
