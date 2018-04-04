<!--Author: Jeremy Chen-->
<!--Represents the core Quiz component of this project-->


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
                        <v-toolbar-title v-if="inQuiz" > {{jsonData["questions"][index]["question"]}}</v-toolbar-title>
                        <v-toolbar-title v-else> Your Score</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-flex>
                <v-flex xs12>
                    <v-card v-if="inQuiz" light color="grey lighten-3">
                        <v-container grid-list-lg>
                            <v-flex xs8>
                                <v-radio-group light v-model="currentAns">
                                    <v-radio
                                            v-bind:color="jsonData['color']"
                                            v-for="i in jsonData['questions'][index]['choices'].length"
                                            :key="i"
                                            :label="jsonData['questions'][index]['choices'][i-1].toString()"
                                            :value="i"
                                    ></v-radio>
                                </v-radio-group>
                            </v-flex>
                        </v-container>
                    </v-card>
                    <v-card v-else light color="grey lighten-3">
                        <v-container grid-list-lg xs-text-center>
                            <v-layout row>
                                <v-flex></v-flex>
                                <v-flex xs4>
                                    <v-card v-bind:color="jsonData['color']" class="text-xs-center">
                                        <v-card-text>
                                            <p id="score" class="text-xs-center">{{numCorrect()}}/{{correct.length}}</p>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                                <v-flex xs8>
                                    <v-card v-bind:color="jsonData['color']" class="text-xs-center">
                                        <v-card-text id="scoretext">
                                            {{jsonData['scoring'][getScoreText()]}}
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
        </v-container>
        <v-toolbar dense>
            <v-btn @click="previousQuestion()" small v-bind:color="jsonData['color']" v-if="hasPrevious()">Previous</v-btn>
            <v-btn small disabled flat v-else>Previous</v-btn>
            <v-spacer></v-spacer>
            <v-btn small v-bind:color="jsonData['color']" @click="quit()">Quit to Menu</v-btn>
            <v-btn small v-bind:color="jsonData['color']" @click="splash()" v-if="inQuiz">Quiz Score</v-btn>
            <v-btn small v-bind:color="jsonData['color']" @click="splash()" v-else>Back to Quiz</v-btn>
            <v-spacer></v-spacer>
            <v-btn small v-bind:color="jsonData['color']" @click="nextQuestion()" v-if="hasNext()&&inQuiz">Next</v-btn>
            <v-btn small disabled flat v-else>Next</v-btn>
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
                currentAns: "",
                inQuiz: true
            }
        },
        methods: {
            // Loads the json data
            loadJson: function(dat) {
                this.myJson = dat;
                this.correct = new Array(this.myJson["questions"].length);
                this.correct.fill(false);
                console.log("my bools" + this.correct);
            },
            // Checks if current answer was done correctly
            check: function() {
                console.log("user input " + this.currentAns);
                this.correct[this.index] = this.currentAns-1 == this.myJson["questions"][this.index]["correctAnswer"];
                console.log(this.correct);
            },
            // Gets the number right
            numCorrect: function(){
                return this.correct.filter(c => c).length;
            },
            // Picks the appropriate text for score
            getScoreText: function(){
                var percent = this.numCorrect()/this.correct.length;
                if(percent < 0.5){
                    return "none";
                }
                else if(percent >= 0.5 && percent < 1){
                    return "half";
                }
                return "all";
            },
            // checks if user can go back
            hasPrevious: function (){
                if(this.index == 0){
                    return false;
                }
                var temp = this.index-1;
                while( temp > 0 && this.correct[temp]){
                    temp--;
                    if(!this.correct[temp]){
                        return true;
                    }
                }
                return !this.correct[temp];
            },
            // switces from the score splash to the quiz
            splash: function () {
                this.check();
                this.currentAns = "";
                this.inQuiz = !this.inQuiz;
            },
            // checks if user can click next
            hasNext: function () {
                if(this.index >= this.correct.length-1){
                    return false;
                }
                var temp = this.index+1;
                while(temp<this.correct.length && this.correct[temp]){
                    temp++;
                    if(!this.correct[temp]){
                        return true;
                    }
                }
                return !this.correct[temp];
            },
            // Goes to the next question
            nextQuestion: function (){
                console.log("my current index " + this.index);
                this.check();
                this.currentAns = "";
                var temp = this.index+1;
                while(temp<this.correct.length && this.correct[temp]){
                    temp++;
                    console.log("incrementing");
                }

                if(temp<this.correct.length && !this.correct[temp]){
                    this.index = temp;
                }
                this.$forceUpdate();
            },
            // Goes to a previous question
            previousQuestion: function () {
                this.check();
                this.currentAns = "";
                console.log(this.correct);
                console.log("next index");
                var temp = this.index-1;
                while(temp>0 && this.correct[temp]){
                    temp--;
                    console.log("incrementing");
                }

                if(temp>=0 && !this.correct[temp]){
                    this.index = temp;
                }

                this.$forceUpdate();
            },
            // Quits to menu
            quit: function(){
                this.$emit("quiz-quit", true);
            }
        },
        // Loads data on creation
        created() {
            this.loadJson(this.jsonData)
        }
    }
</script>

<style scoped>
    #score{
        font-size: 600%;
    }
    #scoretext{
        font-size: 300%;
    }
</style>