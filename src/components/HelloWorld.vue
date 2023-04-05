<template>
  <div class="hello">
    <button @click="process">confirm</button>
    <button @click="select">select</button>
    <button @click="multi">multi</button>
  </div>
</template>

<script>
import confirm from "./lib/confirm.js";

export default {
  name: 'HelloWorld',
  mixins:[confirm],
  props: {
    msg: String
  },
  methods: {
    process: async function() {
      const confirm = await this.confirm({title: "Dialog title1", message: "You can specify button message.\nAnd you can use new line in message.", yes:'OK', no:'NO', cancel:'CANCEL'})
      if(confirm === true) {
        console.log('confirm yes return true');
      } else if(confirm === false) {
        console.log('confirm no return false');
      } else {
        console.log('confirm cancel return undefined');
      }
    },
    select: async function() {
      const selected = await this.confirm({title: "Dialog title2", message:["You can", "use array strings", "in message."], options: [1, {label: 2, value: -2}, 3]})
      if(selected) {
        console.log('select return', selected);
      } else if(selected === false) {
        console.log('confirm no return false');
      } else {
        console.log('confirm cancel return undefined');
      }
    },
    multi: async function() {
      const selected = await this.confirm({title: "Dialog title3", 
        message: [
          "You can specify the buttons order and types(yes/no/cancel/blank).", 
          "And if a cancel button is NOT included, users must select button yes or no for closing dialog.",
          "(If a cancel button is included, users can close the dialog by clicking outside the dialog.)"
        ], 
        options: [1, 2, 3], multiple: true, buttons:['blank', 'no', 'yes']
      })
      if(selected) {
        console.log('select return', selected);
      } else if(selected === false) {
        console.log('confirm no return false');
      } else {
        console.log('confirm cancel return undefined');
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
