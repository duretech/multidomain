<template>
    <select class="form-control" v-model="value" @change="onChange">
        <option v-for="(option,ind) in ddoptions" 
            :value="option.val"
            :key="ind">{{option.label}}
        </option>
    </select>
</template>
<script>
export default {
    props:['ddVal','ddoptions','onChangeFn'],
    mounted(){
        
    },
    data(){
        return{
            value:this.ddVal
        }
    },
    methods:{
        onChange(e){
            this.onChangeFn(e.target.value);
        }
    }
}
</script>