<template>
  <div class="auswahlItem" :style="cssVars" >
      <div class="thumb">
          <img :src="item.image || cssVars['--placeholder']" :alt="item.name || 'Kassenprojekt'" />
      </div>
      <div class="meta">
          <h3 class="name">{{ item.name || item.bezeichnung || 'Projekt' }}</h3>
          <button class="more" @click.stop="this.more(item)">&hellip;</button>
      </div>

      <div class="moreContainer" v-if="activeMoreId == item.Id">
          <!--<div class="moreItems">Bild ändern</div>-->
          <div class="moreItems" @click.stop="this.changeName(item)">Namen ändern</div>
          <div class="moreItems" @click.stop="this.changePassword(item)">Passwort ändern</div>
          <div class="moreItems" @click.stop="this.delete(item)">Löschen</div>
      </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AuswahlItem',
  props: {
    item: Object,
    darkMode: Boolean
  },
  data() {
    return {
        activeMoreId: false
    };
  },
  computed: {
    cssVars() {
      if(!this.$props.darkMode){
        return {
          '--placeholder': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%23efefef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="16">Kein Bild</text></svg>',
        }
      } else{
        return{
          '--placeholder': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%233b3b3b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="16">Kein Bild</text></svg>'
        }
      }
    }
  },
  methods: {
    async more(projekt){
      if(this.activeMoreId == projekt.Id){
        this.activeMoreId = null;
      } else{
        this.activeMoreId = projekt.Id;
      }
    },
    async delete(item){
      Swal.fire({
        title: "Wirklich löschen?",
        showDenyButton: true,
        confirmButtonText: "Löschen",
        denyButtonText: `Nicht Löschen`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$emit('delete', item)
        }
      });
      this.activeMoreId = false;
    },
    async changeName(item){
        Swal.fire({
            title: "Name ändern",
            input: "text",
            showDenyButton: true,
            confirmButtonText: "Speichern",
            denyButtonText: "Abbrechen",
        }).then((result) => {
            if(result.isConfirmed){
                item.name = result.value;
                this.$emit('changeName', item);
            }
        })
        this.activeMoreId = false;
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
                Swal.fire({
                    title: "Passwort ändern",
                    input: "text",
                    showDenyButton: true,
                    confirmButtonText: "Speichern",
                    denyButtonText: "Abbrechen",
                }).then((result) => {
                    if(result.isConfirmed){
                        item.password = result.value;
                        this.$emit('changePassword', item);
                    }
                })
            }
        }
        this.activeMoreId = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  .auswahlItem {
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
    position: relative;

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
</style>