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

            if(response.data == " " || response.data == ""){
                throw err;
            }

            store.commit('kasse/SET_ONLINE', true);
            console.log(response.data);
            return response.data;
        } catch (err) {
            try {
                const response2 = await axios.get(
                    `${Settings.url}/getBenutzerBody`,
                    {
                        params: {
                            email,
                            passwort
                        },
                        timeout: 5000
                    }
                );

                store.commit("kasse/SET_ONLINE", true);
                console.log(response2.data);
                return response2.data;
            } catch (err2) {
                store.commit("kasse/SET_ONLINE", false);
                throw err2;
            }
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