import service from "@/service";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
export default {
	methods: {
		loadOptions({ action, parentNode, callback }, addLevelID = true) {
			// console.log("action", action);
			// console.log("parentNode", parentNode);
			// console.log("callback", callback);
			// console.log("addLevelID", addLevelID);
			// Do the AJAX stuff here.
			// Once the server has responded,
			// assign children options to the parent node & call the callback.
			if (action === LOAD_CHILDREN_OPTIONS) {
				// console.log("parentNode", parentNode);
				let id =
					parentNode.id.split("/").length > 1
						? parentNode.id.split("/")[1]
						: parentNode.id.split("/")[0];
				service
					.getChildOrganisation(id)
					.then((response) => {
						// console.log("child Location", response);
						if (response.data && response.data.children.length) {
							const renamedObj = service.renameKeys(
								{
									...response.data,
								},
								addLevelID
							);
							// console.log("renamedObj", renamedObj);
							parentNode.children = JSON.parse(
								JSON.stringify(renamedObj.children)
							);
							// parentNode.children = service.renameKeys(
							// 	{
							// 		...response.data,
							// 	},
							// 	addLevelID
							// ).children;
							callback();
						} else {
							parentNode.children = [];
							callback();
						}
					})
					.catch(() => {
						callback(new Error("Failed to load options: network error."));
					});
			}
		},
	},
};
