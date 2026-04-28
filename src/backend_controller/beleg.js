import axios from 'axios'
import { Settings } from '@/backend_settings'
import store from '@/store';

export class Beleg{
    static async get(kassenprojektId){
        try{
            const response = await axios.get(
                `${Settings.url}/belegByKassenprojekt/${kassenprojektId}`,
                {
                    timeout: 5000
                }
            );

            console.log(response.data)

            let data = response.data;
            if(data == false || data == undefined || data == '' || !data){
                data = new Array();
            } else{
                if(data.length > 0){
                    data = data.filter(obj=>obj.kassenprojektID == kassenprojektId);
                }
            }
            data.forEach(item => {
                item.artikelAuswahl = JSON.parse(item.artikelAuswahl);
                item.pfandAuswahl = JSON.parse(item.pfandAuswahl);
            });
            console.log(data);
            store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(data))
            store.commit('kasse/SET_ONLINE', true);
            return data;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static getLocal(kassenprojektId){
        let data = JSON.parse(store.state.kasse.belegItems);
        if(data == false || data == undefined || data == '' || !data){
            data = new Array();
        } else{
            if(data.length > 0){
                data = data.filter(obj=>obj.kassenprojektID == kassenprojektId);
            }
        }
        console.log(data);
        return data;
    }

    static async add(belegData){
        try{
            const response = await axios.post(
                `${Settings.url}/addBeleg`,
                { belegData: belegData },
                {
                    timeout: 5000
                }
            );
            console.log(response);
            let belegItems = JSON.parse(store.state.kasse.belegItems);
            if(belegItems == false || belegItems == undefined || belegItems == '' || !belegItems){
                belegItems = new Array();
            }
            console.log(belegItems);
            belegItems.push(belegData);

            store.commit('kasse/SET_BELEG_ITEMS',JSON.stringify(belegItems));
            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static addLocal(belegItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'A',
            modKz: 'I',
            data: belegItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let belegItems = JSON.parse(store.state.kasse.belegItems);
        if(belegItems == false || belegItems == undefined || belegItems == '' || !belegItems){
            belegItems = new Array();
        }
        belegItems.push(belegItem);

        store.commit('kasse/SET_BELEG_ITEMS',JSON.stringify(belegItems));
    }

    static async delete(belegItem){
        let kassenprojektID = belegItem.kassenprojektID;
        let desktopID = belegItem.desktopID;
        let Id = belegItem.Id
        try{
            const response = await axios.delete(
                `${Settings.url}/deleteBeleg/${Id}/${desktopID}/${kassenprojektID}`
            );

            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static deleteLocal(belegItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'A',
            modKz: 'D',
            data: belegItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let belegItems = JSON.parse(store.state.kasse.belegItems);
        console.log(belegItems);
        let index = belegItems.findIndex(obj=>obj.Id == belegItem.Id && obj.kassenprojektID == belegItem.kassenprojektID && obj.desktopID == belegItem.desktopID);
        belegItems.splice(index, 1);

        store.commit('kasse/SET_BELEG_ITEMS',JSON.stringify(belegItems));
    }
}