import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import * as fetchModule from '../../helpers/fetch'

jest.mock('sweetalert2',() => ({
     fire: jest.fn()
}))

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {

}

let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

let token = '';

describe('Pruebas en las acciones auth', () => {

     beforeEach(() => {
          store = mockStore(initState);
          jest.clearAllMocks();
     })

     test('startLogin correcto', async () => {

          await store.dispatch(startLogin('fernando@gmail.com', '123456'));

          const actions = store.getActions();

          expect(actions[0]).toEqual({
               type: types.authLogin,
               payload: { 
                    uid: expect.any(String),
                    name: expect.any(String) 
               }
          })

          expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any(String));
          expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));
          token = localStorage.setItem.mock.calls[0][1];
          // console.log(localStorage.setItem.mock.calls[0][1]);
     });

     test('startLogin incorrecto', async() => {
          
          await store.dispatch(startLogin('fernando@gmail.com', '1234567896'));
          let actions = store.getActions();

          // expect(actions.length).toBe(false);
          expect(actions).toEqual([]);
          expect( Swal.fire).toHaveBeenCalledWith("Error", "Password incorrecto", "error");

          await store.dispatch(startLogin('fernando852@gmail.com', '123456'));
          actions = store.getActions();

          expect(actions).toEqual([]);
          expect( Swal.fire).toHaveBeenCalledWith("Error", "No existe usuario con ese email", "error");
     })
     test('startRegister correcto', async () => {

          fetchModule.fetchSinToken = jest.fn(() => ({
               json() {
                    return {
                         ok: true,
                         uid: '123',
                         name: 'pedro',
                         token: '123456abc'
                    }
               }
          }));

          await store.dispatch(startRegister('pedro', 'pedro@gmail.com', '123456'));

          const actions = store.getActions();

          expect( actions[0]).toEqual({
               type: types.authLogin, 
               payload: { uid: '123', name: 'pedro' }
          })

          expect( localStorage.setItem ).toHaveBeenCalledWith('token', '123456abc');
          expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));

     })
     test('startChecking correcto', async() => {

          fetchModule.fetchConToken = jest.fn(() => ({
               json() {
                    return {
                         ok: true,
                         uid: '123',
                         name: 'pedro',
                         token: '123456abc'
                    }
               }
          }));

          await store.dispatch(startChecking())

          const actions = store.getActions();

          expect(actions[0]).toEqual({ 
               type: types.authLogin, 
               payload: { uid: '123', name: 'pedro' } 
          })

          expect(localStorage.setItem).toHaveBeenCalledWith('token', '123456abc');
     })
     


})
