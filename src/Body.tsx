import BodyFooter from './BodyFooter';
import Notation from './Notation';
import Tab from './Tab';

function Body() {
  const abc = 'M: 4/4\n' + 'L: 1/8\n' + '|CEG_B AGFE D_DC|';

  return (
    <div className="body">
      <Notation abcNotation={abc} />
      <Tab />
      <BodyFooter />
    </div>
  );
}

export default Body;
