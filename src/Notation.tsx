import abcjs from "abcjs";
import { useEffect } from "react";

export interface NotationProps {
	abcNotation: string;
}

function Notation({ abcNotation }: NotationProps) {
  useEffect(() => {
		abcjs.renderAbc("paper", abcNotation);
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