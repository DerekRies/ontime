
var TIMER_OPEN = false;
function openTimers(){
// $('#timer-bar').css('bottom','0px'); 
$('#timer-bar').addClass('up');
TIMER_OPEN = true;
}
function closeTimers(){
$('#timer-bar').removeClass('up');
// $('#timer-bar').css('bottom','-300px'); 
TIMER_OPEN = false;
}
function toggleTimers(){
TIMER_OPEN = !TIMER_OPEN;
if(TIMER_OPEN){
openTimers();
}
else{
closeTimers();
}
}
