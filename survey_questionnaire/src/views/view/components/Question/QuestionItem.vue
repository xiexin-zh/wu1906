<template>
  <component :is="componentName" v-bind="$attrs" v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SingleChoice from './SingleChoice.vue'
import MultiChoice from './MultiChoice.vue'
import MuiltText from './MuiltText.vue'
import DropDown from './DropDown.vue'
import SingleText from './SingleText.vue'
import DatePicker from './DatePicker.vue'
import { questionType } from '@/config/enum/questionType'

@Component({
  components: {
    SingleChoice,
    MultiChoice,
    SingleText,
    DropDown,
    MuiltText,
    DatePicker
  }
})
export default class extends Vue {
  @Prop() type!: string

  get componentName () {
    if (this.type === questionType.SINGLE_CHOICE) { return 'SingleChoice' }
    if (this.type === questionType.MULTIPLE_CHOICE) { return 'MultiChoice' }
    if (this.type === questionType.SINGLE_TEXT) { return 'SingleText' }
    if (this.type === questionType.DROP_DOWN) { return 'DropDown' }
    if (this.type === questionType.TEXT_MUILTIPLE) { return 'MuiltText' }
    if (this.type === questionType.DATE_PICKER) { return 'DatePicker' }
  }
}
</script>

<style lang="scss">
</style>
