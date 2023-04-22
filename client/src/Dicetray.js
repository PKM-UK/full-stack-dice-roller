export default function DiceTray({natRolls, modifier, mode}) {
    let rollText = "";
    let trayClass = "";

    if (mode <= 2) {
        // 5e
        const r1 = natRolls[0];
        const r2 = natRolls[1];

        const effectiveRoll = mode==2 ? Math.max(r1, r2) :
                              mode==0 ? Math.min(r1, r2) : 
                              r1;

        rollText = natRolls.join(", ") + " + " + modifier + " = " + (parseInt(effectiveRoll)+parseInt(modifier));

        trayClass = effectiveRoll < 5 ? 'tray critfail' :
                          effectiveRoll > 15 ? 'tray crit' : 'tray';

    } else if (mode == 3) {
        const r1 = natRolls[0];
        const r2 = natRolls[1];
        const effectiveRoll = r1+r2+modifier;

        rollText = `${r1} + ${r2} + ${modifier} = ${effectiveRoll}`;

        trayClass = effectiveRoll < 7 ? 'tray critfail' :
                          effectiveRoll >= 10 ? 'tray crit' : 'tray';        
    } else if (mode == 4) {

        natRolls.sort(); // Alphabetic but that doesn't matter for d6
        const effectiveRoll = (modifier == 0) ? natRolls[0] : natRolls[natRolls.length-1]

        rollText = natRolls.join(", ") + ": " + 
            (effectiveRoll == 6 ? "Success" : effectiveRoll > 3 ? "Mixed success" : "Failure");
        trayClass = effectiveRoll < 4 ? 'tray critfail' :
                          effectiveRoll == 6 ? 'tray crit' : 'tray';              
    }


    return (
        <div className={trayClass}><h2>{rollText}</h2></div>
    )
}
