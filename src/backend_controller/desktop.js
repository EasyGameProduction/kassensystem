import axios from 'axios'
import { Settings } from '@/backend_settings'
import store from '@/store';

export class Desktop{
    static async get(kassenprojektId){
        try{
            const response = await axios.get(
                `${Settings.url}/desktopsByKassenprojekt/${kassenprojektId}`,
                {
                    timeout: 2000
                }
            );

            console.log(response.data);
            let data = response.data;
            if(data == false || data == undefined || data == '' || !data){
                data = new Array();
            } else{
                if(data.length > 0){
                    data = data.filter(obj=>obj.kassenprojektID == kassenprojektId);
                }
            }

            store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(data));
            store.commit('kasse/SET_ONLINE', true);
            return data;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static getLocal(kassenprojektId){
        let data = JSON.parse(store.state.kasse.desktopItems);
        if(data == false || data == undefined || data == '' || !data){
            data = new Array();
        } else{
            if(data.length > 0){
                data = data.filter(obj=>obj.kassenprojektID == kassenprojektId);
            }
        }
        return data;
    }

    static async add(desktopItem){
        try{
            const response = await axios.post(
                `${Settings.url}/addDesktop`,
                desktopItem
            );

            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static addLocal(desktopItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'D',
            modKz: 'I',
            data: desktopItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let desktopItems = JSON.parse(store.state.kasse.desktopItems);
        if(desktopItems == false || desktopItems == undefined || desktopItems == '' || !desktopItems){
            desktopItems = new Array();
        }
        desktopItems.push(desktopItem);

        store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktopItems));
    }

    static async delete(desktopItem){
        try{
            let kassenprojektID = desktopItem.kassenprojektID;
            let Id = desktopItem.Id;

            const response = await axios.delete(
                `${Settings.url}/deleteDesktopNeu/${Id}/${kassenprojektID}`,
            );

            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }

    static deleteLocal(desktopItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'D',
            modKz: 'D',
            data: desktopItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let desktopItems = JSON.parse(store.state.kasse.desktopItems);
        let index = desktopItems.findIndex(obj=>obj.Id == desktopItem.Id && obj.kassenprojektID == desktopItem.kassenprojektID);
        desktopItems.splice(index, 1);

        store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktopItems));
    }

    static deleteLocalFromKassenprojekt(kassenprojektID){
        let desktopItems = JSON.parse(store.state.kasse.desktopItems);
        try{
            desktopItems = desktopItems.filter(obj=>obj.kassenprojektID != kassenprojektID);
            store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktopItems));
        } catch(err){
            return false;
        }
    }

    static async update(desktopItem){
        try{
            const response = await axios.put(
                `${Settings.url}/updateDesktop`, desktopItem
            );

            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static updateLocal(desktopItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'D',
            modKz: 'U',
            data: desktopItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let desktopItems = JSON.parse(store.state.kasse.desktopItems);
        let index = desktopItems.findIndex(obj=>obj.Id == desktopItem.Id && obj.kassenprojektID == desktopItem.kassenprojektID);
        desktopItems[index] = desktopItem;
        console.log(desktopItems);

        store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktopItems));
    }
}