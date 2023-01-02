<template>
    <div class="summaryTabSection" v-if="categoryInfo">
        <div class="row">
            <div class="col-12">
            <button class="btn text-white summaryBtn fs-19-1920" data-toggle="collapse" :data-target="targetId"  @click="activeSummary()"
            :class="{active: !isActive}">{{$t('summary')}} <i class="fa fa-angle-double-right" aria-hidden="true"></i></button>
                <div :id="tabId" class="collapse card px-3 pt-3 mb-3 summary_Card show" v-html="categoryInfo"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        // console.log(this.contName)
        return {
            isActive: false,
            targetId: '#'+this.contName+'SummaryTab',
            tabId: this.contName+'SummaryTab'
        }
    },
    props: ['categoryInfo', 'contName'],
    methods: {
        activeSummary(){
            this.isActive = !this.isActive
        },
    }
}
</script>
