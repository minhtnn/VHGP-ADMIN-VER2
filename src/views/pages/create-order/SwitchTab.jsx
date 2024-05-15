import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OrderPage1 from "./OrderPage1";
import OrderPage2 from "./OrderPage2";
import OrderPage3 from "./OrderPage3";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/drafts" component={OrderPage1} />
        <Route path="/trash" component={OrderPage2} />
        <Route path="/spam" component={OrderPage3} />
      </Switch>
    </Router>
  );
}

export default App;
