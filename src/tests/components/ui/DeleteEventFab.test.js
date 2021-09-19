import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

jest.mock('../../../actions/events', () => ({
     eventStartDelete: jest.fn()
}))


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {}

const store = mockStore(initState);

store.dispatch = jest.fn()

const wrapper = mount(
     <Provider store={store}>
          <DeleteEventFab/>
     </Provider>
)


describe('Pruebas en <DeleteEventFab />', () => {

     test('Debe hacer match con el snapshot', () => {
          expect(wrapper).toMatchSnapshot();
     });

     test('Debe de llamar el eventStartDelete onClick', () => {
          wrapper.find('.fab-danger').prop('onClick')();


          expect( eventStartDelete ).toHaveBeenCalled();

     })
     
     
})
