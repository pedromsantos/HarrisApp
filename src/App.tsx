import './App.css';
import Header from './Header';
import LeftSide from './LeftSide';
import Body from './Body';
import RightSide from './RightSide';
import Footer from './Footer';
import {
  BarryHarrisLine,
  Duration,
  GuitarPitchLines,
  Key,
  Note,
  Octave,
  Pitch,
  Position,
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
  const [scale] = useState<Scale>(new Scale(ScalePattern.Mixolydian, Pitch.C));

  const line = () => {
    return new BarryHarrisLine(scale)
      .arpeggioUpFrom(ScaleDegree.I)
      .resolveTo(Pitch.A)
      .scaleDownFromLastPitchTo(ScaleDegree.III)
      .arpeggioUpFromLastPitch()
      .resolveTo(Pitch.E)
      .pivotArpeggioUpFromLastPitch()
      .build();
  };

  const abc = () => {
    const timeSignature = new SimpleTimeSignature(4, Duration.Quarter);
    const song = new Song(timeSignature, Key.CMajor);

    [...line()].forEach((sub_lines) =>
      [...sub_lines].map((p) => song.add(new Note(p, Duration.Eighth, Octave.C4)))
    );

    const tune = new abcTune(song.To, Duration.Eighth.To);

    return tune.toString();
  };

  const tab = () => {
    const guitarLine = new GuitarPitchLines(line(), Position.C);
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
