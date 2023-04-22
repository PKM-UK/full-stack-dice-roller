function AddSkill(params) {
    return (
        <div className='skill'>&nbsp;
        <AddButton addCB={params.addCB}/>
        </div>
    )
}

function AddButton(params) {
    return (
        <button onClick={() => params.addCB()}> NEW </button>
    )
}

export default AddSkill;