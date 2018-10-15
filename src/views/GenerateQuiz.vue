<template>
    <div>
        <h2 v-if="!questions" >Choose Template</h2>
        <div class="container">
            <div class="row" v-if="!questions">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-header"> Capitals</div>

                        
                        <div class="card-body">
                            <form @submit.prevent="generateQuiz">
                              <div class="form-group">
                                <label for="selectRegion">Select Region</label>
                                <select 
                                  @change="setRegion($event)"
                                  id="selectRegion"
                                  class="custom-select">
                                  <option selected>Choose...</option>
                                  <option 
                                    v-for="(region, index) in regions" 
                                    :key="index" 
                                    :value="region">
                                    {{ region}}
                                  </option>
                                </select>
                              </div>  

                              

                              <div class="form-group">
                                <label for="selectNumberOfQuestions">Number of questions</label>
                                <input type="text" @change="setNoOfQuestions($event)" class="form-control" id="selectNumberOfQuestions">
                              </div>

                               <button type="submit" class="btn btn-primary">Generate Quiz</button>
                            </form>

              
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div v-for="question in questions" :key="`question-${question.id}`">
                        <div class="card mt-3">
                            <div class="card-header">
                                {{ question.text}}
                            </div>
                            <div class="card-body">
                                <p v-for="answer in question.answers" :key="`answer-${question.id}-${answer.id}`">
                                    <button 
                                      @click="selectAnswer(question.id, answer.id)"
                                      class="btn btn-info " 
                                      :class="{'selected': answer.selected}"
                                      type="button">
                                      {{ answer.capital}} 
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4" v-if="questions">
                      <button 
                        @click="calculateScore"
                        class="btn btn-primary">
                        Calculate Score
                      </button>
                    </div>

                  <div class="mt-4" v-if="score">
                    Score: {{ score }} of 100
                  </div>


                </div>
            </div>
        </div>
        
    </div>
    
</template>

<script>
import { db } from "../helpers/firebase.service.js";
import { getRandomItemFromArray } from "../helpers/getRandomItemFromArray.js";
import { randomizeArray } from "../helpers/randomizeArray.js";
import { guid } from "../helpers/guid.js";
import { calculatePercentage } from "../helpers/calculatePercentage.js";

export default {
  data() {
    return {
      selectedRegion: undefined,
      questionsRequired: undefined,
      regions: undefined,
      questions: undefined,
      score: undefined,
      countries: undefined
    };
  },
  watch: {
    selectedRegion: function(newValue) {
      if (newValue) {
        // let result = undefined;
        db.ref("countries")
          .orderByChild("region")
          .equalTo(newValue)
          .on("value", snap => {
            this.countries = Object.keys(snap.val()).map(
              key => snap.val()[key]
            );
          });
      }
    }
  },
  created() {
    //get regions
    db.ref("countries/regionsList").on("value", snap => {
      this.regions = snap.val();
    });
  },
  methods: {
    setRegion: function(event) {
      this.selectedRegion = event.target.value;
    },
    setNoOfQuestions: function(event) {
      this.questionsRequired = event.target.value;
    },
    generateQuiz: function() {
      const questionsRequired = this.questionsRequired;
      const self = this;

      const getQuestions = function(noOfQuestions) {
        let questions = [];

        while (questions.length < noOfQuestions) {
          const trueCountry = getRandomItemFromArray(self.countries);
          if (
            questions.length &&
            questions.find(
              question =>
                question.answers.find(item => item.value).name ==
                trueCountry.name
            )
          ) {
            //found a duplicate, continue to next loop iteration
            continue;
          }

          const trueResult = {
            name: trueCountry.name,
            capital: trueCountry.capital,
            value: true,
            selected: false,
            id: guid()
          };
          let falseResults = [];

          while (falseResults.length <= 2) {
            let country = getRandomItemFromArray(self.countries);
            if (
              country.name !== trueResult.name &&
              falseResults.find(item => item.name === country.name) ===
                undefined
            ) {
              falseResults.push({
                name: country.name,
                capital: country.capital,
                value: false,
                selected: false,
                id: guid()
              });
            }
          }

          let question = {
            id: guid(),
            text: `What is the capital of ${trueResult.name}?`,
            answers: []
          };

          falseResults.push(trueResult);
          question.answers = randomizeArray(falseResults);

          questions.push(question);
        }
        return questions;
      };

      this.questions = getQuestions(questionsRequired);
    },
    selectAnswer: function(questionId, answerId) {
      const question = this.questions.find(item => item.id === questionId);
      question.answers.forEach(item => (item.selected = false));
      question.answers.find(item => item.id === answerId).selected = true;
    },
    calculateScore: function() {
      let results = this.questions.map(question => {
        return !!question.answers.find(item => item.value && item.selected);
      });

      const goodResults = results.filter(item => item).length;

      this.score = calculatePercentage(goodResults, results.length);
    }
  },
  filters: {}
};
</script>
<style scoped>
.btn.selected {
  border: 2px solid purple;
}
</style>

