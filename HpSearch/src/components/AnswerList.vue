<template>
  <div id="answerList">
    <template v-for="answerBlock in answerList" >
      <AnswerBlock :key="answerBlock.pk"
                      v-bind:title = "answerBlock.title"
                      v-bind:result = "answerBlock.result"
                      v-bind:score = "answerBlock.score"
                      v-bind:context = "answerBlock.context"
                      v-bind:abstract = "answerBlock.abstract"/>
    </template>
  </div>
</template>

<script>
import AnswerBlock from '@/components/AnswerBlock'
export default {
  name: 'AnswerList',
  components: {
    AnswerBlock
  },
  props: {
    answerList: {
      type: Array,
      default: () => [{
        pk: 0,
        title: '文章题目',
        result: '答案',
        score: 1.0,
        context: '文章内容',
        abstract: '文章摘要'
      }]
    }
  }
}
</script>
