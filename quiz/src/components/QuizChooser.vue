<template>
    <v-app dark>
        <v-container grid-list-md text-xs-center>
            <v-layout row-wrap>
                <v-flex lg12>
                    <v-card>
                        <v-toolbar>
                            <v-spacer></v-spacer>
                            <v-toolbar-title>
                                Choose a Quiz
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card>
                            <v-list>
                                <v-list-tile v-for="quiz in quizzes" >
                                    <v-btn block v-bind:color="quiz['color']" @click="switchTo(quiz)">
                                        {{quiz["name"]}}
                                    </v-btn>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    export default {
        name: "quiz-chooser",
        props:["quizzes"],
        methods:{
            switchTo: function(quiz){
                this.$emit('quiz-chosen', quiz);
            }
        }
    }

</script>

<style scoped>

</style>