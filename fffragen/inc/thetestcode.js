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
	console.log( "Start, addIndexes. arr.size <" + arr.length + ">, chkElem <" + chkElem.id + ">" );
	if( !chkElem.checked ) return;
	const from = parseInt( $(chkElem).attr("qFrom") );
	const to = parseInt( $(chkElem).attr("qTo") );
	for( i = from; i <= to; i++ ) arr.push( i );
	console.log( "Done, addIndexes. arr.size <" + arr.length + ">, chkElem <" + chkElem.id + ">" );
}

function prepareTest() {
	console.log( "Start, prepareTest" );
	QuestionNrs = [];
	QuestionIndex = 0;
	FailedQueryNrs = [];
	DoneQuestionCount = 0;
	addIndexes( QuestionNrs, $("#chkBronze")[0] );
	addIndexes( QuestionNrs, $("#chkSilber")[0] );
	addIndexes( QuestionNrs, $("#chkGold")[0] );
	shuffle(QuestionNrs);
	
	const limit = parseInt( $(".rbQCount:checked")[0].value );
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
	$(".answ").prepend("<input type=\"checkbox\" class=\"answcb\" onclick=\"cbClick(event);\" />");
	$(".answ").prepend("<div class=\"rt\"><i></i>&nbsp;</div>");
	$(".answ").addClass("qq");
	$("#q" + $.strPad( QuestionNrs[QuestionIndex], 3, '0') ).show();
	StartTime = new Date();
	updateStats();
	console.log( "Done, prepareTest" );
}

function showQuestion( qnr ) {
	console.log( "Start, showQuestion. qnr <" + qnr + ">" );
	$(".question").hide(); //hide all other
	$("#q" + $.strPad( QuestionNrs[QuestionIndex], 3, '0') ).show();
	shuffleAnswers( QuestionNrs[QuestionIndex] );
	updateStats();
	console.log( "Done, showQuestion. qnr <" + qnr + ">" );
};

function evalAnswer( qnr ) {
	console.log( "Start, evalAnswer. qnr <" + qnr + ">" );
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
		if( (cor && cb.checked) || (!cor && !cb.checked) ) {
			$(this).addClass("qtrue");
		}
		else {
			$(this).addClass("qfalse"); correct=false;
		}
	});
	
	DoneQuestionCount++;
	if( !correct ) {
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
		
		$("#qXofY").hide();
		$("#resulttitle").show();
		$("#btnreload").show();
		for( i=0; i<QuestionNrs.length; i++ ) {
			$("#q" + $.strPad( QuestionNrs[i], 3, '0') ).show();
		};
		$(".hideontest").show();
		moveResultBar( perc );
	}
	console.log( "Done, evalAnswer. qnr <" + qnr + ">" );
}

function cbClick(e) {
	//done by $(".answ").click...
	e.stopPropagation();
}

function shuffleAnswers( qnr ) {
	console.log( "Start, shuffleAnswers. qnr <" + qnr + ">" );
	if( ! $("#chkShuffleAnsw")[0].checked ) return;
	var elem = $("#q" + $.strPad( qnr, 3, '0') );
	var arr = $(elem).find("p");
	shuffle(arr);
	$.each( arr, function(){
		$(this).appendTo( $(elem) );
	});
	console.log( "Done, shuffleAnswers. qnr <" + qnr + ">" );
}


function moveResultBar( percentage ) {
  var elem = document.getElementById("resultBar");   
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= percentage) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
	  elem.innerHTML = width * 1  + '%';
    }
  }
}


$(document).ready(function(){
	$("#testcontrols").hide();
	
	$("#btnstart").click(function(){
		$(".answ").removeClass("preview");
		prepareTest();
		$("#settings").hide();
		$(".hideontest").hide();
		$(".hideonly").hide();
		showQuestion();
		window.scrollTo(0,0);
	});
	$("#btnreload").click(function(){
		location.reload();
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
		var cb = $(this).find("input:checkbox")[0];
		if( !cb.disabled ) cb.checked = (!cb.checked);
	});
	
	//Richtige Antworten zu beginn zeigen
	$(".answ").addClass("preview");
});