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

  const barryLine = () => {
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

    [...barryLine()].forEach((pitchLine) =>
      [...pitchLine.melodicLine(Octave.C4, Duration.Eighth)].map((n) => song.add(n))
    );

    const tune = new abcTune(song.To, Duration.Eighth.To);

    return tune.toString();
  };

  const tab = () => {
    const guitarLine = new GuitarPitchLines(barryLine(), Position.C);
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
