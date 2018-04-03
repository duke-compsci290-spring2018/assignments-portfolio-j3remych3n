<template>
    <v-card v-bind:color="jsonData['color']">
        <v-toolbar>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                {{jsonData["name"]}} Quiz
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-container grid-list-lg xs-text-center>
                <v-flex xs12>
                    <v-toolbar dense v-bind:color="jsonData['color']">
                        <v-spacer></v-spacer>
                        {{jsonData["questions"][index]["question"]}}
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-flex>
                <v-flex xs12>
                    <v-card v-if="index<jsonData['questions'][index]['choices'].length" light color="grey lighten-3">
                        <v-container grid-list-lg>
                            <v-flex xs8>
                                <v-radio-group light >
                                    <v-radio
                                            v-bind:color="jsonData['color']"
                                            v-for="i in jsonData['questions'][index]['choices'].length"
                                            :key="i"
                                            :label="jsonData['questions'][index]['choices'][i-1].toString()"
                                            :value="tempans"
                                    ></v-radio>
                                </v-radio-group>
                            </v-flex>
                        </v-container>
                    </v-card>
                    <v-card v-else>
                        <v-container grid-list-lg>
                           <v-jumbotron>

                           </v-jumbotron>
                        </v-container>
                    </v-card>
                </v-flex>
        </v-container>
        <v-toolbar dense>
            <v-btn @click="previousQuestion()" small v-bind:color="jsonData['color']" v-if="hasPrevious()">Previous</v-btn>
            <v-btn small disabled flat v-else>Previous</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-bind:color="jsonData['color']" @click="quit()">Quit to Menu</v-btn>
            <v-spacer></v-spacer>
            <v-btn small v-bind:color="jsonData['color']" @click="nextQuestion()" v-if="hasNext()">Next</v-btn>
            <v-btn small disabled flat>Next</v-btn>
        </v-toolbar>
    </v-card>
</template>

<script>
    export default {
        name: "quiz",
        props: ["jsonData"],
        data() {
            return{
                index: 0,
                correct: [],
                myJson: {},
                tempans: ""
            }
        },
        methods: {
            loadJson: function(dat) {
                this.myJson = dat;
                this.correct = [false]*this.myJson["questions"].length;
                console.log(this.done);
            },
            check: function(response) {

            },
            hasPrevious: function (){
                if(this.index == 0 ) {
                    return false;
                }


            },
            hasNext()
            {
                var temp = this.index;
                while(this.correct[temp] && temp < this.correct.length){
                    temp++;
                    if(!this.correct(temp)){
                        return true;
                    }
                }
                return false;
            },
            nextQuestion: function (){
                console.log(this.correct);
                console.log("next index");
                var temp = this.index+1;
                while(temp<this.jsonData['questions'][temp]['choices'].length && this.correct[temp]){
                    temp++;
                    console.log("incrementing");
                }

                if(temp<this.jsonData['questions'][temp]['choices'].length && !this.correct[temp]){
                    this.index = temp;
                }

                this.$forceUpdate();
            },
            previousQuestion: function () {
                while(this.index>0 && this.correct[this.index-1]){
                    this.index--;
                }
                this.$forceUpdate();
            },
            quit: function(){
                this.$emit("quiz-quit", true);
            }
        }
    }
</script>

<style scoped>

</style>