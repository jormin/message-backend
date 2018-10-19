<template>
  <Message-detail :is-edit="true"/>
</template>

<script>
import MessageDetail from './components/MessageDetail'

export default {
  name: 'EditForm',
  components: { MessageDetail }
}
</script>

