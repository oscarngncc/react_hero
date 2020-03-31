


//Status Class for Entities
function Status(HP, MaxHP, MP, MaxMP, Atk, Def, Magic ){
    

    this.MaxHP = MaxHP;
    this.HP = HP;
    this.MP = MP;
    this.MaxMP = MaxMP
    this.Atk = Atk;
    this.Def = Def;
    this.Magic = Magic;
    
    this.loseHP = function(loseHP){
        if (typeof HP === 'undefined') throw new Error("this doesn't have a HP");
        this.HP -= loseHP;
        if (this.HP < 0 )
            this.HP = 0;
    };

    this.loseMP = function(loseMP){
        if (typeof MP === 'undefined') throw new Error("this doesn't have a MP");
        this.MP -= loseMP;
        if (this.MP < 0 )
            this.MP = 0;
    };
    
}
export default Status;


//Alternatively to export a function:
// export function();  import {function} from './file'