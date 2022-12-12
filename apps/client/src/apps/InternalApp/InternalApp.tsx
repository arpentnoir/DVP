import React from 'react';
import { Route } from 'react-router-dom';
import { BaseApp } from '../BaseApp';

const InternalOnlyRoute = () => <div>Internal Only Route</div>;

export const InternalApp = () => {
  return (
    <BaseApp>
      <Route path="/internal" element={<InternalOnlyRoute />}></Route>
    </BaseApp>
  );
};
