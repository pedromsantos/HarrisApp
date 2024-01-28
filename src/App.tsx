import './App.css';

function App() {
  return (
    <section className="layout">
      <div className="header">Barry Harris Line generation App</div>
      <div className="left-side">
        <div>
          <b>Select Pitch</b>
        </div>
        <ul>
          <li>
            <a href="#">C</a>
          </li>
          <li>
            <a href="#">C#</a>
            <a href="#">Db</a>
          </li>
          <li>
            <a href="#">D</a>
          </li>
          <li>
            <a href="#">D#</a>
            <a href="#">Eb</a>
          </li>
          <li>
            <a href="#">E</a>
          </li>
          <li>
            <a href="#">F</a>
          </li>
          <li>
            <a href="#">F#</a>
            <a href="#">Gb</a>
          </li>
          <li>
            <a href="#">G</a>
          </li>
          <li>
            <a href="#">G#</a>
            <a href="#">Ab</a>
          </li>
          <li>
            <a href="#">A</a>
          </li>
          <li>
            <a href="#">A#</a>
            <a href="#">Bb</a>
          </li>
          <li>
            <a href="#">B</a>
          </li>
          <li>
            <a href="#">C</a>
          </li>
        </ul>
        <div>
          <b>Select Scale</b>
        </div>
        <ul>
          <li>
            <a href="#">Major</a>
          </li>
          <li>
            <a href="#">Dominant</a>
          </li>
          <li>
            <a href="#">Minor</a>
          </li>
        </ul>
      </div>
      <div className="body">
        <div>
          <div>
            <b>Notation line</b>
          </div>
          <div></div>
        </div>
        <hr />
        <div>
          <div>
            <b>Guitar Line</b>
          </div>
          <div>
            e|-----------------------|
            <br />
            B|-----------------------|
            <br />
            G|-------3-2-------------|
            <br />
            D|---2-5-----5-3-2-------|
            <br />
            A|-3---------------5-4-3-|
            <br />
            E|-----------------------|
            <br />
          </div>
        </div>
      </div>
      <div className="right-side">
        <div>
          <b>Select Action</b>
        </div>
        <ul>
          <li>
            <a href="#">Arpeggio Up</a>
          </li>
          <li>
            <a href="#">Arpeggio Up form last pitch</a>
          </li>
          <li>
            <a href="#">Scale Down</a>
          </li>
          <li>
            <a href="#">Scale Down with extra half steps</a>
          </li>
          <li>
            <a href="#">Pivot Arpeggio</a>
          </li>
          <li>
            <a href="#">Pivot Arpeggio from last picth</a>
          </li>
          <li>
            <a href="#">Resolve to</a>
          </li>
        </ul>
      </div>
      <div className="footer">Pedro Moreira Santos (https://github.com/pedromsantos)</div>
    </section>
  );
}

export default App;
