<template>
    <div id="rechner" v-if="active">
        <div class="display"><p>Betrag:</p><p id="rechnerBetrag">{{ this.rechnerBetrag }} €</p></div>
        <div class="display"><p>Bekommen:</p><p id="rechnerBekommen">{{ rechnerBekommen ? parseFloat(rechnerBekommen).toFixed(2) : '0.00' }} €</p></div>
        <div class="display"><p>Geben:</p><p id="rechnerGeben" :style="(rechnerGeben < 0)?'color: red':(rechnerGeben == 0)?'color: green':'color: blue'">{{ rechnerGeben }} €</p></div>
        <button class="rechnerButton" @click="rechnerButtonClick('7')">7</button>
        <button class="rechnerButton" @click="rechnerButtonClick('8')">8</button>
        <button class="rechnerButton" @click="rechnerButtonClick('9')">9</button>
        <button class="rechnerButton" @click="rechnerButtonClick('+10')">+10</button>
        <button class="rechnerButton" @click="rechnerButtonClick('4')">4</button>
        <button class="rechnerButton" @click="rechnerButtonClick('5')">5</button>
        <button class="rechnerButton" @click="rechnerButtonClick('6')">6</button>
        <button class="rechnerButton" @click="rechnerButtonClick('+20')">+20</button>
        <button class="rechnerButton" @click="rechnerButtonClick('1')">1</button>
        <button class="rechnerButton" @click="rechnerButtonClick('2')">2</button>
        <button class="rechnerButton" @click="rechnerButtonClick('3')">3</button>
        <button class="rechnerButton" @click="rechnerButtonClick('+50')">+50</button>
        <button class="rechnerButton" @click="rechnerButtonClick('C')">C</button>
        <button class="rechnerButton" @click="rechnerButtonClick('0')">0</button>
        <button class="rechnerButton" @click="rechnerButtonClick('.')">.</button>
        <button class="rechnerButton" @click="rechnerButtonClick('ENDE')">ENDE</button>
    </div>
    <div id="rechnerBackground" @click="closeRechner()" v-if="active"></div>
</template>

<script>
    export default{
        name: 'Rechner',
        components: {

        },
        props: {
            active: Boolean,
            rechnerBetrag: String,
        },
        data(){
            return{
                rechnerBetrag: this.$props.rechnerBetrag,
                rechnerBekommen: '',
                rechnerGeben: '',
            }
        },
        computed: {
            // Berechnet bei jeder Änderung automatisch „Betrag – Bekommen“
            rechnerGeben() {
            const betrag = parseFloat(this.rechnerBetrag) || 0;
            const bekommen = parseFloat(this.rechnerBekommen) || 0;
            return (bekommen - betrag).toFixed(2);
            }
        },
        methods: {
            closeRechner(){
                this.$emit('closeRechner');
            },
            rechnerButtonClick(val) {
                if (val === 'C') {
                    // alles löschen
                    this.rechnerBekommen = '';
                } else if (val.startsWith('+')) {
                    // Münz-/Scheineingabe, z.B. "+10"
                    const add = parseFloat(val.slice(1)) || 0;
                    const aktuell = parseFloat(this.rechnerBekommen) || 0;
                    this.rechnerBekommen = (aktuell + add).toFixed(2);
                } else if (val === 'DEL') {
                // letztes Zeichen löschen
                this.rechnerBekommen = this.rechnerBekommen.slice(0, -1);
                } else if(val === 'ENDE'){
                    this.$emit('closeRechner');
                } else if (val === '.') {
                    // nur einen Punkt erlauben
                    if (!this.rechnerBekommen.includes('.')) {
                    this.rechnerBekommen += '.';
                    }
                } else if (val === '=') {
                    // hier könntest du noch extra Logik einbauen – momentan tut sich nichts
                } else {
                    // Ziffer anhängen
                    if(!this.rechnerBekommen.includes('.00')){
                        this.rechnerBekommen += val;
                    }
                }
            },
        },
        created(){

        }
    }
</script>

<style lang="scss" scoped>
    #rechner {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 70vh;
        height: 50vh;
        z-index: 90;
        display: grid;
        transform: translate(-50%, -65%);
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto repeat(4, 1fr);
        gap: 1px;

        .display{
            grid-column: 1 / -1;
            background-color: white;
            color: black;
            font-size: 2em;
            display: flex;
            align-items: center;
            //justify-content: flex-end;
            justify-content: space-between;
            padding: 0.5em;
            p{
                margin: 0;
                padding: 0;
            }

            #rechnerBetrag{
                color: black;
            }

            #rechnerBekommen{
                color: green;
            }

            #rechnerGeben{
                color: red;
            }
        }

        .rechnerButton{
            display: table-cell;
            width: 17.5vh;
            height: 10.5vh;
            text-align: center;
            vertical-align: middle;
            font-size: 1.5em;
            background-color: #eee;
            border: none;
            cursor: pointer;
        }
    }

    #rechnerBackground{
        width: 100%;
        height: 100vh;
        z-index: 89;
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.555);
    }
</style>