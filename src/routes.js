import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app/App.js';
import MainLayout from './components/layouts/mainLayout/MainLayout.js';

import TrackerPage from './components/pages/tracker/TrackerPage.js';

export default (
  <Route path="/" component={App}>
    <Route component={MainLayout}>
      <IndexRoute component={TrackerPage} />
      <Route path="*" component={TrackerPage} />
    </Route>
  </Route>
);
