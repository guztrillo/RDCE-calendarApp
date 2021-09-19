import { startLogin } from "../../actions/auth";
import { authReducer } from "../../reducers/authReducer"
import { types } from "../../types/types";


const initState = {
     checking: true,
}

describe('Pruebas en authReducer', () => {
     
     test('Debe retornar el estado por defecto', () => {
          const state = authReducer(initState, {});

          expect(state).toEqual(initState);
     });

     test('Debe de autenticar el usuario', () => {
          const action = {
               type: types.authLogin,
               payload: {
                    uid: '123',
                    name: 'Fernando'
               }
           };

          const state = authReducer(initState, action);

          expect(state).toEqual({ checking: false, uid: '123', name: 'Fernando' })
     });
})
