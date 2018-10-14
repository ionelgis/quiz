<template>
  <div class="about">
    <div class="container">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <h1>This is an Add Quizz</h1>
          <form @submit.prevent="saveForm">
            <div class="form-group">
              <label for="quixTitle">Quiz <Title></Title></label>
              <input 
              v-model="quiz.title"
              type="text" 
              class="form-control" 
              id="quixTitle">
            </div>

            <div class="questionsWrapper mb-5">
              <QuestionTemplate
                v-for="(question, index) in questions"  
                @question-saved="handleSaveQuestion"
                @toggle-edit="handleToggleEdit"
                @delete-question="handleQuestionDelete"
                :question="question" 
                :key="question.tempId" 
                :index="index"
              />
              <button 
              class="btn button-secondary" 
              type="button"
              @click="addQuestionTemplate">
              Add Question
              </button>
            </div>



          <button type="submit" class="btn btn-primary">Save Quiz</button>



          </form>
        </div>
      </div>
    </div>


   




  </div>
</template>
<script>
import guid from "../helpers/guid.js";
import QuestionTemplate from "../components/questionTemplate";
export default {
  data() {
    return {
      quiz: {
        title: ""
      },
      questions: [],
      savedQuestions: []
    };
  },
  methods: {
    saveForm: function() {
      console.log("save form");
    },
    handleSaveQuestion: function(payload) {
      console.log("event");
      let quest = this.questions.find(item => item.tempId === payload.tempId);
      quest.editing = false;
      quest.saved = true;
      // this.savedQuestions.push(payload);
    },
    handleToggleEdit: function(payload) {
      let quest = this.questions.find(item => item.tempId === payload);
      quest.editing = !quest.editing;
    },
    handleQuestionDelete: function(payload) {
      let questInd = this.questions.findIndex(item => item.tempId === payload);
      this.questions.splice(questInd, 1);
    },
    addQuestionTemplate: function() {
      const question = {
        tempId: guid(),
        editing: true,
        saved: false,
        text: "",
        answers: [
          {
            id: guid(),
            value: false,
            text: ""
          },
          {
            id: guid(),
            value: false,
            text: ""
          },
          {
            id: guid(),
            value: false,
            text: ""
          },

          {
            id: guid(),
            value: false,
            text: ""
          }
        ]
      };
      this.questions.push(question);
      console.log("add question template", question);
    }
  },
  components: {
    QuestionTemplate
  }
};
</script>

