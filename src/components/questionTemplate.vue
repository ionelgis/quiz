<template>
    <div class="card">
    <div class="card-header d-flex">
        Question #{{index + 1}}
        <div class="d-inline-block ml-auto"> 
            <span
                v-if="savedQuestion.saved" 
                class="mr-2"
                @click="handleEdit(savedQuestion.tempId)"
            >
                <i class="fa fa-edit"></i>
            </span>
            <span 
                class="mr-2"
                @click="handleDelete(savedQuestion.tempId)"
            >
                <i class="fa fa-trash-alt"></i>
            </span>
        </div>
    </div>
    <div class="card-body">
        <div>
            <p class="mt-3">Text: </p>
            <input 
                type="text" 
                :class="{'form-control-plaintext': !savedQuestion.editing, 'form-control': savedQuestion.editing}"
                :readonly="!savedQuestion.editing"
                v-model="savedQuestion.text" 
            >
        </div>
        <p class="mt-3">Answers</p>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(answer, answerIndex) in savedQuestion.answers" :key="answer.id">
                <div class="row">
                    <div class="col-md-8">
                        Answer  #{{answerIndex + 1 }} <br>
                        <input 
                            type="text" 
                            :readonly="!savedQuestion.editing"
                            :class="{'form-control-plaintext': !savedQuestion.editing, 'form-control': savedQuestion.editing}"
                            v-model="savedQuestion.answers.find(item => item.id === answer.id).text"
                        >
                    </div>
                    <div class="col-md-4">
                        Correct <br>
                        <div class="form-check mb-3">
                            <input 
                                :checked="savedQuestion.answers.find(item => item.id === answer.id).value"
                                :disabled="!savedQuestion.editing"
                                @change="handleRadioChange(answer.id, $event.target.checked)"
                                class="form-check-input" 
                                type="radio" 
                                :name="`question-${index + 1}`"
                            >
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <button 
            @click="saveQuestion"
            class="btn btn-secondary mt-3" 
            type="button">
            Save Question
        </button>


    </div>
    


    
</div>
</template>
<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      savedQuestion: undefined
    };
  },
  created() {
    this.savedQuestion = {
      ...this.question
    };
  },
  methods: {
    saveQuestion: function() {
      console.log(this.savedQuestion);
      this.$emit("question-saved", this.savedQuestion);
      this.savedQuestion.editing = false;
      this.savedQuestion.saved = true;
    },
    handleEdit: function(id) {
      this.$emit("toggle-edit", id);
      this.savedQuestion.editing = !this.savedQuestion.editing;
    },
    handleDelete: function(id) {
      this.$emit("delete-question", id);
    },
    handleRadioChange: function(id, value) {
      this.savedQuestion.answers.forEach(element => {
        element.value = false;
      });
      if (value) {
        this.savedQuestion.answers.find(item => item.id === id).value = value;
      }

      console.log(id, value);
    }
  }
};
</script>
