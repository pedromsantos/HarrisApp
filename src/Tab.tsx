function Tab() {
  return (
    <div>
      <div>
        <b>Guitar Line</b>
      </div>
      <div>
        {/* Guitar Tab content */}
        <pre>
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
        </pre>
      </div>
      <div>
        <ul>
          <li>
            <a href="#">Open Position</a>
          </li>
          <li>
            <a href="#">C Position</a>
          </li>
          <li>
            <a href="#">A Position</a>
          </li>
          <li>
            <a href="#">G Position</a>
          </li>
          <li>
            <a href="#">E Position</a>
          </li>
          <li>
            <a href="#">D Position</a>
          </li>
          <li>
            <a href="#">C8 Position</a>
          </li>
          <li>
            <a href="#">A8 Position</a>
          </li>
          <li>
            <a href="#">G8 Position</a>
          </li>
          <li>
            <a href="#">E8 Position</a>
          </li>
          <li>
            <a href="#">D8 Position</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Tab;
