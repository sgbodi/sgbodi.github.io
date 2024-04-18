var QuestionNrs = [1,2];
var QuestionIndex = 0;
var FailedQueryNrs = [];
var DoneQuestionCount = 0;
var StartTime = new Date();

function nextQuestion() {
	QuestionIndex++;
	if( QuestionIndex >= QuestionNrs.length ) return false;
	return true;
}

function updateStats() {
	//<span id="qXofY">Frage x/y</span>
	//<span id="qCorrect">0/0 Richtig beantwortet (0%)</span>
	var QueryNr = (QuestionIndex+1);
	var QueryCount = (QuestionNrs.length);
	var CorrectCount = (DoneQuestionCount - FailedQueryNrs.length);
	$("#qXofY").html("Frage " + QueryNr + "/" + QueryCount + ". " );
	if( DoneQuestionCount > 0 ) {
		var perc = Math.round( (100-(FailedQueryNrs.length/DoneQuestionCount*100)) );
		$("#qCorrect").html("" + CorrectCount + "/" + DoneQuestionCount + " richtig (" + perc + "%).");
	}

	var x =  new Date();
	x.setTime( x.getTime() - StartTime.getTime() + (x.getTimezoneOffset()*60000) );
	//$("#qTime").html("Zeit " + x.toLocaleTimeString() + "." );
	$("#qTime").html("Zeit " + jQuery.format.date( x, "mm:ss") + " Min." );
}


function addIndexes( arr, chkElem ) {
	if( !chkElem.checked ) return;
	var from = $(chkElem).attr("qFrom");
	var to = $(chkElem).attr("qTo");
	for (i=from; i<=to; i++ ) arr.push(i);
}

function prepareTest() {
	QuestionNrs = [];
	QuestionIndex = 0;
	FailedQueryNrs = [];
	DoneQuestionCount = 0;
	addIndexes( QuestionNrs, $("#chkBronze")[0] );
	addIndexes( QuestionNrs, $("#chkSilber")[0] );
	addIndexes( QuestionNrs, $("#chkGold")[0] );
	shuffle(QuestionNrs);
	
	var limit = $(".rbQCount:checked")[0].value;
	QuestionNrs = QuestionNrs.slice(0,limit);
	
	$("h1").hide();
	$("#thequestions h2").hide();
	$("#thequestions h3").hide();
	$("#testcontrols").show();
	$("#showresult").show();
	$(".abc").hide();
	$(".qnr").hide();
	$("#next").hide();
	$(".question").hide();
	//$(".answ").prepend("<input type=\"checkbox\" class=\"answcb\"/>");
	$(".answ").prepend("<input type=\"radio\" class=\"answcb\" name=\"" + $.strPad( QuestionNrs[QuestionIndex], 3, '0') + "\" />");
	$("#q" + $.strPad( QuestionNrs[QuestionIndex], 3, '0') ).show();
	StartTime = new Date();
	updateStats();
}

function showQuestion( qnr ) {
	$(".question").hide(); //hide all other
	$("#q" + $.strPad( QuestionNrs[QuestionIndex], 3, '0') ).show();
	shuffleAnswers( QuestionNrs[QuestionIndex] );
	updateStats();
};

function evalAnswer( qnr ) {
	var elem = $("#q" + $.strPad( QuestionNrs[qnr], 3, '0') );
	var correct = true;
	
	if( $(elem).find("p.answ").find("input:checked").length == 0 ) //no answer selected.
	{
		return;
	}
	
	$(elem).addClass("done");
	
	$(elem).find("p.answ").each(function(){
		var cor = $(this).hasClass("cor");
		var cb = $(this).find("input")[0];
		cb.disabled = true;
		if( (cor && cb.checked) || (!cor && !cb.checked) ) { $(this).addClass("qtrue"); }
		else { $(this).addClass("qfalse"); correct=false; }
	});
	
	
	DoneQuestionCount++;
	if( correct ) {
		$(elem).addClass("qtrue");
	}
	else {
		$(elem).addClass("qfalse");
		FailedQueryNrs.push( qnr );
	}
	updateStats();

	$("#showresult").hide();
	if( QuestionIndex < (QuestionNrs.length-1) ) {
		$("#next").show();
	}
	else {
		//final display prepareTest
		let QueryCount = (QuestionNrs.length);
		let CorrectCount = (DoneQuestionCount - FailedQueryNrs.length);
		let perc = Math.round( (100-(FailedQueryNrs.length/DoneQuestionCount*100)) );
		$("#qresCorrectCount").html("" + CorrectCount);
		$("#qresTotalCount").html("" + DoneQuestionCount);
		$("#qresPercent").html("" + perc + "%");
		if( CorrectCount >= DoneQuestionCount ) {
			$("#qres1").show();
		} else if ( perc > 85 ) {
			$("#qres2").show();
		}
		else if ( perc > 75 ) {
			$("#qres3").show();
		}
		else if ( perc > 55 ) {
			$("#qres4").show();
		}
		else {
			$("#qres5").show();
		}
		//--*/

		$("#qXofY").hide();
		$("#resulttitle").show();
		for( i=0; i<QuestionNrs.length; i++ ) {
			$("#q" + $.strPad( QuestionNrs[i], 3, '0') ).show();
		};
		$(".hideontest").show();
	}
}

function shuffleAnswers( qnr ) {
	if( ! $("#chkShuffleAnsw")[0].checked ) return;
	var elem = $("#q" + $.strPad( qnr, 3, '0') );
	var arr = $(elem).find("p");
	shuffle(arr);
	$.each( arr, function(){
		$(this).appendTo( $(elem) );
	});
}


$(document).ready(function(){
	$("#testcontrols").hide();
	
	$("#btnstart").click(function(){
		prepareTest();
		$("#settings").hide();
		$(".hideontest").hide();
		$(".hideonly").hide();
		showQuestion();
		window.scrollTo(0,0);
	});
	$("#showresult").click(function(){
		evalAnswer( QuestionIndex );
	});
	$("#next").click(function(){
		if( nextQuestion() ) {
			showQuestion( QuestionIndex );
			$("#showresult").show();
			$("#next").hide();
		}
		else {
			QuestionIndex = 0;
			QuestionNrs = FailedQueryNrs;
			window.alert(QuestionNrs);
		}
		window.scrollTo(0,0);
	});
	$(".answ").click(function(){
		
		//Multiple choice:
		/*
		var cb = $(this).find("input:checkbox")[0];
		if( !cb.disabled ) cb.checked = (!cb.checked);
		*/
		//Single choice:
		var cb = $(this).find("input:radio")[0];
		cb.checked = true;
		
	});
});