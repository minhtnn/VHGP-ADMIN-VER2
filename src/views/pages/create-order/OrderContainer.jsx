import React, { useState, useEffect } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import CreateOrder from "./CreateOrder";
import OrderPage1 from "./OrderPage1";
import OrderPage3 from "./OrderPage3";
// container of order
const OrderContainer = () => {
  const { path } = useRouteMatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch data or initialize any necessary state
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <Container className="mt--6" fluid>
        <Switch>
          <Route exact path={`${path}`}>
            <CreateOrder navigateToPage={handlePageChange} />
          </Route>
          <Route path={`${path}/page1`} component={OrderPage1} />
          <Route path={`${path}/page3`} component={OrderPage3} />
        </Switch>
      </Container>
    </>
  );
};

export default OrderContainer;
