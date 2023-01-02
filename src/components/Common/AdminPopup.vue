<template>
	<div class="">
		<b-button
			class="bg-transparent border-0 mx-2"
			size="sm"
			v-b-modal.modal-admin
			v-if="$store.getters.getIsAdmin"
			>{{ $t("admin") }}
			</b-button
		>
		<b-modal id="modal-admin" centered title="Admin">
			<b-row>
				<b-col sm="4" class="sub-head">Select Dashboard </b-col>
				<b-col sm="8">
					<b-dropdown id="dropdownnav">
						<template slot="button-content" class="header">
							<p>{{ adminNamespaceTitle }}</p>
						</template>
						<b-dropdown-item class="text-uppercase"
							@click.prevent.stop="changeAdmin('', $t('default'))"
						>
							{{ $t("default") }}</b-dropdown-item
						>
						<b-dropdown-item class="text-uppercase"
							@click.prevent.stop="
								changeAdmin(
									'_mnch-dashboard',
									$t('maternal_newborn_and_child_health')
								)
							"
						>
							{{ $t("maternal_newborn_and_child_health") }}</b-dropdown-item
						>
						<b-dropdown-item class="text-uppercase"
							@click.prevent.stop="
								changeAdmin('_fp-dashboard', $t('family_planning'))
							"
						>
							{{ $t("family_planning") }}</b-dropdown-item
						>
					</b-dropdown>
				</b-col>
			</b-row>
			<div id="footer-admin" class="mt-3">
				<b-button class="footer-ok" @click.prevent.stop="toAdmin">{{
					$t("ok")
				}}</b-button>
			</div>
		</b-modal>
	</div>
</template>
<script>
/*global settings*/
export default {
	data() {
		return {
			adminNamespace: "",
			adminNamespaceTitle: "",
		};
	},
	methods: {
		reload() {
			this.getUserDetails();
		},
		toAdmin() {
			this.$store.commit(
				"setNamespace",
				`${settings.tableName}${this.adminNamespace}`
			);
			this.$router.push("/admin");
		},
		changeAdmin(value, title) {
			this.adminNamespaceTitle = title;
			this.adminNamespace = value;
		},
	},
	created() {
		this.adminNamespaceTitle = this.$i18n.t("default");
	},
};
</script>
