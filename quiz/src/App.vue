<template>
  <v-app dark>
    <v-container>
      <quiz v-if="inQuiz" v-on:quiz-quit="showChooser()" :jsonData="currentQuiz"></quiz>
      <quiz-chooser v-if="!inQuiz" v-on:quiz-chosen="showQuiz($event)" :quizzes="quizzes"></quiz-chooser>
    </v-container>
  </v-app>
</template>

<script>
    import DookQuestions from './assets/duke_questions.json';
    import MathQuestions from './assets/math_questions.json';
    import TestQuestions from './assets/test_questions.json';

    import Quiz from './components/Quiz.vue';
    import QuizChooser from './components/QuizChooser.vue';

  export default {
      data (){
          return{
              inQuiz: false,
              currentQuiz: {},
              quizzes: [DookQuestions, MathQuestions, TestQuestions]
          }
      },
      methods: {
          showQuiz: function (quiz) {
              this.currentQuiz = quiz;
              this.inQuiz = true;
          },
          showChooser: function (quiz) {
              this.currentQuiz = {};
              this.inQuiz = false;
          }
      },
      components: {
          Quiz,
          QuizChooser
      }
  }
</script>
