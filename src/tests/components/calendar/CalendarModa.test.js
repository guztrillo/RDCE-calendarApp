
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import moment from 'moment';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';


jest.mock('../../../actions/events', () => ({
     eventStartUpdate: jest.fn(),
     eventClearActiveEvent: jest.fn(),
     eventStartAddNew: jest.fn()
}));

jest.mock('sweetalert2', () => ({
     fire: jest.fn()
}))

Storage.prototype.setItem = jest.fn();


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');


const initState = {
     ui: {
          modalOpen: true
     },
     auth: {

          uid: '123ABC',
          name: 'Juan'
     },
     calendar: {
          events: [],
          activeEvent: {
               title: 'Hola Mundo',
               notes: 'Algunas notas',
               start: now.toDate(),
               end: nowPlus1.toDate()
          }
     }
}

const store = mockStore(initState);

store.dispatch = jest.fn()

const wrapper = mount(
     <Provider store={store}>
          <CalendarModal/>
     </Provider>
)       


describe('Pruebas en <CalendarModal/>', () => {

     beforeEach(() => {
          jest.clearAllMocks();
     })

     test('debe de mostrar el Modal', () => {
         
          // expect(wrapper.find('.modal').exists()).toBe(true);
          expect(wrapper.find('Modal').prop('isOpen')).toBe(true);

     });

     test('Debe llamar la acción de actualizar y cerrar el Modal', () => {
          
          wrapper.find('form').simulate('submit', {
               preventDefault(){}
          });

          expect( eventStartUpdate).toHaveBeenCalledWith( initState.calendar.activeEvent);

          expect( eventClearActiveEvent).toHaveBeenCalled();

     });

     test('Debe mostrar error si falta el título', () => {
          
          wrapper.find('form').simulate('submit', {
               preventDefault(){}
          });

          expect( wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);

     });

     test('Debe crear un nuevo evento', () => {
          
          const initState = {
               ui: {
                    modalOpen: true
               },
               auth: {
          
                    uid: '123ABC',
                    name: 'Juan'
               },
               calendar: {
                    events: [],
                    activeEvent: null
               }
          }
          
          const store = mockStore(initState);
          
          store.dispatch = jest.fn()
          
          const wrapper = mount(
               <Provider store={store}>
                    <CalendarModal/>
               </Provider>
          )      
          
          wrapper.find('input[name="title"]').simulate('change', {
               target: {
                    name: 'title',
                    value: 'Hola pruebas'
               }
          });

          wrapper.find('form').simulate('submit', {
               preventDefault(){}
          });

          expect(eventStartAddNew).toHaveBeenCalledWith({
               start: expect.anything(),
               end: expect.anything(),
               title: 'Hola pruebas',
               notes: ''
          })

          expect( eventClearActiveEvent).toHaveBeenCalled();

     });

     test('Debe de validar las fechas', () => {
          wrapper.find('input[name="title"]').simulate('change', {
               target: {
                    name: 'title',
                    value: 'Hola pruebas'
               }
          });

          const hoy = new Date();

          act(()=> {
               wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);
          })

          
          wrapper.find('form').simulate('submit', {
               preventDefault(){}
          });

          expect(Swal.fire).toHaveBeenCalledWith('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error')
     })
     
     
     
     
     
})
