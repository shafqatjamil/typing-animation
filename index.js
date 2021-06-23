import Bus from './Event'

const charDelay =  1;
const turnDelay =  500;
var p1Phrase = []
var p2Phrase = []
var runingArray = []
var phraseCalculated = ''
var turn =  -1
var timer
var activityNarration = {}

function startAnimatingText(){
    timer = setInterval(() => {
        let temp = runingArray.shift();
        if(turn == 0){
            p1Phrase.push(temp)
            emmitP1DataEvent()
        } else {
            p2Phrase.push(temp)
            emmitP2DataEvent()
        }
        if(temp == null){
            clearInterval(timer)
            setTimeout(() => {
                if(turn == 0){
                    p2Phrase = []
                } else {
                    p1Phrase = []
                }
                TurnChanged();
            }, turnDelay);
        }
    }, charDelay);
}
function TurnChanged(){

    ChangeTurn();
    let temp = activityNarration['p' + turn + 'Phrases'].shift()
    console.log('temp', temp)
    if(turn == 0){
        p1Phrase = []
    } else if(turn == 1){
        p2Phrase = []
    }
    if(temp != null){
        phraseCalculated = temp.replace(/\s\s+/g,' ');
        runingArray = phraseCalculated.split('')
        startAnimatingText()
        return true;
    } else {
        ChangeTurn();
        let temp = activityNarration['p' + turn + 'Phrases'].shift()
        console.log('temp11', temp)
        if(turn == 0){
            p1Phrase = []
        } else if(turn == 1){
            p2Phrase = []
        }
        if(temp != null){
            phraseCalculated = temp.replace(/\s\s+/g,' ');
            runingArray = phraseCalculated.split('')
            startAnimatingText()
            return true;
        } 
        ResetService()
        return false;
        
    }
}
function ChangeTurn(){

    emmitTurnEnded(turn);
    if(turn == -1){
        turn = activityNarration.firstTurn;
    } else {
        turn = turn == 0 ? 1 : 0
    }
    emmitTurnStarted(turn);
    emmitTurn(turn);

}
function copyInputData(data){
    return {
        p0Phrases: [...data.p0Phrases],
        p1Phrases: [...data.p1Phrases],
        firstTurn: data.firstTurn,
    }
}
function startNarration(data){
    console.log(data)
    activityNarration = copyInputData(data);
    TurnChanged();
}

function ResetService(){
    p1Phrase = []
    p2Phrase = []
    runingArray = []
    phraseCalculated = ''
    turn =  -1
    activityNarration = {}
    emmitTurn(turn)
    clearInterval(timer)
}

function emmitP1DataEvent(){
    Bus.trigger('onP1PhraseUpdated', p1Phrase.join(''))
}
function emmitP2DataEvent(){
    Bus.trigger('onP2PhraseUpdated', p2Phrase.join(''))
}
function emmitTurn(turn){
    Bus.trigger('onTurnChanged', turn)
}
function emmitTurnStarted(data){
    Bus.trigger('onTurnStarted', data)
}
function emmitTurnEnded(data){
    Bus.trigger('onTurnEnded', data)
}

export default startNarration