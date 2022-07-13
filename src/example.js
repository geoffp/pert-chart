loadData(
    {
        name: 'PERT CHART',
        // Nodes
        nodes: [
            { id: '1', value: { label: 'Task 1' } },
            { id: '2', value: { label: 'Task 2' } },
            { id: '3', value: { label: 'Task 3' } },
            { id: '4', value: { label: 'Task 4' } },
            { id: '5', value: { label: 'Task 5' } },
            { id: '6', value: { label: 'Task 6' } },
            { id: '7', value: { label: 'Task 7' } },
            { id: '8', value: { label: 'Task 8' } },
        ],
        // Edges ( links )
        links: [
            { u: '1', v: '2', value: { label: 'link1' } },
            { u: '1', v: '3', value: { label: 'link2' } },
            { u: '1', v: '4', value: { label: 'link3' } },
            { u: '2', v: '4', value: { label: 'link4' } },
            { u: '3', v: '4', value: { label: 'link5' } },
            { u: '4', v: '5', value: { label: 'link6' } },
            { u: '4', v: '6', value: { label: 'link7' } },
            { u: '5', v: '6', value: { label: 'link8' } },
            { u: '6', v: '7', value: { label: 'link9' } },
            { u: '7', v: '8', value: { label: 'link10' } },
        ]
    }
);
