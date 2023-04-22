// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import Skill from './Skill';
import AddSkill from './AddSkill';


import Dicetray from './Dicetray';
import "./App.css";

function App() {
  const [charNames, setCharNames] = React.useState([]);
  const [selectedChar, setSelectedChar] = React.useState(0);
  const [skills, setSkills] = React.useState(null);
  const [natRolls, setNatRolls] = React.useState(Array(2).fill(0));
  const [modifier, setModifier] = React.useState(0);
  const [mode, setMode] = React.useState(0); /* Should be an enum */
  const trayRef = React.useRef(null);

  let trayClass = "tray-plain";

  // State that should be initialised from setCharNames
  let charIdTypes = {1: "dnd", 2: "dw", 3: "bitd"};



/*
{
  "_id": {
    "$oid": "6420234435d044ccc2481591"
  },
  "charid": 1,
  "desc": "Strength",
  "mod": 3
}
then we add
skill['id'] = index++;
skill['type'] = charIdTypes[skill['charid']];
skill['editmode'] = false;  
*/

  function loadSkills(json) {
    let index = 0;
    for (let skill of json) {
      skill['id'] = index++;
      skill['type'] = charIdTypes[skill['charid']];
      skill['editmode'] = false;

      console.log(`Skill ${skill['desc']} has id ${skill['_id']} `)
    }
    // json = 
    setSkills(json);
  }
  



  /* API INTERACTIONS */

  /* Do this on re-render? Page load? Other? */
  React.useEffect(() => {
    console.log('getting chars');
    fetch("/api/chars")
      .then((res) => res.json())
      .then((json) => {console.log('got chars ' + json); setCharNames(json)});
  }, []);

  /* Do this whenever selectedChar (our sdependency) changes */
  React.useEffect(() => {
    reloadskills();
  }, [selectedChar]);

  /* Has to be async to use API - the local state is already up to date so we don't care if it takes a while */
  async function postSkillChange(skill) {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
      };
      fetch('/api/updateskills', requestOptions)
          .then(response => response.json()) // Returns a Promise of data, hence further .then
          .then(data => reloadupserts(data));
  };

  async function postSkillDelete(skill) {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
      };
      fetch('/api/deleteskills', requestOptions)
          .then(response => response.json()) // Returns a Promise of data, hence further .then
          .then(data => reloadskills());
  };  

  async function reloadupserts(data) {
    if (data.upsertedCount > 0) {
      // Reload skills data to get proper id for upserted value
      console.log("New item in DB so we force an update");

      reloadskills();
    }
  }

  async function reloadskills() {
    console.log('getting skills for ' + selectedChar);
    fetch("/api/skills/?char=" + selectedChar)
      .then((res) => res.json())
      .then((json) => loadSkills(json));
  }








  /* DICE ROLLING STUFF */

  function doRoll(modifier, mode) {
    console.log("Rolling " + modifier + ", " + mode);

    let natrolls = [];

    if (0 <= mode && mode <= 2) {
      natrolls = do5eRoll(mode);
    } else if (mode == 3) {
      natrolls = doDWroll();
    } else if (mode == 4) {
      natrolls = doBITDroll(mode, modifier);
    } else {
      natrolls = [0];
    }

    setNatRolls(natrolls);
    setMode(mode);
    setModifier(modifier);
  }

  function do5eRoll(mode) {
    console.log("5e roll");
    /* One D20, or two if adv/disadv */

    let rolls = [Math.ceil(Math.random()*20)];
    if (mode != 1) {
      rolls.push(Math.ceil(Math.random()*20));
    }
    return rolls;
  }

  function doDWroll() {
    console.log("dw roll");
    /* Dungeon world: 2d6 + modifier */
    let rolls = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
    return rolls;
  }

  function doBITDroll(mode, modifier) {
    console.log("bitd roll");
    /* BitD: roll a number of d6 equal to mod, highest roll determines result
       unless mod == 0, in which case lower of two */
    let rolls = [];
    if (modifier == 0) {
      rolls = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
    } else {
      /* roll modifier*d6 */
      for (let i=0; i<modifier; i++) {
        rolls.push(Math.ceil(Math.random()*6));
        console.log(rolls);
      }
    }

    console.log("How many dice? " + rolls.length);

    return rolls;
  }









  /* APP STATE HANDLING */

  function editMode(index) {
    console.log('edit skill ' + index);
    const skillindex = skills.findIndex(sk => sk.id === index); // Probably unnecessary but good practise
    let skillsDeepCopy = [...skills];

    if (skillsDeepCopy[skillindex]['editmode']) {
      // clicked SAVE - send new value to DB
      console.log("Saving " + skillsDeepCopy[skillindex]['desc'] + " value " + skillsDeepCopy[skillindex]['mod'] + " to db with id " + skillsDeepCopy[skillindex]['_id']);
      skillsDeepCopy[skillindex]['editmode'] = false;
      postSkillChange(skillsDeepCopy[skillindex]);
    }
    else {
      // Set all to false except selected skill
      for (let skill of skillsDeepCopy) {
        skill['editmode'] = false;
      }   
      skillsDeepCopy[skillindex]['editmode'] = true;      
    }

    setSkills(skillsDeepCopy);
  }

  function changeDesc(index, newdesc) {
    let skillsDeepCopy = [...skills];
    skillsDeepCopy[index]['desc'] = newdesc;
    setSkills(skillsDeepCopy);
  }

  /* Dev note: this could be a useEffect on skills? This cant be the only way to have objects in state */
  function changeMod(index, event) {
    const newmod = event.target.value;
    console.log('edit skill ' + index);
    const skillindex = skills.findIndex(sk => sk.id === index); // Probably unnecessary but good practise
    let skillsDeepCopy = [...skills];

    console.log("Changing " + skillsDeepCopy[skillindex]['desc'] + " from " + skillsDeepCopy[skillindex]['mod'] + " to " + newmod);
    skillsDeepCopy[skillindex]['mod'] = newmod;      

    setSkills(skillsDeepCopy);
  }

  function addSkill() {
    let skillsDeepCopy = [...skills];
    let numberOfSkills = skillsDeepCopy.length

    // copy last skill for char, type etc
    let lastSkill = skillsDeepCopy[numberOfSkills - 1];
    skillsDeepCopy.push({charid: lastSkill['charid'], type: lastSkill['type']});

    // increment 
    skillsDeepCopy[numberOfSkills]['id'] = skillsDeepCopy[numberOfSkills - 1]['id'] - (-1);
    skillsDeepCopy[numberOfSkills]['mod'] = 0;
    skillsDeepCopy[numberOfSkills]['desc'] = '...';
    skillsDeepCopy[numberOfSkills]['editmode'] = true;

    setSkills(skillsDeepCopy);    
  }

  function delSkill(index) {
    postSkillDelete(skills[index]);   
  }





  return (
    <div className="App">
      <div className="char-selector">
        Select a character:<br/>
        <select
          value={selectedChar} // ...force the select's value to match the state variable...
          onChange={e => setSelectedChar(e.target.value)} // ... and update the state variable on any change!
        >
          <option value="0" hidden="true"></option>
          {charNames.map((character) => {
            return (
              <option value={character.id}>
                {character.name}
              </option>
            );
          })}        
        </select>
      </div>

      {!skills ? "Loading skills..." : skills.map(h => (
        <Skill id={h.id} type={h.type} desc={h.desc} mod={h.mod} action={doRoll} editmode={h.editmode} editCB={editMode} deditCB={changeDesc} changeCB={changeMod} delCB={delSkill}/>
      ))}
      {skills && skills.length > 0 ? <AddSkill addCB={addSkill}/> : <></>}

      <Dicetray natRolls={natRolls} modifier={modifier} mode={mode} />
    </div>
  );
}

export default App;

/* 
<option value="0"></option>
          <option value="1">Hardwon</option>
          <option value="2">Fat Billy</option>
          */