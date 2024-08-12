import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './route';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

export default App;
