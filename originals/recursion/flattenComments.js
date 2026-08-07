const comments = [
	{
		id: 1,
		text: 'First',
		replies: [
			{ id: 2, text: 'Reply 1', replies: [] },
			{
				id: 3,
				text: 'Reply 2',
				replies: [{ id: 4, text: 'Deep reply', replies: [] }],
			},
		],
	},
]

function flattenComments(list, result = []) {
	for (const comment of list) {
		result.push(comment.text)
		if (comment.replies?.length) {
			flattenComments(comment.replies, result)
		}
	}

	return result
}

console.log(flattenComments(comments))
