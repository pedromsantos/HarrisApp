import './App.css';
import Header from './Header';
import LeftSide from './LeftSide';
import Body from './Body';
import RightSide from './RightSide';
import Footer from './Footer';

function HarrisApp() {
  return (
    <section className="layout">
      <Header />
      <LeftSide />
      <Body />
      <RightSide />
      <Footer />
    </section>
  );
}

export default HarrisApp;
