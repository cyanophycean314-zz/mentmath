
operations = ["+","*","-","/"];

window.onload = function() {
    probdisp = document.getElementById("probdisp");
    ans = document.getElementById("ans");
    easy = document.getElementById("easy");
    hard = document.getElementById("hard");

    ans.addEventListener("keyup", function(e) {
	//Check the answer
	if (typeof prob == "object" && prob.checkAns(e.target.value)) {
	    prob = loadNewQuestion();
	    e.target.value = "";
	    updateScore(score + 1);
	}
    });

    diffs.addEventListener("click", function(e) {
	e.preventDefault();
	startTest(e.target.id);
   });
}

function startTest(diff) {
    prob = loadNewQuestion(diff);
    startTimer(90);
    updateScore(0);
    ans.focus();
}

function stopTest() {
    prob = null;
    probdisp.innerHTML = "Score: " + score;
}

function startTimer(secs) {
    document.getElementById("clock").innerHTML = "Time: " + secs;
    if (secs == 0) {
	stopTest();
    } else {
	setTimeout(function() {
	    startTimer(secs - 1);
	}, 1000);
    }
}

function updateScore(sc) {
    score = sc;
    document.getElementById("score").innerHTML = "Score: " + score;
}

function loadNewQuestion(diff) {
    var args = [];
    var numargs = 2;
    var range = [1,50];
    if (diff == "hard") {
	if (Math.random() < 0.5) {
	    numargs++;
	}
	if (Math.random() < 0.5) {
	    range = [10,100];
	}
    }

    for (var i = 0; i < numargs; i++) {
	args.push(Math.floor(Math.random() * (range[1] - range[0])) + range[0]);
    }

    var ops = [];
    for (var i = 0; i < numargs - 1; i++) {
	ops.push(operations[Math.floor(Math.random() * operations.length)]);
    }

    //make the division problems nicer
    var startdiv = -1;
    for (var i = 0; i < numargs - 1; i++) {
	if (ops[i] == '/') {
	    startdiv = (startdiv != -1 ? startdiv : i);
	    args[startdiv] *= args[i + 1];
	} else {
	    startdiv = -1;
	}
    }

    //display the problem
    var probtext = "";
    for (var i = 0; i < numargs; i++) {
	probtext += args[i];
	if (i < numargs - 1) {
	    probtext += " " + ops[i] + " ";
	}
    }
    probdisp.innerHTML = probtext;
    probdisp.style.visibility = "visible";

    //calculate the right answer
    var rightans = eval(probtext);
    return {
	ptext : probtext,
	checkAns : function(guess) {
	    return Number(guess) == rightans;
	}
    };
}
