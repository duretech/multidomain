<template>
	<section>
		<div
			class="card mb-3"
			v-for="(form, i) in responseForms"
			:key="'form-' + i"
		>
			<b-row class="">
				<b-col class="">
					<h6 class="userName mb-0 ml-3 pt-1">
						<i
							class="fa fa-user mr-2"
							:class="form.iconColorClass"
							aria-hidden="true"
						></i>
						{{ form.userDetails.firstName }}
						{{ form.userDetails.surname }}
					</h6>
				</b-col>
				<b-col class="">
					<div>
						<p class="location mr-2 mb-0">
							{{ form.location }}, {{ form.period }}
						</p>
					</div>
				</b-col>
			</b-row>
			<b-row class="">
				<b-col class="">
					<div class="actionBtn d-flex mr-2">
						<button
							class="btn ml-2"
							v-if="editOpt"
							@click="updateSignOffForm({ form: form, isEdit: true })"
						>
							<!-- <img
                                :src="
                                    require('@/assets/images/icons/preview active wh.png')
                                "
                                class="viewIcon"
                            /> -->
							<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
							{{ $t("edit") }}
						</button>
						<button
							class="btn ml-2"
							v-if="viewOpt"
							@click="updateSignOffForm({ form: form, isView: true })"
						>
							<!-- <img
                                :src="
                                    require('@/assets/images/icons/preview active wh.png')
                                "
                                class="viewIcon"
                            /> -->
							<i class="fa fa-eye" aria-hidden="true"></i>
							{{ $t("view") }}
						</button>
						<button
							class="btn ml-2"
							@click.prevent.stop="deleteForm(form.formID)"
							v-if="deleteOpt && userDetails.id === form.userDetails.id"
						>
							<i class="fa fa-trash-o" aria-hidden="true"></i>
							{{ $t("deletebtn") }}
						</button>
					</div>
				</b-col>
			</b-row>
		</div>
		<div class="text-center text-white" v-if="responseForms.length === 0">
			No forms available
		</div>
	</section>
</template>
<script>
export default {
	props: ["responseForms", "userDetails", "editOpt", "deleteOpt", "viewOpt"],
	methods: {
		updateSignOffForm(formObj) {
			this.$emit("updateSignOffForm", formObj);
		},
		deleteForm(formID) {
			this.$emit("deleteForm", formID);
		},
	},
};
</script>
