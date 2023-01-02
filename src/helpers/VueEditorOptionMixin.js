export default {
	data() {
		return {
			customToolbar: [
				[{ header: [false, 1, 2, 3, 4, 5, 6] }],
				// ["bold", "italic", "underline", "strike"], // toggled buttons
				["bold", "italic", "underline"], // toggled buttons
				[
					{ align: "" },
					{ align: "center" },
					{ align: "right" },
					{ align: "justify" },
				],
				// ["blockquote", "code-block"],
				[
					{ list: "ordered" },
					{ list: "bullet" },
					// { list: "check" }
				],
				// [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
				// [{ color: [] }, { background: [] }], // dropdown with defaults from theme
				[{ color: [] }], // dropdown with defaults from theme
				// ["link", "image", "video"],
				// ["clean"] // remove formatting button
			],
		};
	},
};
