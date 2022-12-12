import React from 'react';
import { Route } from 'react-router-dom';
import { BaseApp } from '../BaseApp';

const InternetOnlyRoute = () => <div>Internet Only Route</div>;

export const InternetApp = () => {
  return (
    <BaseApp>
      <Route path="/internet" element={<InternetOnlyRoute />}></Route>
    </BaseApp>
  );
};
