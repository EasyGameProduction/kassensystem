import axios from 'axios'
import { Settings } from '@/backend_settings'
import store from '@/store';

export class Pfand{
    static async get(kassenprojektId, desktopId){
        try{
            const response = await axios.get(
                `${Settings.url}/pfandByKassenprojektDesktop/${kassenprojektId}-${desktopId}`
            );

            let data = response.data.data;
            if(data == false || data == undefined || data == '' || !data){
                data = new Array();
            } else{
                if(data.length > 0){
                    data = data.filter(obj=>obj.kassenprojektID == kassenprojektId && obj.desktopID == desktopId);
                }
            }
            return data;
        } catch(err){
            throw err;
        }
    }
    static getLocal(kassenprojektId, desktopId){
        let data = JSON.parse(store.state.kasse.pfandItems);
        if(data == false || data == undefined || data == '' || !data){
            data = new Array();
        } else{
            if(data.length > 0){
                data = data.filter(obj=>obj.kassenprojektID == kassenprojektId && obj.desktopID == desktopId);
            }
        }
        console.log(data);
        return data;
    }

    static async add(pfandItem){
        try{
            const response = await axios.post(
                `${Settings.url}/addPfand/`,
                pfandItem
            );

            return true;
        } catch(err){
            throw err;
        }
    }
    static addLocal(pfandItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'P',
            modKz: 'I',
            data: pfandItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let pfandItems = JSON.parse(store.state.kasse.pfandItems);
        if(pfandItems == false || pfandItems == undefined || pfandItems == '' || !pfandItems){
            pfandItems = new Array();
        }
        pfandItems.push(pfandItem);

        store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(pfandItems));
    }

    static async delete(pfandItem){
        try{
            const response = await axios.post(
                `${Settings.url}/deletePfand/`,
                { params: { kassenprojektID: pfandItem.kassenprojektID, desktopID: pfandItem.desktopID, Id: pfandItem.Id } }
            );

            return true;
        } catch(err){
            throw err;
        }
    }
    static deleteLocal(pfandItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'P',
            modKz: 'D',
            data: pfandItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let pfandItems = JSON.parse(store.state.kasse.pfandItems);
        let index = pfandItems.findIndex(obj=>obj.Id == pfandItem.Id && obj.kassenprojektID == pfandItem.kassenprojektID && obj.desktopID == pfandItem.desktopID);
        pfandItems.splice(index, 1);

        store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(pfandItems));
    }

    static deleteLocalFromKassenprojekt(kassenprojektID){
        let pfandItems = JSON.parse(store.state.kasse.pfandItems);
        try{
            pfandItems = pfandItems.filter(obj=>obj.kassenprojektID != kassenprojektID);
            store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(pfandItems));
        } catch(err){
            return false;
        }
    }

    static deleteLocalFromDesktop(kassenprojektID, desktopID){
        let pfandItems = JSON.parse(store.state.kasse.pfandItems);
        try{
            let pfandTemps = pfandItems.filter(obj=>obj.kassenprojektID == kassenprojektID && obj.desktopID == desktopID);
            pfandTemps.forEach(pfandItem => {
                let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
                if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
                    updateZeiger = new Array();
                }
                updateZeiger.push({
                    obj: 'P',
                    modKz: 'D',
                    data: pfandItem
                })
            });
            pfandItems = pfandItems.filter(obj=>obj.kassenprojektID != kassenprojektID && obj.desktopID != desktopID);
            store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(pfandItems));
        } catch(err){
            return false;
        }
    }

    static async update(pfandItem){
        try{
            const response = await axios.put(
                `${Settings.url}/updatePfand/`, pfandItem
            );

            return true;
        } catch(err){
            throw err;
        }
    }
    static updateLocal(pfandItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'P',
            modKz: 'U',
            data: pfandItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let pfandItems = JSON.parse(store.state.kasse.pfandItems);
        
        if(pfandItems == false || pfandItems == undefined || pfandItems == '' || !pfandItems){
            updateZeiger.splice(updateZeiger.length - 1, 1);
            store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));
            return;
        }
        let index = pfandItems.findIndex(obj=>obj.Id == pfandItem.Id && obj.kassenprojektID == pfandItem.kassenprojektID && obj.desktopID == pfandItem.desktopID);
        pfandItems[index] = pfandItem;
        console.log(pfandItem);

        store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(pfandItems));
    }
}