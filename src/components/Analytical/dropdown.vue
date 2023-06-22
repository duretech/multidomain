<template>
    <select class="form-control typeDropdown new-theme" v-model="value" @change="onChange">
        <option v-for="(option,ind) in ddoptions" 
            :value="option.val"
            :key="ind">{{option.label}}
        </option>
    </select>
</template>
<script>
export default {
    props:['ddVal','ddoptions','onChangeFn'],
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
<style scoped lang="scss"> 
.typeDropdown {
    font-size: 12px;
    padding: 2px 2px 2px 5px;
    height: auto;
    margin-top: 4px;
}
</style>
