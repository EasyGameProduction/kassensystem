import axios from 'axios'
import { Settings } from '@/backend_settings'
import { Desktop } from './desktop';
import store from '@/store';

export class Kassenprojekt{
    static async get(konvKey){
        try{
            const response = await axios.get(
                `${Settings.url}/kassenprojektByKonvKey/${konvKey}`
            );
            return response.data;
        } catch(err){
            throw err;
        }
    }
    static getLocal(){
        return JSON.parse(store.state.kasse.kassenprojektItems);
    }

    static async add(kassenprojektItem){
        console.log(kassenprojektItem)
        try{
            const response = await axios.post(
                `${Settings.url}/addKassenprojektNeu`,
                kassenprojektItem
            );

            return true;
        } catch(err){
            throw err;
        }
    }
    static addLocal(kassenprojektItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'K',
            modKz: 'I',
            data: kassenprojektItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let kassenprojektItems = JSON.parse(store.state.kasse.kassenprojektItems);
        if(kassenprojektItems == false || kassenprojektItems == undefined || kassenprojektItems == '' || !kassenprojektItems){
            kassenprojektItems = new Array();
        }
        kassenprojektItems.push(kassenprojektItem);

        store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(kassenprojektItems));
    }

    static async delete(kassenprojektItem){
        try{
            let Id = kassenprojektItem.Id;
            const response = await axios.delete(
                `${Settings.url}/deleteKassenprojektNeu/${Id}`
            );
            console.log(response);
            return true;
        } catch(err){
            throw err;
        }
    }
    static deleteLocal(kassenprojektItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'K',
            modKz: 'D',
            data: kassenprojektItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        try{
            Desktop.deleteLocalFromKassenprojekt(kassenprojektItem.Id);
        } catch(err){

        }

        let kassenprojektItems = JSON.parse(store.state.kasse.kassenprojektItems);
        let index = kassenprojektItems.findIndex(obj=>obj.Id == kassenprojektItem.Id);
        kassenprojektItems.splice(index, 1);

        store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(kassenprojektItems));
    }

    static async update(kassenprojektItem){
        try{
            const response = await axios.put(
                `${Settings.url}/updateKassenprojekt`, kassenprojektItem
            );

            return true;
        } catch(err){
            throw err;
        }
    }
    static updateLocal(kassenprojektItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'K',
            modKz: 'U',
            data: kassenprojektItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let kassenprojektItems = JSON.parse(store.state.kasse.kassenprojektItems);
        let index = kassenprojektItems.findIndex(obj=>obj.Id == kassenprojektItem.Id);
        kassenprojektItems[index] = kassenprojektItem;
        console.log(kassenprojektItems);

        store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(kassenprojektItems));
    }
}