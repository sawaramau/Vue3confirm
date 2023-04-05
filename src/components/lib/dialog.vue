<template>
  <dialog open="true" @click="onClick" ref="dialog">
    <div v-if="title !== ''" class="title">{{title}}</div>
    <div v-for="msg in messages" :key="msg" class="message">{{msg}}</div>
    <div class="options">
      <div v-for="(option, index) in options" :key="option">
        <label>
          <input 
          :type="multiple ? 'checkbox' : 'radio'" 
          :name="multiple ? '' : 'dialog-select'" 
          :value="index"
          :checked="select[index]"
          @change="if (!multiple) select.fill(false); select.splice(index, 1, $event.target.checked);"
          >
          {{option?.label || option}}
        </label>
      </div>
    </div>
    <div class="buttons">
      <span v-for="button in buttons.map(str => str.toLowerCase()).filter(button => button in on)" :key="button">
        <button v-if="button !== 'blank'" @click="on[button]" 
        :disabled="positive[button] && !selected"
        :class="{'yes':positive[button]}"
        >
          {{this[button]}}
        </button>
      </span>
    </div>
  </dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmDialog',
  computed: {
    ok: function() {
      return this.yes;
    },
    value: function () {
      if(this.multiple) {
        return this.options.map(o => o?.value || o).filter((o, i) => this.select[i]);
      }
      const index = this.select.findIndex(s => s);
      if(index < 0) {
        return undefined;
      }
      return this.options[index]?.value || this.options[index];
    },
    selected: function() {
      if(this.options.length === 0) {
        return true;
      }
      return this.select.find(s => s) !== undefined;
    },
    messages: function() {
      if(typeof this.message === "string" || this.message instanceof String) {
        return this.message.split(/(\r\n|\n)/);
      }
      return this.message;
    },
    isCancelable: function() {
      return this.buttons.map(str => str.toLowerCase()).find(button => button === "cancel") !== undefined;
    }
  },
  watch: {
  },
  props: {
    destroy : {
        type: Function,
        required: true
    },
    title: {
      type: String,
      default: function () {
        return "Title";
      }
    },
    message: {
      default: function () {
        return "";
      }
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    yes: {
      type: String,
      default: "はい"
    },
    no: {
      type: String,
      default: "いいえ"
    },
    cancel: {
      type: String,
      default: "キャンセル"
    },
    buttons: {
      type: Array,
      default: function() {
        return ["yes", "no", "CANCEL"];
      }
    },
  },
  methods: {
    close: function(val) {
      this.$refs.dialog.classList.value = 'closing';
      setTimeout(() => {
        this.destroy(val);
      }, this.animationDuration * 800);
    },
    onClick: function(e) {
      e.stopPropagation();
    },
    onOk: function() {
      if(this.options.length === 0) {
        this.close(true);
      }
      if(this.select.find(s => s) === undefined) {
        return;
      }
      this.close(this.value);
    },
    onNo: function() {
      this.close(false);
    },
    onCancel: function() {
      this.close();
    },
  },
  data: function() {
    return {
      select: [],
      on: {
        blank: () => {
          return;
        },
        yes: () => {
          this.onOk();
        },
        ok: () => {
          this.onOk();
        },
        no: () => {
          this.onNo();
        },
        cancel: () => {
          this.onCancel();
        },
      },
      positive: {
        yes: true,
        ok: true,
        no: false,
        cancel: false,
      },
      animationDuration: 0.25,
      animationStartY: -20,
    };
  },
  mounted: function() {
    this.options.forEach(() => this.select.push(false));
  }
})
</script>

<style scoped>
dialog {
  color: #000000b0;
  width: 50%;
  border: 1px solid;
  margin-top: 10px;
  border-radius: 3px;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);
  animation: fadeIn v-bind(animationDuration + 's') ease 0s 1 normal backwards;
}
.closing {
  animation: fadeOut v-bind(animationDuration + 's') ease 0s 1 normal backwards;
  opacity: 0;
  transform: translateY(v-bind(animationStartY + 'px'));
}

.buttons {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  text-align: center;
}
.options {
  margin-left: 14px;
}
input {
  position: relative;
  top: 2px;
  margin-right: 15px;
  cursor: pointer;
}
label {
  display: inline-block;
  cursor: pointer;
  width: 100%;
  padding-bottom: 4px;
  margin-bottom: 4px;
  font-family: monospace;
}
label:hover {
  background-color: #f8f8f8;
}
button {
  user-select: none;
  min-width: 100px;
  border-radius: 20px;
  border: 1px solid black;
  cursor:pointer;
}
button:disabled {
  cursor: not-allowed;
}
button.yes {
  background-color: #f06000;
  color: white;
  border: 1px solid #ff6060;
}
button:disabled {
  opacity: 0.5;
}
button:hover {
  opacity: 0.5;
}
button:active {
  opacity: 0.8;
}
.title {
  font-size: 18px;
}
.message {
  margin-left: 8px;
  font-size: 16px;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(v-bind(animationStartY + 'px'));
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeOut {
  100% {
    opacity: 0;
    transform: translateY(v-bind(animationStartY + 'px'));
  }
  0% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
