import axios from 'axios'
import { Settings } from '@/backend_settings'
import store from '@/store';

export class Artikel{
    static async get(kassenprojektId, desktopId){
        try{
            const response = await axios.get(
                `${Settings.url}/artikelByKassenprojektDesktop/${kassenprojektId}/${desktopId}`,
                {
                    timeout: 2000
                }
            );

            console.log(response.data)

            let data = response.data;
            if(data == false || data == undefined || data == '' || !data){
                data = new Array();
            } else{
                if(data.length > 0){
                    data = data.filter(obj=>obj.kassenprojektID == kassenprojektId && obj.desktopID == desktopId);
                }
            }
            store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(data));
            store.commit('kasse/SET_ONLINE', true);
            data.sort((a, b) => a.reihenfolge - b.reihenfolge);
            return data;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static getLocal(kassenprojektId, desktopId){
        let data = JSON.parse(store.state.kasse.artikelItems);
        if(data == false || data == undefined || data == '' || !data){
            data = new Array();
        } else{
            if(data.length > 0){
                data = data.filter(obj=>obj.kassenprojektID == kassenprojektId && obj.desktopID == desktopId);
            }
        }
        data.sort((a, b) => a.reihenfolge - b.reihenfolge);
        console.log(data);
        return data;
    }

    static async add(artikelItem){
        try{
            const response = await axios.post(
                `${Settings.url}/addArtikel`,
                artikelItem
            );
            console.log(response);
            let artikelItems = JSON.parse(store.state.kasse.artikelItems);
            if(artikelItems == false || artikelItems == undefined || artikelItems == '' || !artikelItems){
                artikelItems = new Array();
            }
            artikelItems.push(artikelItem);

            store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static addLocal(artikelItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'A',
            modKz: 'I',
            data: artikelItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let artikelItems = JSON.parse(store.state.kasse.artikelItems);
        if(artikelItems == false || artikelItems == undefined || artikelItems == '' || !artikelItems){
            artikelItems = new Array();
        }
        artikelItems.push(artikelItem);

        store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
    }

    static async delete(artikelItem){
        let kassenprojektID = artikelItem.kassenprojektID;
        let desktopID = artikelItem.desktopID;
        let Id = artikelItem.Id
        try{
            const response = await axios.delete(
                `${Settings.url}/deleteArtikel/${Id}/${desktopID}/${kassenprojektID}`
            );

            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static deleteLocal(artikelItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'A',
            modKz: 'D',
            data: artikelItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let artikelItems = JSON.parse(store.state.kasse.artikelItems);
        let index = artikelItems.findIndex(obj=>obj.Id == artikelItem.Id && obj.kassenprojektID == artikelItem.kassenprojektID && obj.desktopID == artikelItem.desktopID);
        artikelItems.splice(index, 1);

        store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
    }

    static deleteLocalFromKassenprojekt(kassenprojektID){
        let artikelItems = JSON.parse(store.state.kasse.artikelItems);
        try{
            artikelItems = artikelItems.filter(obj=>obj.kassenprojektID != kassenprojektID);
            store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
        } catch(err){
            return false;
        }
    }

    static deleteLocalFromDesktop(kassenprojektID, desktopID){
        let artikelItems = JSON.parse(store.state.kasse.artikelItems);
        try{
            let artikelTemps = artikelItems.filter(obj=>obj.kassenprojektID == kassenprojektID && obj.desktopID == desktopID);
            artikelTemps.forEach(artikelItem => {
                let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
                if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
                    updateZeiger = new Array();
                }
                updateZeiger.push({
                    obj: 'A',
                    modKz: 'D',
                    data: artikelItem
                })
            });
            artikelItems = artikelItems.filter(obj=>obj.kassenprojektID != kassenprojektID && obj.desktopID != desktopID);
            store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
        } catch(err){
            return false;
        }
    }

    static async update(artikelItem){
        try{
            const response = await axios.put(
                `${Settings.url}/updateArtikel`, artikelItem
            );
            console.log(artikelItem);
            store.commit('kasse/SET_ONLINE', true);
            return true;
        } catch(err){
            store.commit('kasse/SET_ONLINE', false);
            throw err;
        }
    }
    static updateLocal(artikelItem){
        let updateZeiger = JSON.parse(store.state.kasse.updateZeiger);
        if(updateZeiger == false || updateZeiger == undefined || updateZeiger == '' || !updateZeiger){
            updateZeiger = new Array();
        }
        updateZeiger.push({
            obj: 'A',
            modKz: 'U',
            data: artikelItem
        })
        store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));

        let artikelItems = JSON.parse(store.state.kasse.artikelItems);
        
        if(artikelItems == false || artikelItems == undefined || artikelItems == '' || !artikelItems){
            updateZeiger.splice(updateZeiger.length - 1, 1);
            store.commit('kasse/SET_UPDATE_ZEIGER',JSON.stringify(updateZeiger));
            return;
        }
        let index = artikelItems.findIndex(obj=>obj.Id == artikelItem.Id && obj.kassenprojektID == artikelItem.kassenprojektID && obj.desktopID == artikelItem.desktopID);
        artikelItems[index] = artikelItem;
        console.log(artikelItem);

        store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(artikelItems));
    }
}