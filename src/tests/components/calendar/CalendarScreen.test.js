
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import {messages} from '../../../helpers/calendar-messages-es'
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events';
import { act } from '@testing-library/react';

jest.mock('../../../actions/events', () => ({
     eventSetActive: jest.fn(),
     eventStartLoading: jest.fn()
}));

Storage.prototype.setItem = jest.fn();


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
     ui: {
          modalOpen: false
     },
     auth: {

          uid: '123ABC',
          name: 'Juan'
     },
     calendar: {
          events: [],
     }
}

const store = mockStore(initState);

store.dispatch = jest.fn()

const wrapper = mount(
     <Provider store={store}>
          <CalendarScreen/>
     </Provider>
)       


describe('Pruebas en <CalendarScreen/>', () => {
     
     beforeEach(()=>{
          jest.clearAllMocks();
     })

     test('Debe mostrarse correctamente', () => {
          expect( wrapper ).toMatchSnapshot();
     });

     test('Pruebas en las interacciones del calendario', () => {
          
          const calendar = wrapper.find('Calendar');

          const calendarMessages = calendar.prop('messages');

          expect(calendarMessages).toEqual(messages);

          calendar.prop('onDoubleClickEvent')();

          expect(store.dispatch).toHaveBeenCalledWith({
               type: types.uiOpenModal
          });

          calendar.prop('onSelectEvent')({ start: 'Hola'});

          expect(eventSetActive).toHaveBeenCalledWith({ start: 'Hola'});

          act(()=> {
               calendar.prop('onView')('week');

               expect( localStorage.setItem).toHaveBeenCalledWith('lastView', 'week')
          })

     })
     
     
})
