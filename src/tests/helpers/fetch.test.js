import { fetchConToken, fetchSinToken } from "../../helpers/fetch"


describe('Pruebas en fetch.js', () => {
     
     let token = '';

     test('FetchSinToken debe funcionar', async () => {
          
          const resp = await fetchSinToken('auth', {email: 'fernando@gmail.com', password: '123456'}, 'POST');

          expect( resp instanceof Response ).toBe(true);

          const body = await resp.json();

          expect( body.ok).toBe(true);

          token = body.token;
     });

     test('FetchConToken debe funcionar',  async() => {
          localStorage.setItem('token', token);

          const resp = await fetchConToken('events/611d1e01760b174014645ba5', {}, 'DELETE');

          const body = await resp.json();

          expect( body.msg ).toBe('El evento no existe');
     })
     
     
})
