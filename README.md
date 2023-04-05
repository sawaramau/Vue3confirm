# Confirm dialog for Vue3

# Usage
```javascript: sample.vue
import confirm from "./confirm.js";

export default {
    mixins:[confirm],
    methods: {
        process: async function() {
            const confirm = await this.confirm({message: 'test message.'});
            if(confirm) {
                console.log('confirm ok.');
            }
        }
    }
}
```

