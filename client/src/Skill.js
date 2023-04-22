// file: Skill.js
import "./Skill.css"

/* https://legacy.reactjs.org/docs/jsx-in-depth.html

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}

To fix this, we will assign the type to a capitalized variable first:

function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}

*/


function Skill(params) {

    // params: {id, type, desc, deditCB, mod, action, editmode, editCB, delCB }
    let id = params.id;
    let type = params.type;
    let desc = params.desc;
    let deditCB = params.deditCB;
    let mod = params.mod;
    let action = params.action;
    let editmode = params.editmode;
    let editCB = params.editCB;
    let delCB = params.delCB;
    let changeCB = params.changeCB;

    let Buttongroup;
    let ModDisplay;
    let Editcontrols;
    switch(params.type) {

    case "dnd":
        ModDisplay = Modlabel;
        Buttongroup = Dnd5ebuttons;
        break;
    case "dw":
        Buttongroup = DWbuttons;
        ModDisplay = Modlabel;
        break;
    default:
        Buttongroup = BITDbuttons;
        ModDisplay = Modpips;
        break;
    }

    return (
        <div className='skill'>
        <DescLabel id={id} desc={desc} deditCB={deditCB} editmode={editmode}/>
        <ModDisplay id={id} mod={mod} editmode={editmode} changeCB={changeCB}/>
        <Buttongroup mod={mod} action={action} editmode={editmode}/>
        <EditButton id={id} delCB={delCB} beditCB={editCB} editmode={editmode} />
        </div>
    )
} 



function DescLabel({id, desc, deditCB, editmode}) {
    if (editmode) {
        return (<input type="text" value={desc} onChange={(e) => deditCB(id, e.target.value)} />)
   } else {
        return (<>
        Click to roll {desc}
        </>)
    }
}

function Dnd5ebuttons({mod, action, editmode}) {
    if (!editmode) {
    return (
        <>
            <button onClick={() => action(mod, 0)}>Roll dis.</button>
            <button onClick={() => action(mod, 1)}>Roll</button>
            <button onClick={() => action(mod, 2)}>Roll adv.</button>
        </>
    )   
    } else {
        return (<> </>)
    }
}

function DWbuttons({mod, action, editmode}) {
    if (!editmode) {    
    return (
        <>
            <button onClick={() => action(mod, 3)}>Roll</button>
            <button onClick={() => action(mod+1, 3)}>Roll aided</button>
        </>
    )
    } else {
        return (<> </>)
    }    
}

function BITDbuttons({mod, action, editmode}) {
    if (!editmode) {    
    return (
        <>
            <button onClick={() => action(mod, 4)}>Roll</button>
            <button onClick={() => action(mod - (-1), 4)}>Push yourself</button>
        </>
    )
    } else {
        return (<> </>)
    }    
}

function Modlabel({id, mod, editmode, changeCB}) {
    return (
        <>
            {editmode ? <input className="modedit" type="text" value={mod} onChange={(mod) => changeCB(id, mod)}></input>
             : mod > 0 ? " +" + mod : " " + mod}
        </>
    )
}

function Modpips({id, mod, editmode, changeCB}) {
    let pips = " ";
    for (let i=0; i<mod; i++) {
        pips += "•";
    }
    return (
        <>
            {editmode ? <input className="modedit" type="text" value={mod} onChange={(mod) => changeCB(id, mod)}></input>
             : pips}
        </>
    )
}

function EditButton({id, beditCB, delCB, editmode}) {
    return (
        <>
            <button onClick={() => beditCB(id)}>{editmode ? "SAVE" : "EDIT"}</button>
            <button onClick={() => delCB(id)}>X</button>            
        </>
    )
}

export default Skill;