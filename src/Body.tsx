import BodyFooter from './BodyFooter';
import Notation from './Notation';
import Tab from './Tab';

export interface BodyProps {
  tab: string;
  abc: string;
}

function Body({ tab, abc }: BodyProps) {
  return (
    <div className="body">
      <Notation abc={abc} />
      <Tab tab={tab} />
      <BodyFooter />
    </div>
  );
}

export default Body;
