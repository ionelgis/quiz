<template>
    <div>
        <h2>Choose Template</h2>
        <div class="container">
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-header"> Capitals</div>
                        <div class="card-body">
                            <p>Choose a region so learn capitals from</p>

                            <div class="mt-5">
                                <p v-for="(region, index) in regions" :key="index">
                                    <button class="btn btn-primary"  @click="getCountriesInRegion(region)" type="button">Get countries in {{region}}</button>
                                </p>
                                
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div v-for="(question, index) in questions" :key="`question-${index}`">
                        <div class="card">
                            <div class="card-header">
                                {{ question.text}}
                            </div>
                            <div class="card-body">
                                <p v-for="(answer, answerIndex) in question.answers" :key="`answer-${index}-${answerIndex}`">
                                    <button class="btn btn-info" type="button">{{ answer.capital}} </button>
                                </p>
                            </div>
                        </div>
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

export default {
  data() {
    return {
      regions: undefined,
      questions: undefined
    };
  },
  created() {
    //get regions
    db.ref("countries/regionsList").on("value", snap => {
      this.regions = snap.val();
    });
  },
  methods: {
    getCountriesInRegion: function(region) {
      db.ref("countries")
        .orderByChild("region")
        .equalTo(region)
        .on("value", snap => {
          const allCountriesInRegion = Object.keys(snap.val()).map(
            key => snap.val()[key]
          );

          const getQuestions = function(noOfQuestions) {
            let questions = [];

            while (questions.length < noOfQuestions) {
              const trueCountry = getRandomItemFromArray(allCountriesInRegion);

              if (
                questions.length &&
                questions.find(
                  question =>
                    question.answers.filter(item => item.value).name ==
                    trueCountry.name
                )
              ) {
                break;
              }

              const trueResult = {
                name: trueCountry.name,
                capital: trueCountry.capital,
                value: true
              };
              let falseResults = [];

              while (falseResults.length <= 2) {
                let country = getRandomItemFromArray(allCountriesInRegion);
                if (
                  country.name !== trueResult.name &&
                  falseResults.find(item => item.name === country.name) ===
                    undefined
                ) {
                  falseResults.push({
                    name: country.name,
                    capital: country.capital,
                    value: false
                  });
                }
              }

              let question = {
                text: `What is the capital of ${trueResult.name}?`,
                answers: []
              };

              falseResults.push(trueResult);
              question.answers = randomizeArray(falseResults);

              questions.push(question);
            }
            return questions;
          };

          this.questions = getQuestions(3);
        });
    }
  },
  filters: {}
};
</script>
