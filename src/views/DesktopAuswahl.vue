<template>
  <div class="desktopAuswahl" :style="cssVars">
    <header class="topbar" id="topbar">
      <div class="left-actions">
        <!--<button class="menuButton" :class="menuActive ? 'menuButtonActive' : 'menuButtonDeactive'" @click="openMenu()">≡</button>-->
      </div>
      <div class="title">Desktop wählen</div>
      <div class="right-actions">
        <div class="status"><span class="dot" :class="(online)?'online':'offline'"></span> {{ (online)?'online':'offline' }}</div>
        <label class="switch">
          <input :checked="darkModeDefault" id="checkbox" type="checkbox" v-model="darkMode" @change="$emit('switchDarkmode',darkMode)"/>
          <span class="slider">
            <div class="star star_1"></div>
            <div class="star star_2"></div>
            <div class="star star_3"></div>
            <svg viewBox="0 0 16 16" class="cloud_1 cloud" aria-hidden="true">
              <path
                transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                fill="#fff"
                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
              ></path>
            </svg>
          </span>
        </label>
      </div>
    </header>

    <main class="workspace" role="list" aria-label="Kassenprojekte">
      <AuswahlItem v-for="desktopItem in desktops" role="button" tabindex="0" :key="desktopItem.Id" @click="$emit('selectDesktop', desktopItem)" @keydown.enter="$emit('selectDesktop', desktopItem)" :item="desktopItem" @delete="this.delete(desktopItem)" @changeName="this.changeName" :darkMode="this.darkMode" :type="'D'" :selectedKassenprojekt="this.$props.kassenprojekt"/>
      <div class="addItem" @click="this.addDesktop()">
        <button class="add">+</button>
      </div>
    </main>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { mapState, mapMutations } from 'vuex';
import AuswahlItem from '@/components/AuswahlItem.vue';
import { Desktop } from '@/backend_controller/desktop';

export default {
  name: 'desktopAuswahl',
  components: {
    AuswahlItem
  },
  props: {
    kassenprojekt: Object,
    darkModeDefault: Boolean,
    online: Boolean
  },
  data() {
    return {
      desktops: [],

      menuActive: false,
      darkMode: this.darkModeDefault,
      // dezenter lokaler Platzhalter, kannst du ersetzen
      placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%23efefef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="16">Kein Bild</text></svg>'
    };
  },
  computed: {
    ...mapState('kasse', ['desktopItems']),

    cssVars() {
      return {
        '--header-height': '54px'
      };
    }
  },
  methods: {
    openMenu() {
      this.menuActive = !this.menuActive;
    },
    more(projekt){

    },
    async addDesktop(){
      let html = "";
      html += `<input id="name" maxLength="50" class="swal2-input" placeholder="Bezeichnung" style="margin-left:0 !important; margin-right: 0 !important; width: 100% !important">`;
      html += `<input id="password" maxLength="50" class="swal2-input" placeholder="Passwort" style="margin-left:0 !important; margin-right: 0 !important; width: 100% !important">`;
      html += `<input type="file" id="file" class="swal2-input" placeholder="Bild hochladen" style="margin-left:0 !important; margin-right: 0 !important; width: 100% !important">`;

      const { value: formValues } = await Swal.fire({
          title: "Desktop anlegen",
          html: html,
          focusConfirm: false,
          preConfirm: () => {
              const file = document.getElementById("file").files[0];
              const name = document.getElementById("name").value;
              return { name, file };
          }
      });

      if(formValues){
        const file = formValues.file;
        const name = formValues.name;
        const password = formValues.password;

        // FormData erstellen, um Bild zu senden
        const formData = new FormData();
        formData.append('file', file);

        // Upload der Datei ans Backend
        /*try {
            const response = await fetch('https://feuerwehr-server.de:5000/upload-image-endpoint', {
                method: 'POST',
                body: formData
            });

            const result = await response.json(); // der Pfad oder das Ergebnis vom Backend
            if (result.success) {
                // Wenn der Upload erfolgreich war, Geraet anlegen
                const imagePath = result.filePath; // Bildpfad vom Backend
                this.createGeraet(name, imagePath); // Geraet mit Bildpfad erstellen
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }*/
       
        let newId;
        if(this.desktops!= false && this.desktops!=undefined && this.desktops!= '' &&this.desktops.length > 0){
          this.desktops.sort((a,b) => a.Id - b.Id);
          newId = +this.desktops[this.desktops.length-1].Id + 1;
        } else{
          this.desktops = new Array();
          newId = 1;
        }

        let kassenprojektID = this.$props.kassenprojekt.Id;

        let newObj = {
          Id: newId,
          kassenprojektID: kassenprojektID,
          name: name,
          password: password,
          image: undefined
        }
        console.log(newObj);
        let desktops = JSON.parse(this.$store.state.kasse.desktopItems);
        if(!desktops){
          desktops = new Array();
        }
        //desktops.push(newObj)
        try{
          await Desktop.add(newObj);
        } catch(err){
          Desktop.addLocal(newObj);
        }
        this.getDesktops();
        //this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktops));
        //this.desktops = desktops.filter(obj => obj.kassenprojektID == this.$props.kassenprojekt.Id);
      }
    },
    async delete(obj){
      /*let desktops = JSON.parse(this.$store.state.kasse.desktopItems)
      desktops = desktops.filter(p => ( p.Id != obj.Id || p.kassenprojektID != this.$props.kassenprojekt.Id));
      this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktops));
      this.desktops = desktops.filter(obj => obj.kassenprojektID == this.$props.kassenprojekt.Id);*/
      try{
        await Desktop.delete(obj)
      } catch(err){
        Desktop.deleteLocal(obj)
      }
      this.getDesktops();
    },
    async changeName(obj){
      /*let desktops = JSON.parse(this.$store.state.kasse.desktopItems)
      let index = desktops.findIndex(o=>o.Id == obj.Id && o.kassenprojektID == this.$props.kassenprojekt.Id);
      desktops[index].name = obj.name;
      this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktops));
      this.desktops = desktops.filter(obj => obj.kassenprojektID == this.$props.kassenprojekt.Id);*/
      try{
        await Desktop.update(obj)
      } catch(err){
        Desktop.updateLocal(obj)
      }
      this.getDesktops();
    },
    async changePassword(item){
        var res;
        if(item.password != undefined && item.password != ''){
            await Swal.fire({
                title: "Aktuelles Passwort",
                input: "text",
                showDenyButton: true,
                confirmButtonText: "Speichern",
                denyButtonText: "Abbrechen",
            }).then((result) => {
                res = result;
            })
        } else{
            res = {
                isConfirmed: true
            }
        }

        if(res.isConfirmed){
            if(item.password == res.value || ( item.password == undefined || item.password == '' )){
                let update = Swal.fire({
                    title: "Passwort ändern",
                    input: "text",
                    showDenyButton: true,
                    confirmButtonText: "Speichern",
                    denyButtonText: "Abbrechen",
                }).then((result) => {
                    if(result.isConfirmed){
                        item.password = result.value;
                        let desktops = JSON.parse(this.$store.state.kasse.desktopItems)
                        let index = desktops.findIndex(o=>o.Id == item.Id && o.kassenprojektID == this.$props.kassenprojekt.Id);
                        desktops[index].password = item.password;
                        /*this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(desktops));
                        this.desktops = desktops.filter(obj => obj.kassenprojektID == this.$props.kassenprojekt.Id);*/
                        return true;
                    }
                });
                if(update){
                    try{
                      await Desktop.update(desktops[index]);
                    } catch(err){
                      Desktop.updateLocal(desktops[index]);
                    }
                }
            }
        }
        this.activeMoreId = false;
    },
    async getDesktops(){
      try{
        this.desktops = await Desktop.get(this.$props.kassenprojekt.Id)
      } catch(err){
        this.desktops = Desktop.getLocal(this.$props.kassenprojekt.Id)
      }
    }
  },
  async created(){
    this.getDesktops();
    /*try{
      this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(this.desktops));
    } catch(err){

    }*/
    /*this.desktops = JSON.parse(`${this.desktopItems}`);
    this.desktops = this.desktops.filter(obj => obj.kassenprojektID == this.$props.kassenprojekt.Id);*/
    //this.$store.commit('kasse/SET_DESKTOP_ITEMS',JSON.stringify(this.desktops));
  }
};
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; }

/* Behält Header unverändert (wie gewünscht) */
:host, .desktopAuswahl { height: 100%; }

.desktopAuswahl {
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
  background: var(--bg, #f6f6f6);
  color: var(--ink, #222);
  font: 15px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
  overflow: hidden;
  height: 100vh;
  width: 100%;

  .topbar {
    /* Header unverändert — Styles belassen wie von dir vorgegeben */
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    background: var(--header, #fff);
    border-bottom: 1px solid var(--border, #e6e6e6);
    z-index: 99;

    .left-actions, .right-actions { display: flex; align-items: center; gap: 10px; }
    .title { font-weight: 600; justify-self: center; text-align: center; font-size: 1.25rem; cursor:default }
    .left-actions { justify-content: left; }
    .right-actions { justify-content: right; }

    .menuButton { padding: 6px 10px; border-radius: 999px; background: var(--menu-button); color: var(--ink); border: none; cursor: pointer; }
    .menuButtonActive { transform: rotate(90deg); transition: transform .4s; }
    .menuButtonDeactive { transform: rotate(0deg); transition: transform .4s; }

    .status { display: flex; align-items: center; gap: 6px; color: var(--ink, #222); font-size: 12px; cursor:default;
      .dot { width: 7px; height: 7px; border-radius: 50%; }

      .online{
        background: var(--ok);
      }

      .offline{
        background: var(--danger);
      }
    }
  }

  /* --------- Workspace: Grid mit Kacheln --------- */
  .workspace {
    padding: 24px;          /* Abstand zum Rand wie im Screenshot */
    overflow-y: auto;
    display: grid;
    /* responsive grid: so viele Kacheln wie reinpassen, mind. 180px, max 1fr */
    grid-template-columns: repeat(auto-fit, minmax(180px, 22.8vw));
    gap: 20px;
    align-items: start;
    align-content: start;
    height: 100%;
  }

  .kassenprojektItem {
    background: var(--items, #fff);
    border-radius: 18px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    user-select: none;
    min-height: 180px;

    &:hover, &:focus {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
      outline: none;
    }

    .thumb {
      flex: 1 0 auto;
      width: 100%;
      height: 110px;
      border-radius: 12px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* wichtig damit Bild zuschneidet wie im Screenshot */
      display: block;
    }

    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 6px;
    }
    .name {
      font-size: 1.1rem;
      margin: 0;
      color: var(--ink, #111);
      font-weight: 700;
    }

    .more{
        height: 100%;
        border: none;
        background-color: var(--items);
        color: var(--ink);
        font-weight:bold;
        cursor: pointer;
        position: relative;
        vertical-align: 4em;
        padding-bottom: 8px;
        border-radius: 90px;
        z-index: 4;
    }

    .more:hover{
      background-color: var(--hover);
    }

    .moreContainer{
      position: absolute;
      right: 3%;
      bottom: 5%;
      z-index: 3;
      min-width: 30%;
      min-height: 50%;
      background-color: var(--items);
      box-shadow: var(--shadow);
      border-radius: 10px;
      padding: 4px 0px;

      .moreItems{
        padding: 3px 6px;
      }

      .moreItems:hover{
        background-color: var(--hover);
      }
    }
  }

  .addItem{
    background: var(--items, #fff);
    border-radius: 18px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    padding: 12px;
    display: flex;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    user-select: none;
    min-height: 180px;
    justify-content: center;
    align-items: center;
  }

  .add{
      display: block;
      text-align: center;
      font-size:2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 90px;
      cursor: pointer;
      background-color: var(--bg);
      border-color: var(--border);
      color: var(--ink);
  }

  /* kleine Bildschirme: größere Kacheln in einer Spalte */
  @media (max-width: 480px) {
    .workspace {
      grid-template-columns: 1fr;
      padding: 12px;
      gap: 12px;
    }
    .kassenprojektItem {
      min-height: 140px;
    }
  }

  /* From Uiverse.io by JustCode14 */ 
/* Theme Switch */
/* The switch - the box around the slider */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 4em;
  height: 2em;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2a2a;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.2em;
  width: 1.2em;
  border-radius: 20px;
  left: 0.5em;
  bottom: 0.5em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  box-shadow: inset 8px -4px 0px 0px #fff;
}

.switch input:checked + .slider {
  background-color: #00a6ff;
}

.switch input:checked + .slider:before {
  transform: translateX(1.8em);
  box-shadow: inset 15px -4px 0px 15px #ffcf48;
}

.star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 5px;
  transition: all 0.4s;
  height: 5px;
}

.star_1 {
  left: 2.5em;
  top: 0.5em;
}

.star_2 {
  left: 2.2em;
  top: 1.2em;
}

.star_3 {
  left: 3em;
  top: 0.9em;
}

.switch input:checked ~ .slider .star {
  opacity: 0;
}

.cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}

.switch input:checked ~ .slider .cloud {
  opacity: 1;
}
}
</style>