import axios from 'axios'
import { Settings } from '@/backend_settings'
import store from '@/store';

export class Benutzer{
    static async get(email, passwort){
        try{
            const response = await axios.get(
                `${Settings.url}/getBenutzer/${email}/${passwort}`,
                {
                    timeout: 5000
                }
            );

            store.commit('kasse/SET_ONLINE', true);
            console.log(response.data);
            return response.data;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }

    static async add(benutzerObj){
        try{
            const response = await axios.post(
                `${Settings.url}/createBenutzer`,
                benutzerObj
            );

            store.commit('kasse/SET_ONLINE', true);
            return response.data;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
}