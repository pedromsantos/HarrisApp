import abcjs from 'abcjs';
import { useEffect } from 'react';

export interface NotationProps {
  abc: string;
}

function Notation({ abc }: NotationProps) {
  useEffect(() => {
    abcjs.renderAbc('paper', abc);
  }, []);

  return (
    <div>
      <div>
        <b>Notation line</b>
      </div>
      <div id="paper"></div>
    </div>
  );
}

export default Notation;
