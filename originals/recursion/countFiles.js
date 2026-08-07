const folder = {
	name: 'root',
	files: ['a.txt', 'b.txt'],
	folders: [
		{
			name: 'images',
			files: ['1.png'],
			folders: [],
		},
		{
			name: 'docs',
			files: [],
			folders: [
				{
					name: 'projects',
					files: ['readme.md', 'plan.docx'],
					folders: [],
				},
			],
		},
	],
}

function countFiels(folder) {
    let count = folder.files.length

    for(const subFolder of folder.folders) {
        count += countFiels(subFolder)
    }

    return count
}


console.log(countFiels(folder))